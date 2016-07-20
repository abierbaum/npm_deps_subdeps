"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var ts = require('typescript');
var reference_extractor_strategy_1 = require('./reference_extractor_strategy');
var RecursiveReferenceExtractorStrategy = (function (_super) {
    __extends(RecursiveReferenceExtractorStrategy, _super);
    function RecursiveReferenceExtractorStrategy(fileCache, ls) {
        _super.call(this);
        this.fileCache = fileCache;
        this.ls = ls;
    }
    RecursiveReferenceExtractorStrategy.prototype.extract = function (nodes, file, walkerFactory) {
        var _this = this;
        return nodes.map(function (node) {
            _this.ls.getSourceFile(file.fileName);
            var locs = _this.ls.getDefinitionAtPosition(file.fileName, node.pos + 1);
            var def = null;
            while (locs && locs.length) {
                var current = locs.pop();
                if (current.kind === 'class') {
                    def = current;
                    break;
                }
                else {
                    locs = locs.concat(_this.ls.getDefinitionAtPosition(current.fileName, current.textSpan.start));
                }
            }
            var info = {
                def: def,
                file: def && def.fileName,
                min: def && _this.fileCache.positionToLineCol(def.fileName, def.textSpan.start),
                lim: def && _this.fileCache.positionToLineCol(def.fileName, ts.textSpanEnd(def.textSpan))
            };
            if (def && info.file) {
                var file_1 = ts.createSourceFile(info.file, fs.readFileSync(info.file).toString(), ts.ScriptTarget.ES2015, true);
                console.log('----------------------');
                console.log(info.file.fileName);
                var visitor = walkerFactory(new RecursiveReferenceExtractorStrategy(_this.fileCache, _this.ls));
                return visitor.getMetadata(file_1, [node.text]).pop();
            }
            return null;
        });
    };
    return RecursiveReferenceExtractorStrategy;
}(reference_extractor_strategy_1.ReferenceExtractorStrategy));
exports.RecursiveReferenceExtractorStrategy = RecursiveReferenceExtractorStrategy;
