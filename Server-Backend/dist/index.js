"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = __importDefault(require("./utils/client"));
const root_router_1 = __importDefault(require("./root.router"));
const target_router_1 = __importDefault(require("./modules/sale/target.router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/test", (req, res) => {
    res.send("Hello World!");
});
app.get("/", (req, res) => {
    res.send("Express on Vercel!");
});
app.use("/api/v1", new root_router_1.default().router);
app.use("/api/v1/target", new target_router_1.default().router);
client_1.default.$connect().then(() => {
    console.info("Connected to SQL Database");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
module.exports = app;
