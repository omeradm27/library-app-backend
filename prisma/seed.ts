import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Creating Users
  const user1 = await prisma.user.create({
    data: { firstName: "Alice", lastName: "Johnson", email: "alice@example.com" },
  });

  const user2 = await prisma.user.create({
    data: { firstName: "Bob", lastName: "Smith", email: "bob@example.com" },
  });

  const user3 = await prisma.user.create({
    data: { firstName: "Charlie", lastName: "Brown", email: "charlie@example.com" },
  });

  // Creating Books
  const book1 = await prisma.book.create({
    data: { title: "1984", author: "George Orwell", year: 1949, rating: 4.8 },
  });

  const book2 = await prisma.book.create({
    data: { title: "Brave New World", author: "Aldous Huxley", year: 1932, rating: 4.5 },
  });

  const book3 = await prisma.book.create({
    data: { title: "Dune", author: "Frank Herbert", year: 1965, rating: 4.7 },
  });

  const book4 = await prisma.book.create({
    data: { title: "The Catcher in the Rye", author: "J.D. Salinger", year: 1951, rating: 4.2 },
  });

  // Borrow Records (Alice borrows "1984", Bob borrows "Dune", Charlie borrows "Brave New World")
  await prisma.borrowRecord.create({
    data: {
      userId: user1.id,
      bookId: book1.id,
      borrowedAt: new Date(),
    },
  });

  await prisma.borrowRecord.create({
    data: {
      userId: user2.id,
      bookId: book3.id,
      borrowedAt: new Date(),
    },
  });

  await prisma.borrowRecord.create({
    data: {
      userId: user3.id,
      bookId: book2.id,
      borrowedAt: new Date(),
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
