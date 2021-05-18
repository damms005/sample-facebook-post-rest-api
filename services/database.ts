import mysql from "mysql2";

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
				reject(error);
				return;
			}

			resolve(databaseConnection);
		});
	});
}

export function executeQuery(query: string, bindings: any): Promise<any> {
	return new Promise((resolve, reject) => {
		getDatabaseConnection()
			.then((databaseConnection: mysql.Connection) => {
				databaseConnection.query(query, bindings, (error, results, fields) => {
					if (error) {
						reject(error);
						return;
					}

					resolve({ results, fields });
				});
			})
			.catch((error) => {
				resolve(error);
			});
	});
}
