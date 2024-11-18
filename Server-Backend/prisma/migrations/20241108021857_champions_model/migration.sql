-- CreateTable
CREATE TABLE "ChampionData" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "markat" TEXT NOT NULL,
    "jobSpace" TEXT NOT NULL,
    "aMarkDirect" TEXT NOT NULL,
    "aMarkPublishing" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChampionData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChampionData_year_key" ON "ChampionData"("year");
