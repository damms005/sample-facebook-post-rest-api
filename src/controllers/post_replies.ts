import { SqlQuery, User } from "../types";
import { buildQuery } from "../services/query_builder";
import { getAuthenticatedUser } from "./auth";
import { executeQuery } from "../services/database";

export const replyPost = (request: any, response: any) => {
	const { postId, replyText } = request.body;

	getAuthenticatedUser(request)
		.then((user: User) => {
			let bindings = [user.id?.toString(), postId, replyText];
			let query: SqlQuery = buildQuery("INSERT INTO post_replies (user_id, post_id, reply_text) VALUES (?,?,?)", bindings);

			executeQuery(query)
				.then(() => {
					response.json({ message: `You replied to post #${postId} with: ${replyText}` });
				})
				.catch((error) => {
					return response.status(400).json({ error });
				});

			response.json();
		})
		.catch((error) => {
			response.status(400).json({ error });
		});
};
