import express from "express";
import { CURRENT_API_VERSION } from "../constants";

export const getUrlFromPath = (request: express.Request, path: string) => {
	let isSecure = request.protocol == "https" || request.secure;
	return `http${isSecure ? "s" : ""}://${request.headers.host}/${CURRENT_API_VERSION}/${path}`;
};
