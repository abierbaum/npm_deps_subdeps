"use strict";
var testHelper_1 = require('./testHelper');
describe('directive-selector-type', function () {
    describe('invalid directive selectors', function () {
        it('should fail when directive used as attribute', function () {
            var source = "\n      @Directive({\n        selector: 'foo-bar'\n      })\n      class Test {}";
            testHelper_1.assertFailure('directive-selector-type', source, {
                message: 'The selector of the directive "Test" should be used as attribute, however its value is "foo-bar".',
                startPosition: {
                    line: 2,
                    character: 18
                },
                endPosition: {
                    line: 2,
                    character: 27
                }
            }, 'attribute');
        });
    });
    describe('valid directive selector', function () {
        it('should succeed when set valid selector in @Directive', function () {
            var source = "\n      @Directive({\n        selector: '[sgBarFoo]'\n      })\n      class Test {}";
            testHelper_1.assertSuccess('directive-selector-type', source, 'attribute');
        });
    });
});
