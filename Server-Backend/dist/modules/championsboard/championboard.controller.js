"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.championDataController = void 0;
const client_1 = __importDefault(require("../../utils/client"));
const championBoard_service_1 = require("./championBoard.service");
exports.championDataController = {
    // Save Champion Data
    saveChampionData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year, data } = req.body;
            try {
                const savedData = yield championBoard_service_1.championDataService.saveChampionData(year, data.markat, data.jobSpace, data.aMarkDirect, data.aMarkPublishing);
                res.status(200).json({
                    message: "Champion data saved successfully.",
                    data: {
                        year: savedData.year,
                        jobSpace: savedData.jobSpace,
                        aMarkDirect: savedData.aMarkDirect,
                        aMarkPublishing: savedData.aMarkPublishing,
                        updatedAt: savedData.updatedAt,
                    },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error saving champion data:", error.message);
                    res.status(500).json({ message: "Failed to save champion data", error: error.message });
                }
                else {
                    console.error("Unexpected error:", error);
                    res.status(500).json({ message: "An unexpected error occurred" });
                }
            }
        });
    },
    // Get All Champion Data
    getChampionData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield championBoard_service_1.championDataService.getChampionData();
                res.status(200).json(data);
            }
            catch (error) {
                console.error("Error fetching champion data:", error);
                res.status(500).json({ message: "Error fetching champion data" });
            }
        });
    },
    // Get Champion Data by Year
    getChampionDataByYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year } = req.params;
            try {
                const data = yield championBoard_service_1.championDataService.getChampionDataByYear(Number(year));
                if (!data || data.length === 0) {
                    return res.status(404).json({ message: `No data found for the year ${year}.` });
                }
                res.status(200).json(data);
            }
            catch (error) {
                console.error("Error fetching champion data by year:", error);
                res.status(500).json({ message: "Error fetching champion data by year" });
            }
        });
    },
    // Update Champion Data
    updateChampionData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, year, data } = req.body;
            try {
                const championId = Number(id);
                if (isNaN(championId)) {
                    return res.status(400).json({ message: "Invalid ID format" });
                }
                const updatedFields = {};
                if ((data === null || data === void 0 ? void 0 : data.markat) !== undefined)
                    updatedFields.markat = data.markat;
                if ((data === null || data === void 0 ? void 0 : data.jobSpace) !== undefined)
                    updatedFields.jobSpace = data.jobSpace;
                if ((data === null || data === void 0 ? void 0 : data.aMarkDirect) !== undefined)
                    updatedFields.aMarkDirect = data.aMarkDirect;
                if ((data === null || data === void 0 ? void 0 : data.aMarkPublishing) !== undefined)
                    updatedFields.aMarkPublishing = data.aMarkPublishing;
                if (year !== undefined)
                    updatedFields.year = year;
                const updatedData = yield championBoard_service_1.championDataService.updateChampionData(championId, updatedFields);
                if (!updatedData) {
                    return res.status(404).json({ message: "Champion data not found" });
                }
                res.status(200).json({
                    message: "Champion data updated successfully.",
                    data: updatedData,
                });
            }
            catch (error) {
                console.error("Error updating champion data:", error instanceof Error ? error.message : error);
                res.status(500).json({ message: "Failed to update champion data" });
            }
        });
    },
    // Delete Champion Data
    deleteChampionData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const championId = Number(id);
                if (isNaN(championId)) {
                    return res.status(400).json({ message: "Invalid ID format" });
                }
                const deletedChampion = yield client_1.default.championData.delete({
                    where: { id: championId },
                });
                res.status(200).json({
                    message: "Champion data deleted successfully",
                    data: deletedChampion,
                });
            }
            catch (error) {
                if (error.code === 'P2025') {
                    console.error("Champion data not found:", error.message);
                    res.status(404).json({ message: `Champion data with ID ${id} not found.` });
                }
                else {
                    console.error("Error deleting champion data:", error.message || error);
                    res.status(500).json({ message: "Failed to delete champion data", error: error.message });
                }
            }
        });
    },
};
exports.default = exports.championDataController;
