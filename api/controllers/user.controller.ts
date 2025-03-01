import { Request, Response } from "express";
import prisma from "../prismaClient";

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "While getting users, an error occurred." });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { borrowedBooks: { include: { book: true } } },
    });

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: "While getting user, an error occurred." });
  }
};


export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { firstName, lastName, email } = req.body;
  try {
    const isExists = await prisma.user.findUnique({ where: { email } });

    if (isExists) return res.status(400).json({ success: false, message: "Please use another email." });

    const user = await prisma.user.create({ data: { firstName, lastName, email } });
    return res.json({success: true, message: "User created.", user});
  } catch (error) {
    res.status(500).json({ success: false, message: "While creating user, an error occurred." });
  }
};
export const borrowBook = async (req: Request, res: Response): Promise<any> => {
  const { userId, bookId } = req.params;

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ success: false, message: "The book does not exist." });

    const borrowed = await prisma.borrowRecord.findFirst({
      where: { bookId, returnedAt: null },
    });
    if (borrowed) return res.status(400).json({ success: false, message: "The book has already been borrowed." });

    const record = await prisma.borrowRecord.create({
      data: {
        userId,
        bookId,
      },
    });

    res.json({ message: "Book borrowed.", record });
  } catch (error) {
    res.status(500).json({ success: false, message: "While borrowing book, an error occurred." });
  }
};


export const returnBook = async (req: Request, res: Response): Promise<any> => {
  const { userId, bookId } = req.params;

  try {
    const record = await prisma.borrowRecord.findFirst({
      where: { userId, bookId, returnedAt: null },
    });
    if (!record) return res.status(404).json({ success: false, message: "The book has not been borrowed." });

    await prisma.borrowRecord.update({
      where: { id: record.id },
      data: { returnedAt: new Date() },
    });

    res.json({ message: "Book returned." });
  } catch (error) {
    res.status(500).json({ success: false, message: "While returning book, an error occurred." });
  }
};

