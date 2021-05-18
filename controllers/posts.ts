export const getAllPosts = (request, response) => {
	const { firstname, middlename, lastname } = request.body();
	response.send(`New user registered: ${firstname} ${lastname}`);
};

export const createPost = (request, response) => {
	const { firstname, middlename, lastname } = request.body();
	response.send(`New user registered: ${firstname} ${lastname}`);
};
