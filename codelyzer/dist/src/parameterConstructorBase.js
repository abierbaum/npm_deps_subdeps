"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ts = require('typescript');
var sprintf_js_1 = require('sprintf-js');
var ConstructorRule = (function (_super) {
    __extends(ConstructorRule, _super);
    function ConstructorRule(ruleName, value, disabledIntervals, validator, errorMessage) {
        _super.call(this, ruleName, value, disabledIntervals);
        this.validator = validator;
        this.errorMessage = errorMessage;
    }
    ConstructorRule.prototype.apply = function (sourceFile) {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new ConstructorMetadataWalker(sourceFile, languageService, this));
    };
    ConstructorRule.prototype.validate = function (parameter) {
        return this.validator(parameter);
    };
    ConstructorRule.prototype.getFailureString = function (failureConfig) {
        return sprintf_js_1.sprintf(this.errorMessage, failureConfig.className, failureConfig.parameterName, failureConfig.parameterName);
    };
    return ConstructorRule;
}(Lint.Rules.AbstractRule));
exports.ConstructorRule = ConstructorRule;
var ConstructorMetadataWalker = (function (_super) {
    __extends(ConstructorMetadataWalker, _super);
    function ConstructorMetadataWalker(sourceFile, languageService, rule) {
        _super.call(this, sourceFile, rule.getOptions());
        this.rule = rule;
        this.languageService = languageService;
        this.typeChecker = languageService.getProgram().getTypeChecker();
    }
    ConstructorMetadataWalker.prototype.visitConstructorDeclaration = function (node) {
        var parentName = node.parent.name.text;
        (node.parameters || []).forEach(this.validateParameter.bind(this, parentName));
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    ConstructorMetadataWalker.prototype.validateParameter = function (className, parameter) {
        var parameterName = parameter.name.text;
        if (!this.rule.validate(parameter)) {
            this.addFailure(this.createFailure(parameter.getStart(), parameter.getWidth(), this.rule.getFailureString({ className: className, parameterName: parameterName })));
        }
    };
    return ConstructorMetadataWalker;
}(Lint.RuleWalker));
exports.ConstructorMetadataWalker = ConstructorMetadataWalker;
