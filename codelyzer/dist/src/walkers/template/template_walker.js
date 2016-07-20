"use strict";
var compiler_1 = require('angular2/src/compiler/compiler');
var TemplateWalker = (function () {
    function TemplateWalker() {
    }
    TemplateWalker.prototype.visitEmbeddedTemplate = function (ast, context) {
        compiler_1.templateVisitAll(this, ast.attrs);
        compiler_1.templateVisitAll(this, ast.children);
        compiler_1.templateVisitAll(this, ast.directives);
        compiler_1.templateVisitAll(this, ast.vars);
        compiler_1.templateVisitAll(this, ast.outputs);
    };
    TemplateWalker.prototype.visitElement = function (ast, context) {
        compiler_1.templateVisitAll(this, ast.attrs);
        compiler_1.templateVisitAll(this, ast.children);
        compiler_1.templateVisitAll(this, ast.directives);
        compiler_1.templateVisitAll(this, ast.outputs);
        compiler_1.templateVisitAll(this, ast.inputs);
    };
    TemplateWalker.prototype.visitDirective = function (ast, context) {
        compiler_1.templateVisitAll(this, ast.hostEvents);
        compiler_1.templateVisitAll(this, ast.inputs);
        compiler_1.templateVisitAll(this, ast.hostProperties);
    };
    TemplateWalker.prototype.visitVariable = function (ast, context) { };
    TemplateWalker.prototype.visitEvent = function (ast, context) { };
    TemplateWalker.prototype.visitElementProperty = function (ast, context) { };
    TemplateWalker.prototype.visitAttr = function (ast, context) { };
    TemplateWalker.prototype.visitBoundText = function (ast, context) { };
    TemplateWalker.prototype.visitText = function (ast, context) { };
    TemplateWalker.prototype.visitDirectiveProperty = function (ast, context) { };
    TemplateWalker.prototype.visitNgContent = function (ast, context) { };
    return TemplateWalker;
}());
exports.TemplateWalker = TemplateWalker;
