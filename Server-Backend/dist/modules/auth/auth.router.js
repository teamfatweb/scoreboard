"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const action_handler_1 = __importDefault(require("../../middlewares/action-handler"));
class AuthRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.authController = new auth_controller_1.default();
        this.routes();
    }
    routes() {
        this.router.post("/login", (0, action_handler_1.default)(this.authController.login));
        this.router.post("/sample", (req, res) => {
            res.status(201).send("fasdfasd");
        });
    }
}
exports.default = AuthRouter;
