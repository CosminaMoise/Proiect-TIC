import { Router } from "express";
import bookController from "../controllers/bookController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  validateBookCreate,
  validateBookUpdate,
} from "../middleware/validationBookMiddleware.js";

const router = Router();

router.post("/create",authenticateUser,validateBookCreate,bookController.createBook);
router.put("/:bookId",authenticateUser,validateBookUpdate,bookController.updateBook);
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/:bookId", bookController.getBookById);
router.delete("/:bookId", authenticateUser, bookController.deleteBook);

export default router;
