"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikePost = exports.likePost = void 0;
var query_builder_1 = require("../services/query_builder");
var auth_1 = require("./auth");
var database_1 = require("../services/database");
var likePost = function (request, response) {
    var post_id = request.body.post_id;
    auth_1.getAuthenticatedUser(request)
        .then(function (user) {
        var _a;
        var bindings = [(_a = user.id) === null || _a === void 0 ? void 0 : _a.toString(), post_id];
        var query = query_builder_1.buildQuery("INSERT INTO post_likes (user_id, post_id) VALUES (?,?)", bindings);
        database_1.executeQuery(query)
            .then(function () {
            response.json({ message: "Liked post #" + post_id });
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
exports.likePost = likePost;
var unlikePost = function (request, response) {
    var postId = request.params.postId;
    auth_1.getAuthenticatedUser(request)
        .then(function (authenticatedUser) {
        //you can only unlike a post you liked
        var bindings = [authenticatedUser.id.toString(), postId];
        var query = query_builder_1.buildQuery("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?", bindings);
        database_1.executeQuery(query)
            .then(function (result) {
            return response.json({ message: "Like undone for post #" + postId });
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
exports.unlikePost = unlikePost;
