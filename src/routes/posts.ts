import express from "express";
import { VALIDATION_SOURCE_POST, VALIDATION_RULE_REQUIRED, VALIDATION_SOURCE_PARAMS } from "../constants";
import { verifyToken } from "../services/auth";
import { validate } from "../services/validator";
import { createPost, getPost, deletePost, updatePost } from "../controllers/posts";

const router = express.Router();

router.post("/create", [verifyToken, validate({ postBody: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_POST)], createPost);

router.get("/:id", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], getPost);

//TODO:: Create an endpoint to allow viewing a paginated list of posts. This
//will be helpful to read posts, get id of posts for use with other
//API endpoints like liking post, commenting etc. For now, users
//will bear with looking up id manually in the database

router.delete("/:id/delete", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], deletePost);

router.patch("/:id/update", [verifyToken, validate({ id: [VALIDATION_RULE_REQUIRED] }, VALIDATION_SOURCE_PARAMS)], updatePost);

export default router;
