"use strict";
var component_metadata_collector_1 = require('../src/component_metadata_collector');
var chai = require('chai');
var path_1 = require('path');
describe('collect_components_metadata', function () {
    it('should collect metadata', function () {
        var collector = new component_metadata_collector_1.ComponentMetadataCollector();
        var cmpPath = path_1.normalize(path_1.join(__dirname, '..', '..', 'sample_data', 'cmp_a.ts'));
        var result = collector.getComponentTree(cmpPath);
        var a = result[0].metadata;
        var b = a.directives[0];
        chai.assert.equal(a.pipes[0].metadata.name, 'p1');
        chai.assert.equal(b.metadata.selector, 'b');
        chai.assert.deepEqual(b.metadata.directives.map(function (d) { return d.metadata.selector; }), ['[d]', 'c']);
    });
});
