"use strict";
var ts = require('typescript');
function computeLineStarts(text) {
    var result = new Array();
    var pos = 0;
    var lineStart = 0;
    while (pos < text.length) {
        var ch = text.charCodeAt(pos++);
        switch (ch) {
            case 0x0D:
                if (text.charCodeAt(pos) === 0x0A) {
                    pos++;
                }
            case 0x0A:
                result.push(lineStart);
                lineStart = pos;
                break;
            default:
                if (ch > 0x7F && ts.isLineBreak(ch)) {
                    result.push(lineStart);
                    lineStart = pos;
                }
                break;
        }
    }
    result.push(lineStart);
    return result;
}
var ScriptInfo = (function () {
    function ScriptInfo(fileName, content, isOpen) {
        if (isOpen === void 0) { isOpen = true; }
        this.fileName = fileName;
        this.content = content;
        this.isOpen = isOpen;
        this.version = 1;
        this.editRanges = [];
        this.setContent(content);
    }
    ScriptInfo.prototype.setContent = function (content) {
        this.content = content;
    };
    ScriptInfo.prototype.updateContent = function (content) {
        var old_length = this.content.length;
        this.setContent(content);
        this.editRanges.push({
            length: content.length,
            textChangeRange: ts.createTextChangeRange(ts.createTextSpan(0, old_length), content.length)
        });
        this.version++;
    };
    ScriptInfo.prototype.editContent = function (minChar, limChar, newText) {
        var prefix = this.content.substring(0, minChar);
        var middle = newText;
        var suffix = this.content.substring(limChar);
        this.setContent(prefix + middle + suffix);
        this.editRanges.push({
            length: this.content.length,
            textChangeRange: ts.createTextChangeRange(ts.createTextSpanFromBounds(minChar, limChar), newText.length)
        });
        this.version++;
    };
    ScriptInfo.prototype.getTextChangeRangeBetweenVersions = function (startVersion, endVersion) {
        if (startVersion === endVersion) {
            return ts.unchangedTextChangeRange;
        }
        var initialEditRangeIndex = this.editRanges.length - (this.version - startVersion);
        var lastEditRangeIndex = this.editRanges.length - (this.version - endVersion);
        var entries = this.editRanges.slice(initialEditRangeIndex, lastEditRangeIndex);
        return ts.collapseTextChangeRangesAcrossMultipleVersions(entries.map(function (e) { return e.textChangeRange; }));
    };
    return ScriptInfo;
}());
exports.ScriptInfo = ScriptInfo;
var ScriptSnapshot = (function () {
    function ScriptSnapshot(scriptInfo) {
        this.scriptInfo = scriptInfo;
        this.lineMap = null;
        this.textSnapshot = scriptInfo.content;
        this.version = scriptInfo.version;
    }
    ScriptSnapshot.prototype.getText = function (start, end) {
        return this.textSnapshot.substring(start, end);
    };
    ScriptSnapshot.prototype.getLength = function () {
        return this.textSnapshot.length;
    };
    ScriptSnapshot.prototype.getLineStartPositions = function () {
        if (this.lineMap === null) {
            this.lineMap = computeLineStarts(this.textSnapshot);
        }
        return this.lineMap;
    };
    ScriptSnapshot.prototype.getChangeRange = function (oldSnapshot) {
        return undefined;
    };
    return ScriptSnapshot;
}());
exports.ScriptSnapshot = ScriptSnapshot;
