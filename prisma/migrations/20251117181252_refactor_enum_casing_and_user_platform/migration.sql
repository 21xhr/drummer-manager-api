/*
  Warnings:

  - The values [Active,Archived,Auctioning,InProgress,Completed,Removed,Failed] on the enum `ChallengeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PlatformName" AS ENUM ('GAME_MASTER', 'KICK', 'TWITCH', 'YOUTUBE');

-- AlterEnum
BEGIN;
CREATE TYPE "ChallengeStatus_new" AS ENUM ('ACTIVE', 'ARCHIVED', 'AUCTIONED', 'COMPLETED', 'FAILED', 'IN_PROGRESS', 'REMOVED');
ALTER TABLE "challenges" ALTER COLUMN "status" TYPE "ChallengeStatus_new" USING ("status"::text::"ChallengeStatus_new");
ALTER TYPE "ChallengeStatus" RENAME TO "ChallengeStatus_old";
ALTER TYPE "ChallengeStatus_new" RENAME TO "ChallengeStatus";
DROP TYPE "public"."ChallengeStatus_old";
COMMIT;
