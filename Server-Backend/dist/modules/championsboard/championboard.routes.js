"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const championboard_controller_1 = require("../championsboard/championboard.controller");
const router = express_1.default.Router();
// POST route to save champion data
router.post("/saveChampionData", championboard_controller_1.championDataController.saveChampionData);
// GET route to fetch champion data
router.get("/getChampionData", championboard_controller_1.championDataController.getChampionData);
// PUT route to update champion data by ID
router.put("/updateChampionData/:id", championboard_controller_1.championDataController.updateChampionData);
// Example DELETE route in Express
router.delete("/championData/:id", championboard_controller_1.championDataController.deleteChampionData);
exports.default = router;
