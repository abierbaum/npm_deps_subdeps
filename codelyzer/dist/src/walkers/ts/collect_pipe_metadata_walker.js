"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('angular2/core');
var ts = require('typescript');
var base_collect_metadata_walker_1 = require('./base_collect_metadata_walker');
var PipeInfo = (function () {
    function PipeInfo() {
    }
    return PipeInfo;
}());
exports.PipeInfo = PipeInfo;
var CollectPipeMetadataWalker = (function (_super) {
    __extends(CollectPipeMetadataWalker, _super);
    function CollectPipeMetadataWalker() {
        _super.apply(this, arguments);
        this.pipes = [];
    }
    CollectPipeMetadataWalker.prototype.getMetadata = function (file, pipeNames) {
        this.pipeNames = pipeNames;
        this.file = file;
        this.walk(file);
        return this.pipes;
    };
    CollectPipeMetadataWalker.prototype.visitClassDeclaration = function (node) {
        if (!this.pipeNames || this.pipeNames.indexOf(node.name.text) >= 0) {
            this.currentPipe = new PipeInfo();
            this.currentPipe.classDeclaration = node;
            var res = this.extractDecorators(node, /^Pipe$/);
            this.collectClassDecoratorMetadata(res.node, res.name, res.args[0]);
            _super.prototype.visitClassDeclaration.call(this, node);
            this.pipes.push(this.currentPipe);
        }
    };
    CollectPipeMetadataWalker.prototype.extractDecorators = function (node, decoratorRegexp) {
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
    CollectPipeMetadataWalker.prototype.collectClassDecoratorMetadata = function (node, decoratorName, decoratorArg) {
        var metadata = { name: null };
        if (decoratorArg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            decoratorArg.properties.forEach(function (prop) {
                var name = prop.name.text;
                var extracter = base_collect_metadata_walker_1.classMetadataValueExtracter[name];
                if (extracter && base_collect_metadata_walker_1.PROP_MAP[name]) {
                    metadata[base_collect_metadata_walker_1.PROP_MAP[name]] = extracter(prop);
                }
                else {
                    console.log("Cannot extract value for " + name);
                }
            });
        }
        this.currentPipe.metadata = new core_1.PipeMetadata(metadata);
    };
    return CollectPipeMetadataWalker;
}(base_collect_metadata_walker_1.BaseCollectMetadataWalker));
exports.CollectPipeMetadataWalker = CollectPipeMetadataWalker;
