-- DDL-only export of `lens_lab` — generated 2026-08-06T07:20:00.096Z
-- Source: 192.168.27.157:3306 (MySQL 8.0.46). No data included.

CREATE DATABASE IF NOT EXISTS `lens_lab` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `lens_lab`;

DROP TABLE IF EXISTS `blanks-fqc`;
CREATE TABLE `blanks-fqc` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fitting_id` varchar(50) NOT NULL,
  `wms_order_code` varchar(50) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `operator_id` varchar(50) NOT NULL,
  `operator_grade` tinyint(1) NOT NULL COMMENT '1=Grade-1, 2=Grade-2',
  `right_sph` decimal(6,2) DEFAULT NULL,
  `right_cyl` decimal(6,2) DEFAULT NULL,
  `right_axis` smallint DEFAULT NULL,
  `right_ap` decimal(6,2) DEFAULT NULL,
  `right_pd` decimal(5,2) DEFAULT NULL,
  `right_lensometer_sph` decimal(6,2) DEFAULT NULL,
  `right_lensometer_cyl` decimal(6,2) DEFAULT NULL,
  `right_lensometer_axis` smallint DEFAULT NULL,
  `right_lensometer_ap` decimal(6,2) DEFAULT NULL,
  `left_sph` decimal(6,2) DEFAULT NULL,
  `left_cyl` decimal(6,2) DEFAULT NULL,
  `left_axis` smallint DEFAULT NULL,
  `left_ap` decimal(6,2) DEFAULT NULL,
  `left_pd` decimal(5,2) DEFAULT NULL,
  `left_lensometer_sph` decimal(6,2) DEFAULT NULL,
  `left_lensometer_cyl` decimal(6,2) DEFAULT NULL,
  `left_lensometer_axis` smallint DEFAULT NULL,
  `left_lensometer_ap` decimal(6,2) DEFAULT NULL,
  `qc_status` enum('PASS','HOLD','FAIL','UNHOLD') NOT NULL,
  `qcf_dept` varchar(30) DEFAULT NULL,
  `qcf_reason` varchar(100) DEFAULT NULL,
  `fail_side` enum('LEFT','RIGHT','BOTH') DEFAULT NULL,
  `coating` varchar(100) DEFAULT NULL,
  `lens_index` varchar(20) DEFAULT NULL,
  `lens_name` varchar(100) DEFAULT NULL,
  `lens_type` varchar(50) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1321 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `lab_out_check_logs`;
CREATE TABLE `lab_out_check_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operator_id` varchar(100) NOT NULL,
  `fitting_id` varchar(100) DEFAULT NULL,
  `location_id` varchar(20) NOT NULL,
  `product1_id` varchar(100) DEFAULT NULL,
  `product1_barcode` varchar(200) DEFAULT NULL,
  `product1_updated_at` datetime DEFAULT NULL,
  `product1_is_valid` tinyint(1) DEFAULT NULL,
  `product2_id` varchar(100) DEFAULT NULL,
  `product2_barcode` varchar(200) DEFAULT NULL,
  `product2_updated_at` datetime DEFAULT NULL,
  `product2_is_valid` tinyint(1) DEFAULT NULL,
  `all_green` tinyint(1) NOT NULL DEFAULT '0',
  `scanned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_operator_id` (`operator_id`),
  KEY `idx_fitting_id` (`fitting_id`),
  KEY `idx_location_id` (`location_id`),
  KEY `idx_scanned_at` (`scanned_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `location_blank_check_logs`;
CREATE TABLE `location_blank_check_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `operator_id` varchar(100) NOT NULL,
  `fitting_id` varchar(100) DEFAULT NULL,
  `location_id` varchar(20) NOT NULL,
  `product1_id` varchar(100) DEFAULT NULL,
  `product1_barcode` varchar(200) DEFAULT NULL,
  `product1_updated_at` datetime DEFAULT NULL,
  `product1_is_valid` tinyint(1) DEFAULT NULL,
  `product2_id` varchar(100) DEFAULT NULL,
  `product2_barcode` varchar(200) DEFAULT NULL,
  `product2_updated_at` datetime DEFAULT NULL,
  `product2_is_valid` tinyint(1) DEFAULT NULL,
  `all_green` tinyint(1) NOT NULL DEFAULT '0',
  `scanned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_operator_id` (`operator_id`),
  KEY `idx_fitting_id` (`fitting_id`),
  KEY `idx_location_id` (`location_id`),
  KEY `idx_scanned_at` (`scanned_at`)
) ENGINE=InnoDB AUTO_INCREMENT=688755 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

