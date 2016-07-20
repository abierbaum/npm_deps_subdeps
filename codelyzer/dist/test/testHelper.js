"use strict";
var Lint = require('tslint');
var chai = require('chai');
function lint(ruleName, source, options) {
    var configuration = {
        rules: {}
    };
    if (options !== null && options.length >= 0) {
        configuration.rules[ruleName] = [true].concat(options);
    }
    else {
        configuration.rules[ruleName] = true;
    }
    var linterOptions = {
        formatter: 'json',
        configuration: configuration,
        rulesDirectory: './dist/src',
        formattersDirectory: null
    };
    var linter = new Lint('file.ts', source, linterOptions);
    return linter.lint();
}
function assertFailure(ruleName, source, fail, options) {
    if (options === void 0) { options = null; }
    var result;
    try {
        result = lint(ruleName, source, options);
    }
    catch (e) {
        console.log(e.stack);
    }
    chai.assert(result.failureCount > 0, 'no failures');
    result.failures.forEach(function (ruleFail) {
        chai.assert.equal(fail.message, ruleFail.getFailure(), 'error messages dont\'t match');
        chai.assert.deepEqual(fail.startPosition, ruleFail.getStartPosition().getLineAndCharacter(), 'start char doesn\'t match');
        chai.assert.deepEqual(fail.endPosition, ruleFail.getEndPosition().getLineAndCharacter(), 'end char doesn\'t match');
    });
}
exports.assertFailure = assertFailure;
;
function assertSuccess(ruleName, source, options) {
    if (options === void 0) { options = null; }
    chai.assert.equal(lint(ruleName, source, options).failureCount, 0);
}
exports.assertSuccess = assertSuccess;
;
