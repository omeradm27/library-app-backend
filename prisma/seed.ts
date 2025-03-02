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

  // Creating Books with longer summaries
  const book1 = await prisma.book.create({
    data: {
      title: "1984",
      author: "George Orwell",
      summary: "A dystopian social science fiction novel set in a totalitarian society ruled by Big Brother. The book explores themes of surveillance, government control, and the manipulation of truth. Winston Smith, a low-ranking member of the ruling Party, struggles with oppressive control and secretly dreams of rebellion.",
      year: 1949,
      rating: 4.8
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "Brave New World",
      author: "Aldous Huxley",
      summary: "A futuristic novel that envisions a world driven by technological advancements and genetic engineering. Society is organized into castes, conditioned from birth to ensure stability and contentment. Individuality is discouraged, and emotions are suppressed through a drug called soma. The story follows Bernard Marx, who begins to question the cost of societal harmony.",
      year: 1932,
      rating: 4.5
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: "Dune",
      author: "Frank Herbert",
      summary: "An epic science fiction novel set on the desert planet Arrakis, the only source of the universe’s most valuable substance, 'melange' (spice). The story follows Paul Atreides, a noble heir who finds himself entangled in a battle for control over Arrakis. Themes of ecology, prophecy, politics, and power drive this classic novel.",
      year: 1965,
      rating: 4.7
    },
  });

  const book4 = await prisma.book.create({
    data: {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      summary: "A coming-of-age novel narrated by Holden Caulfield, a troubled teenager who has just been expelled from prep school. The book explores themes of alienation, identity, and the loss of innocence. As Holden wanders through New York City, he reflects on the 'phoniness' of the adult world and struggles with his emotions.",
      year: 1951,
      rating: 4.2
    },
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
