/*
  Warnings:

  - Added the required column `currentTargetAmount` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN "currentTargetAmount" FLOAT DEFAULT 0.0;
