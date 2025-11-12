/*
  Warnings:

  - Changed the type of `duration_type` on the `challenges` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DurationType" AS ENUM ('ONE_OFF', 'RECURRING');

-- AlterTable
ALTER TABLE "challenges" DROP COLUMN "duration_type",
ADD COLUMN     "duration_type" "DurationType" NOT NULL;
