"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var reference_extractor_strategy_1 = require('./reference_extractor_strategy');
var BasicReferenceExtractorStrategy = (function (_super) {
    __extends(BasicReferenceExtractorStrategy, _super);
    function BasicReferenceExtractorStrategy() {
        _super.apply(this, arguments);
    }
    BasicReferenceExtractorStrategy.prototype.extract = function (nodes, file, walkerFactory) {
        return nodes.map(function (n) { return n.text; });
    };
    return BasicReferenceExtractorStrategy;
}(reference_extractor_strategy_1.ReferenceExtractorStrategy));
exports.BasicReferenceExtractorStrategy = BasicReferenceExtractorStrategy;
