export const getUrlFromPath = (request: any, path: string, secure = true) => {
	return `http${secure ? "s" : ""}://${request.headers.host}/${path}`;
};
