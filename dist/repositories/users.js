"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.findUserByEmail = exports.insert = void 0;
var database_1 = require("../services/database");
var query_builder_1 = require("../services/query_builder");
var insert = function (user) {
    var query = query_builder_1.buildQuery("INSERT INTO users SET ?", user);
    return database_1.executeQuery(query);
};
exports.insert = insert;
var findUserByEmail = function (email) {
    return exports.findUser("email", email);
};
exports.findUserByEmail = findUserByEmail;
var findUser = function (matchedColumn, matchedValue) {
    return new Promise(function (resolve, reject) {
        var query = query_builder_1.buildQuery("SELECT id,email,password FROM users WHERE ?? = ?", [matchedColumn, matchedValue]);
        var result = database_1.executeQuery(query);
        result
            .then(function (result) {
            var passwordHash = result.password;
            if (!!passwordHash === false) {
                reject("Invalid login credentials. Please try again");
            }
            resolve(result);
        })
            .catch(function (error) { return reject(error); });
    });
};
exports.findUser = findUser;
