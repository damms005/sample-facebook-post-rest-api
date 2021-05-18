import { User } from "../types";
import { initializeSession } from "../services/auth";
import { insert, findUserByEmail } from "../repositories/users";
import { encrypt } from "../services/encryption";
import { sendEmail } from "../services/email";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { executeQuery } from "../services/database";

export const register = (request, response) => {
	const user: User = getUser(request);
	const { password } = request.body();

	encrypt(password)
		.then((encryptedPassword) => {
			Promise.all([insert({ ...user, password: encryptedPassword }), initializeSession(user)])
				.then((sessionToken) => {
					notifyUserAfterResponseSent(user.email);
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
				.then((validPassword) => {
					response.status(200).json({ message: "Valid password" });
				})
				.catch((error) => {
					response.status(400).json({ error: "Invalid login credentials. Please try again" });
				});
		})
		.catch((error) => {
			response.status(401).send({ error });
		});
};

export const forgotPassword = (request, response, next) => {
	getToken()
		.then((token) => {
			const { email } = request.body();

			useTokenToInitiatePasswordReset(token, email)
				.then(() => {
					response.send("A link to reset your password has been sent to your email. Thank you");
				})
				.catch((error) => {
					response.status(403).send(error);
				});
		})
		.catch((error) => {
			response.status(500).send(error);
		});
};

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

function useTokenToInitiatePasswordReset(token: string, email: string): Promise<void> {
	return new Promise((resolve, reject) => {
		findUserByEmail(email)
			.then((user: any) => {
				let tokenExpiry = Date.now() + 3600000; // 1 hour
				executeQuery(
					`UPDATE users SET
					password_reset_token = ?,
					password_reset_token_expires_at = ?
					WHERE users.id = ?`,
					[token, tokenExpiry, user.id]
				)
					.then(() => {
						sendPasswordResetLinkToUser(email);
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

function notifyUserAfterResponseSent(recipientEmail: string) {
	let subject: string = "Facebook Post Service to the Moon 🚀🚀";
	let mailBodyPlainText: string = "Hello, Thanks for registering with us. 🤙";

	sendEmail(recipientEmail, subject, mailBodyPlainText);
}

function getUser(request: any): User {
	const { firstname, lastname, email } = request.body();
	return { firstname, lastname, email };
}

function sendPasswordResetLinkToUser(email: string) {
	const subject = "Facebook Post: Password Reset";
	const mailBodyPlainText = "mailBodyPlainText";

	sendEmail(email, subject, mailBodyPlainText);
}
