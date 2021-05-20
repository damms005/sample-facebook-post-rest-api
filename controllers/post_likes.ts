import { SqlQuery, User } from "../types";
import { buildQuery } from "../services/query_builder";
import { getAuthenticatedUser } from "./auth";
import { executeQuery } from "../services/database";

export const likePost = (request, response) => {
	const { post_id } = request.body;

	getAuthenticatedUser(request)
		.then((user: User) => {
			let bindings = [user.id.toString(), post_id];
			let query: SqlQuery = buildQuery("INSERT INTO post_likes (user_id, post_id) VALUES (?,?)", bindings);

			executeQuery(query)
				.then(() => {
					response.json({ message: `Liked post #${post_id}` });
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

export const unlikePost = (request, response) => {
	const postId = request.params.id;

	getAuthenticatedUser(request)
		.then((authenticatedUser: User) => {
			//you can only unlike a post you liked
			let bindings = [authenticatedUser.id.toString(), postId];
			let query = buildQuery("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?", bindings);

			executeQuery(query)
				.then((result) => {
					return response.json({ message: `Like undone for post #${postId}` });
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
