/*
  Warnings:

  - You are about to drop the column `type` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InjectionType" AS ENUM ('MULTIPOINT', 'DIRECT');

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_userId_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "type";

-- DropTable
DROP TABLE "Evaluation";

-- DropEnum
DROP TYPE "SessionType";

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL,
    "year" INTEGER NOT NULL,
    "engineCapacity" DOUBLE PRECISION NOT NULL,
    "peakPower" DOUBLE PRECISION NOT NULL,
    "peakTorque" DOUBLE PRECISION NOT NULL,
    "injection" "InjectionType" NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "wheelBase" DOUBLE PRECISION NOT NULL,
    "doorAmount" INTEGER NOT NULL,
    "seatCapacity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "isAccepatble" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
