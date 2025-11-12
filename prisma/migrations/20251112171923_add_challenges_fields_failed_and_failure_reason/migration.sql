-- AlterEnum
ALTER TYPE "ChallengeStatus" ADD VALUE 'Failed';

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "failure_reason" TEXT;
