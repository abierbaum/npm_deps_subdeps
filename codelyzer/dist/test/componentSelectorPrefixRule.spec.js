"use strict";
var testHelper_1 = require('./testHelper');
describe('component-selector-prefix', function () {
    describe('invalid component selectors', function () {
        it('should fail when component used without prefix', function () {
            var source = "\n      @Component({\n        selector: 'foo-bar'\n      })\n      class Test {}";
            testHelper_1.assertFailure('component-selector-prefix', source, {
                message: 'The selector of the component "Test" should have prefix "sg", however its value is "foo-bar".',
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
    describe('valid component selector', function () {
        it('should succeed when set valid selector in @Component', function () {
            var source = "\n      @Component({\n        selector: 'sg-bar-foo'\n      })\n      class Test {}";
            testHelper_1.assertSuccess('component-selector-prefix', source, 'sg');
        });
    });
});
