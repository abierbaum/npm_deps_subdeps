"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var base_collect_metadata_walker_1 = require('./base_collect_metadata_walker');
var collect_pipe_metadata_walker_1 = require('./collect_pipe_metadata_walker');
var core_1 = require('angular2/core');
var DirectiveInfo = (function () {
    function DirectiveInfo() {
    }
    return DirectiveInfo;
}());
exports.DirectiveInfo = DirectiveInfo;
var CollectComponentMetadataWalker = (function (_super) {
    __extends(CollectComponentMetadataWalker, _super);
    function CollectComponentMetadataWalker() {
        _super.apply(this, arguments);
        this.directives = [];
    }
    CollectComponentMetadataWalker.prototype.getMetadata = function (file, directivesName) {
        this.directivesName = directivesName;
        this.file = file;
        this.walk(file);
        return this.directives;
    };
    CollectComponentMetadataWalker.prototype.visitPropertyDeclaration = function (node) {
        var res = this.extractDecorators(node, /^HostBinding/);
        this.collectHostBindingMetadata(res.node, res.args[0]);
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    CollectComponentMetadataWalker.prototype.visitMethodDeclaration = function (node) {
        var res = this.extractDecorators(node, /^HostListener$/);
        this.collectHostListenerMetadata(res.node, res.args);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    CollectComponentMetadataWalker.prototype.visitClassDeclaration = function (node) {
        if (!this.directivesName || this.directivesName.indexOf(node.name.text) >= 0) {
            this.currentDirective = new DirectiveInfo();
            this.currentDirective.classDeclaration = node;
            var res = this.extractDecorators(node, /^(Component|Directive)$/);
            this.collectClassDecoratorMetadata(res.node, res.name, res.args[0]);
            _super.prototype.visitClassDeclaration.call(this, node);
            this.directives.push(this.currentDirective);
        }
    };
    CollectComponentMetadataWalker.prototype.extractDecorators = function (node, decoratorRegexp) {
        return (node.decorators || []).map(function (d) {
            var baseExpr = d.expression || {};
            var expr = baseExpr.expression || {};
            var name = expr.text;
            var args = baseExpr.arguments || [];
            if (decoratorRegexp.test(name)) {
                return {
                    args: args, name: name, node: node
                };
            }
            return null;
        }).find(function (r) { return !!r; });
    };
    CollectComponentMetadataWalker.prototype.collectClassDecoratorMetadata = function (node, decoratorName, decoratorArg) {
        var _this = this;
        if (decoratorName === 'Directive') {
            this.currentDirective.metadata = new core_1.DirectiveMetadata();
        }
        else {
            this.currentDirective.metadata = new core_1.ComponentMetadata();
        }
        if (decoratorArg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            decoratorArg.properties.forEach(function (prop) {
                var name = prop.name.text;
                if (name === 'directives') {
                    _this.currentDirective.metadata[name] =
                        _this.referenceExtractorStrategy.extract(prop.initializer.elements, _this.file, function (extractor) { return new CollectComponentMetadataWalker(extractor); });
                }
                else if (name === 'pipes') {
                    _this.currentDirective.metadata[name] =
                        _this.referenceExtractorStrategy.extract(prop.initializer.elements, _this.file, function (extractor) { return new collect_pipe_metadata_walker_1.CollectPipeMetadataWalker(extractor); });
                }
                else {
                    var extracter = base_collect_metadata_walker_1.classMetadataValueExtracter[name];
                    if (extracter && base_collect_metadata_walker_1.PROP_MAP[name]) {
                        _this.currentDirective.metadata[base_collect_metadata_walker_1.PROP_MAP[name]] = extracter(prop, _this.file.fileName);
                    }
                    else {
                        console.log("Cannot extract value for " + name + " in " + node.name.text);
                    }
                }
            });
        }
    };
    CollectComponentMetadataWalker.prototype.collectHostBindingMetadata = function (node, decoratorArg) {
        var propName = node.name.text;
        if (!decoratorArg || decoratorArg.kind === ts.SyntaxKind.StringLiteral) {
            this.currentDirective.metadata.host = this.currentDirective.metadata.host || {};
            this.currentDirective.metadata.host[("[" + ((decoratorArg && decoratorArg.text) || propName) + "]")] = propName;
        }
        else {
            console.log('Unsupported construct');
        }
    };
    CollectComponentMetadataWalker.prototype.collectHostListenerMetadata = function (node, decoratorArgs) {
        var methodName = node.name.text;
        if (decoratorArgs[0].kind === ts.SyntaxKind.StringLiteral) {
            this.currentDirective.metadata.host = this.currentDirective.metadata.host || {};
            this.currentDirective.metadata.host[("(" + decoratorArgs[0].text + ")")] = methodName + "()";
        }
    };
    return CollectComponentMetadataWalker;
}(base_collect_metadata_walker_1.BaseCollectMetadataWalker));
exports.CollectComponentMetadataWalker = CollectComponentMetadataWalker;
