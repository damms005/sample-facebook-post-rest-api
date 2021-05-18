import { executeQuery } from "../services/database";
import bcrypt from "bcrypt";

export const insert = (user: any) => {
	return executeQuery("INSERT INTO users SET ?", user);
};

export const findUserByEmail = (email: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		const result = executeQuery("SELECT id,email,password FROM users WHERE email=?", [email]);

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
