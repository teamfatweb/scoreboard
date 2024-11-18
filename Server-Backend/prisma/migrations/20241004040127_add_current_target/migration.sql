/*
  Warnings:

  - Made the column `currentTargetAmount` on table `Sale` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currentTarget` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "currentTargetAmount" SET NOT NULL,
ALTER COLUMN "currentTargetAmount" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "currentTarget" DOUBLE PRECISION NOT NULL;
