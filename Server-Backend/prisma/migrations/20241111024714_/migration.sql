-- DropIndex
DROP INDEX "ChampionData_year_key";

-- AlterTable
ALTER TABLE "ChampionData" ALTER COLUMN "year" DROP NOT NULL;
