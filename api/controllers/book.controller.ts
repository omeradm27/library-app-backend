import { Request, Response } from "express";
import prisma from "../prismaClient";
export const getBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const books = await prisma.book.findMany();
    return res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Kitapları getirirken hata oluştu." });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<any>  => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { borrowRecord: true },
    });

    if (!book) return res.status(404).json({ error: "Kitap bulunamadı." });

    return res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Kitabı getirirken hata oluştu." });
  }
};

export const createBook = async (req: Request, res: Response): Promise<any> => {
  const { title, author, year } = req.body;
  try {
    const book = await prisma.book.create({
      data: { title, author, year },
    });
    return res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Kitap oluşturulurken hata oluştu." });
  }
};

module.exports = { getBooks, getBookById, createBook };
