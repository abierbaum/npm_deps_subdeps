"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require('tslint/lib/lint');
var ts = require('typescript');
var sprintf_js_1 = require('sprintf-js');
var ClassParameterRule = (function (_super) {
    __extends(ClassParameterRule, _super);
    function ClassParameterRule(ruleName, value, disabledIntervals, validator, errorMessage) {
        _super.call(this, ruleName, value, disabledIntervals);
        this.validator = validator;
        this.errorMessage = errorMessage;
    }
    ClassParameterRule.prototype.apply = function (sourceFile) {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new ClassMetadataWalker(sourceFile, languageService, this));
    };
    ClassParameterRule.prototype.validate = function (parameter) {
        return this.validator(parameter);
    };
    ClassParameterRule.prototype.getFailureString = function (failureConfig) {
        return sprintf_js_1.sprintf(this.errorMessage, failureConfig.className, failureConfig.memberName, failureConfig.memberName);
    };
    return ClassParameterRule;
}(Lint.Rules.AbstractRule));
exports.ClassParameterRule = ClassParameterRule;
var ClassMetadataWalker = (function (_super) {
    __extends(ClassMetadataWalker, _super);
    function ClassMetadataWalker(sourceFile, languageService, rule) {
        _super.call(this, sourceFile, rule.getOptions());
        this.rule = rule;
        this.languageService = languageService;
        this.typeChecker = languageService.getProgram().getTypeChecker();
    }
    ClassMetadataWalker.prototype.visitClassDeclaration = function (node) {
        (node.members || []).forEach(this.validateClassMember.bind(this, node.name.text));
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    ClassMetadataWalker.prototype.validateClassMember = function (className, member) {
        if (!this.rule.validate(member)) {
            var memberName = member.name.text;
            this.addFailure(this.createFailure(member.getStart(), member.getWidth(), this.rule.getFailureString({ className: className, memberName: memberName })));
        }
    };
    return ClassMetadataWalker;
}(Lint.RuleWalker));
exports.ClassMetadataWalker = ClassMetadataWalker;
