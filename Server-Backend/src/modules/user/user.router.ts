import express, { Router } from "express";
import UserController from "./user.controller";
import actionHandler from "../../middlewares/action-handler";
// import { upload } from '../../middlewares/uploadMiddleware';

export default class UserRouter {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.routes();
  }

  public routes(): void {
    this.router.get("/", actionHandler(this.userController.listUser));
    this.router.post("/create",actionHandler(this.userController.createUser));
    // This is api for editing user
    this.router.post("/update", actionHandler(this.userController.updateUser));
    // This is api for deleting user
    // src/modules/user/user.router.ts
  this.router.delete("/", actionHandler(this.userController.deleteUser));

  }
}
