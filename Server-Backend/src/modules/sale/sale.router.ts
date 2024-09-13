import express, { Router } from "express";
import SaleController from "./sale.controller";
import actionHandler from "../../middlewares/action-handler";
import { authenticateToken } from "../../middlewares/auth-middleware";

export default class SaleRouter {
  public router: Router;
  private saleController: SaleController;

  constructor() {
    this.router = express.Router();
    this.saleController = new SaleController();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", actionHandler(this.saleController.listSales));
    this.router.post(
      "/add",
      authenticateToken,
      actionHandler(this.saleController.addSale)
    );
    this.router.post(
      "/delete",
      authenticateToken,
      actionHandler(this.saleController.deletedSale)
    );
  }
}
