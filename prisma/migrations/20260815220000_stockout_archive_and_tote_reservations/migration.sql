ALTER TABLE `scanned_barcode_inventory_transfer`
  ADD COLUMN `tote` VARCHAR(12) NULL AFTER `nexs_location`,
  ADD COLUMN `tote_simplified` VARCHAR(20) NULL AFTER `tote`,
  ADD COLUMN `tote_number` INTEGER NULL AFTER `tote_simplified`,
  ADD COLUMN `partition` INTEGER NULL AFTER `tote_number`,
  ADD COLUMN `handover` VARCHAR(100) NOT NULL DEFAULT '' AFTER `partition`,
  ADD INDEX `idx_sbit_handover_injested` (`handover`, `injested_at`);

CREATE TABLE `pid_hunter_tote_reservations` (
  `tote_id` VARCHAR(12) NOT NULL,
  `tote_number` INTEGER NOT NULL,
  `expires_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `uniq_pid_hunter_reservation_number` (`tote_number`),
  INDEX `idx_pid_hunter_reservation_expiry` (`expires_at`),
  PRIMARY KEY (`tote_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
