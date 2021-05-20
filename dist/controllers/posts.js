"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.deletePost = exports.getPost = exports.createPost = void 0;
var query_builder_1 = require("../services/query_builder");
var storage_1 = require("../services/storage");
var auth_1 = require("./auth");
var database_1 = require("../services/database");
var routing_1 = require("../services/routing");
var createPost = function (request, response) {
    var post_body = request.body.post_body;
    storage_1.saveUploadedFile(request, response, "post_image", storage_1.getPostImageUploadStorageService())
        .then(function (savedFilePath) {
        auth_1.getAuthenticatedUser(request)
            .then(function (user) {
            var bindings = [user.id.toString(), savedFilePath, post_body];
            var query = query_builder_1.buildQuery("INSERT INTO posts (user_id, post_image, content) VALUES (?,?,?)", bindings);
            database_1.executeQuery(query)
                .then(function () {
                response.json({ message: "Post created successfully" });
            })
                .catch(function (error) {
                return response.status(400).json({ error: error });
            });
            response.json();
        })
            .catch(function (error) {
            response.status(400).json({ error: error });
        });
    })
        .catch(function (error) {
        return response.status(400).json({ message: "An error occurred", error: error });
    });
};
exports.createPost = createPost;
var getPost = function (request, response) {
    var postId = request.params.id;
    var imageUrlPrefix = routing_1.getUrlFromPath(request, "/uploads");
    var queryString = "SELECT\n\t\tposts.content,\n\t\tSUM(post_likes.*) as number_of_likes,\n\t\tWS_CONACT(\"" + imageUrlPrefix + "\", posts.post_image) as cover_image_url,\n\t\tGROUP_CONCAT(post_replies.reply_text SEPARATOR '; '),\n\t\tFROM posts\n\t\tLEFT JOIN posts_likes ON posts.id = post_likes.post_id\n\t\tWHERE posts.id = ?";
    var query = query_builder_1.buildQuery(queryString, [postId]);
    database_1.executeQuery(query)
        .then(function (result) {
        return response.json({ result: result });
    })
        .catch(function (error) {
        return response.status(400).json({ error: error });
    });
    response.json();
};
exports.getPost = getPost;
var deletePost = function (request, response) {
    var postId = request.params.id;
    var query = query_builder_1.buildQuery("DELETE FROM posts WHERE id = ?", [postId]);
    database_1.executeQuery(query)
        .then(function (result) {
        return response.json({ message: "Successfully deleted post #" + postId });
    })
        .catch(function (error) {
        return response.status(400).json({ error: error });
    });
    response.json();
};
exports.deletePost = deletePost;
var updatePost = function (request, response) {
    auth_1.getAuthenticatedUser(request)
        .then(function (user) {
        var _a;
        var userId = user.id.toString();
        var postSecurityCondition = "user_id = ?";
        var setQueryString = getSetQueryStringFromFormInput(request.body);
        var bindings = (_a = setQueryString.bindings) === null || _a === void 0 ? void 0 : _a.concat([userId, userId]);
        var query = query_builder_1.buildQuery("UPDATE posts SET " + setQueryString.query + " WHERE id = ? AND " + postSecurityCondition, bindings);
        database_1.executeQuery(query)
            .then(function () {
            return response.json({ message: "Post updated" });
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
exports.updatePost = updatePost;
function getSetQueryStringFromFormInput(formInputs) {
    var updates = [];
    var sqlQuery = {
        query: "",
        bindings: [],
        isValid: true,
    };
    Object.values(formInputs).forEach(function (formInputName) {
        //prevent user from changing id
        if (formInputName == "id") {
            return;
        }
        updates.push(formInputName + " = ?");
        sqlQuery.bindings.push(formInputs[formInputName]);
    });
    sqlQuery.query = updates.join(", ");
    return sqlQuery;
}
