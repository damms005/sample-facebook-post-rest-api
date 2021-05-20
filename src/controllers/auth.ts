import express from "express";
import { User, SqlQuery } from "../types";
import { getAuthTokenForUser } from "../services/auth";
import { insert, findUserByEmail, findUser } from "../repositories/users";
import { encrypt } from "../services/encryption";
import { sendEmail, getEmailHtmlTemplate } from "../services/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { executeQuery } from "../services/database";
import { getUrlFromPath } from "../services/routing";
import { buildQuery } from "../services/query_builder";
import { SSL_OP_ALL } from "constants";
import { convertDateToMysqlDateTime } from "../services/date";

const AUTH_LOGIN_ERROR_MESSAGE = "Invalid login credentials. Please try again";

export const register = (request: express.Request, response: express.Response) => {
	const user: User = getUserForRegistration(request);
	const { password } = request.body;

	getUserHavingSameEmail(user.email)
		.then((dbUserRecord) => {
			response.status(400).json({ message: "User already exists with this email" });
		})
		.catch((error) => {
			if (error) {
				response.status(400).json({ message: "An error occurred", error });
				return;
			}

			storeUser(password, user, response);
		});
};

export const login = (request, response) => {
	const { email, password } = request.body;

	findUserByEmail(email)
		.then((user: User) => {
			bcrypt
				.compare(password, user.password)
				.then((isValid) => {
					if (!isValid) {
						return response.status(400).json({ message: AUTH_LOGIN_ERROR_MESSAGE });
					}
					getAuthTokenForUser(user)
						.then((token) => {
							response.json({ sessionToken: token });
						})
						.catch((error) => response.json({ message: "User registration failed", error }));
				})
				.catch((error) => {
					response.status(400).json({ message: AUTH_LOGIN_ERROR_MESSAGE, error });
				});
		})
		.catch((error) => {
			response.status(401).json({ dd: SSL_OP_ALL, message: AUTH_LOGIN_ERROR_MESSAGE, error });
		});
};

export const resetPassword = (request, response) => {
	const { email, newPassword } = request.body;

	Promise.all([getToken(), encrypt(newPassword)])
		.then(([token, encryptedNewPassword]) => {
			initiatePasswordReset(request, token, email, encryptedNewPassword)
				.then(() => {
					response.json({ message: "A link to reset your password has been sent to your email. Thank you" });
				})
				.catch((error) => {
					response.status(403).json({ error });
				});
		})
		.catch((error) => {
			response.status(500).json({ error });
		});
};

export const finalizePasswordResetToken = (request, response) => {
	const token = request.params.token;

	findUser("password_reset_token", token)
		.then((user: User) => {
			let userId = user.id as Number;
			let tokenExpiry = user.password_reset_token_expires_at;
			if (isExpiredToken(tokenExpiry)) {
				return response.status(503).json({ message: "Token expiry error" });
			}

			runPasswordUpdateDatabaseChanges(userId)
				.then(() => {
					response.json({ message: "Password update completed" });
				})
				.catch((error) => {
					response.status(403).json({ message: "An error occurred", error });
				});
		})
		.catch((error) => {
			response.status(401).json({ message: "Error: invalid token", error });
		});
};

function isExpiredToken(tokenExpiryTimestamp) {
	return Date.now() > tokenExpiryTimestamp;
}

function getToken(): Promise<string> {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(20, function (error, buffer) {
			if (error) {
				return reject(error);
			}

			var token = buffer.toString("hex");

			resolve(token);
		});
	});
}

function initiatePasswordReset(request, token: string, email: string, encryptedNewPassword: string): Promise<void> {
	return new Promise((resolve, reject) => {
		findUserByEmail(email)
			.then((user: User) => {
				let tokenExpiry = convertDateToMysqlDateTime(new Date(Date.now() + 3600000)); // 1 hour
				let query = getPasswordUpdateQuery();
				let bindings = [token, tokenExpiry, encryptedNewPassword, (user.id as Number).toString()];
				let sqlQuery: SqlQuery = buildQuery(query, bindings);

				executeQuery(sqlQuery)
					.then(() => {
						sendPasswordResetLinkToUser(request, user, token);
						resolve();
					})
					.catch((error) => {
						reject(error);
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

function getUserForRegistration(request: express.Request): User {
	const { firstname, lastname, email } = request.body;
	return { firstname, lastname, email };
}

function sendPasswordResetLinkToUser(request, user: User, token: string): Promise<void> {
	const parameters = {
		link: getUrlFromPath(request, `auth/reset/${token}`),
		...user,
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

function changePassword(userId: Number): Promise<any> {
	let queryString: string = "UPDATE users SET `password` = `temporary_password` WHERE users.id = ? ";
	let query: SqlQuery = buildQuery(queryString, [userId.toString()]);

	return executeQuery(query);
}

function nullifyPasswordResetColumns(userId: Number): Promise<any> {
	let query: SqlQuery = buildQuery(
		"UPDATE users SET \
		password_reset_token = NULL, \
		password_reset_token_expires_at = NULL, \
		temporary_password = NULL \
		WHERE users.id = ? ",
		[userId.toString()]
	);

	return executeQuery(query);
}

export function getAuthenticatedUser(request): Promise<User> {
	return new Promise((resolve, reject) => {
		let userId = request.jwt.user.id;

		findUser("id", userId)
			.then((queryResult) => {
				resolve(request.jwt.user);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function storeUser(password, user, response) {
	encrypt(password)
		.then((encryptedPassword) => {
			Promise.all([insert({ ...user, password: encryptedPassword }), getAuthTokenForUser(user)])
				.then((sessionToken) => {
					sendRegistrationNotificationToUser(user.email);
					response.json({ message: "Registration successful", sessionToken });
				})
				.catch((error) => response.json({ message: "User registration failed", error }));
		})
		.catch((error) => {
			response.status(400).json({ error });
		});
}

function getUserHavingSameEmail(email: string): Promise<User> {
	return new Promise((resolve, reject) => {
		findUserByEmail(email)
			.then((user: User) => {
				return resolve(user);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
