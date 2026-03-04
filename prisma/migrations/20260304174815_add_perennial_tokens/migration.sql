-- CreateTable
CREATE TABLE "perennial_tokens" (
    "token_id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "platform_id" TEXT NOT NULL,
    "platform_name" "PlatformName" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perennial_tokens_pkey" PRIMARY KEY ("token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perennial_tokens_token_key" ON "perennial_tokens"("token");

-- AddForeignKey
ALTER TABLE "perennial_tokens" ADD CONSTRAINT "perennial_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
