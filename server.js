import express from "express";
import dotenv from "dotenv/config";
import rootRouter from "./src/api/index.js";
import connectDB from "./src/infrastructure/db/index.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
connectDB();

app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
