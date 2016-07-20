"use strict";
var ts = require('typescript');
var harness = require('./harness');
var FileCache = (function () {
    function FileCache() {
        this.fileNames = [];
        this.snapshots = {};
        this.fileNameToScript = {};
    }
    FileCache.prototype.getFileNames = function () { return this.fileNames; };
    FileCache.prototype.getScriptInfo = function (fileName) {
        if (!this.fileNameToScript[fileName]) {
            this.fetchFile(fileName);
        }
        return this.fileNameToScript[fileName];
    };
    FileCache.prototype.getScriptSnapshot = function (fileName) {
        if (!this.snapshots[fileName]) {
            this.fetchFile(fileName);
        }
        return this.snapshots[fileName];
    };
    FileCache.prototype.addFile = function (fileName, text, isDefaultLib) {
        if (isDefaultLib === void 0) { isDefaultLib = false; }
        if (isDefaultLib) {
            this.fileNames.push(fileName);
        }
        else {
            this.fileNames.unshift(fileName);
        }
        this.fileNameToScript[fileName] = new harness.ScriptInfo(fileName, text);
        this.snapshots[fileName] = new harness.ScriptSnapshot(this.getScriptInfo(fileName));
    };
    FileCache.prototype.fetchFile = function (fileName) {
        if (ts.sys.fileExists(fileName)) {
            this.addFile(fileName, ts.sys.readFile(fileName));
        }
        else {
        }
    };
    FileCache.prototype.lineColToPosition = function (fileName, line, col) {
        return ts.getPositionOfLineAndCharacter(this.ls.getSourceFile(fileName), line - 1, col - 1);
    };
    FileCache.prototype.positionToLineCol = function (fileName, position) {
        var lineChar = ts.getLineAndCharacterOfPosition(this.ls.getSourceFile(fileName), position);
        return { line: lineChar.line + 1, character: lineChar.character + 1 };
    };
    FileCache.prototype.getLineText = function (fileName, line) {
        var source = this.ls.getSourceFile(fileName);
        var lineStart = ts.getPositionOfLineAndCharacter(source, line - 1, 0);
        var lineEnd = ts.getPositionOfLineAndCharacter(source, line, 0) - 1;
        var lineText = source.text.substring(lineStart, lineEnd);
        return lineText;
    };
    FileCache.prototype.updateScript = function (fileName, content) {
        var script = this.getScriptInfo(fileName);
        if (script) {
            script.updateContent(content);
            this.snapshots[fileName] = new harness.ScriptSnapshot(script);
        }
        else {
            this.addFile(fileName, content);
        }
    };
    FileCache.prototype.editScript = function (fileName, minChar, limChar, newText) {
        var script = this.getScriptInfo(fileName);
        if (script) {
            script.editContent(minChar, limChar, newText);
            this.snapshots[fileName] = new harness.ScriptSnapshot(script);
            return;
        }
        throw new Error("No script with name \"" + fileName + "\".");
    };
    return FileCache;
}());
exports.FileCache = FileCache;
