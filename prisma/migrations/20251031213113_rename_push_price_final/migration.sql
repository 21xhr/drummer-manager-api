/*
  Warnings:

  - You are about to drop the column `push_price` on the `challenges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "challenges" DROP COLUMN "push_price",
ADD COLUMN     "push_base_cost" INTEGER NOT NULL DEFAULT 21;
