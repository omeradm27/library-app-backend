import express from "express";
import { getBooks, getBookById, createBook } from "../controllers/book.controller";
import validate from "../middleware/validationMiddleware";
import { bookSchema } from "../validations/bookValidation";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", validate(bookSchema), createBook);

export default router;
