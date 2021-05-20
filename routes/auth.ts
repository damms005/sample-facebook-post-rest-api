import express from "express";
import { register, login, resetPassword, finalizePasswordResetToken } from "../controllers/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset", resetPassword);
router.get("/reset/:token", finalizePasswordResetToken);

export default router;
