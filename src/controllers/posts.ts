import { SqlQuery, User } from "../types";
import { buildQuery } from "../services/query_builder";
import { saveUploadedFile, getPostImageUploadStorageService } from "../services/storage";
import { getAuthenticatedUser } from "./auth";
import { executeQuery } from "../services/database";
import { getUrlFromPath } from "../services/routing";

export const createPost = (request, response) => {
	const { postBody } = request.body;

	saveUploadedFile(request, response, "postImage", getPostImageUploadStorageService())
		.then((uploadedImageFilePath) => {
			getAuthenticatedUser(request)
				.then((user: User) => {
					let bindings = [(user.id as Number).toString(), uploadedImageFilePath, postBody];
					let query: SqlQuery = buildQuery("INSERT INTO posts (user_id, post_image, content) VALUES (?,?,?)", bindings);

					executeQuery(query)
						.then(() => {
							response.json({ message: "Post created successfully" });
						})
						.catch((error) => {
							return response.status(400).json({ error });
						});
				})
				.catch((error) => {
					response.status(400).json({ error });
				});
		})
		.catch((error) => {
			return response.status(400).json({ message: "An error occurred", error });
		});
};

export const getPost = (request, response) => {
	const postId = request.params.id;

	let imageUrlPrefix: string = getUrlFromPath(request, "/uploads");

	const queryString = `SELECT
		posts.id,
		posts.content,
		COUNT(post_likes.id) as number_of_likes,
		CONCAT_WS("${imageUrlPrefix}", posts.post_image) as cover_image_url
		FROM posts
		LEFT JOIN post_likes ON posts.id = post_likes.post_id
		WHERE posts.id = ?`;

	let query = buildQuery(queryString, [postId]);

	executeQuery(query)
		.then((result) => {
			return response.json(result);
		})
		.catch((error) => {
			return response.status(400).json({ error });
		});
};

export const deletePost = (request, response) => {
	const postId = request.params.id;
	let query = buildQuery("DELETE FROM posts WHERE id = ?", [postId]);

	executeQuery(query)
		.then((result) => {
			if (result.affectedRows == 0) {
				return response.status(404).json({ message: `No post found to delete (post #${postId})` });
			}

			return response.json({ message: `Successfully deleted post #${postId}` });
		})
		.catch((error) => {
			return response.status(400).json({ error });
		});
};

export const updatePost = (request, response) => {
	getAuthenticatedUser(request)
		.then((user: User) => {
			let postId = request.params.id;
			let userId = (user.id as Number).toString();
			let postSecurityCondition = "user_id = ?";
			let setQueryString: SqlQuery = getSetQueryStringFromFormInput(request.body);
			let bindings = setQueryString.bindings?.concat([userId, userId]);
			let query = buildQuery(`UPDATE posts SET ${setQueryString.query} WHERE id = ? AND ${postSecurityCondition}`, bindings);

			executeQuery(query)
				.then((result) => {
					if (result.affectedRows == 0) {
						return response.status(404).json({ message: `No post found to update (post #${postId})` });
					}

					return response.json({ message: `Post updated` });
				})
				.catch((error) => {
					return response.status(400).json({ error });
				});
		})
		.catch((error) => {
			response.status(400).json({ error });
		});
};

function getSetQueryStringFromFormInput(formInputs: any): SqlQuery {
	let updates: any = [];

	let sqlQuery: any = {
		query: "",
		bindings: [],
		isValid: true,
	};

	Object.keys(formInputs).forEach((formInputName: any) => {
		//prevent user from changing id
		if (formInputName == "id") {
			return;
		}

		updates.push(`${formInputName} = ?`);
		sqlQuery.bindings.push(formInputs[formInputName]);
	});

	sqlQuery.query = updates.join(", ");

	return sqlQuery;
}
