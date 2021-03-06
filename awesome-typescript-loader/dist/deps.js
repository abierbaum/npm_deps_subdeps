"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const _ = require('lodash');
const path = require('path');
const promisify = require('es6-promisify');
let objectAssign = require('object-assign');
function createResolver(externals, exclude, webpackResolver) {
    let resolver = promisify(webpackResolver);
    function resolve(base, dep) {
        let inWebpackExternals = externals && externals.hasOwnProperty(dep);
        let inTypeScriptExclude = false;
        if ((inWebpackExternals || inTypeScriptExclude)) {
            return Promise.resolve('%%ignore');
        }
        else {
            return resolver(base, dep).then(resultPath => {
                if (!resultPath.match(/.tsx?$/)) {
                    let matchedExcludes = exclude.filter((excl) => {
                        return resultPath.indexOf(excl) !== -1;
                    });
                    if (matchedExcludes.length > 0) {
                        return '%%ignore';
                    }
                    else {
                        return resultPath;
                    }
                }
                else {
                    return resultPath;
                }
            });
        }
    }
    return resolve;
}
exports.createResolver = createResolver;
function isTypeDeclaration(fileName) {
    return /\.d.ts$/.test(fileName);
}
function isImportOrExportDeclaration(node) {
    return (!!node.exportClause || !!node.importClause)
        && node.moduleSpecifier;
}
function isImportEqualsDeclaration(node) {
    return !!node.moduleReference && node.moduleReference.hasOwnProperty('expression');
}
function isIgnoreDependency(absulutePath) {
    return absulutePath == '%%ignore';
}
class FileAnalyzer {
    constructor(state) {
        this.dependencies = new DependencyManager();
        this.validFiles = new ValidFilesManager();
        this.state = state;
    }
    checkDependencies(resolver, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validFiles.isFileValid(fileName)) {
                return false;
            }
            this.validFiles.markFileValid(fileName);
            this.dependencies.clearDependencies(fileName);
            let changed = false;
            try {
                if (!this.state.hasFile(fileName)) {
                    changed = yield this.state.readFileAndUpdate(fileName);
                }
                yield this.checkDependenciesInternal(resolver, fileName);
            }
            catch (err) {
                this.validFiles.markFileInvalid(fileName);
                throw err;
            }
            return changed;
        });
    }
    checkDependenciesInternal(resolver, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            let imports = yield this.findImportDeclarations(resolver, fileName);
            let tasks = [];
            for (let i = 0; i < imports.length; i++) {
                let importPath = imports[i];
                let isDeclaration = isTypeDeclaration(importPath);
                let isRequiredJs = /\.js$/.exec(importPath) || importPath.indexOf('.') === -1;
                if (isDeclaration) {
                    let hasDeclaration = this.dependencies.hasTypeDeclaration(importPath);
                    if (!hasDeclaration) {
                        this.dependencies.addTypeDeclaration(importPath);
                        tasks.push(this.checkDependencies(resolver, importPath));
                    }
                }
                else if (isRequiredJs && !this.state.options.allowJs) {
                    continue;
                }
                else {
                    this.dependencies.addDependency(fileName, importPath);
                    tasks.push(this.checkDependencies(resolver, importPath));
                }
            }
            yield Promise.all(tasks);
            return null;
        });
    }
    findImportDeclarations(resolver, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            let sourceFile = this.state.services.getSourceFile(fileName);
            let isDeclaration = isTypeDeclaration(fileName);
            let imports = [];
            let visit = (node) => {
                if (!isDeclaration && isImportEqualsDeclaration(node)) {
                    let importPath = node.moduleReference.expression.text;
                    imports.push(importPath);
                }
                else if (!isDeclaration && isImportOrExportDeclaration(node)) {
                    let importPath = node.moduleSpecifier.text;
                    imports.push(importPath);
                }
            };
            imports.push.apply(imports, sourceFile.referencedFiles.map(file => file.fileName));
            this.state.ts.forEachChild(sourceFile, visit);
            let task = imports.map((importPath) => __awaiter(this, void 0, void 0, function* () {
                let absolutePath = yield this.resolve(resolver, fileName, importPath);
                if (!isIgnoreDependency(absolutePath)) {
                    return absolutePath;
                }
            }));
            let resolvedImports = yield Promise.all(task);
            return resolvedImports.filter(Boolean);
        });
    }
    resolve(resolver, fileName, defPath) {
        let result;
        if (/^[a-z0-9].*\.d\.ts$/.test(defPath)) {
            defPath = './' + defPath;
        }
        if (isTypeDeclaration(defPath)) {
            result = Promise.resolve(path.resolve(path.dirname(fileName), defPath));
        }
        else {
            result = resolver(path.dirname(fileName), defPath)
                .catch(function (error) {
                try {
                    if (require.resolve(defPath) == defPath) {
                        return defPath;
                    }
                    else {
                        throw error;
                    }
                }
                catch (e) {
                    throw error;
                }
            });
        }
        return result
            .catch(function (error) {
            let detailedError = new ResolutionError();
            detailedError.message = error.message + "\n    Required in " + fileName;
            detailedError.cause = error;
            detailedError.fileName = fileName;
            throw detailedError;
        });
    }
}
exports.FileAnalyzer = FileAnalyzer;
class DependencyManager {
    constructor(dependencies = {}, knownTypeDeclarations = {}) {
        this.dependencies = dependencies;
        this.knownTypeDeclarations = knownTypeDeclarations;
        this.compiledModules = {};
    }
    clone() {
        return new DependencyManager(_.cloneDeep(this.dependencies), _.cloneDeep(this.knownTypeDeclarations));
    }
    addDependency(fileName, depFileName) {
        if (!this.dependencies.hasOwnProperty(fileName)) {
            this.clearDependencies(fileName);
        }
        this.dependencies[fileName].push(depFileName);
    }
    addCompiledModule(fileName, depFileName) {
        if (!this.compiledModules.hasOwnProperty(fileName)) {
            this.clearCompiledModules(fileName);
        }
        let store = this.compiledModules[fileName];
        if (store.indexOf(depFileName) === -1) {
            store.push(depFileName);
        }
    }
    clearDependencies(fileName) {
        this.dependencies[fileName] = [];
    }
    clearCompiledModules(fileName) {
        this.compiledModules[fileName] = [];
    }
    getDependencies(fileName) {
        if (!this.dependencies.hasOwnProperty(fileName)) {
            this.clearDependencies(fileName);
        }
        return this.dependencies[fileName].slice();
    }
    addTypeDeclaration(fileName) {
        this.knownTypeDeclarations[fileName] = true;
    }
    hasTypeDeclaration(fileName) {
        return this.knownTypeDeclarations.hasOwnProperty(fileName);
    }
    getTypeDeclarations() {
        return objectAssign({}, this.knownTypeDeclarations);
    }
    getDependencyGraph(fileName) {
        let appliedDeps = {};
        let result = {
            fileName,
            dependencies: []
        };
        let walk = (fileName, context) => {
            this.getDependencies(fileName).forEach((depFileName) => {
                let depContext = {
                    fileName: depFileName,
                    dependencies: []
                };
                context.dependencies.push(depContext);
                if (!appliedDeps[depFileName]) {
                    appliedDeps[depFileName] = true;
                    walk(depFileName, depContext);
                }
            });
        };
        walk(fileName, result);
        return result;
    }
    applyCompiledFiles(fileName, deps) {
        if (!this.compiledModules.hasOwnProperty(fileName)) {
            this.clearCompiledModules(fileName);
        }
        this.compiledModules[fileName].forEach((mod) => {
            deps.add(mod);
        });
    }
    applyChain(fileName, deps) {
        if (!this.dependencies.hasOwnProperty(fileName)) {
            this.clearDependencies(fileName);
        }
        let appliedDeps = {};
        let graph = this.getDependencyGraph(fileName);
        let walk = (item) => {
            let itemFileName = item.fileName;
            if (!appliedDeps[itemFileName]) {
                appliedDeps[itemFileName] = true;
                deps.add(itemFileName);
                item.dependencies.forEach((dep) => walk(dep));
            }
        };
        walk(graph);
    }
}
exports.DependencyManager = DependencyManager;
class ValidFilesManager {
    constructor() {
        this.files = {};
    }
    isFileValid(fileName) {
        return !!this.files[fileName];
    }
    markFileValid(fileName) {
        this.files[fileName] = true;
    }
    markFileInvalid(fileName) {
        this.files[fileName] = false;
    }
}
exports.ValidFilesManager = ValidFilesManager;
class ResolutionError extends Error {
}
exports.ResolutionError = ResolutionError;
//# sourceMappingURL=deps.js.map