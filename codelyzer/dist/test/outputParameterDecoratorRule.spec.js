"use strict";
var testHelper_1 = require('./testHelper');
describe('output-parameter-decorator', function () {
    it('should fail when "outputs" is used in @Component', function () {
        var source = "\n      @Component({\n        outputs: [\n          'id: foo'\n        ]\n      })\n      class Bar {}\n    ";
        testHelper_1.assertFailure('output-parameter-decorator', source, {
            message: 'In the "@Component" class decorator of the class "Bar" you are using the "outputs" property, this is considered bad practice. Use "@Output" property decorator instead.',
            startPosition: {
                line: 2,
                character: 8
            },
            endPosition: {
                line: 4,
                character: 9
            }
        });
    });
    it('should succeed when "outputs" is not used', function () {
        var source = "\n      @Component({\n        selector: 'baz'\n      })\n      class Bar {}\n    ";
        testHelper_1.assertSuccess('output-parameter-decorator', source);
    });
    it('should fail when "outputs" is used in @Directive', function () {
        var source = "\n      @Directive({\n        outputs: [\n          'id: foo'\n        ]\n      })\n      class Baz {}\n    ";
        testHelper_1.assertFailure('output-parameter-decorator', source, {
            message: 'In the "@Directive" class decorator of the class "Baz" you are using the "outputs" property, this is considered bad practice. Use "@Output" property decorator instead.',
            startPosition: {
                line: 2,
                character: 8
            },
            endPosition: {
                line: 4,
                character: 9
            }
        });
    });
});
