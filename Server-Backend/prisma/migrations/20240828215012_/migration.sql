/*
  Warnings:

  - You are about to drop the column `role` on the `Seller` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
