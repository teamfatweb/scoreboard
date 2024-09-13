import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./utils/client";
import RootRouter from "./root.router";
import TargetRouter from "./modules/sale/target.router";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express on Vercel!");
});

app.use("/api/v1", new RootRouter().router);
app.use("/api/v1/target", new TargetRouter().router);

prisma.$connect().then(() => {
  console.info("Connected to SQL Database");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = app;
