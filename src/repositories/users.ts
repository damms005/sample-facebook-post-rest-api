import { executeQuery, isEmptySelectQueryResponse } from "../services/database";
import { SqlQuery, User } from "../../types";
import { buildQuery } from "../services/query_builder";

export const insert = (user: any) => {
	let query: SqlQuery = buildQuery("INSERT INTO users SET ?", user);
	return executeQuery(query);
};

export const findUserByEmail = (email: string): Promise<User> => {
	return findUser("email", email);
};

export const findUser = (matchedColumn: string, matchedValue: string): Promise<User> => {
	return new Promise((resolve, reject) => {
		let query: SqlQuery = buildQuery("SELECT id,email,password,firstname,lastname FROM users WHERE ?? = ?", [matchedColumn, matchedValue]);

		executeQuery(query)
			.then((databaseResult: any) => {
				if (isEmptySelectQueryResponse(databaseResult)) {
					return reject("User not found");
				}

				let user = getUserFromDatabaseResponse(databaseResult);
				resolve(user as User);
			})
			.catch((error) => reject(error));
	});
};

export const getUserFromDatabaseResponse = (databaseResult: any): User | undefined => {
	return {
		id: databaseResult[0]["id"],
		firstname: databaseResult[0]["firstname"],
		lastname: databaseResult[0]["lastname"],
		email: databaseResult[0]["email"],
		password: databaseResult[0]["password"],
	};
};
