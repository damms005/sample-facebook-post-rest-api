import jwt from "jsonwebtoken";
import { User } from "../types";

export const initializeSession = (user: User): Promise<string> => {
	let tokenSecret: any = process.env.JWT_SECRET;

	return new Promise((resolve, reject) => {
		jwt.sign({ user: user }, tokenSecret, (error, token) => {
			if (error) {
				return reject(error);
			}

			resolve(token);
		});
	});
};

export const verifyToken = (request, response, next) => {
	if (request.headers["authorization"]) {
		return response.status(401).json({ message: "Authorization header not found" });
	}

	try {
		let authorization = request.headers["authorization"].split(" ");
		if (authorization[0] !== "Bearer") {
			return response.status(401).json({ message: "Authorization header not correctly set" });
		}

		request.jwt = jwt.verify(authorization[1], process.env.JWT_SECRET as any);

		return next();
	} catch (error) {
		return response.status(403).json({ message: "An error occurred", ...error });
	}
};
