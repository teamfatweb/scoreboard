/*
  Warnings:

  - Added the required column `percentage` to the `Archive` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Archive" DROP CONSTRAINT "Archive_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Target" DROP CONSTRAINT "Target_sellerId_fkey";

-- AlterTable
ALTER TABLE "Archive" ADD COLUMN     "percentage" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
