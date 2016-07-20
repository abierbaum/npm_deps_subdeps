"use strict";
var testHelper_1 = require('./testHelper');
describe('output-property-directive', function () {
    describe('invalid directive output property', function () {
        it("should fail, when a directive output property is renamed", function () {
            var source = "\n            class ButtonComponent {\n                @Output('changeEvent') change = new EventEmitter<any>();\n            }";
            testHelper_1.assertFailure('output-property-directive', source, {
                message: 'In the class "ButtonComponent", the directive output property "change" should not be renamed.' +
                    'Please, consider the following use "@Output() change = new EventEmitter();"',
                startPosition: {
                    line: 2,
                    character: 16
                },
                endPosition: {
                    line: 2,
                    character: 72
                }
            });
        });
    });
    describe('valid directive output property', function () {
        it('should succeed, when a directive output property is properly used', function () {
            var source = "\n            class ButtonComponent {\n               @Output() change = new EventEmitter<any>();\n            }";
            testHelper_1.assertSuccess('output-property-directive', source);
        });
        it('should succeed, when a directive output property rename is the same as the property name', function () {
            var source = "\n            class ButtonComponent {\n               @Output('change') change = new EventEmitter<any>();\n            }";
            testHelper_1.assertSuccess('output-property-directive', source);
        });
    });
});
