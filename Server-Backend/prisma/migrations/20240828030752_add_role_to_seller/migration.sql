/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `Seller` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'seller',
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");
