import { expect, use } from "chai";
import { getAuthTokenForUser, getTokenOwner } from "../../src/services/auth";
import { User } from "../../src/types";
use(require("chai-as-promised"));
require("dotenv").config();

describe("Token works well for user authentication", () => {
	it("can generate token for users and user can authenticated with generated token", async function () {
		let user: User = {
			firstname: "John",
			lastname: "Doe",
			email: "example@email.com",
		};

		let token = await getAuthTokenForUser(user);

		let authenticatedUser = getTokenOwner(token);
		delete authenticatedUser["iat"];

		expect(JSON.stringify(authenticatedUser)).equals(JSON.stringify({ user }));
	});
});
