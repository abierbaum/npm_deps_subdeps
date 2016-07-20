"use strict";
var testHelper_1 = require('./testHelper');
describe('component-selector-type', function () {
    describe('invalid component selectors', function () {
        it('should fail when component used as attribute', function () {
            var source = "\n      @Component({\n        selector: '[fooBar]'\n      })\n      class Test {}";
            testHelper_1.assertFailure('component-selector-type', source, {
                message: 'The selector of the component "Test" should be used as element, however its value is "[fooBar]".',
                startPosition: {
                    line: 2,
                    character: 18
                },
                endPosition: {
                    line: 2,
                    character: 28
                }
            }, 'element');
        });
    });
    describe('valid component selector', function () {
        it('should succeed when set valid selector in @Component', function () {
            var source = "\n      @Component({\n        selector: 'sg-bar-foo'\n      })\n      class Test {}";
            testHelper_1.assertSuccess('component-selector-type', source, 'element');
        });
    });
});
