"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var error_reporting_1 = require("./error_reporting");
var encrypt = function (plainText) {
    return new Promise(function (resolve, reject) {
        var salt = bcrypt_1.default.genSalt(10);
        salt
            .then(function (salt) {
            bcrypt_1.default.hash(plainText, salt).then(function (encryptedPassword) {
                resolve(encryptedPassword);
            });
        })
            .catch(function (error) {
            error_reporting_1.reportError({ error: error });
        });
    });
};
exports.encrypt = encrypt;
