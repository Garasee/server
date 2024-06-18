/*
  Warnings:

  - Changed the type of `isAcceptable` on the `Prediction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "isAcceptable",
ADD COLUMN     "isAcceptable" BOOLEAN NOT NULL;
