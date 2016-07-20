"use strict";
var collect_component_metadata_walker_1 = require('../../src/walkers/ts/collect_component_metadata_walker');
var chai = require('chai');
var tsc = require('typescript');
describe('collect_component_metadata_walker', function () {
    it('should collect metadata', function () {
        var file = tsc.createSourceFile('file.ts', "\n      @Directive({\n        selector: 'foobar',\n        inputs: ['bar', 'baz'],\n        outputs: ['bar', 'foo'],\n        host: {\n          '(click)': 'foobar()',\n          '[baz]': 'baz',\n          'role': 'button'\n        }\n      })\n      class Foo {}\n    ", tsc.ScriptTarget.ES2015, true);
        var visitor = new collect_component_metadata_walker_1.CollectComponentMetadataWalker();
        visitor.getMetadata(file);
        chai.assert.equal(visitor.directives[0].metadata.selector, 'foobar', 'should get the selector value');
        chai.assert.deepEqual(visitor.directives[0].metadata.host, { '(click)': 'foobar()', '[baz]': 'baz', 'role': 'button' }, 'should work with inline host');
        chai.assert.deepEqual(visitor.directives[0].metadata.inputs, ['bar', 'baz']);
        chai.assert.deepEqual(visitor.directives[0].metadata.outputs, ['bar', 'foo']);
    });
    it('should collect inline metadata', function () {
        var file = tsc.createSourceFile('file.ts', "\n      @Directive({\n        selector: 'foobar',\n        inputs: ['bar', 'baz'],\n        outputs: ['bar', 'foo'],\n        host: {\n          'role': 'button'\n        }\n      })\n      class Foo {\n        @HostBinding()\n        baz: string;\n        @HostBinding('bar')\n        foobar: string;\n        @HostListener('click')\n        foobar() {}\n      }\n    ", tsc.ScriptTarget.ES2015, true);
        var visitor = new collect_component_metadata_walker_1.CollectComponentMetadataWalker();
        visitor.getMetadata(file);
        chai.assert.deepEqual(visitor.directives[0].metadata.host, { '(click)': 'foobar()', '[baz]': 'baz', '[bar]': 'foobar', 'role': 'button' }, 'should work with inline host');
    });
    it('should work with multiple directives per file', function () {
        var file = tsc.createSourceFile('file.ts', "\n      @Directive({\n        selector: 'foo'\n      })\n      class Foo {}\n      @Component({\n        selector: 'bar',\n        inputs: ['bar', 'baz'],\n        outputs: ['bar', 'foo'],\n        directives: [Foo],\n        host: {\n          'role': 'button'\n        }\n      })\n      class Bar {}\n    ", tsc.ScriptTarget.ES2015, true);
        var visitor = new collect_component_metadata_walker_1.CollectComponentMetadataWalker();
        visitor.getMetadata(file);
        chai.assert.equal(visitor.directives.length, 2);
        var dir = visitor.directives[0];
        var component = visitor.directives[1];
        chai.assert.equal(dir.metadata.selector, 'foo');
        chai.assert.equal(component.metadata.selector, 'bar');
        chai.assert.deepEqual(component.metadata.inputs, ['bar', 'baz']);
        chai.assert.deepEqual(component.metadata.directives, ['Foo']);
    });
    it('should work with external templates', function () {
        var file = tsc.createSourceFile('file.ts', "\n      @Component({\n        selector: 'bar',\n        templateUrl: './sample_data/external_template.html'\n      })\n      class Bar {}\n    ", tsc.ScriptTarget.ES2015, true);
        var visitor = new collect_component_metadata_walker_1.CollectComponentMetadataWalker();
        visitor.getMetadata(file);
        chai.assert.equal(visitor.directives.length, 1);
        chai.assert.equal(visitor.directives[0].metadata.template, '<div></div>');
    });
});
