
-- Drop tables if they already exist to prevent conflicts
DROP TABLE IF EXISTS BorrowRecord CASCADE;
DROP TABLE IF EXISTS User CASCADE;
DROP TABLE IF EXISTS Book CASCADE;

-- Create the User table
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- Create the Book table
CREATE TABLE "Book" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    summary TEXT,
    year INT NOT NULL,
    isAvailable BOOLEAN DEFAULT TRUE,
    quantity INT DEFAULT 0,
    rating FLOAT DEFAULT 0.0,
    totalRate INT DEFAULT 0
);

-- Create the BorrowRecord table
CREATE TABLE "BorrowRecord" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL,
    bookId UUID NOT NULL,
    borrowedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returnedAt TIMESTAMP,
    rating FLOAT,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_book FOREIGN KEY (bookId) REFERENCES "Book"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample users
INSERT INTO "User" (id, firstName, lastName, email) VALUES
    ('b2d619c0-5c21-11ee-8c99-0242ac120002', 'John', 'Doe', 'john.doe@example.com'),
    ('c3e719d0-5c21-11ee-8c99-0242ac120002', 'Jane', 'Smith', 'jane.smith@example.com');

-- Insert sample books
INSERT INTO "Book" (id, title, author, summary, year, isAvailable, quantity, rating, totalRate) VALUES
    ('d4f829e0-5c21-11ee-8c99-0242ac120002', '1984', 'George Orwell', 'Dystopian novel', 1949, TRUE, 3, 4.5, 100),
    ('e5fa38f0-5c21-11ee-8c99-0242ac120002', 'Brave New World', 'Aldous Huxley', 'Futuristic society', 1932, TRUE, 2, 4.2, 85);

-- Insert sample borrow records
INSERT INTO "BorrowRecord" (id, userId, bookId, borrowedAt, returnedAt, rating) VALUES
    ('f6cb49a0-5c21-11ee-8c99-0242ac120002', 'b2d619c0-5c21-11ee-8c99-0242ac120002', 'd4f829e0-5c21-11ee-8c99-0242ac120002', '2024-02-25 14:00:00', NULL, NULL),
    ('07ec5ab0-5c22-11ee-8c99-0242ac120002', 'c3e719d0-5c21-11ee-8c99-0242ac120002', 'e5fa38f0-5c21-11ee-8c99-0242ac120002', '2024-02-20 09:30:00', '2024-02-28 10:00:00', 4.0);

-- Check inserted data
SELECT * FROM "User";
SELECT * FROM "Book";
SELECT * FROM "BorrowRecord";
