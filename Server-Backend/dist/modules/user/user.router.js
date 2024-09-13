"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const action_handler_1 = __importDefault(require("../../middlewares/action-handler"));
// import { upload } from '../../middlewares/uploadMiddleware';
class UserRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.userController = new user_controller_1.default();
        this.routes();
    }
    routes() {
        this.router.get("/", (0, action_handler_1.default)(this.userController.listUser));
        this.router.post("/create", (0, action_handler_1.default)(this.userController.createUser));
        // This is api for editing user
        this.router.post("/update", (0, action_handler_1.default)(this.userController.updateUser));
        // This is api for deleting user
        // src/modules/user/user.router.ts
        this.router.delete("/", (0, action_handler_1.default)(this.userController.deleteUser));
    }
}
exports.default = UserRouter;
