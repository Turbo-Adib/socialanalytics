-- AlterTable
ALTER TABLE "channels" ADD COLUMN "is_monetized" BOOLEAN;
ALTER TABLE "channels" ADD COLUMN "monetization_last_checked" DATETIME;
