import {
	executeQuery
} from './services/database';

Promise.all([
		createDatabase(),
		createTable("users", getUsersTableSchemaDefinition()),
		createTable("posts", getPostsTableSchemaDefinition())
		createTable("tokens", getTokensTableSchemaDefinition())
	])
	.catch(error => {
		console.log(error);
	});

function createDatabase() {
	return executeQuery(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_DATABASE}\``)
}

function createTable(tableName: string, tableSchemaDefinition: string) {
	return executeQuery(`CREATE TABLE IF NOT EXISTS \`${tableName}\` ( ${tableSchemaDefinition} )`)
}

function getUsersTableSchemaDefinition() {
	return `id AUTO_INCREMENT NOT NULL,
	firstname VARCHAR(200) NOT NULL,
	lastname VARCHAR(200) NOT NULL,
	email VARCHAR(500) NOT NULL
	password VARCHAR(64) NOT NULL
	password_reset_token VARCHAR(64) NULL
	password_reset_token_expires_at DATETIME NULL
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getPostsTableSchemaDefinition() {
	return `id AUTO_INCREMENT NOT NULL,
	content VARCHAR(200) NOT NULL,
	user_id INTEGER NOT NULL,
	post_image VARCHAR(500) NOT NULL
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
}

function getTokensTableSchemaDefinition() {
	return `"id AUTO_INCREMENT NOT NULL";
	user_id INTEGER NOT NULL,
	token VARCHAR(60) NOT NULL
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	expires_at DATETIME NOT NULL`;
}