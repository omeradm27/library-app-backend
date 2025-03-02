import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user1 = await prisma.user.create({
    data: { firstName: "Alice", lastName: "Johnson", email: "alice@example.com" },
  });

  const user2 = await prisma.user.create({
    data: { firstName: "Bob", lastName: "Smith", email: "bob@example.com" },
  });

  const book1 = await prisma.book.create({
    data: {
      title: "1984",
      author: "George Orwell",
      summary: "A dystopian novel about totalitarian control and surveillance.",
      year: 1949,
      quantity: 3,
      rating: 4.5,
      totalRate: 20,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "Brave New World",
      author: "Aldous Huxley",
      summary: "A futuristic society that values stability over individuality.",
      year: 1932,
      quantity: 5,
      rating: 4.3,
      totalRate: 15,
    },
  });

  await prisma.borrowRecord.create({
    data: {
      userId: user1.id,
      bookId: book1.id,
      borrowedAt: new Date(),
      rating: 4.5,
    },
  });

  await prisma.borrowRecord.create({
    data: {
      userId: user2.id,
      bookId: book2.id,
      borrowedAt: new Date(),
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
