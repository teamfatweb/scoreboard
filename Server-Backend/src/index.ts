import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./utils/client";
import RootRouter from "./root.router";
import TargetRouter from "./modules/sale/target.router";
import championDataRouter from './modules/championsboard/championboard.routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get("/", (req, res) => {
  res.send("Express on Vercel!");
});

// Set up route paths
app.use("/api/v1", new RootRouter().router);
app.use("/api/v1/target", new TargetRouter().router);
app.use("/api/v1/champions", championDataRouter);
app.use("/api/v1", championDataRouter);
// Database connection and server initialization
prisma.$connect().then(() => {
  console.info("Connected to SQL Database");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = app;
