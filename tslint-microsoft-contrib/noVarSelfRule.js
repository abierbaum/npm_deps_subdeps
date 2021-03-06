"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lint_1 = require('tslint/lib/lint');
var SyntaxKind_1 = require('./utils/SyntaxKind');
var FAILURE_STRING = 'Assigning this reference to local variable: ';
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoVarSelfRuleWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(lint_1.Rules.AbstractRule));
exports.Rule = Rule;
var NoVarSelfRuleWalker = (function (_super) {
    __extends(NoVarSelfRuleWalker, _super);
    function NoVarSelfRuleWalker(sourceFile, options) {
        _super.call(this, sourceFile, options);
        this.bannedVariableNames = /.*/;
        if (options.ruleArguments != null && options.ruleArguments.length > 0) {
            this.bannedVariableNames = new RegExp(options.ruleArguments[0]);
        }
    }
    NoVarSelfRuleWalker.prototype.visitVariableDeclaration = function (node) {
        if (node.initializer != null && node.initializer.kind === SyntaxKind_1.SyntaxKind.current().ThisKeyword) {
            if (node.name.kind === SyntaxKind_1.SyntaxKind.current().Identifier) {
                var identifier = node.name;
                if (this.bannedVariableNames.test(identifier.text)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText()));
                }
            }
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    return NoVarSelfRuleWalker;
}(lint_1.RuleWalker));
//# sourceMappingURL=noVarSelfRule.js.map