import bcrypt from "bcrypt";
import { reportError } from "./error_reporting";

export const encrypt = (plainText: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const salt = bcrypt.genSalt(10);

		salt
			.then((salt) => {
				bcrypt.hash(plainText, salt).then((encryptedPassword: string) => {
					resolve(encryptedPassword);
				});
			})
			.catch((error) => {
				reportError({ error });
			});
	});
};
