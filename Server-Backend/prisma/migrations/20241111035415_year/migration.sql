/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `ChampionData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChampionData_year_key" ON "ChampionData"("year");
