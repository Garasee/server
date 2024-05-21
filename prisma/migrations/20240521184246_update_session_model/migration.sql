/*
  Warnings:

  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('NORMAL', 'PASSWORD_RESET');

-- DropForeignKey
ALTER TABLE "PasswordReset" DROP CONSTRAINT "PasswordReset_userId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "type" "SessionType" NOT NULL DEFAULT 'NORMAL';

-- DropTable
DROP TABLE "PasswordReset";
