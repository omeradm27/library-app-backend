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
  if(!userId || !bookId) return res.status(400).json({ success: false, message: "Please provide user id and book id." });
  try {
    const book = await prisma.book.findFirst({ where: { id: bookId } });
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
  if(!userId || !bookId) return res.status(400).json({ success: false, message: "Please provide user id and book id." });
  try {
    const record = await prisma.borrowRecord.findFirst({
      where: { userId, bookId, returnedAt: null },
    });
    if (!record) return res.status(404).json({ success: false, message: "The book has not been borrowed." });

    await prisma.borrowRecord.update({
      where: { id: record.id },
      data: { returnedAt: new Date() },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { borrowedBooks: { disconnect: { id: record.id } } },
    });
    await prisma.book.update({
      where: { id: bookId },
      data: { borrowRecord: { disconnect: { id: record.id } } },
    });


    res.json({ message: "Book returned." });
  } catch (error) {
    res.status(500).json({ success: false, message: "While returning book, an error occurred." });
  }
};

export const rateBook = async (req: Request, res: Response): Promise<any> => {
  const { userId, bookId } = req.params;
  const { rating } = req.body;
  if(!userId || !bookId) return res.status(400).json({ success: false, message: "Please provide user id and book id." });
  if(!rating || rating < 0 || rating > 5) return res.status(400).json({ success: false, message: "Please provide a rating between 0 and 5." });
  try {
    const record = await prisma.borrowRecord.findFirst({
      where: { userId, bookId, returnedAt: null },
    });
    if (!record) return res.status(404).json({ success: false, message: "The book has not been borrowed." });

    await prisma.borrowRecord.update({
      where: { id: record.id },
      data: { rating },
    });
    const book = await prisma.book.findFirst({ where: { id: bookId } });

    if (!book) {
      throw new Error("Book not found");
    }

    const totalRate = book.totalRate || 0;
    const totalScore = (book.rating || 0) * totalRate;

    const newTotalRate = totalRate + 1;
    const newRating =parseFloat(((totalScore + rating) / newTotalRate).toFixed(2));

    await prisma.book.update({
      where: { id: bookId },
      data: {
        rating: newRating,
        totalRate: newTotalRate,
      },
    });
    res.json({ message: "Book is rated.",book: {rating: newRating, totalRate: newTotalRate} });
  } catch (error) {
    res.status(500).json({ success: false, message: "While rating book, an error occurred." });
  }
};

