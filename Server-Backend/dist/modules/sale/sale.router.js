"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sale_controller_1 = __importDefault(require("./sale.controller"));
const action_handler_1 = __importDefault(require("../../middlewares/action-handler"));
const auth_middleware_1 = require("../../middlewares/auth-middleware");
class SaleRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.saleController = new sale_controller_1.default();
        this.routes();
    }
    routes() {
        this.router.get("/", (0, action_handler_1.default)(this.saleController.listSales));
        this.router.post("/add", auth_middleware_1.authenticateToken, (0, action_handler_1.default)(this.saleController.addSale));
        this.router.post("/delete", auth_middleware_1.authenticateToken, (0, action_handler_1.default)(this.saleController.deletedSale));
    }
}
exports.default = SaleRouter;
