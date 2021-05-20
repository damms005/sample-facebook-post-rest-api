import express from "express";
import { SqlQuery, User } from "../types";
import { buildQuery } from "../services/query_builder";
import { getAuthenticatedUser } from "./auth";
import { executeQuery } from "../services/database";

export const likePost = (request: express.Request, response: express.Response) => {
	const postId: string = request.params.id;

	getAuthenticatedUser(request)
		.then((user: User) => {
			let bindings = [(user.id as Number).toString(), postId];

			//TODO:: check if post exists before allowing to like it
			let query: SqlQuery = buildQuery("INSERT INTO post_likes (user_id, post_id) VALUES (?,?)", bindings);

			executeQuery(query)
				.then((result) => {
					if (result.affectedRows == 0) {
						return response.status(404).json({ message: `No post found to like (post #${postId})` });
					}

					return response.json({ message: `Liked post #${postId}` });
				})
				.catch((error) => {
					return response.status(400).json({ error });
				});
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
			let bindings = [(authenticatedUser.id as Number).toString(), postId];
			let query = buildQuery("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?", bindings);

			executeQuery(query)
				.then((result) => {
					return response.json({ message: `Like undone for post #${postId}` });
				})
				.catch((error) => {
					return response.status(400).json({ error });
				});
		})
		.catch((error) => {
			response.status(400).json({ error });
		});
};
