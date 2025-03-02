import { Request, Response } from "express";
import prisma from "../prismaClient";
export const getBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const books = await prisma.book.findMany();
    return res.json(books);
  } catch (error) {
    res.status(500).json({ success: false, message: "While getting books, an error occurred." });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<any>  => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { borrowRecord: { include: { user: true } } },
    });

    if (!book) return res.status(404).json({ success: false, message: "Book not found." });

    return res.json(book);
  } catch (error) {
    res.status(500).json({ success: false, message: "While getting book, an error occurred." });
  }
};

export const createBook = async (req: Request, res: Response): Promise<any> => {
  const { title, author, year, summary } = req.body;
  try {
    const book = await prisma.book.create({
      data: { title, author, year, summary },
    });
    return res.json(book);
  } catch (error) {
    res.status(500).json({ success: false, message: "While creating book, an error occurred." });
  }
};

module.exports = { getBooks, getBookById, createBook };
