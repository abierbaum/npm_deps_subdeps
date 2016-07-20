"use strict";
var testHelper_1 = require('./testHelper');
describe('component-selector-name', function () {
    describe('invalid component selectors', function () {
        it('should fail when component named camelCase', function () {
            var source = "\n      @Component({\n        selector: 'fooBar'\n      })\n      class Test {}";
            testHelper_1.assertFailure('component-selector-name', source, {
                message: 'The selector of the component "Test" should be named kebab-case, however its value is "fooBar".',
                startPosition: {
                    line: 2,
                    character: 18
                },
                endPosition: {
                    line: 2,
                    character: 26
                }
            }, 'kebab-case');
        });
    });
    describe('valid component selector', function () {
        it('should succeed when set valid selector in @Component', function () {
            var source = "\n      @Component({\n        selector: 'sg-bar-foo'\n      })\n      class Test {}";
            testHelper_1.assertSuccess('component-selector-name', source, 'kebab-case');
        });
    });
});
