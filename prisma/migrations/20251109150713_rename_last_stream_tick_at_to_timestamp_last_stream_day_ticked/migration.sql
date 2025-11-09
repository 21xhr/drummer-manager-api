/*
  Warnings:

  - You are about to drop the column `lastStreamTickAt` on the `challenges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "challenges" DROP COLUMN "lastStreamTickAt",
ADD COLUMN     "timestampLastStreamDayTicked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
