"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("../controllers/auth");
var validator_1 = require("../services/validator");
var constants_1 = require("../constants");
var router = express_1.default.Router();
router.post("/register", validator_1.validate({
    firstname: [constants_1.VALIDATION_RULE_REQUIRED],
    lastname: [constants_1.VALIDATION_RULE_REQUIRED],
    password: [constants_1.VALIDATION_RULE_REQUIRED],
    email: [constants_1.VALIDATION_RULE_REQUIRED, constants_1.VALIDATION_RULE_EMAIL],
}, constants_1.VALIDATION_SOURCE_POST), auth_1.register);
router.post("/login", auth_1.login);
router.post("/reset", auth_1.resetPassword);
router.get("/reset/:token", auth_1.finalizePasswordResetToken);
exports.default = router;
