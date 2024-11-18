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
Object.defineProperty(exports, "__esModule", { value: true });
exports.championDataService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.championDataService = {
    // Save Champion Data (Create or Update)
    saveChampionData: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (year = null, markat = "", jobSpace = "", aMarkDirect = "", aMarkPublishing = "") {
        try {
            // Check if a record exists based on `year` and `markat` as unique identifiers
            const existingData = yield prisma.championData.findFirst({
                where: {
                    year,
                    markat,
                },
            });
            if (existingData) {
                // Update the existing record if found
                return yield prisma.championData.update({
                    where: { id: existingData.id },
                    data: {
                        jobSpace,
                        aMarkDirect,
                        aMarkPublishing,
                        updatedAt: new Date(), // Update timestamp
                    },
                });
            }
            // Create a new record if no match is found
            return yield prisma.championData.create({
                data: {
                    year,
                    markat,
                    jobSpace,
                    aMarkDirect,
                    aMarkPublishing,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        }
        catch (error) {
            console.error("Error saving champion data:", error.message || error);
            throw new Error("A database error occurred while trying to save champion data.");
        }
    }),
    // Fetch all Champion Data
    getChampionData: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield prisma.championData.findMany();
        }
        catch (error) {
            console.error("Error fetching champion data:", error.message || error);
            throw new Error("An error occurred while trying to retrieve champion data.");
        }
    }),
    // Fetch Champion Data by Year
    getChampionDataByYear: (year) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield prisma.championData.findMany({
                where: { year },
            });
        }
        catch (error) {
            console.error("Error fetching champion data by year:", error.message || error);
            throw new Error(`An error occurred while fetching champion data for the year ${year}.`);
        }
    }),
    // Update Champion Data (only update provided fields)
    updateChampionData: (id, updatedFields) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingData = yield prisma.championData.findUnique({
                where: { id },
            });
            if (!existingData) {
                throw new Error(`Champion data with ID ${id} not found.`);
            }
            const updatedData = yield prisma.championData.update({
                where: { id },
                data: Object.assign(Object.assign({}, updatedFields), { updatedAt: new Date() }),
            });
            return updatedData;
        }
        catch (error) {
            console.error("Error updating champion data:", error.message || error);
            throw new Error("An error occurred while updating champion data.");
        }
    }),
    // Delete Champion Data by ID
    deleteChampionData: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedData = yield prisma.championData.delete({
                where: { id },
            });
            return deletedData;
        }
        catch (error) {
            console.error("Error deleting champion data:", error.message || error);
            if (error.code === 'P2025') { // Prisma error code for record not found
                throw new Error(`Champion data with ID ${id} not found. It may have already been deleted.`);
            }
            throw new Error("An error occurred while deleting champion data.");
        }
    }),
};
exports.default = exports.championDataService;
