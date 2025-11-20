import express, { Request, Response } from "express";
import "dotenv/config";

import cors from "cors";

import connectDB from "./infrastructure/db/index.js";
import rootRouter from "./api/index.js";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + ESM!");
});

app.use("/api", rootRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
