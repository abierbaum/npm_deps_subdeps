"use strict";
var testHelper_1 = require('./testHelper');
describe('host-parameter-decorator', function () {
    it('should fail when "host" is used in @Component', function () {
        var source = "\n      @Component({\n        host: {\n          '(click)': 'bar()'\n        }\n      })\n      class Bar {}\n    ";
        testHelper_1.assertFailure('host-parameter-decorator', source, {
            message: 'In the "@Component" class decorator of the class "Bar" you are using the "host" property, this is considered bad practice. Use "@HostBindings", "@HostListeners" property decorator instead.',
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
    it('should succeed when "host" is not used', function () {
        var source = "\n      @Component({\n        selector: 'baz'\n      })\n      class Bar {}\n    ";
        testHelper_1.assertSuccess('host-parameter-decorator', source);
    });
    it('should fail when "host" is used in @Directive', function () {
        var source = "\n      @Directive({\n        host: {\n          '(click)': 'bar()'\n        }\n      })\n      class Baz {}\n    ";
        testHelper_1.assertFailure('host-parameter-decorator', source, {
            message: 'In the "@Directive" class decorator of the class "Baz" you are using the "host" property, this is considered bad practice. Use "@HostBindings", "@HostListeners" property decorator instead.',
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
