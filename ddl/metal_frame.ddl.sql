-- DDL-only export of `metal_frame` — generated 2026-08-06T07:20:01.263Z
-- Source: 192.168.27.157:3306 (MySQL 8.0.46). No data included.

CREATE DATABASE IF NOT EXISTS `metal_frame` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `metal_frame`;

DROP TABLE IF EXISTS `FittingScan`;
CREATE TABLE `FittingScan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `line_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nose_pad_pid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tip_fitting_pid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lens_fitting_pid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tip_bending_pid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `front_align_pid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frame_align_pid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_rework` tinyint(1) NOT NULL DEFAULT '0',
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_FittingScan_barcode` (`barcode`),
  KEY `idx_FittingScan_line_ts` (`line_number`,`timestamp`),
  KEY `idx_FittingScan_ts` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `Plating`;
CREATE TABLE `Plating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modelId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finish` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryOfWork` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalQuantity` int NOT NULL DEFAULT '0',
  `qcQuantity` int NOT NULL DEFAULT '0',
  `ngQuantity` int NOT NULL DEFAULT '0',
  `copperRejection` int NOT NULL DEFAULT '0',
  `nickelRejection` int NOT NULL DEFAULT '0',
  `lineRejection` int NOT NULL DEFAULT '0',
  `fqcRejection` int NOT NULL DEFAULT '0',
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Plating_modelId_idx` (`modelId`),
  KEY `Plating_size_idx` (`size`),
  KEY `Plating_finish_idx` (`finish`),
  KEY `Plating_categoryOfWork_idx` (`categoryOfWork`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `QcReason`;
CREATE TABLE `QcReason` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotkey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_QcReason_active_sort` (`active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `QcScan`;
CREATE TABLE `QcScan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qc_person` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qc_station` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_QcScan_barcode` (`barcode`),
  KEY `idx_QcScan_status_ts` (`status`,`timestamp`),
  KEY `idx_QcScan_reason` (`reason`),
  KEY `idx_QcScan_station_ts` (`qc_station`,`timestamp`),
  KEY `idx_QcScan_ts` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `TumblingConfiguration`;
CREATE TABLE `TumblingConfiguration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `defaultDurationMinutes` int NOT NULL DEFAULT '720',
  `additionalFieldLabel` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Additional Reference',
  `nearCompletionThresholdMinutes` int NOT NULL DEFAULT '60',
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `TumblingContainer`;
CREATE TABLE `TumblingContainer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stationNumber` int NOT NULL,
  `side` enum('LEFT','RIGHT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `displayName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TumblingContainer_stationNumber_side_key` (`stationNumber`,`side`),
  KEY `TumblingContainer_stationNumber_idx` (`stationNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `TumblingProcess`;
CREATE TABLE `TumblingProcess` (
  `id` int NOT NULL AUTO_INCREMENT,
  `processCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `containerId` int NOT NULL,
  `status` enum('DRAFT','RUNNING','COMPLETED','COMPLETED_EARLY','STOPPED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `durationMinutes` int NOT NULL DEFAULT '720',
  `startedAt` datetime(3) DEFAULT NULL,
  `expectedCompletionAt` datetime(3) DEFAULT NULL,
  `completedAt` datetime(3) DEFAULT NULL,
  `stoppedAt` datetime(3) DEFAULT NULL,
  `completionType` enum('AUTOMATIC','EARLY','STOPPED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `startedByName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorizedByCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authorizedByName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `products` json NOT NULL,
  `events` json NOT NULL,
  `activeSlotContainerId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TumblingProcess_processCode_key` (`processCode`),
  UNIQUE KEY `TumblingProcess_activeSlotContainerId_key` (`activeSlotContainerId`),
  KEY `TumblingProcess_status_idx` (`status`),
  KEY `TumblingProcess_containerId_idx` (`containerId`),
  KEY `TumblingProcess_startedAt_idx` (`startedAt`),
  KEY `TumblingProcess_expectedCompletionAt_idx` (`expectedCompletionAt`),
  CONSTRAINT `TumblingProcess_containerId_fkey` FOREIGN KEY (`containerId`) REFERENCES `TumblingContainer` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

