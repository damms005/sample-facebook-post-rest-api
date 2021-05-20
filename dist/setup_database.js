"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./services/database");
var query_builder_1 = require("./services/query_builder");
require("dotenv").config();
console.info("Database setup started");
var tasks = Promise.all([
    //TODO:: validate entries for content length before inserting/updating the database, to prevent data truncation
    createTable("users", getUsersTableSchemaDefinition()),
    createTable("tokens", getTokensTableSchemaDefinition()),
    createTable("posts", getPostsTableSchemaDefinition()),
    createTable("post_likes", getPostLikesTableSchemaDefinition()),
    createTable("post_replies", getPostRepliesTableSchemaDefinition()),
])
    .then(function () {
    console.info("Database setup completed successfully");
})
    .catch(function (error) {
    console.error(error);
});
/**
 * Let's wait for tasks to complete, else
 * nodejs will simply bail on us.
 */
waitForPromiseFulfilment();
function waitForPromiseFulfilment() {
    if (tasks.finally(function () {
        process.exit(1);
    }))
        setTimeout(waitForPromiseFulfilment, 1000);
}
function createTable(tableName, tableSchemaDefinition) {
    var query = query_builder_1.buildQuery("CREATE TABLE IF NOT EXISTS `" + tableName + "` ( " + tableSchemaDefinition + " )");
    return database_1.executeQuery(query);
}
function getUsersTableSchemaDefinition() {
    return "id INTEGER AUTO_INCREMENT PRIMARY KEY,\n\tfirstname VARCHAR(255) NOT NULL,\n\tlastname VARCHAR(255) NOT NULL,\n\temail VARCHAR(500) NOT NULL,\n\tpassword VARCHAR(64) NOT NULL,\n\tpassword_reset_token VARCHAR(64) NULL,\n\tpassword_reset_token_expires_at DATETIME NULL,\n\ttemporary_password VARCHAR(64) NULL,\n\tcreated_at DATETIME DEFAULT CURRENT_TIMESTAMP";
}
function getTokensTableSchemaDefinition() {
    return "id INTEGER AUTO_INCREMENT PRIMARY KEY,\n\tuser_id INTEGER NOT NULL,\n\ttoken VARCHAR(60) NOT NULL,\n\tcreated_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n\texpires_at DATETIME NOT NULL";
}
function getPostsTableSchemaDefinition() {
    return "id INTEGER AUTO_INCREMENT PRIMARY KEY,\n\tuser_id INTEGER NOT NULL,\n\tpost_image VARCHAR(250) NOT NULL,\n\tcontent VARCHAR(255) NOT NULL,\n\tcreated_at DATETIME DEFAULT CURRENT_TIMESTAMP";
}
function getPostLikesTableSchemaDefinition() {
    return "id INTEGER AUTO_INCREMENT PRIMARY KEY,\n\tuser_id INTEGER NOT NULL,\n\tpost_id INTEGER NOT NULL,\n\tcreated_at DATETIME DEFAULT CURRENT_TIMESTAMP";
}
function getPostRepliesTableSchemaDefinition() {
    return "id INTEGER AUTO_INCREMENT PRIMARY KEY,\n\tuser_id INTEGER NOT NULL,\n\tpost_id INTEGER NOT NULL,\n\treply_text VARCHAR(250) NOT NULL,\n\tcreated_at DATETIME DEFAULT CURRENT_TIMESTAMP";
}
