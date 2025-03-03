import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";

dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL || "https://library-app-web.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

export default app;
