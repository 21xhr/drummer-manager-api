-- AlterTable
ALTER TABLE "challenges" ALTER COLUMN "total_numbers_spent" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "total_numbers_spent_game_wide" SET DATA TYPE BIGINT,
ALTER COLUMN "total_numbers_returned_from_removals_game_wide" SET DATA TYPE BIGINT,
ALTER COLUMN "total_numbers_spent" SET DATA TYPE BIGINT;
