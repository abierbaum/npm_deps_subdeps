"use strict";
require('reflect-metadata');
var ts = require('typescript');
var fs = require('fs');
var file_cache_1 = require('./util/file_cache');
var collect_component_metadata_walker_1 = require('./walkers/ts/collect_component_metadata_walker');
var recursive_reference_extractor_strategy_1 = require('./reference_extractors/recursive_reference_extractor_strategy');
var ComponentMetadataCollector = (function () {
    function ComponentMetadataCollector() {
        var _this = this;
        this.lsHost = {
            getCompilationSettings: function () { return {}; },
            getScriptFileNames: function () { return _this.fileCache.getFileNames(); },
            getScriptVersion: function (fileName) { return _this.fileCache.getScriptInfo(fileName).version.toString(); },
            getScriptSnapshot: function (fileName) { return _this.fileCache.getScriptSnapshot(fileName); },
            getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
            getDefaultLibFileName: function (options) { return ts.getDefaultLibFileName(options); },
            log: function (message) { return undefined; },
            trace: function (message) { return undefined; },
            error: function (message) { return console.error(message); }
        };
        this.ls = ts.createLanguageService(this.lsHost, ts.createDocumentRegistry());
        this.fileCache = new file_cache_1.FileCache();
        this.fileCache.ls = this.ls;
    }
    ComponentMetadataCollector.prototype.getComponentTree = function (rootFile) {
        var walker = new collect_component_metadata_walker_1.CollectComponentMetadataWalker(new recursive_reference_extractor_strategy_1.RecursiveReferenceExtractorStrategy(this.fileCache, this.ls));
        var file = ts.createSourceFile(rootFile, fs.readFileSync(rootFile).toString(), ts.ScriptTarget.ES2015, true);
        return walker.getMetadata(file);
    };
    return ComponentMetadataCollector;
}());
exports.ComponentMetadataCollector = ComponentMetadataCollector;
