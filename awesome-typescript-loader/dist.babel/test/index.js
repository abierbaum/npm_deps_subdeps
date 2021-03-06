"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var utils_1 = require('./utils');
describe('main test', function () {
    it('should compile simple file', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var config, stats, result, expectation;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            config = {
                                entry: utils_1.fixturePath(['basic', 'basic.ts'])
                            };
                            _context.next = 3;
                            return utils_1.cleanAndCompile(utils_1.createConfig(config));

                        case 3:
                            stats = _context.sent;

                            utils_1.expect(stats.compilation.errors.length).eq(0);
                            _context.next = 7;
                            return utils_1.readOutputFile();

                        case 7:
                            result = _context.sent;
                            _context.next = 10;
                            return utils_1.readFixture(['basic', 'basic.js']);

                        case 10:
                            expectation = _context.sent;

                            utils_1.expectSource(result, expectation);

                        case 12:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    });
    it('should check typing', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
            var config, stats;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            config = {
                                entry: utils_1.fixturePath(['errors', 'with-type-errors.ts'])
                            };
                            _context2.next = 3;
                            return utils_1.cleanAndCompile(utils_1.createConfig(config));

                        case 3:
                            stats = _context2.sent;

                            utils_1.expect(stats.compilation.errors.length).eq(1);

                        case 5:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));
    });
    it('should load tsx files and use tsconfig', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
            var tsConfig, config, loaderParams, stats, result, expectation;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            tsConfig = utils_1.fixturePath(['tsx', 'tsconfig.json']);
                            config = {
                                entry: utils_1.fixturePath(['tsx', 'basic.tsx'])
                            };
                            loaderParams = '&tsconfig=' + tsConfig;
                            _context3.next = 5;
                            return utils_1.cleanAndCompile(utils_1.createConfig(config, { loaderParams: loaderParams }));

                        case 5:
                            stats = _context3.sent;

                            utils_1.expect(stats.compilation.errors.length).eq(1);
                            _context3.next = 9;
                            return utils_1.readOutputFile();

                        case 9:
                            result = _context3.sent;
                            expectation = 'return React.createElement("div", null, "hi there");';

                            utils_1.expectSource(result, expectation);

                        case 12:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));
    });
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map