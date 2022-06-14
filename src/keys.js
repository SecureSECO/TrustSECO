"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getKeys = void 0;
var crypto_1 = require("crypto");
var fs_1 = require("fs");
var KEY_DIRECTORY = 'keys';
var PRIVATE_KEY_FILE = "".concat(KEY_DIRECTORY, "/gpg_rsa");
var PUBLIC_KEY_FILE = "".concat(KEY_DIRECTORY, "/gpg_rsa.pub");
var PASSWORD = '';
function setup() {
    if (!fs_1["default"].existsSync(KEY_DIRECTORY)) {
        generateKeys(PASSWORD).then(function (keys) { return storeKeys(keys); });
    }
}
var generateKeys = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                (0, crypto_1.generateKeyPair)('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',
                        cipher: 'aes-256-cbc',
                        passphrase: password
                    }
                }, function (err, publicKey, privateKey) {
                    if (err)
                        return reject(err);
                    resolve({ publicKey: publicKey, privateKey: privateKey });
                    return undefined;
                });
            })];
    });
}); };
function storeKeys(keys) {
    fs_1["default"].mkdirSync(KEY_DIRECTORY);
    fs_1["default"].writeFileSync(PUBLIC_KEY_FILE, keys.publicKey);
    fs_1["default"].writeFileSync(PRIVATE_KEY_FILE, keys.privateKey);
}
function getKeys() {
    return __awaiter(this, void 0, void 0, function () {
        var privateKey, publicKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1["default"].promises.readFile(PRIVATE_KEY_FILE, 'utf-8')];
                case 1:
                    privateKey = _a.sent();
                    return [4 /*yield*/, fs_1["default"].promises.readFile(PUBLIC_KEY_FILE, 'utf-8')];
                case 2:
                    publicKey = _a.sent();
                    return [2 /*return*/, {
                            privateKey: privateKey,
                            publicKey: publicKey
                        }];
            }
        });
    });
}
exports.getKeys = getKeys;
exports["default"] = setup;
