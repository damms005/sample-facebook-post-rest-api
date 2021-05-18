import express from "express";
import { register, login, forgotPassword } from '../controllers/auth';
import { verifyToken } from "../services/auth";

const router = express.Router();

router.post("/create", register);
router.post("/login", verifyToken, login);
router.post("/forgot-password", forgotPassword);

export default router;
