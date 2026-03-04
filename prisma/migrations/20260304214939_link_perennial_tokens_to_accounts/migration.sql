-- AddForeignKey
ALTER TABLE "perennial_tokens" ADD CONSTRAINT "perennial_tokens_platform_id_platform_name_fkey" FOREIGN KEY ("platform_id", "platform_name") REFERENCES "accounts"("platform_id", "platform_name") ON DELETE RESTRICT ON UPDATE CASCADE;
