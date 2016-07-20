"use strict";
var testHelper_1 = require('./testHelper');
describe('directive-selector-prefix', function () {
    describe('invalid directive selectors', function () {
        it('should fail when directive used without prefix', function () {
            var source = "\n      @Directive({\n        selector: 'foo-bar'\n      })\n      class Test {}";
            testHelper_1.assertFailure('directive-selector-prefix', source, {
                message: 'The selector of the directive "Test" should have prefix "sg", however its value is "foo-bar".',
                startPosition: {
                    line: 2,
                    character: 18
                },
                endPosition: {
                    line: 2,
                    character: 27
                }
            }, 'sg');
        });
    });
    describe('valid directive selector', function () {
        it('should succeed when set valid selector in @Directive', function () {
            var source = "\n      @Directive({\n        selector: 'sgBarFoo'\n      })\n      class Test {}";
            testHelper_1.assertSuccess('directive-selector-prefix', source, 'sg');
        });
    });
});
