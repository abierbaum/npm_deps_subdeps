"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ast_1 = require('angular2/src/core/change_detection/parser/ast');
var ValidateExpressionWalker = (function (_super) {
    __extends(ValidateExpressionWalker, _super);
    function ValidateExpressionWalker() {
        _super.apply(this, arguments);
    }
    ValidateExpressionWalker.prototype.visitMethodCall = function (ast) {
        _super.prototype.visitMethodCall.call(this, ast);
    };
    ValidateExpressionWalker.prototype.visitPropertyRead = function (ast) {
        _super.prototype.visitPropertyRead.call(this, ast);
    };
    ValidateExpressionWalker.prototype.visitSafePropertyRead = function (ast) {
        _super.prototype.visitSafePropertyRead.call(this, ast);
    };
    ValidateExpressionWalker.prototype.visitSafeMethodCall = function (ast) {
        _super.prototype.visitSafeMethodCall.call(this, ast);
    };
    return ValidateExpressionWalker;
}(ast_1.RecursiveAstVisitor));
