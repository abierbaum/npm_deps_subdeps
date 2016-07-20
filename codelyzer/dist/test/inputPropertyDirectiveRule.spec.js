"use strict";
var testHelper_1 = require('./testHelper');
describe('input-property-directive', function () {
    describe('invalid directive input property', function () {
        it("should fail, when a directive input property is renamed", function () {
            var source = "\n            class ButtonComponent {\n                @Input('labelAttribute') label: string;\n            }";
            testHelper_1.assertFailure('input-property-directive', source, {
                message: 'In the class "ButtonComponent", the directive input property "label" should not be renamed.' +
                    'Please, consider the following use "@Input() label: string"',
                startPosition: {
                    line: 2,
                    character: 16
                },
                endPosition: {
                    line: 2,
                    character: 55
                }
            });
        });
    });
    describe('valid directive input property', function () {
        it('should succeed, when a directive input property is properly used', function () {
            var source = "\n            class ButtonComponent {\n              @Input() label: string;\n            }";
            testHelper_1.assertSuccess('input-property-directive', source);
        });
        it('should succeed, when a directive input property rename is the same as the name of the property', function () {
            var source = "\n            class ButtonComponent {\n              @Input('label') label: string;\n            }";
            testHelper_1.assertSuccess('input-property-directive', source);
        });
    });
});
