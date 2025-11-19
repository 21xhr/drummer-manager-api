-- CreateEnum
CREATE TYPE "CadenceUnit" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM_DAYS');

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "cadence_period_start" TIMESTAMP(3),
ADD COLUMN     "cadence_progress_counter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cadence_unit" "CadenceUnit",
ADD COLUMN     "session_cadence_text" TEXT;
