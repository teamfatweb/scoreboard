/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `ChampionData` will be added. If there are existing duplicate values, this will fail.
  - Made the column `year` on table `ChampionData` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChampionData" ALTER COLUMN "year" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ChampionData_year_key" ON "ChampionData"("year");
