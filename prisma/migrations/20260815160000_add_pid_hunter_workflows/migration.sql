CREATE TABLE IF NOT EXISTS `pid_hunter_totes` (
  `tote_number` INTEGER NOT NULL,
  `tote_id` VARCHAR(12) NOT NULL,
  `is_free` BOOLEAN NOT NULL DEFAULT false,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `uniq_pid_hunter_tote_id` (`tote_id`),
  INDEX `idx_pid_hunter_tote_free` (`is_free`, `tote_number`),
  PRIMARY KEY (`tote_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pid_hunter_scans` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `pid` VARCHAR(50) NOT NULL,
  `barcode` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NULL,
  `condition` VARCHAR(50) NULL,
  `availability` VARCHAR(50) NULL,
  `nexs_location` VARCHAR(255) NULL,
  `current_location` VARCHAR(100) NOT NULL,
  `raw_location` VARCHAR(255) NULL,
  `tote_id` VARCHAR(12) NULL,
  `tote_number` INTEGER NULL,
  `partition` INTEGER NULL,
  `bucket` VARCHAR(20) NOT NULL,
  `bin_name` VARCHAR(50) NULL,
  `mode` VARCHAR(20) NOT NULL,
  `operation` VARCHAR(100) NULL,
  `action_id` VARCHAR(100) NULL,
  `updated_at_nexs` VARCHAR(50) NULL,
  `total_operations` INTEGER NULL,
  `raw_scan` VARCHAR(255) NULL,
  `compacted` BOOLEAN NOT NULL DEFAULT false,
  `compacted_from` VARCHAR(100) NULL,
  `source_key` VARCHAR(191) NULL,
  `scanned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `uniq_pid_hunter_source_key` (`source_key`),
  INDEX `idx_pid_hunter_barcode_scanned` (`barcode`, `scanned_at`),
  INDEX `idx_pid_hunter_pid_bucket_scanned` (`pid`, `bucket`, `scanned_at`),
  INDEX `idx_pid_hunter_tote_partition_scanned` (`tote_number`, `partition`, `scanned_at`),
  INDEX `idx_pid_hunter_mode_scanned` (`mode`, `scanned_at`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
