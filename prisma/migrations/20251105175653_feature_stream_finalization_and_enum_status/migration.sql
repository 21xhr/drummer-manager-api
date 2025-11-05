-- CreateEnum
CREATE TYPE "public"."ChallengeStatus" AS ENUM ('Active', 'Archived', 'Auctioning', 'InProgress', 'Completed', 'Removed');

-- Step 1: Convert all existing 'In Progress' entries to 'InProgress' to match the Enum value (handling the space)
UPDATE "challenges" SET "status" = 'InProgress' WHERE "status" = 'In Progress';

-- Step 2: Change the column type from String to the new Enum
-- The USING clause converts the existing text values to the new Enum values.
ALTER TABLE "challenges" ALTER COLUMN "status" TYPE "public"."ChallengeStatus" USING "status"::text::"public"."ChallengeStatus";