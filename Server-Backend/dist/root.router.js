"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = __importDefault(require("./modules/user/user.router"));
const sale_router_1 = __importDefault(require("./modules/sale/sale.router"));
//import TargetRouter from "./modules/sale/target.router";
const auth_middleware_1 = require("./middlewares/auth-middleware");
const auth_router_1 = __importDefault(require("./modules/auth/auth.router"));
class RootRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.use("/user", auth_middleware_1.authenticateToken, new user_router_1.default().router);
        this.router.use("/sale", new sale_router_1.default().router);
        //  this.router.use("/target", new TargetRouter().router);
        this.router.use("/auth", new auth_router_1.default().router);
    }
}
exports.default = RootRouter;
