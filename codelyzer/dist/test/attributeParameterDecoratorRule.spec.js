"use strict";
var testHelper_1 = require('./testHelper');
describe('attribute-parameter-decorator', function () {
    describe('invalid parameter decorator', function () {
        it("should fail, when it's used attribute decorator", function () {
            var source = "\n            class ButtonComponent {\n                label: string;\n                constructor(@Attribute('label') label) {\n                    this.label = label;\n                }\n            }";
            testHelper_1.assertFailure('attribute-parameter-decorator', source, {
                message: 'In the constructor of class "ButtonComponent", the parameter "label" uses the @Attribute decorator, ' +
                    'which is considered as a bad practice. Please, consider construction of type "@Input() label: string"',
                startPosition: {
                    line: 3,
                    character: 28
                },
                endPosition: {
                    line: 3,
                    character: 53
                }
            });
        });
    });
    describe('valid class constructor', function () {
        it('should succeed, when is not used attribute decorator', function () {
            var source = "\n            class ButtonComponent {\n                constructor(){}\n            }";
            testHelper_1.assertSuccess('attribute-parameter-decorator', source);
        });
    });
});
