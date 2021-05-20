"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var post_likes_1 = require("../controllers/post_likes");
var auth_1 = require("../services/auth");
var router = express_1.default.Router();
router.post("/create", auth_1.verifyToken, post_likes_1.likePost);
router.delete("/delete/:postId", auth_1.verifyToken, post_likes_1.unlikePost);
exports.default = router;
