-- DDL-only export of `dispatch_ptl` — generated 2026-08-06T07:19:56.911Z
-- Source: 192.168.27.157:3306 (MySQL 8.0.46). No data included.

CREATE DATABASE IF NOT EXISTS `dispatch_ptl` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `dispatch_ptl`;

DROP TABLE IF EXISTS `Awb`;
CREATE TABLE `Awb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `awbNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `routingCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assignedLocationId` int NOT NULL,
  `operatorColor` enum('YELLOW','BLUE','GREEN','PINK','RED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `scanTimestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `placedTimestamp` datetime(3) DEFAULT NULL,
  `status` enum('ASSIGNED','PLACED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ASSIGNED',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Awb_awbNumber_key` (`awbNumber`),
  KEY `Awb_assignedLocationId_fkey` (`assignedLocationId`),
  CONSTRAINT `Awb_assignedLocationId_fkey` FOREIGN KEY (`assignedLocationId`) REFERENCES `locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cl_cls_qc_queue_entries`;
CREATE TABLE `cl_cls_qc_queue_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fitting_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_package_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `attempts` int NOT NULL DEFAULT '0',
  `last_error` text COLLATE utf8mb4_unicode_ci,
  `first_seen_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_seen_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completed_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cl_cls_qc_queue_entries_barcode_key` (`barcode`),
  KEY `cl_cls_qc_queue_entries_state_last_seen_at_idx` (`state`,`last_seen_at`),
  KEY `cl_cls_qc_queue_entries_shipping_package_id_idx` (`shipping_package_id`),
  KEY `cl_cls_qc_queue_entries_fitting_id_idx` (`fitting_id`)
) ENGINE=InnoDB AUTO_INCREMENT=267353 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidate_locations`;
CREATE TABLE `consolidate_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rack_id` int NOT NULL,
  `level` int NOT NULL,
  `position` int NOT NULL,
  `location_number` int NOT NULL,
  `barcode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `light_state` enum('OFF','ON') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OFF',
  `current_package_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignment_timestamp` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consolidate_locations_location_number_key` (`location_number`),
  UNIQUE KEY `consolidate_locations_barcode_key` (`barcode`),
  KEY `consolidate_locations_current_package_id_idx` (`current_package_id`),
  KEY `consolidate_locations_rack_id_fkey` (`rack_id`),
  CONSTRAINT `consolidate_locations_rack_id_fkey` FOREIGN KEY (`rack_id`) REFERENCES `consolidate_racks` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidate_package_scans`;
CREATE TABLE `consolidate_package_scans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipping_package_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barcode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_id` int NOT NULL,
  `placed` tinyint(1) NOT NULL DEFAULT '0',
  `operator_color` enum('YELLOW','BLUE','GREEN','PINK','RED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scanned_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `placed_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consolidate_package_scans_shipping_package_id_barcode_key` (`shipping_package_id`,`barcode`),
  KEY `consolidate_package_scans_location_id_idx` (`location_id`),
  CONSTRAINT `consolidate_package_scans_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `consolidate_locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `consolidate_package_scans_shipping_package_id_fkey` FOREIGN KEY (`shipping_package_id`) REFERENCES `consolidate_packages` (`shipping_package_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52883 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidate_packages`;
CREATE TABLE `consolidate_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipping_package_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_id` int DEFAULT NULL,
  `operator_color` enum('YELLOW','BLUE','GREEN','PINK','RED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','CONSOLIDATING','COMPLETE','RELEASED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `expected_count` int NOT NULL DEFAULT '0',
  `accounted_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `completed_at` datetime(3) DEFAULT NULL,
  `released_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consolidate_packages_shipping_package_id_key` (`shipping_package_id`),
  KEY `consolidate_packages_status_idx` (`status`),
  KEY `consolidate_packages_location_id_idx` (`location_id`),
  CONSTRAINT `consolidate_packages_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `consolidate_locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22745 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidate_qc_dump_entries`;
CREATE TABLE `consolidate_qc_dump_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_package_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `increment_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tray_no` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_created_at` datetime(3) DEFAULT NULL,
  `order_updated_at` datetime(3) DEFAULT NULL,
  `first_seen_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_seen_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `in_dump` tinyint(1) NOT NULL DEFAULT '1',
  `scanned` tinyint(1) NOT NULL DEFAULT '0',
  `scanned_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consolidate_qc_dump_entries_barcode_key` (`barcode`),
  KEY `consolidate_qc_dump_entries_shipping_package_id_idx` (`shipping_package_id`),
  KEY `consolidate_qc_dump_entries_in_dump_idx` (`in_dump`)
) ENGINE=InnoDB AUTO_INCREMENT=5801698 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidate_racks`;
CREATE TABLE `consolidate_racks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rack_number` int NOT NULL,
  `total_levels` int NOT NULL DEFAULT '4',
  `total_positions` int NOT NULL DEFAULT '5',
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consolidate_racks_rack_number_key` (`rack_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidate_release_history`;
CREATE TABLE `consolidate_release_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipping_package_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_number` int NOT NULL,
  `rack_number` int NOT NULL,
  `operator_color` enum('YELLOW','BLUE','GREEN','PINK','RED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expected_count` int NOT NULL,
  `accounted_count` int NOT NULL,
  `barcodes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `completed_at` datetime(3) DEFAULT NULL,
  `released_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `consolidate_release_history_shipping_package_id_idx` (`shipping_package_id`),
  KEY `consolidate_release_history_released_at_idx` (`released_at`)
) ENGINE=InnoDB AUTO_INCREMENT=23099 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidation_history`;
CREATE TABLE `consolidation_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipping_package_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_number` int NOT NULL,
  `rack_number` int NOT NULL,
  `operator_color` enum('YELLOW','BLUE','GREEN','PINK','RED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expected_count` int NOT NULL,
  `accounted_count` int NOT NULL,
  `barcodes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `completed_at` datetime(3) DEFAULT NULL,
  `released_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `consolidation_history_shipping_package_id_idx` (`shipping_package_id`),
  KEY `consolidation_history_released_at_idx` (`released_at`)
) ENGINE=InnoDB AUTO_INCREMENT=216 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `consolidation_scans`;
CREATE TABLE `consolidation_scans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipping_package_id` varchar(191) NOT NULL,
  `barcode` varchar(191) NOT NULL,
  `location_id` int NOT NULL,
  `placed` tinyint(1) NOT NULL DEFAULT '0',
  `scanned_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `placed_at` datetime(3) DEFAULT NULL,
  `operator_color` enum('YELLOW','BLUE','GREEN','PINK','RED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consolidation_scans_shipping_package_id_barcode_key` (`shipping_package_id`,`barcode`),
  KEY `consolidation_scans_location_id_idx` (`location_id`),
  CONSTRAINT `consolidation_scans_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `consolidation_scans_shipping_package_id_fkey` FOREIGN KEY (`shipping_package_id`) REFERENCES `package_consolidations` (`shipping_package_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4886 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `location_events`;
CREATE TABLE `location_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location_id` int NOT NULL,
  `event_type` enum('LIGHT_ON','LIGHT_OFF','ROUTING_ASSIGNED','ROUTING_RELEASED') NOT NULL,
  `routing_code` varchar(191) DEFAULT NULL,
  `awb_number` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_events_location_id_fkey` (`location_id`),
  CONSTRAINT `location_events_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rack_id` int NOT NULL,
  `level` int NOT NULL,
  `position` int NOT NULL,
  `location_number` int NOT NULL,
  `barcode` varchar(191) NOT NULL,
  `light_state` enum('OFF','ON') NOT NULL DEFAULT 'OFF',
  `current_routing_code` varchar(191) DEFAULT NULL,
  `assignment_timestamp` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1),
  `created_at` datetime(3) DEFAULT NULL,
  `current_package_id` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `locations_location_number_key` (`location_number`),
  UNIQUE KEY `locations_barcode_key` (`barcode`),
  KEY `locations_current_routing_code_idx` (`current_routing_code`),
  KEY `locations_rack_id_fkey` (`rack_id`),
  KEY `locations_current_package_id_idx` (`current_package_id`),
  CONSTRAINT `locations_rack_id_fkey` FOREIGN KEY (`rack_id`) REFERENCES `racks` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=300 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `omt_activity_logs`;
CREATE TABLE `omt_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event_type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tray_barcode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_tray_barcode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fitting_id` bigint unsigned DEFAULT NULL,
  `shipment_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_barcode` varchar(24) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stack_level` tinyint unsigned DEFAULT NULL,
  `max_qcf_count` int unsigned DEFAULT NULL,
  `order_type` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_ms` int unsigned DEFAULT NULL,
  `metadata_json` json DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_omt_logs_created` (`created_at`),
  KEY `idx_omt_logs_operator` (`operator_id`,`created_at`),
  KEY `idx_omt_logs_fitting` (`fitting_id`,`created_at`),
  KEY `idx_omt_logs_event` (`event_type`,`result`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3199 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `omt_tray_putaway`;
CREATE TABLE `omt_tray_putaway` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `position_barcode` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tray_barcode` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fitting_id` bigint unsigned DEFAULT NULL,
  `shipment_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_qcf_count` int unsigned NOT NULL DEFAULT '0',
  `operator_id` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority_classification` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_mode` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_date` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validation_status` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `validation_message` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validated_at` datetime(3) DEFAULT NULL,
  `stack_level` tinyint unsigned NOT NULL,
  `putaway_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_omt_tray` (`tray_barcode`),
  UNIQUE KEY `uq_omt_position_level` (`position_barcode`,`stack_level`),
  UNIQUE KEY `uq_omt_fitting` (`fitting_id`),
  KEY `idx_omt_position` (`position_barcode`)
) ENGINE=InnoDB AUTO_INCREMENT=1121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `package_consolidations`;
CREATE TABLE `package_consolidations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipping_package_id` varchar(191) NOT NULL,
  `location_id` int DEFAULT NULL,
  `operator_color` enum('YELLOW','BLUE','GREEN','PINK','RED') DEFAULT NULL,
  `status` enum('PENDING','CONSOLIDATING','COMPLETE','RELEASED') NOT NULL DEFAULT 'PENDING',
  `expected_count` int NOT NULL DEFAULT '0',
  `accounted_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL ON UPDATE CURRENT_TIMESTAMP(3),
  `completed_at` datetime(3) DEFAULT NULL,
  `released_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `package_consolidations_shipping_package_id_key` (`shipping_package_id`),
  KEY `package_consolidations_status_idx` (`status`),
  KEY `package_consolidations_location_id_idx` (`location_id`),
  CONSTRAINT `package_consolidations_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `placements`;
CREATE TABLE `placements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `awb_id` int NOT NULL,
  `location_id` int NOT NULL,
  `verified` tinyint(1),
  `verified_at` datetime(3) DEFAULT NULL,
  `operator_id` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `placements_awb_id_key` (`awb_id`),
  KEY `placements_location_id_fkey` (`location_id`),
  CONSTRAINT `placements_awb_id_fkey` FOREIGN KEY (`awb_id`) REFERENCES `Awb` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `placements_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `qc_dump_entries`;
CREATE TABLE `qc_dump_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(191) NOT NULL,
  `shipping_package_id` varchar(191) NOT NULL,
  `increment_id` varchar(191) DEFAULT NULL,
  `item_type` varchar(191) DEFAULT NULL,
  `tray_no` varchar(191) DEFAULT NULL,
  `current_status` varchar(191) DEFAULT NULL,
  `order_created_at` datetime(3) DEFAULT NULL,
  `order_updated_at` datetime(3) DEFAULT NULL,
  `first_seen_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_seen_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `in_dump` tinyint(1) NOT NULL DEFAULT '1',
  `scanned` tinyint(1) NOT NULL DEFAULT '0',
  `scanned_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `qc_dump_entries_barcode_key` (`barcode`),
  KEY `qc_dump_entries_shipping_package_id_idx` (`shipping_package_id`),
  KEY `qc_dump_entries_in_dump_idx` (`in_dump`)
) ENGINE=InnoDB AUTO_INCREMENT=1967490 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `racks`;
CREATE TABLE `racks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rack_number` int NOT NULL,
  `total_levels` int NOT NULL DEFAULT '5',
  `total_positions` int NOT NULL DEFAULT '5',
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `racks_rack_number_key` (`rack_number`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `routing_assignments`;
CREATE TABLE `routing_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `routing_code` varchar(191) NOT NULL,
  `location_id` int NOT NULL,
  `assigned_at` datetime(3) DEFAULT NULL,
  `released_at` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1),
  PRIMARY KEY (`id`),
  UNIQUE KEY `routing_assignments_routing_code_key` (`routing_code`),
  KEY `routing_assignments_location_id_fkey` (`location_id`),
  CONSTRAINT `routing_assignments_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
