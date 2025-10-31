import { Router } from "express";

const categoryRouter = Router();

categoryRouter.get("/", (req, res) => {
  res.status(200).send("Category API is working");
});

export default categoryRouter;
