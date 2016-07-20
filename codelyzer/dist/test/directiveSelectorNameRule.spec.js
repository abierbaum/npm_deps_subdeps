"use strict";
var testHelper_1 = require('./testHelper');
describe('directive-selector-name', function () {
    describe('invalid directive selectors', function () {
        it('should fail when directive named kebab-case', function () {
            var source = "\n      @Directive({\n        selector: 'foo-bar'\n      })\n      class Test {}";
            testHelper_1.assertFailure('directive-selector-name', source, {
                message: 'The selector of the directive "Test" should be named camelCase, however its value is "foo-bar".',
                startPosition: {
                    line: 2,
                    character: 18
                },
                endPosition: {
                    line: 2,
                    character: 27
                }
            }, 'camelCase');
        });
    });
    describe('valid directive selector', function () {
        it('should succeed when set valid selector in @Directive', function () {
            var source = "\n      @Component({\n        selector: 'sgBarFoo'\n      })\n      class Test {}";
            testHelper_1.assertSuccess('component-selector-name', source, 'camelCase');
        });
    });
});
