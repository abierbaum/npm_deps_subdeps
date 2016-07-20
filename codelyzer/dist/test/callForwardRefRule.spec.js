"use strict";
var testHelper_1 = require('./testHelper');
describe('call-forward-ref', function () {
    describe('invalid function call', function () {
        it('should fail when we are calling forwardRef in constructor', function () {
            var source = "\n            class Test {\n                constructor(@Inject(forwardRef(()=>NameService)) nameService) {}\n            }\n            class NameService {}";
            testHelper_1.assertFailure('call-forward-ref', source, {
                message: 'In the class "Test" you are calling forwardRef, which is considered a bad practice ' +
                    'and indicates either a cyclic dependency or inconsistency in the services declaration',
                startPosition: {
                    line: 2,
                    character: 36
                },
                endPosition: {
                    line: 2,
                    character: 63
                }
            });
        });
        it('should fail when we are calling forwardRef in Component directives array', function () {
            var source = "\n            @Component({\n                directives: [forwardRef(()=>NameService)]\n            })\n            class Test {}\n            class NameService {}";
            testHelper_1.assertFailure('call-forward-ref', source, {
                message: 'In the class "Test" you are calling forwardRef, which is considered a bad practice ' +
                    'and indicates either a cyclic dependency or inconsistency in the services declaration',
                startPosition: {
                    line: 2,
                    character: 29
                },
                endPosition: {
                    line: 2,
                    character: 56
                }
            });
        });
    });
    describe('valid function call', function () {
        it('should succeed, when we are not calling forwardRef', function () {
            var source = "\n                class Test {\n                    constructor() {\n                        this.test();\n                    }\n                    test(){\n                    }\n                }";
            testHelper_1.assertSuccess('call-forward-ref', source);
        });
    });
});
