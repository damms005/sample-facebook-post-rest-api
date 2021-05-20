"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = void 0;
var buildQuery = function (query, bindings) {
    //more detailed check need to be done here. For now, we
    //simply check for non-zero query length
    var isValid = query.length > 0;
    return {
        query: query,
        bindings: bindings,
        isValid: isValid,
    };
};
exports.buildQuery = buildQuery;
