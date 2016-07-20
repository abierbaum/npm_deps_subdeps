"use strict";
var template_validator_1 = require('../src/template_validator');
var path_1 = require('path');
describe('template_validator', function () {
    it('should validate template', function () {
        var cmpPath = path_1.normalize(path_1.join(__dirname, '..', '..', 'sample_data', 'cmp_a.ts'));
        var validator = new template_validator_1.TemplateValidator();
        var errors = validator.validate(cmpPath);
    });
});
