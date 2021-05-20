import { executeQuery } from "./services/database";
import { buildQuery } from "./services/query_builder";

require("dotenv").config();

console.info("Database setup started");

const tasks = Promise.all([
	//TODO:: validate entries for content length before inserting/updating the database, to prevent data truncation
	//TODO:: Add updated_at column to tables and make it auto on update current_timestamp

	createTable("users", getUsersTableSchemaDefinition()),
	createTable("tokens", getTokensTableSchemaDefinition()),
	createTable("posts", getPostsTableSchemaDefinition()),
	createTable("post_likes", getPostLikesTableSchemaDefinition()),
	createTable("post_replies", getPostRepliesTableSchemaDefinition()),
])
	.then(() => {
		console.info("Database setup completed successfully");
	})
	.catch((error) => {
		console.error(error);
	});

/**
 * Let's wait for tasks to complete, else
 * nodejs will simply bail on us.
 */
waitForPromiseFulfilment();

function waitForPromiseFulfilment() {
	if (
		tasks.finally(() => {
			process.exit(1);
		})
	)
		setTimeout(waitForPromiseFulfilment, 1000);
}

function createTable(tableName: string, tableSchemaDefinition: string) {
	let query = buildQuery(`CREATE TABLE IF NOT EXISTS \`${tableName}\` ( ${tableSchemaDefinition} )`);
	return executeQuery(query);
}

function getUsersTableSchemaDefinition() {
	return `id INTEGER AUTO_INCREMENT PRIMARY KEY,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(500) NOT NULL,
	password VARCHAR(64) NOT NULL,
	password_reset_token VARCHAR(64) NULL,
	password_reset_token_expires_at DATETIME NULL,
	temporary_password VARCHAR(64) NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getTokensTableSchemaDefinition() {
	return `id INTEGER AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER NOT NULL,
	token VARCHAR(60) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	expires_at DATETIME NOT NULL`;
}

function getPostsTableSchemaDefinition() {
	return `id INTEGER AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER NOT NULL,
	post_image VARCHAR(250) NULL,
	content VARCHAR(255) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getPostLikesTableSchemaDefinition() {
	return `id INTEGER AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getPostRepliesTableSchemaDefinition() {
	return `id INTEGER AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL,
	reply_text VARCHAR(250) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}
