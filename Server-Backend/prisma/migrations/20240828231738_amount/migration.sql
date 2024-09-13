/*
  Warnings:

  - You are about to drop the column `targetAmount` on the `Target` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Target" DROP COLUMN "targetAmount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
