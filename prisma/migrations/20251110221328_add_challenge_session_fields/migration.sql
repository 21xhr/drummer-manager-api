/*
  Warnings:

  - Added the required column `total_sessions` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "current_session_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "session_start_timestamp" TIMESTAMP(3),
ADD COLUMN     "total_sessions" INTEGER NOT NULL;
