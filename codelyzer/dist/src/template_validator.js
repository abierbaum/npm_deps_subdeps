"use strict";
require('reflect-metadata');
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var directive_metadata_1 = require('angular2/src/compiler/directive_metadata');
var template_parser_1 = require('angular2/src/compiler/template_parser');
var compiler_1 = require('angular2/src/compiler/compiler');
var parse5_adapter_1 = require('angular2/src/platform/server/parse5_adapter');
var component_metadata_collector_1 = require('./component_metadata_collector');
var template_validation_walker_1 = require('./walkers/template/template_validation_walker');
parse5_adapter_1.Parse5DomAdapter.makeCurrent();
var TemplateValidator = (function () {
    function TemplateValidator() {
        this.injector = core_1.Injector.resolveAndCreate([core_1.PLATFORM_COMMON_PROVIDERS, core_1.APPLICATION_COMMON_PROVIDERS, compiler_1.COMPILER_PROVIDERS]);
        this.parser = this.injector.get(template_parser_1.TemplateParser);
    }
    TemplateValidator.prototype.validate = function (rootFile) {
        var _this = this;
        var collector = new component_metadata_collector_1.ComponentMetadataCollector();
        var tree = collector.getComponentTree(rootFile) || [];
        return tree.map(function (c) { return _this._validateDirectivesInTemplate(c); }).filter(function (e) { return !!e; }).concat(tree.map(function (c) { return _this._validateExpressionsInTemplate(c); }).filter(function (e) { return !!e; }));
    };
    TemplateValidator.prototype._validateDirectivesInTemplate = function (component, _directives, _pipes) {
        var _this = this;
        if (_directives === void 0) { _directives = common_1.COMMON_DIRECTIVES; }
        if (_pipes === void 0) { _pipes = common_1.COMMON_PIPES; }
        var meta = component.metadata;
        if (meta instanceof core_1.ComponentMetadata) {
            var directives_1 = (meta.directives || []).map(this._getDirective.bind(this)).concat(_directives);
            var pipes_1 = (meta.pipes || []).map(this._getPipe.bind(this)).concat(_pipes);
            try {
                var ast = this.parser.parse(meta.template, directives_1, pipes_1, '');
                this._validateDirectives(ast);
            }
            catch (e) {
                return e;
            }
            return (meta.directives || []).map(function (c) { return _this._validateDirectivesInTemplate(c, directives_1, pipes_1); });
        }
        else {
            return null;
        }
    };
    TemplateValidator.prototype._validateDirectives = function (ast) {
        compiler_1.templateVisitAll(new template_validation_walker_1.TemplateValidationWalker(), ast);
    };
    TemplateValidator.prototype._getDirective = function (dir) {
        var m = dir.metadata;
        return directive_metadata_1.CompileDirectiveMetadata.create({
            selector: m.selector,
            type: new directive_metadata_1.CompileTypeMetadata({ name: dir.classDeclaration.name.text }),
            inputs: m.inputs,
            outputs: m.outputs
        });
    };
    TemplateValidator.prototype._getPipe = function (pipe) {
        var m = pipe.metadata;
        return new directive_metadata_1.CompilePipeMetadata({
            name: m.name,
            type: new directive_metadata_1.CompileTypeMetadata({ name: pipe.classDeclaration.name.text })
        });
    };
    TemplateValidator.prototype._validateExpressionsInTemplate = function (c) {
        return [];
    };
    return TemplateValidator;
}());
exports.TemplateValidator = TemplateValidator;
