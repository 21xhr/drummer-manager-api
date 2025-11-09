-- AlterTable
ALTER TABLE "users" ADD COLUMN     "total_to_community_chest" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "total_to_pushers" BIGINT NOT NULL DEFAULT 0;
