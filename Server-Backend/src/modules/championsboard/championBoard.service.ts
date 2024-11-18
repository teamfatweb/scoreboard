import { PrismaClient, ChampionData } from "@prisma/client";

const prisma = new PrismaClient();

export const championDataService = {
  // Save Champion Data (Create or Update)
  saveChampionData: async (
    year: number | null = null,
    markat: string = "",
    jobSpace: string = "",
    aMarkDirect: string = "",
    aMarkPublishing: string = ""
  ): Promise<ChampionData> => {
    try {
      // Check if a record exists based on `year` and `markat` as unique identifiers
      const existingData = await prisma.championData.findFirst({
        where: {
          year,
          markat,
        },
      });

      if (existingData) {
        // Update the existing record if found
        return await prisma.championData.update({
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
      return await prisma.championData.create({
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
    } catch (error: any) {
      console.error("Error saving champion data:", error.message || error);
      throw new Error("A database error occurred while trying to save champion data.");
    }
  },

  // Fetch all Champion Data
  getChampionData: async (): Promise<ChampionData[]> => {
    try {
      return await prisma.championData.findMany();
    } catch (error: any) {
      console.error("Error fetching champion data:", error.message || error);
      throw new Error("An error occurred while trying to retrieve champion data.");
    }
  },

  // Fetch Champion Data by Year
  getChampionDataByYear: async (year: number): Promise<ChampionData[]> => {
    try {
      return await prisma.championData.findMany({
        where: { year },
      });
    } catch (error: any) {
      console.error("Error fetching champion data by year:", error.message || error);
      throw new Error(`An error occurred while fetching champion data for the year ${year}.`);
    }
  },

  // Update Champion Data (only update provided fields)
  updateChampionData: async (
    id: number,
    updatedFields: { year?: number; markat?: string; jobSpace?: string; aMarkDirect?: string; aMarkPublishing?: string }
  ): Promise<ChampionData> => {
    try {
      const existingData = await prisma.championData.findUnique({
        where: { id },
      });

      if (!existingData) {
        throw new Error(`Champion data with ID ${id} not found.`);
      }

      const updatedData = await prisma.championData.update({
        where: { id },
        data: {
          ...updatedFields,
          updatedAt: new Date(), // Ensure updated timestamp
        },
      });

      return updatedData;
    } catch (error: any) {
      console.error("Error updating champion data:", error.message || error);
      throw new Error("An error occurred while updating champion data.");
    }
  },

  // Delete Champion Data by ID
  deleteChampionData: async (id: number): Promise<ChampionData | null> => {
    try {
      const deletedData = await prisma.championData.delete({
        where: { id },
      });
      return deletedData;
    } catch (error: any) {
      console.error("Error deleting champion data:", error.message || error);
      
      if (error.code === 'P2025') { // Prisma error code for record not found
        throw new Error(`Champion data with ID ${id} not found. It may have already been deleted.`);
      }

      throw new Error("An error occurred while deleting champion data.");
    }
  },
};

export default championDataService;
