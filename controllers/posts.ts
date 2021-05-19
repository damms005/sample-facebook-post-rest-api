export const getAllPosts = (request, response) => {
	const { firstname, middlename, lastname } = request.body();
	response.send();
};

export const createPost = (request, response) => {
	const { firstname, middlename, lastname } = request.body();
	response.send();
};
