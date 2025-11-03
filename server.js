import express from "express";
import dotenv from "dotenv/config";
import rootRouter from "./src/api/index.js";
import connectDB from "./src/infrastructure/db/index.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", rootRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
