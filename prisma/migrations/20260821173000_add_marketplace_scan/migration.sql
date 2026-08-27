CREATE TABLE `MarketplaceScan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` VARCHAR(191) NOT NULL,
    `stationId` VARCHAR(191) NOT NULL,
    `nexsId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_MarketplaceScan_scanId`(`scanId`),
    INDEX `idx_MarketplaceScan_station_ts`(`stationId`, `timestamp`),
    INDEX `idx_MarketplaceScan_ts_scan_station`(`timestamp`, `scanId`, `stationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

