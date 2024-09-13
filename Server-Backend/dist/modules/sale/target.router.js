"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const target_controller_1 = __importDefault(require("./target.controller"));
const action_handler_1 = __importDefault(require("../../middlewares/action-handler"));
// import { authenticateToken } from '../../middlewares/auth-middleware';
class TargetRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.targetController = new target_controller_1.default();
        this.routes();
    }
    routes() {
        this.router.post('/update', 
        //   authenticateToken,
        (0, action_handler_1.default)(this.targetController.updateTarget.bind(this.targetController)));
    }
}
exports.default = TargetRouter;
