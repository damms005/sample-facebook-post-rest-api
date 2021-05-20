"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.initializeSession = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var initializeSession = function (user) {
    var tokenSecret = process.env.JWT_SECRET;
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.sign({ user: user }, tokenSecret, function (error, token) {
            if (error) {
                return reject(error);
            }
            resolve(token);
        });
    });
};
exports.initializeSession = initializeSession;
var verifyToken = function (request, response, next) {
    if (request.headers["authorization"]) {
        return response.status(401).json({ message: "Authorization header not found" });
    }
    try {
        var authorization = request.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
            return response.status(401).json({ message: "Authorization header not correctly set" });
        }
        request.jwt = jsonwebtoken_1.default.verify(authorization[1], process.env.JWT_SECRET);
        return next();
    }
    catch (error) {
        return response.status(403).json(__assign({ message: "An error occurred" }, error));
    }
};
exports.verifyToken = verifyToken;
