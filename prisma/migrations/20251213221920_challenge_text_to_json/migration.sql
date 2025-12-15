/*
  Warnings:

  - Changed the type of `challenge_text` on the `challenges` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "challenges" DROP COLUMN "challenge_text",
ADD COLUMN     "challenge_text" JSONB NOT NULL;
