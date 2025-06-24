-- CreateTable
CREATE TABLE "video_analysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "view_count" BIGINT NOT NULL,
    "duration" TEXT NOT NULL,
    "is_short" BOOLEAN NOT NULL,
    "published_at" DATETIME NOT NULL,
    "video_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "is_outlier_longform" BOOLEAN NOT NULL DEFAULT false,
    "is_outlier_shorts" BOOLEAN NOT NULL DEFAULT false,
    "longform_multiplier" REAL,
    "shorts_multiplier" REAL,
    "extracted_patterns" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "video_analysis_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analysis_cache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "videos_analyzed" INTEGER NOT NULL,
    "total_video_count" INTEGER NOT NULL,
    "last_full_fetch" DATETIME NOT NULL,
    "last_incremental_update" DATETIME,
    "cache_expires_at" DATETIME NOT NULL,
    "upload_frequency_per_week" REAL,
    "cache_duration_hours" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "analysis_cache_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "video_analysis_channel_id_video_id_key" ON "video_analysis"("channel_id", "video_id");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_cache_channel_id_key" ON "analysis_cache"("channel_id");
