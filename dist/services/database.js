"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = void 0;
var mysql2_1 = __importDefault(require("mysql2"));
function getDatabaseConnection() {
    return new Promise(function (resolve, reject) {
        var connectionOptions = {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
        };
        var databaseConnection = mysql2_1.default.createConnection(connectionOptions);
        databaseConnection.connect(function (error) {
            if (error) {
                return reject(error);
            }
            resolve(databaseConnection);
        });
    });
}
function executeQuery(command) {
    return new Promise(function (resolve, reject) {
        if (!command.isValid) {
            return reject("Invalid query");
        }
        var query = command.query, bindings = command.bindings;
        getDatabaseConnection()
            .then(function (databaseConnection) {
            databaseConnection.query(query, bindings, function (error, results, fields) {
                if (error) {
                    return reject(error);
                }
                resolve({ results: results, fields: fields });
            });
        })
            .catch(function (error) {
            reject({ message: "Database error", error: error });
        });
    });
}
exports.executeQuery = executeQuery;
