"use strict";
var ts = require('typescript');
var ng2Walker_1 = require('../../src/util/ng2Walker');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var chaiSpy = chai.spy;
describe('ng2Walker', function () {
    it('should visit components and directives', function () {
        var source = "\n      @Component({\n        selector: 'foo',\n        template: 'bar'\n      })\n      class Baz {}\n      @Directive({\n        selector: '[baz]'\n      })\n      class Foobar {}\n    ";
        var ruleArgs = {
            ruleName: 'foo',
            ruleArguments: ['foo'],
            disabledIntervals: null
        };
        var sf = ts.createSourceFile('foo', source, null);
        var walker = new ng2Walker_1.Ng2Walker(sf, ruleArgs);
        var cmpSpy = chaiSpy.on(walker, 'visitNg2Component');
        var dirSpy = chaiSpy.on(walker, 'visitNg2Directive');
        walker.walk(sf);
        chai.expect(cmpSpy).to.have.been.called();
        chai.expect(dirSpy).to.have.been.called();
    });
    it('should visit inputs and outputs with args', function () {
        var source = "\n      @Component({\n        selector: 'foo',\n      })\n      class Baz {\n        @Input('bar')\n        foo;\n        @Output('baz')\n        foobar;\n      }\n    ";
        var ruleArgs = {
            ruleName: 'foo',
            ruleArguments: ['foo'],
            disabledIntervals: null
        };
        var sf = ts.createSourceFile('foo', source, null);
        var walker = new ng2Walker_1.Ng2Walker(sf, ruleArgs);
        var outputsSpy = chaiSpy.on(walker, 'visitNg2Output');
        var inputsSpy = chaiSpy.on(walker, 'visitNg2Input');
        walker.walk(sf);
        chai.expect(outputsSpy).to.have.been.called();
        chai.expect(inputsSpy).to.have.been.called();
    });
});
