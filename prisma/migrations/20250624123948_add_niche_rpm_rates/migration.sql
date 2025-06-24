-- CreateTable
CREATE TABLE "niche_rpm_rates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "niche" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "min_rpm_usd" REAL NOT NULL,
    "max_rpm_usd" REAL NOT NULL,
    "average_rpm_usd" REAL NOT NULL,
    "shorts_rpm_usd" REAL NOT NULL DEFAULT 0.15,
    "confidence" TEXT NOT NULL,
    "data_source" TEXT NOT NULL,
    "last_updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sample_size" TEXT,
    "notes" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "niche_rpm_rates_niche_key" ON "niche_rpm_rates"("niche");
