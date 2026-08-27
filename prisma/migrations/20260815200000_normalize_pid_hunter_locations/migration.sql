ALTER TABLE `scanned_barcode_inventory`
  ADD COLUMN `tote` VARCHAR(12) NULL AFTER `nexs_location`,
  ADD COLUMN `tote_simplified` VARCHAR(20) NULL AFTER `tote`,
  ADD COLUMN `tote_number` INTEGER NULL AFTER `tote_simplified`,
  ADD COLUMN `partition` INTEGER NULL AFTER `tote_number`,
  ADD INDEX `idx_sbi_tote_partition` (`tote_number`, `partition`);

CREATE TABLE `scanned_barcode_inventory_location_backup_20260815`
  LIKE `scanned_barcode_inventory`;

CREATE TABLE `scanned_barcode_inventory_location_archive_20260815`
  LIKE `scanned_barcode_inventory`;

ALTER TABLE `scanned_barcode_inventory_location_archive_20260815`
  ADD COLUMN `archived_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ADD COLUMN `archive_reason` VARCHAR(100) NOT NULL DEFAULT 'WORKBOOK_LOCATION_NORMALIZATION';

CREATE TABLE `pid_hunter_location_stage_20260815` (
  `barcode` VARCHAR(50) NOT NULL,
  `pid` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NULL,
  `condition` VARCHAR(50) NULL,
  `availability` VARCHAR(50) NULL,
  `nexs_location` VARCHAR(255) NULL,
  `tote` VARCHAR(12) NOT NULL,
  `tote_simplified` VARCHAR(20) NOT NULL,
  `tote_number` INTEGER NOT NULL,
  `partition` INTEGER NOT NULL,
  `scan_location` VARCHAR(100) NOT NULL,
  `scanned_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`barcode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
