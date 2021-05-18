import jwt from "jsonwebtoken";
import { User } from "../types";

export const initializeSession = (user: User): Promise<string> => {
	let tokenSecret = process.env.JWT_SECRET;

	return new Promise((resolve, reject) => {
		jwt.sign({ user: user }, tokenSecret, (error, token) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(token);
		});
	});
};

export const verifyToken = (request, response, next) => {
	const bearerHeader = request.headers["authorization"];

	if (typeof bearerHeader !== "undefined") {
		const bearerToken = bearerHeader.split(" ")[1];
		request.token = bearerToken;

		next();
	} else {
		response.status(403).send("Request forbidden");
	}
};
