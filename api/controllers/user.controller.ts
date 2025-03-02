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
  if (!userId || !bookId) {
    return res.status(400).json({ success: false, message: "Please provide user ID and book ID." });
  }

  try {

    const book = await prisma.book.findUnique({ where: { id: bookId }, select: { quantity: true } });

    if (!book) {
      return res.status(404).json({ success: false, message: "The book does not exist." });
    }
    if (book.quantity <= 0) {
      return res.status(400).json({ success: false, message: "Book is out of stock." });
    }
    const userBorrowHistory = await prisma.borrowRecord.findFirst({
      where: { userId, bookId, returnedAt: null },
      include: { user: true },
    });

    if (userBorrowHistory) {
      return res.status(400).json({ success: false, message: userBorrowHistory.user.firstName + " " + userBorrowHistory.user.lastName + " have already borrowed this book before." });
    }
    const record = await prisma.$transaction(async (prisma) => {
      const newRecord = await prisma.borrowRecord.create({
        data: { userId, bookId },
      });
      await prisma.book.update({
        where: { id: bookId },
        data: {
          quantity: { decrement: 1 },
          isAvaliable: book.quantity - 1 > 0,
        },
      });
      return newRecord;
    });

    return res.json({ success: true, message: "Book borrowed successfully.", record });

  } catch (error) {
    console.error("Error while borrowing book:", error);
    return res.status(500).json({ success: false, message: "While borrowing book, an error occurred." });
  }
};

export const returnBook = async (req: Request, res: Response): Promise<any> => {
  const { userId, bookId } = req.params;

  if (!userId || !bookId) {
    return res.status(400).json({ success: false, message: "Please provide user ID and book ID." });
  }
  try {
    const record = await prisma.borrowRecord.findFirst({
      where: { userId, bookId, returnedAt: null },
    });
    if (!record) {
      return res.status(404).json({ success: false, message: "The book has not been borrowed." });
    }

    const updatedBook = await prisma.$transaction(async (prisma) => {
      await prisma.borrowRecord.update({
        where: { id: record.id },
        data: { returnedAt: new Date() },
      });

      return await prisma.book.update({
        where: { id: bookId },
        data: {
          quantity: { increment: 1 },
          isAvaliable: true,
        },
      });
    });

    return res.json({ success: true, message: "Book returned successfully.", book: updatedBook });

  } catch (error) {
    console.error("Error while returning book:", error);
    return res.status(500).json({ success: false, message: "While returning book, an error occurred." });
  }
};
export const rateBook = async (req: Request, res: Response): Promise<any> => {
  const { userId, bookId } = req.params;
  const { rating } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ success: false, message: "Please provide user ID and book ID." });
  }
  if (!rating || rating < 0 || rating > 5) {
    return res.status(400).json({ success: false, message: "Please provide a rating between 0 and 5." });
  }

  try {
    const record = await prisma.borrowRecord.findFirst({
      where: { userId, bookId },
    });
    if (!record) {
      return res.status(404).json({ success: false, message: "The book has not been borrowed." });
    }
    if (record.rating !== null) {
      return res.status(400).json({ success: false, message: "The book has already been rated." });
    }
    await prisma.borrowRecord.update({
      where: { id: record.id },
      data: { rating },
    });


    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ success: false, message: "The book does not exist." });
    }

    const totalRate = book.totalRate || 0;
    const totalScore = (book.rating || 0) * totalRate;

    const newTotalRate = totalRate + 1;
    const newRating = parseFloat(((totalScore + rating) / newTotalRate).toFixed(2));

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        rating: newRating,
        totalRate: newTotalRate,
      },
    });
    return res.json({
      success: true,
      message: "Book is rated.",
      book: { rating: updatedBook.rating, totalRate: updatedBook.totalRate },
    });

  } catch (error) {
    console.error("Error while rating book:", error);
    return res.status(500).json({ success: false, message: "While rating book, an error occurred." });
  }
};
