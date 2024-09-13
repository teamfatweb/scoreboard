import { Router } from "express";
import UserRouter from "./modules/user/user.router";
import SaleRouter from "./modules/sale/sale.router";
//import TargetRouter from "./modules/sale/target.router";
import { authenticateToken } from "./middlewares/auth-middleware";
import AuthRouter from "./modules/auth/auth.router";

export default class RootRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.use("/user", authenticateToken, new UserRouter().router);
    this.router.use("/sale", new SaleRouter().router);
  //  this.router.use("/target", new TargetRouter().router);
    this.router.use("/auth", new AuthRouter().router);
    
  }
}
