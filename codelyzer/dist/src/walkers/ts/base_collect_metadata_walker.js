"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('reflect-metadata');
var fs = require('fs');
var path = require('path');
var ts = require('typescript');
var syntax_walker_1 = require('./syntax_walker');
var basic_reference_extractor_strategy_1 = require('../../reference_extractors/basic_reference_extractor_strategy');
var BaseCollectMetadataWalker = (function (_super) {
    __extends(BaseCollectMetadataWalker, _super);
    function BaseCollectMetadataWalker(referenceExtractorStrategy) {
        if (referenceExtractorStrategy === void 0) { referenceExtractorStrategy = new basic_reference_extractor_strategy_1.BasicReferenceExtractorStrategy(); }
        _super.call(this);
        this.referenceExtractorStrategy = referenceExtractorStrategy;
    }
    return BaseCollectMetadataWalker;
}(syntax_walker_1.SyntaxWalker));
exports.BaseCollectMetadataWalker = BaseCollectMetadataWalker;
exports.classMetadataValueExtracter = {
    selector: getPropValue,
    inputs: getArrayLiteralValue,
    outputs: getArrayLiteralValue,
    host: getObjectLiteralValue,
    templateUrl: getExternalFileFromLiteral,
    template: getPropValue,
    name: getPropValue
};
exports.PROP_MAP = {
    outputs: '_events',
    events: '_events',
    inputs: '_properties',
    properties: '_properties',
    host: 'host',
    selector: 'selector',
    directives: 'directives',
    pipes: 'pipes',
    templateUrl: 'template',
    template: 'template',
    name: 'name'
};
function getPropValue(p) {
    if (p.initializer.kind === ts.SyntaxKind.StringLiteral) {
        return p.initializer.text;
    }
    return null;
}
function getArrayLiteralValue(n) {
    if (n.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
        return n.initializer.elements.map(function (e) { return e.text; });
    }
    return null;
}
function getObjectLiteralValue(n) {
    if (n.initializer.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        return n.initializer.properties.reduce(function (p, c) {
            p[c.name.text] = c.initializer.text;
            return p;
        }, {});
    }
    return null;
}
function getExternalFileFromLiteral(n, fileName) {
    var dir = path.dirname(fileName);
    return fs.readFileSync(path.join(dir, getPropValue(n))).toString();
}
