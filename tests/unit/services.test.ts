import { expect } from "chai";
import { convertDateToMysqlDateTime } from "../../src/services/date";
import { buildQuery } from "../../src/services/query_builder";

//TODO:: Add more tests to improve on test coverage

describe("Services", () => {
	describe(__(convertDateToMysqlDateTime), () => {
		it("converts JS date to MySQL date", () => {
			let pastDate = new Date(1234567890);
			let mysqlDate = convertDateToMysqlDateTime(pastDate);
			expect(mysqlDate).equals("1970-01-15 06:56:07");
		});
	});

	describe(__(buildQuery), () => {
		it("can build MySQL query", () => {
			let query = "UPDATE posts SET user_id = ? WHERE posts.id = ?";
			let bindings = [5, 6];
			let builtQuery = buildQuery(query, bindings as any);

			expect(JSON.stringify(builtQuery)).equals(
				JSON.stringify({
					query,
					bindings,
					isValid: true,
				})
			);
		});
	});
});

/**
 * Adapted from the __() function in Laravel, but this translates the name
 * of a function to a user-friendly form
 */
 export function __(f: Function): string {
	return convertToSentenceCase(f.name);
}

function convertToSentenceCase(text: string): string {
	var result = text.replace(/([A-Z])/g, " $1");
	var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
	return finalResult;
}
