/*
  Warnings:

  - Added the required column `submission_cost` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "submission_cost" INTEGER NOT NULL;
