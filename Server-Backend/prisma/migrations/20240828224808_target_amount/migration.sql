/*
  Warnings:

  - You are about to drop the column `amount` on the `Target` table. All the data in the column will be lost.
  - Added the required column `targetAmount` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Target" DROP COLUMN "amount",
ADD COLUMN     "targetAmount" DOUBLE PRECISION NOT NULL;
