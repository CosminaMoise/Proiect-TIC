import { Router } from "express";
import bookController from "../controllers/bookController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import validateBookCreate from "../middleware/validationBookMiddleware.js";
import { validateBookUpdate } from "../middleware/validationBookMiddleware.js";

const router = Router();

router.post(
  "/create",
  authenticateUser,
  validateBookCreate,
  bookController.createBook
);

router.put(
  "/:bookId",
  authenticateUser,
  validateBookUpdate,
  bookController.updateBook
);

export default router;
