import mysql from "mysql2";
import { SqlQuery } from "../types";

function getDatabaseConnection(): Promise<mysql.Connection> {
	return new Promise((resolve, reject) => {
		let databaseConnection = mysql.createConnection({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DATABASE,
		});

		databaseConnection.connect((error) => {
			if (error) {
				return reject(error);
			}

			resolve(databaseConnection);
		});
	});
}

export function executeQuery(command: SqlQuery): Promise<any> {
	return new Promise((resolve, reject) => {
		if (!command.isValid) {
			return reject("Invalid query");
		}

		const { query, bindings } = command;

		getDatabaseConnection()
			.then((databaseConnection: mysql.Connection) => {
				databaseConnection.query(query, bindings, (error, results, fields) => {
					if (error) {
						return reject(error);
					}

					resolve({ results, fields });
				});
			})
			.catch((error) => {
				resolve(error);
			});
	});
}
