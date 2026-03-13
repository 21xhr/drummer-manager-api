-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "timestamp_last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
