-- AlterTable
ALTER TABLE "streams" ADD COLUMN     "total_challenges_submitted_in_session" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_numbers_returned_from_removals_in_session" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_removals_in_session" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "total_numbers_spent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_received_from_removals" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_removals_executed" INTEGER NOT NULL DEFAULT 0;
