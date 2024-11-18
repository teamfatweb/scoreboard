import { Request, Response } from "express";
import prisma from "../../utils/client";
import { championDataService } from "./championBoard.service";

export const championDataController = {
  // Save Champion Data
  async saveChampionData(req: Request, res: Response) {
    const { year, data } = req.body;

    try {
      const savedData = await championDataService.saveChampionData(
        year,
        data.markat,
        data.jobSpace,
        data.aMarkDirect,
        data.aMarkPublishing
      );

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error saving champion data:", error.message);
        res.status(500).json({ message: "Failed to save champion data", error: error.message });
      } else {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  },

  // Get All Champion Data
  async getChampionData(req: Request, res: Response) {
    try {
      const data = await championDataService.getChampionData();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching champion data:", error);
      res.status(500).json({ message: "Error fetching champion data" });
    }
  },

  // Get Champion Data by Year
  async getChampionDataByYear(req: Request, res: Response) {
    const { year } = req.params;

    try {
      const data = await championDataService.getChampionDataByYear(Number(year));

      if (!data || data.length === 0) {
        return res.status(404).json({ message: `No data found for the year ${year}.` });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching champion data by year:", error);
      res.status(500).json({ message: "Error fetching champion data by year" });
    }
  },

  // Update Champion Data
  async updateChampionData(req: Request, res: Response) {
    const { id, year, data } = req.body;

    try {
      const championId = Number(id);
      if (isNaN(championId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const updatedFields: { [key: string]: any } = {};
      if (data?.markat !== undefined) updatedFields.markat = data.markat;
      if (data?.jobSpace !== undefined) updatedFields.jobSpace = data.jobSpace;
      if (data?.aMarkDirect !== undefined) updatedFields.aMarkDirect = data.aMarkDirect;
      if (data?.aMarkPublishing !== undefined) updatedFields.aMarkPublishing = data.aMarkPublishing;
      if (year !== undefined) updatedFields.year = year;

      const updatedData = await championDataService.updateChampionData(championId, updatedFields);

      if (!updatedData) {
        return res.status(404).json({ message: "Champion data not found" });
      }

      res.status(200).json({
        message: "Champion data updated successfully.",
        data: updatedData,
      });
    } catch (error) {
      console.error("Error updating champion data:", error instanceof Error ? error.message : error);
      res.status(500).json({ message: "Failed to update champion data" });
    }
  },

  // Delete Champion Data
  async deleteChampionData(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const championId = Number(id);
      if (isNaN(championId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const deletedChampion = await prisma.championData.delete({
        where: { id: championId },
      });

      res.status(200).json({
        message: "Champion data deleted successfully",
        data: deletedChampion,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.error("Champion data not found:", error.message);
        res.status(404).json({ message: `Champion data with ID ${id} not found.` });
      } else {
        console.error("Error deleting champion data:", error.message || error);
        res.status(500).json({ message: "Failed to delete champion data", error: error.message });
      }
    }
  },
};

export default championDataController;
