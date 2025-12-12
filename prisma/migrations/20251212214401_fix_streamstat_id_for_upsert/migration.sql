-- AlterTable
ALTER TABLE "stream_stats" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "stream_stats_id_seq";
