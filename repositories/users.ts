import { executeQuery } from "../services/database";
import { SqlQuery } from "../types";
import { buildQuery } from "../services/query_builder";

export const insert = (user: any) => {
	let query: SqlQuery = buildQuery("INSERT INTO users SET ?", user);

	return executeQuery(query);
};

export const findUserByEmail = (email: string): Promise<any> => {
	return findUser("email", email);
};

export const findUser = (matchedColumn: string, matchedValue: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		let query: SqlQuery = buildQuery("SELECT id,email,password FROM users WHERE ?? = ?", [matchedColumn, matchedValue]);

		const result = executeQuery(query);

		result
			.then((result) => {
				let passwordHash = result.password;

				if (!!passwordHash === false) {
					reject("Invalid login credentials. Please try again");
				}

				resolve(result);
			})
			.catch((error) => reject(error));
	});
};
