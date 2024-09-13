/*
  Warnings:

  - A unique constraint covering the columns `[sellerId,createdAt]` on the table `Target` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Target_sellerId_createdAt_key" ON "Target"("sellerId", "createdAt");
