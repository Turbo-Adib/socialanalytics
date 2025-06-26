-- CreateTable
CREATE TABLE "intelligent_insights" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "insight_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "knowledge_base_ref" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "actionable" BOOLEAN NOT NULL DEFAULT true,
    "related_video_ids" TEXT,
    "metrics" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" DATETIME NOT NULL,
    CONSTRAINT "intelligent_insights_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "content_recommendations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel_id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "recommendation_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expected_impact" TEXT NOT NULL,
    "implementation_steps" TEXT NOT NULL,
    "required_resources" TEXT,
    "difficulty_level" TEXT NOT NULL,
    "time_to_implement" TEXT NOT NULL,
    "knowledge_base_ref" TEXT NOT NULL,
    "success_examples" TEXT,
    "potential_score" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "content_recommendations_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "video_insights" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "video_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "insight_type" TEXT NOT NULL,
    "hook_effectiveness" REAL,
    "format_alignment" REAL,
    "viral_factors" TEXT,
    "improvement_areas" TEXT,
    "competitor_comparison" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "niche_analysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "niche" TEXT NOT NULL,
    "saturation_level" REAL NOT NULL,
    "competitor_count" INTEGER NOT NULL,
    "avg_views_per_video" BIGINT NOT NULL,
    "top_performers" TEXT NOT NULL,
    "emerging_trends" TEXT,
    "entry_barrier" TEXT NOT NULL,
    "monetization_potential" REAL NOT NULL,
    "recommended_formats" TEXT NOT NULL,
    "cross_platform_data" TEXT,
    "last_updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "intelligent_insights_channel_id_insight_type_idx" ON "intelligent_insights"("channel_id", "insight_type");

-- CreateIndex
CREATE INDEX "intelligent_insights_channel_id_category_idx" ON "intelligent_insights"("channel_id", "category");

-- CreateIndex
CREATE INDEX "content_recommendations_channel_id_priority_idx" ON "content_recommendations"("channel_id", "priority");

-- CreateIndex
CREATE INDEX "content_recommendations_channel_id_status_idx" ON "content_recommendations"("channel_id", "status");

-- CreateIndex
CREATE INDEX "video_insights_channel_id_idx" ON "video_insights"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_insights_video_id_insight_type_key" ON "video_insights"("video_id", "insight_type");

-- CreateIndex
CREATE UNIQUE INDEX "niche_analysis_niche_key" ON "niche_analysis"("niche");
