import express from "express";
import { getUsers, getUserById, createUser, borrowBook, returnBook } from "../controllers/user.controller";
import { userSchema } from "../validations/userValidation";
import validate from "../middleware/validationMiddleware";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/",validate(userSchema), createUser);
router.post("/:userId/borrow/:bookId", borrowBook);
router.post("/:userId/return/:bookId", returnBook);

export default router;
