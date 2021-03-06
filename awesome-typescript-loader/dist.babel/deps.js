"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var _ = require('lodash');
var path = require('path');
var promisify = require('es6-promisify');
var objectAssign = require('object-assign');
function createResolver(externals, exclude, webpackResolver) {
    var resolver = promisify(webpackResolver);
    function resolve(base, dep) {
        var inWebpackExternals = externals && externals.hasOwnProperty(dep);
        var inTypeScriptExclude = false;
        if (inWebpackExternals || inTypeScriptExclude) {
            return Promise.resolve('%%ignore');
        } else {
            return resolver(base, dep).then(function (resultPath) {
                if (!resultPath.match(/.tsx?$/)) {
                    var matchedExcludes = exclude.filter(function (excl) {
                        return resultPath.indexOf(excl) !== -1;
                    });
                    if (matchedExcludes.length > 0) {
                        return '%%ignore';
                    } else {
                        return resultPath;
                    }
                } else {
                    return resultPath;
                }
            });
        }
    }
    return resolve;
}
exports.createResolver = createResolver;
function isTypeDeclaration(fileName) {
    return (/\.d.ts$/.test(fileName)
    );
}
function isImportOrExportDeclaration(node) {
    return (!!node.exportClause || !!node.importClause) && node.moduleSpecifier;
}
function isImportEqualsDeclaration(node) {
    return !!node.moduleReference && node.moduleReference.hasOwnProperty('expression');
}
function isIgnoreDependency(absulutePath) {
    return absulutePath == '%%ignore';
}

var FileAnalyzer = function () {
    function FileAnalyzer(state) {
        _classCallCheck(this, FileAnalyzer);

        this.dependencies = new DependencyManager();
        this.validFiles = new ValidFilesManager();
        this.state = state;
    }

    _createClass(FileAnalyzer, [{
        key: 'checkDependencies',
        value: function checkDependencies(resolver, fileName) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var changed;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this.validFiles.isFileValid(fileName)) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt('return', false);

                            case 2:
                                this.validFiles.markFileValid(fileName);
                                this.dependencies.clearDependencies(fileName);
                                changed = false;
                                _context.prev = 5;

                                if (this.state.hasFile(fileName)) {
                                    _context.next = 10;
                                    break;
                                }

                                _context.next = 9;
                                return this.state.readFileAndUpdate(fileName);

                            case 9:
                                changed = _context.sent;

                            case 10:
                                _context.next = 12;
                                return this.checkDependenciesInternal(resolver, fileName);

                            case 12:
                                _context.next = 18;
                                break;

                            case 14:
                                _context.prev = 14;
                                _context.t0 = _context['catch'](5);

                                this.validFiles.markFileInvalid(fileName);
                                throw _context.t0;

                            case 18:
                                return _context.abrupt('return', changed);

                            case 19:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[5, 14]]);
            }));
        }
    }, {
        key: 'checkDependenciesInternal',
        value: function checkDependenciesInternal(resolver, fileName) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                var imports, tasks, i, importPath, isDeclaration, isRequiredJs, hasDeclaration;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.findImportDeclarations(resolver, fileName);

                            case 2:
                                imports = _context2.sent;
                                tasks = [];
                                i = 0;

                            case 5:
                                if (!(i < imports.length)) {
                                    _context2.next = 23;
                                    break;
                                }

                                importPath = imports[i];
                                isDeclaration = isTypeDeclaration(importPath);
                                isRequiredJs = /\.js$/.exec(importPath) || importPath.indexOf('.') === -1;

                                if (!isDeclaration) {
                                    _context2.next = 14;
                                    break;
                                }

                                hasDeclaration = this.dependencies.hasTypeDeclaration(importPath);

                                if (!hasDeclaration) {
                                    this.dependencies.addTypeDeclaration(importPath);
                                    tasks.push(this.checkDependencies(resolver, importPath));
                                }
                                _context2.next = 20;
                                break;

                            case 14:
                                if (!(isRequiredJs && !this.state.options.allowJs)) {
                                    _context2.next = 18;
                                    break;
                                }

                                return _context2.abrupt('continue', 20);

                            case 18:
                                this.dependencies.addDependency(fileName, importPath);
                                tasks.push(this.checkDependencies(resolver, importPath));

                            case 20:
                                i++;
                                _context2.next = 5;
                                break;

                            case 23:
                                _context2.next = 25;
                                return Promise.all(tasks);

                            case 25:
                                return _context2.abrupt('return', null);

                            case 26:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: 'findImportDeclarations',
        value: function findImportDeclarations(resolver, fileName) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee4() {
                var _this = this;

                var sourceFile, isDeclaration, imports, visit, task, resolvedImports;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                sourceFile = this.state.services.getSourceFile(fileName);
                                isDeclaration = isTypeDeclaration(fileName);
                                imports = [];

                                visit = function visit(node) {
                                    if (!isDeclaration && isImportEqualsDeclaration(node)) {
                                        var _importPath = node.moduleReference.expression.text;
                                        imports.push(_importPath);
                                    } else if (!isDeclaration && isImportOrExportDeclaration(node)) {
                                        var _importPath2 = node.moduleSpecifier.text;
                                        imports.push(_importPath2);
                                    }
                                };

                                imports.push.apply(imports, sourceFile.referencedFiles.map(function (file) {
                                    return file.fileName;
                                }));
                                this.state.ts.forEachChild(sourceFile, visit);
                                task = imports.map(function (importPath) {
                                    return __awaiter(_this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
                                        var absolutePath;
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        _context3.next = 2;
                                                        return this.resolve(resolver, fileName, importPath);

                                                    case 2:
                                                        absolutePath = _context3.sent;

                                                        if (isIgnoreDependency(absolutePath)) {
                                                            _context3.next = 5;
                                                            break;
                                                        }

                                                        return _context3.abrupt('return', absolutePath);

                                                    case 5:
                                                    case 'end':
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, this);
                                    }));
                                });
                                _context4.next = 9;
                                return Promise.all(task);

                            case 9:
                                resolvedImports = _context4.sent;
                                return _context4.abrupt('return', resolvedImports.filter(Boolean));

                            case 11:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        }
    }, {
        key: 'resolve',
        value: function resolve(resolver, fileName, defPath) {
            var result = undefined;
            if (/^[a-z0-9].*\.d\.ts$/.test(defPath)) {
                defPath = './' + defPath;
            }
            if (isTypeDeclaration(defPath)) {
                result = Promise.resolve(path.resolve(path.dirname(fileName), defPath));
            } else {
                result = resolver(path.dirname(fileName), defPath).catch(function (error) {
                    try {
                        if (require.resolve(defPath) == defPath) {
                            return defPath;
                        } else {
                            throw error;
                        }
                    } catch (e) {
                        throw error;
                    }
                });
            }
            return result.catch(function (error) {
                var detailedError = new ResolutionError();
                detailedError.message = error.message + "\n    Required in " + fileName;
                detailedError.cause = error;
                detailedError.fileName = fileName;
                throw detailedError;
            });
        }
    }]);

    return FileAnalyzer;
}();

exports.FileAnalyzer = FileAnalyzer;

var DependencyManager = function () {
    function DependencyManager() {
        var dependencies = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var knownTypeDeclarations = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, DependencyManager);

        this.dependencies = dependencies;
        this.knownTypeDeclarations = knownTypeDeclarations;
        this.compiledModules = {};
    }

    _createClass(DependencyManager, [{
        key: 'clone',
        value: function clone() {
            return new DependencyManager(_.cloneDeep(this.dependencies), _.cloneDeep(this.knownTypeDeclarations));
        }
    }, {
        key: 'addDependency',
        value: function addDependency(fileName, depFileName) {
            if (!this.dependencies.hasOwnProperty(fileName)) {
                this.clearDependencies(fileName);
            }
            this.dependencies[fileName].push(depFileName);
        }
    }, {
        key: 'addCompiledModule',
        value: function addCompiledModule(fileName, depFileName) {
            if (!this.compiledModules.hasOwnProperty(fileName)) {
                this.clearCompiledModules(fileName);
            }
            var store = this.compiledModules[fileName];
            if (store.indexOf(depFileName) === -1) {
                store.push(depFileName);
            }
        }
    }, {
        key: 'clearDependencies',
        value: function clearDependencies(fileName) {
            this.dependencies[fileName] = [];
        }
    }, {
        key: 'clearCompiledModules',
        value: function clearCompiledModules(fileName) {
            this.compiledModules[fileName] = [];
        }
    }, {
        key: 'getDependencies',
        value: function getDependencies(fileName) {
            if (!this.dependencies.hasOwnProperty(fileName)) {
                this.clearDependencies(fileName);
            }
            return this.dependencies[fileName].slice();
        }
    }, {
        key: 'addTypeDeclaration',
        value: function addTypeDeclaration(fileName) {
            this.knownTypeDeclarations[fileName] = true;
        }
    }, {
        key: 'hasTypeDeclaration',
        value: function hasTypeDeclaration(fileName) {
            return this.knownTypeDeclarations.hasOwnProperty(fileName);
        }
    }, {
        key: 'getTypeDeclarations',
        value: function getTypeDeclarations() {
            return objectAssign({}, this.knownTypeDeclarations);
        }
    }, {
        key: 'getDependencyGraph',
        value: function getDependencyGraph(fileName) {
            var _this2 = this;

            var appliedDeps = {};
            var result = {
                fileName: fileName,
                dependencies: []
            };
            var walk = function walk(fileName, context) {
                _this2.getDependencies(fileName).forEach(function (depFileName) {
                    var depContext = {
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
    }, {
        key: 'applyCompiledFiles',
        value: function applyCompiledFiles(fileName, deps) {
            if (!this.compiledModules.hasOwnProperty(fileName)) {
                this.clearCompiledModules(fileName);
            }
            this.compiledModules[fileName].forEach(function (mod) {
                deps.add(mod);
            });
        }
    }, {
        key: 'applyChain',
        value: function applyChain(fileName, deps) {
            if (!this.dependencies.hasOwnProperty(fileName)) {
                this.clearDependencies(fileName);
            }
            var appliedDeps = {};
            var graph = this.getDependencyGraph(fileName);
            var walk = function walk(item) {
                var itemFileName = item.fileName;
                if (!appliedDeps[itemFileName]) {
                    appliedDeps[itemFileName] = true;
                    deps.add(itemFileName);
                    item.dependencies.forEach(function (dep) {
                        return walk(dep);
                    });
                }
            };
            walk(graph);
        }
    }]);

    return DependencyManager;
}();

exports.DependencyManager = DependencyManager;

var ValidFilesManager = function () {
    function ValidFilesManager() {
        _classCallCheck(this, ValidFilesManager);

        this.files = {};
    }

    _createClass(ValidFilesManager, [{
        key: 'isFileValid',
        value: function isFileValid(fileName) {
            return !!this.files[fileName];
        }
    }, {
        key: 'markFileValid',
        value: function markFileValid(fileName) {
            this.files[fileName] = true;
        }
    }, {
        key: 'markFileInvalid',
        value: function markFileInvalid(fileName) {
            this.files[fileName] = false;
        }
    }]);

    return ValidFilesManager;
}();

exports.ValidFilesManager = ValidFilesManager;

var ResolutionError = function (_Error) {
    _inherits(ResolutionError, _Error);

    function ResolutionError() {
        _classCallCheck(this, ResolutionError);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ResolutionError).apply(this, arguments));
    }

    return ResolutionError;
}(Error);

exports.ResolutionError = ResolutionError;
//# sourceMappingURL=deps.js.map
//# sourceMappingURL=deps.js.map