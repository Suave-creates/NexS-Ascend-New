CREATE TABLE IF NOT EXISTS `cl_cls_qc_queue_entries` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `barcode` VARCHAR(191) NOT NULL,
  `fitting_id` VARCHAR(191) NULL,
  `shipping_package_id` VARCHAR(191) NOT NULL,
  `state` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `last_error` TEXT NULL,
  `first_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completed_at` DATETIME(3) NULL,
  UNIQUE INDEX `cl_cls_qc_queue_entries_barcode_key` (`barcode`),
  INDEX `cl_cls_qc_queue_entries_state_last_seen_at_idx` (`state`, `last_seen_at`),
  INDEX `cl_cls_qc_queue_entries_shipping_package_id_idx` (`shipping_package_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
