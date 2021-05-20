"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var posts_1 = require("../controllers/posts");
var auth_1 = require("../services/auth");
var router = express_1.default.Router();
router.post("/create", auth_1.verifyToken, posts_1.createPost);
router.get("/:id", auth_1.verifyToken, posts_1.getPost);
router.delete("/delete/:id", auth_1.verifyToken, posts_1.deletePost);
router.patch("/update/:id", auth_1.verifyToken, posts_1.updatePost);
exports.default = router;
