-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel_title" TEXT NOT NULL,
    "description" TEXT,
    "primary_niche" TEXT,
    "upload_frequency_per_week" REAL,
    "thumbnail_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_snapshot_at" DATETIME
);

-- CreateTable
CREATE TABLE "channel_snapshots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriber_count" INTEGER NOT NULL,
    "monthly_views_long" BIGINT NOT NULL,
    "monthly_views_shorts" BIGINT NOT NULL,
    "est_revenue_long_usd" REAL NOT NULL,
    "est_revenue_shorts_usd" REAL NOT NULL,
    CONSTRAINT "channel_snapshots_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
