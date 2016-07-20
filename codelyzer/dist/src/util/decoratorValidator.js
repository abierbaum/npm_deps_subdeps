"use strict";
exports.decoratorValidator = function (condition) {
    return function (element) {
        var isValid = true;
        if (element.decorators) {
            element.decorators.forEach(function (decorator) {
                var baseExpr = decorator.expression || {};
                var expr = baseExpr.expression || {};
                var name = expr.text;
                var args = baseExpr.arguments || [];
                var arg = args[0];
                if (condition(name, arg, element)) {
                    isValid = false;
                }
            });
        }
        return isValid;
    };
};
