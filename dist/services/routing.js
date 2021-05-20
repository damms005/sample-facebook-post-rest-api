"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlFromPath = void 0;
var getUrlFromPath = function (request, path, secure) {
    if (secure === void 0) { secure = true; }
    return "http" + (secure ? "s" : "") + "://" + request.headers.host + "/" + path;
};
exports.getUrlFromPath = getUrlFromPath;
