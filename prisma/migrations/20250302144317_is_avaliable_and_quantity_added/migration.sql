-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "isAvaliable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
