/*
  Warnings:

  - A unique constraint covering the columns `[user_platform_id,platform_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."users_user_platform_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_user_platform_id_platform_name_key" ON "users"("user_platform_id", "platform_name");
