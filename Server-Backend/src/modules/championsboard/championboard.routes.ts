import express from "express";
import { championDataController } from "../championsboard/championboard.controller";

const router = express.Router();

// POST route to save champion data
router.post("/saveChampionData", championDataController.saveChampionData);

// GET route to fetch champion data
router.get("/getChampionData", championDataController.getChampionData);

// PUT route to update champion data by ID
router.put("/updateChampionData/:id", championDataController.updateChampionData);

// Example DELETE route in Express
router.delete("/championData/:id", championDataController.deleteChampionData);


export default router;
