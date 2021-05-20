import bcrypt from "bcrypt";

export const encrypt = (plainText: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const salt = bcrypt.genSalt(10);

		if (salt) {
			salt.then((salt) => {
				bcrypt.hash(plainText, salt).then((encryptedPassword: string) => {
					resolve(encryptedPassword);
				});
			});

			return reject("System error");
		}

		reject("Could not generate hashing salt");
	});
};
