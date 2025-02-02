import { Router } from "express";
import bookController from "../controllers/bookController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import validateBookCreate from "../middleware/validationBookCreateMiddleware.js";
import validateBookUpdate from "../middleware/validationBookUpdateMiddleware.js";

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
router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/:bookId", bookController.getBookById);
router.delete("/:bookId", authenticateUser, bookController.deleteBook);
router.post(
  "/update-existing",
  authenticateUser,
  bookController.updateExistingBooks
);

export default router;
