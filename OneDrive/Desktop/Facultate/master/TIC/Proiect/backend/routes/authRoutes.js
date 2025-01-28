import { Router } from "express";
import authController from "../controllers/authController.js";
import validateLogin from "../middleware/validationLoginMiddleware.js";
import validateRegistration from "../middleware/validationRegisterMiddleware.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = Router();

router.get("/current", authController.getCurrentUser);
router.post("/login", validateLogin, authController.login);
router.post("/register", validateRegistration, authController.register);
router.post("/logout", authenticateUser, authController.logout);

export default router;
