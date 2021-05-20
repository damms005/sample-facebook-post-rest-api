"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var encrypt = function (plainText) {
    return new Promise(function (resolve, reject) {
        var salt = bcrypt_1.default.genSalt(10);
        if (salt) {
            salt.then(function (salt) {
                bcrypt_1.default.hash(plainText, salt).then(function (encryptedPassword) {
                    resolve(encryptedPassword);
                });
            });
            return reject("System error");
        }
        reject("Could not generate hashing salt");
    });
};
exports.encrypt = encrypt;
