/*
  Warnings:

  - You are about to drop the column `timestampLastStreamDayTicked` on the `challenges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "challenges" DROP COLUMN "timestampLastStreamDayTicked",
ADD COLUMN     "timestamp_last_push_at" TIMESTAMP(3),
ADD COLUMN     "timestamp_last_stream_day_ticked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
