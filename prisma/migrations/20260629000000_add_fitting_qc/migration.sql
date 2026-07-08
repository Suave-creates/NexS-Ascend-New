-- CreateTable
CREATE TABLE IF NOT EXISTS `FittingScan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(191) NOT NULL,
    `line_number` VARCHAR(191) NOT NULL,
    `nose_pad_pid` VARCHAR(191) NOT NULL,
    `tip_fitting_pid` VARCHAR(191) NOT NULL,
    `lens_fitting_pid` VARCHAR(191) NOT NULL,
    `tip_bending_pid` VARCHAR(191) NOT NULL,
    `front_align_pid` VARCHAR(191) NOT NULL,
    `frame_align_pid` VARCHAR(191) NOT NULL,
    `is_rework` BOOLEAN NOT NULL DEFAULT false,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_FittingScan_barcode`(`barcode`),
    INDEX `idx_FittingScan_line_ts`(`line_number`, `timestamp`),
    INDEX `idx_FittingScan_ts`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `QcScan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode` VARCHAR(191) NOT NULL,
    `qc_person` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_QcScan_barcode`(`barcode`),
    INDEX `idx_QcScan_status_ts`(`status`, `timestamp`),
    INDEX `idx_QcScan_reason`(`reason`),
    INDEX `idx_QcScan_ts`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
