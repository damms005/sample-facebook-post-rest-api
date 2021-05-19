import { User, SqlQuery } from "../types";
import { initializeSession } from "../services/auth";
import { insert, findUserByEmail, findUser } from "../repositories/users";
import { encrypt } from "../services/encryption";
import { sendEmail, getEmailHtmlTemplate } from "../services/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { executeQuery } from "../services/database";
import { getUrlFromPath } from "../services/routing";
import { buildQuery } from "../services/query_builder";

const TOKEN_PASSWORD_SEPARATOR = `[:password:]`;

export const register = (request, response) => {
	const user: User = getUser(request);
	const { password } = request.body();

	encrypt(password)
		.then((encryptedPassword) => {
			Promise.all([insert({ ...user, password: encryptedPassword }), initializeSession(user)])
				.then((sessionToken) => {
					sendRegistrationNotificationToUser(user.email);
					response.send({ message: "Registration successful", sessionToken });
				})
				.catch((error) => response.send({ message: "User registration failed", ...error }));
		})
		.catch(() => {
			console.log("Data encryption failed");
		});
};

export const login = (request, response) => {
	const { email, password } = request.body();

	findUserByEmail(email)
		.then((user: any) => {
			bcrypt
				.compare(password, user.password)
				.then(() => {
					initializeSession(user)
						.then((token) => {
							response.send({ sessionToken: token });
						})
						.catch((error) => response.send({ message: "User registration failed", ...error }));
				})
				.catch((error) => {
					response.status(400).json({ error: "Invalid login credentials. Please try again" });
				});
		})
		.catch((error) => {
			response.status(401).send({ error });
		});
};

export const resetPassword = (request, response) => {
	const { email, newPassword } = request.body();

	Promise.all([getToken(), encrypt(newPassword)])
		.then(([token, encryptedNewPassword]) => {
			initiatePasswordReset(request, token, email, encryptedNewPassword)
				.then(() => {
					response.send({ message: "A link to reset your password has been sent to your email. Thank you" });
				})
				.catch((error) => {
					response.status(403).send({ error });
				});
		})
		.catch((error) => {
			response.status(500).send({ error });
		});
};

export const finalizePasswordResetToken = (request, response) => {
	const token = request.params.token;

	findUser("password_reset_token", token)
		.then((queryResult) => {
			let userId = queryResult["id"];
			let tokenExpiry = queryResult["password_reset_token_expires_at"];
			if (isExpiredToken(tokenExpiry)) {
				response.status(503).send({ message: "Token expiry error" });
				return;
			}

			runPasswordUpdateDatabaseChanges(userId)
				.then(() => {
					response.send({ message: "Password update completed" });
				})
				.catch((error) => {
					response.status(403).send({ message: "An error occurred", ...error });
				});
		})
		.catch((error) => {
			response.status(401).send({ message: "Error: invalid token", ...error });
		});
};

function isExpiredToken(tokenExpiryTimestamp) {
	return Date.now() > tokenExpiryTimestamp;
}

function getToken(): Promise<string> {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(20, function (error, buffer) {
			if (error) {
				reject(error);
				return;
			}

			var token = buffer.toString("hex");

			resolve(token);
		});
	});
}

function initiatePasswordReset(request, token: string, email: string, encryptedNewPassword: string): Promise<void> {
	return new Promise((resolve, reject) => {
		findUserByEmail(email)
			.then((user: any) => {
				let tokenExpiry = Date.now() + 3600000; // 1 hour
				let query = getPasswordUpdateQuery();
				let bindings = [token, tokenExpiry, encryptedNewPassword, user.id];
				let sqlQuery: SqlQuery = buildQuery(query, bindings);

				executeQuery(sqlQuery)
					.then(() => {
						sendPasswordResetLinkToUser(request, user, token);
						resolve();
					})
					.catch((error) => {
						reject(error);
						``;
					});
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function sendRegistrationNotificationToUser(recipientEmail: string) {
	let subject: string = "Facebook Post Service to the Moon 🚀🚀";
	let mailBodyPlainText: string = "Hello, Thanks for registering with us. 🤙";

	sendEmail(recipientEmail, subject, mailBodyPlainText);
}

function getUser(request: any): User {
	const { firstname, lastname, email } = request.body();
	return { firstname, lastname, email };
}

function sendPasswordResetLinkToUser(request, user: User, token: string): Promise<void> {
	const parameters = {
		link: getUrlFromPath(request, `/reset/${token}`),
		user: user.firstname,
	};

	return new Promise((resolve, reject) => {
		getEmailHtmlTemplate("password_reset", parameters)
			.then((htmlBody) => {
				const subject = "Facebook Post: Password Reset";
				sendEmail(user.email, subject, htmlBody);
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
	});
}

/**
 * The encrypted password is stored temporarily. This ensures that
 * users will not be able to login until they click on an email confirmation link
 * so that it is not trivial to simply reset someone else's password via this API
 */
function getPasswordUpdateQuery(): string {
	return "UPDATE users SET \
	`password_reset_token` = ?, \
	`password_reset_token_expires_at` = ?, \
	`temporary_password` = ? \
	WHERE users.id = ?";
}

function runPasswordUpdateDatabaseChanges(userId: Number): Promise<any[]> {
	return Promise.all([changePassword(userId), nullifyPasswordResetColumns(userId)]);
}

function changePassword(userId: Number): Promise<void> {
	let query: SqlQuery = buildQuery("UPDATE users SET password = temporary_password WHERE user.id = ? ", [userId.toString()]);

	return executeQuery(query);
}

function nullifyPasswordResetColumns(userId: Number): Promise<void> {
	let query: SqlQuery = buildQuery(
		"UPDATE users SET \
		password_reset_token = NULL, \
		password_reset_token_expires_at = NULL, \
		temporary_password = NULL, \
		WHERE user.id = ? ",
		[userId.toString()]
	);

	return executeQuery(query);
}
