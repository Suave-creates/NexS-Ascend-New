-- DDL-only export of `mydb` — generated 2026-08-06T07:19:55.165Z
-- Source: 192.168.27.157:3306 (MySQL 8.0.46). No data included.

CREATE DATABASE IF NOT EXISTS `mydb` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `mydb`;

DROP TABLE IF EXISTS `BulkScan`;
CREATE TABLE `BulkScan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nexsId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_BulkScan_scanId` (`scanId`),
  KEY `idx_BulkScan_station_ts` (`stationId`,`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=968296 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `CLScans`;
CREATE TABLE `CLScans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stationId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nexsId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_CLScans_scanId` (`scanId`),
  KEY `idx_CLScans_station_created` (`stationId`,`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=2040350 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `CourierHandover`;
CREATE TABLE `CourierHandover` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partner` varchar(191) NOT NULL,
  `awb` varchar(191) NOT NULL,
  `personId` varchar(191) NOT NULL,
  `lastScan` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `duplicate` tinyint(1) NOT NULL DEFAULT '0',
  `mismatch` tinyint(1) NOT NULL DEFAULT '0',
  `detectedPartner` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_CourierHandover_partner_awb` (`partner`,`awb`)
) ENGINE=InnoDB AUTO_INCREMENT=3540270 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `DispatchScan`;
CREATE TABLE `DispatchScan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nexsId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_DispatchScan_scanId` (`scanId`),
  KEY `idx_DispatchScan_station_ts` (`stationId`,`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=4184847 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `EHSDeviation`;
CREATE TABLE `EHSDeviation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `timeOfRound` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `responsibleDepartment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observations` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photographBefore` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `controlMeasures` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photographAfter` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categorization` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Yellow',
  `remarksByDepartment` text COLLATE utf8mb4_unicode_ci,
  `complianceStatus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Open',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `complianceDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EHSDeviation_date_idx` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `FR0BulkHOTO`;
CREATE TABLE `FR0BulkHOTO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) NOT NULL,
  `stationId` varchar(191) NOT NULL,
  `nexsId` varchar(191) NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `FR0BulkHOTO_scanId_idx` (`scanId`),
  KEY `idx_FR0BulkHOTO_scanId_ts` (`scanId`,`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=1914317 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `FR0Scan`;
CREATE TABLE `FR0Scan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nexsId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_FR0Scan_scanId` (`scanId`),
  KEY `idx_FR0Scan_station_created` (`stationId`,`createdAt`)
) ENGINE=InnoDB AUTO_INCREMENT=2179793 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `InventoryPID`;
CREATE TABLE `InventoryPID` (
  `PID` varchar(191) NOT NULL,
  `Comment` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`PID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `MaintenanceShopIssue`;
CREATE TABLE `MaintenanceShopIssue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `partName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` double NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` double NOT NULL,
  `destination` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ManualWarehouse`;
CREATE TABLE `ManualWarehouse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) NOT NULL,
  `stationId` varchar(191) NOT NULL,
  `nexsId` varchar(191) NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_ManualWarehouse_timestamp` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=24364 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `ManualWarehouseSetUp`;
CREATE TABLE `ManualWarehouseSetUp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pid` varchar(191) NOT NULL,
  `location` varchar(191) NOT NULL,
  `package` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ManualWarehouseSetUp_pid_key` (`pid`),
  KEY `ManualWarehouseSetUp_pid_idx` (`pid`),
  KEY `ManualWarehouseSetUp_location_idx` (`location`)
) ENGINE=InnoDB AUTO_INCREMENT=34120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `MetalFrameFittingScan`;
CREATE TABLE `MetalFrameFittingScan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) NOT NULL,
  `stationId` varchar(191) NOT NULL,
  `nexsId` varchar(191) NOT NULL,
  `pid` varchar(191) DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `MetalFrameFittingScan_scanId_idx` (`scanId`),
  KEY `MetalFrameFittingScan_stationId_idx` (`stationId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `OperationsMetadata`;
CREATE TABLE `OperationsMetadata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_odd` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ship_to_cust` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_OperationsMetadata_location_id` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1345819301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `PackingScan`;
CREATE TABLE `PackingScan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scanId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nexsId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_PackingScan_scanId` (`scanId`),
  KEY `idx_PackingScan_station_ts` (`stationId`,`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=13618252 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ShippingMetadata`;
CREATE TABLE `ShippingMetadata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shippingID` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ShippingMetadata_shippingID_key` (`shippingID`)
) ENGINE=InnoDB AUTO_INCREMENT=1345820846 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_employeeCode_key` (`employeeCode`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `fasttrackscan`;
CREATE TABLE `fasttrackscan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_odd` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ndd_shipments`;
CREATE TABLE `ndd_shipments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `awb` varchar(100) NOT NULL,
  `type` enum('Normal','Rescue') NOT NULL DEFAULT 'Normal',
  PRIMARY KEY (`id`),
  KEY `idx_ndd_created_at` (`created_at`),
  KEY `idx_ndd_awb` (`awb`)
) ENGINE=InnoDB AUTO_INCREMENT=569708 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `order_update_dashboard_study`;
CREATE TABLE `order_update_dashboard_study` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wave` varchar(191) DEFAULT NULL,
  `order_id` varchar(191) DEFAULT NULL,
  `order_status` varchar(191) DEFAULT NULL,
  `station_id` varchar(191) DEFAULT NULL,
  `fitting_id` varchar(191) DEFAULT NULL,
  `updated_fitting_id` varchar(191) DEFAULT NULL,
  `order_sync_time` datetime(3) DEFAULT NULL,
  `order_item_id` varchar(191) DEFAULT NULL,
  `sku` varchar(191) DEFAULT NULL,
  `unallocated_reason` varchar(191) DEFAULT NULL,
  `item_type` varchar(191) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `priority` varchar(191) DEFAULT NULL,
  `order_item_status` varchar(191) DEFAULT NULL,
  `wave_state` varchar(191) DEFAULT NULL,
  `category` varchar(191) DEFAULT NULL,
  `tray_id` varchar(191) DEFAULT NULL,
  `jit_flag` tinyint(1) DEFAULT NULL,
  `serial_no` varchar(191) DEFAULT NULL,
  `response_message` text,
  `picking_cutoff_time` datetime(3) DEFAULT NULL,
  `order_allocation_time` datetime(3) DEFAULT NULL,
  `item_picked_timestamp` datetime(3) DEFAULT NULL,
  `uploaded_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `order_update_dashboard_study_order_id_idx` (`order_id`),
  KEY `order_update_dashboard_study_fitting_id_idx` (`fitting_id`),
  KEY `order_update_dashboard_study_updated_fitting_id_idx` (`updated_fitting_id`),
  KEY `order_update_dashboard_study_station_id_idx` (`station_id`),
  KEY `order_update_dashboard_study_sku_idx` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=4901 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `scanned_barcode_inventory`;
CREATE TABLE `scanned_barcode_inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pid` varchar(50) NOT NULL,
  `barcode` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `condition` varchar(50) DEFAULT NULL,
  `availability` varchar(50) DEFAULT NULL,
  `scan_location` varchar(100) NOT NULL,
  `scanned_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `nexs_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scanned_barcode_inventory_barcode_scan_location_key` (`barcode`,`scan_location`),
  KEY `scanned_barcode_inventory_barcode_idx` (`barcode`),
  KEY `idx_sbi_location_scanned` (`scan_location`,`scanned_at`)
) ENGINE=InnoDB AUTO_INCREMENT=191672 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `scanned_barcode_inventory_transfer`;
CREATE TABLE `scanned_barcode_inventory_transfer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pid` varchar(50) NOT NULL,
  `barcode` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `condition` varchar(50) DEFAULT NULL,
  `availability` varchar(50) DEFAULT NULL,
  `scan_location` varchar(100) NOT NULL,
  `scanned_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `injested_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `nexs_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scanned_barcode_inventory_transfer_barcode_scan_location_key` (`barcode`,`scan_location`),
  KEY `scanned_barcode_inventory_transfer_barcode_idx` (`barcode`)
) ENGINE=InnoDB AUTO_INCREMENT=201933 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

