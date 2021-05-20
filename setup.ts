import { executeQuery } from "./services/database";
import { buildQuery } from "./services/query_builder";

Promise.all([
	//TODO:: validate entries for content length before inserting/updating the database, to prevent data truncation

	createDatabase(),
	createTable("users", getUsersTableSchemaDefinition()),
	createTable("tokens", getTokensTableSchemaDefinition()),
	createTable("posts", getPostsTableSchemaDefinition()),
	createTable("post_likes", getPostLikesTableSchemaDefinition()),
	createTable("post_replies", getPostRepliesTableSchemaDefinition()),
]).catch((error) => {
	console.log(error);
});

function createDatabase() {
	let query = buildQuery("CREATE DATABASE IF NOT EXISTS `${process.env.DATABASE_DATABASE}`");
	return executeQuery(query);
}

function createTable(tableName: string, tableSchemaDefinition: string) {
	let query = buildQuery(`CREATE TABLE IF NOT EXISTS \`${tableName}\` ( ${tableSchemaDefinition} )`);
	return executeQuery(query);
}

function getUsersTableSchemaDefinition() {
	return `id AUTO_INCREMENT NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(500) NOT NULL
	password VARCHAR(64) NOT NULL
	password_reset_token VARCHAR(64) NULL
	password_reset_token_expires_at DATETIME NULL
	temporary_password VARCHAR(64) NULL
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getTokensTableSchemaDefinition() {
	return `"id AUTO_INCREMENT NOT NULL";
	user_id INTEGER NOT NULL,
	token VARCHAR(60) NOT NULL
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	expires_at DATETIME NOT NULL`;
}

function getPostsTableSchemaDefinition() {
	return `id AUTO_INCREMENT NOT NULL,
	user_id INTEGER NOT NULL,
	post_image VARCHAR(250) NOT NULL
	content VARCHAR(255) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getPostLikesTableSchemaDefinition() {
	return `id AUTO_INCREMENT NOT NULL,
	user_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getPostRepliesTableSchemaDefinition() {
	return `"id AUTO_INCREMENT NOT NULL";
	user_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL,
	reply_text VARCHAR(250) NOT NULL
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}
