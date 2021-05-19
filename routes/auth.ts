import express from "express";
import { register, login, resetPassword, finalizePasswordResetToken } from "../controllers/auth";
import { verifyToken } from "../services/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", verifyToken, login);
router.post("/reset", resetPassword);
router.get("/reset/:token", finalizePasswordResetToken);

export default router;
