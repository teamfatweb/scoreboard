import express, { Request, Response, Router } from "express";
import AuthController from "./auth.controller";
import actionHandler from "../../middlewares/action-handler";

export default class AuthRouter {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = express.Router();
    this.authController = new AuthController();
    this.routes();
  }

  public routes(): void {
    this.router.post("/login", actionHandler(this.authController.login));

    this.router.post("/sample",(req: Request, res: Response)=>{
      res.status(201).send("fasdfasd");
    });
  }
}
