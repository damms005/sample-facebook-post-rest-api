"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyPost = void 0;
var query_builder_1 = require("../services/query_builder");
var auth_1 = require("./auth");
var database_1 = require("../services/database");
var replyPost = function (request, response) {
    var _a = request.body, postId = _a.postId, replyText = _a.replyText;
    auth_1.getAuthenticatedUser(request)
        .then(function (user) {
        var _a;
        var bindings = [(_a = user.id) === null || _a === void 0 ? void 0 : _a.toString(), postId, replyText];
        var query = query_builder_1.buildQuery("INSERT INTO post_replies (user_id, post_id, reply_text) VALUES (?,?,?)", bindings);
        database_1.executeQuery(query)
            .then(function () {
            response.json({ message: "You replied to post #" + postId + " with: " + replyText });
        })
            .catch(function (error) {
            return response.status(400).json({ error: error });
        });
        response.json();
    })
        .catch(function (error) {
        response.status(400).json({ error: error });
    });
};
exports.replyPost = replyPost;
