-- AlterTable
ALTER TABLE "users" ADD COLUMN "discord_id" TEXT;
ALTER TABLE "users" ADD COLUMN "last_discord_check" DATETIME;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "details" TEXT,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
