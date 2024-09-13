import express, { Router } from 'express';
import TargetController from './target.controller';
import actionHandler from '../../middlewares/action-handler';
// import { authenticateToken } from '../../middlewares/auth-middleware';

export default class TargetRouter {
  public router: Router;
  private targetController: TargetController;
  constructor() {
    this.router = express.Router();
    this.targetController = new TargetController();
    this.routes();
  }

  public routes(): void {
    this.router.post(
      '/update',
    //   authenticateToken,
      actionHandler(this.targetController.updateTarget.bind(this.targetController))
    );
  }
}
