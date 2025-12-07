/*
  Warnings:

  - You are about to drop the column `last_balance_update` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_known_balance` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `platform_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_platform_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_user_platform_id_platform_name_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "last_balance_update",
DROP COLUMN "last_known_balance",
DROP COLUMN "platform_name",
DROP COLUMN "user_platform_id";

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform_id" TEXT NOT NULL,
    "platform_name" "PlatformName" NOT NULL,
    "current_balance" INTEGER NOT NULL DEFAULT 0,
    "last_balance_update" TIMESTAMP(3),
    "last_activity_timestamp" TIMESTAMP(3),
    "last_live_activity_timestamp" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_platform_id_platform_name_key" ON "accounts"("platform_id", "platform_name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
