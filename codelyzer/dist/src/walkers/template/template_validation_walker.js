"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var template_walker_1 = require('./template_walker');
var TemplateValidationWalker = (function (_super) {
    __extends(TemplateValidationWalker, _super);
    function TemplateValidationWalker() {
        _super.apply(this, arguments);
    }
    TemplateValidationWalker.prototype.visitVariable = function (ast, context) {
        console.log('Visiting template variable', ast.value);
    };
    TemplateValidationWalker.prototype.visitEvent = function (ast, context) {
        console.log('Visiting event', ast.name);
    };
    TemplateValidationWalker.prototype.visitElementProperty = function (ast, context) {
        console.log('Visiting element property', ast.name);
    };
    TemplateValidationWalker.prototype.visitAttr = function (ast, context) {
        console.log('Visiting element attribute', ast.name);
    };
    TemplateValidationWalker.prototype.visitBoundText = function (ast, context) { };
    TemplateValidationWalker.prototype.visitText = function (ast, context) { };
    TemplateValidationWalker.prototype.visitDirectiveProperty = function (ast, context) {
        console.log('Visiting directive property', ast.value);
    };
    TemplateValidationWalker.prototype.visitNgContent = function (ast, context) { };
    return TemplateValidationWalker;
}(template_walker_1.TemplateWalker));
exports.TemplateValidationWalker = TemplateValidationWalker;
