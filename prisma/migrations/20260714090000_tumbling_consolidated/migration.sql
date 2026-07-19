-- Tumbling Process Management plugin — consolidated 3-table design.
-- Supersedes the earlier 7-table migration (20260714070000_add_tumbling).
-- If your database already has TumblingStation / TumblingProcessProduct /
-- TumblingProcessEvent / TumblingUserRole / an old-shape TumblingContainer,
-- TumblingProcess, or TumblingConfiguration from that earlier migration,
-- drop those first (see the DROP block handed to you separately) before
-- running this file. On a database that never had any Tumbling tables,
-- just run this file as-is.

-- CreateTable
CREATE TABLE IF NOT EXISTS `TumblingContainer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stationNumber` INTEGER NOT NULL,
    `side` ENUM('LEFT', 'RIGHT') NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TumblingContainer_stationNumber_idx`(`stationNumber`),
    UNIQUE INDEX `TumblingContainer_stationNumber_side_key`(`stationNumber`, `side`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `TumblingProcess` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `processCode` VARCHAR(191) NOT NULL,
    `containerId` INTEGER NOT NULL,
    `status` ENUM('DRAFT', 'RUNNING', 'COMPLETED', 'COMPLETED_EARLY', 'STOPPED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `durationMinutes` INTEGER NOT NULL DEFAULT 720,
    `startedAt` DATETIME(3) NULL,
    `expectedCompletionAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `stoppedAt` DATETIME(3) NULL,
    `completionType` ENUM('AUTOMATIC', 'EARLY', 'STOPPED') NULL,
    `reason` VARCHAR(191) NULL,
    `remarks` TEXT NULL,
    `startedByName` VARCHAR(191) NULL,
    `authorizedByCode` VARCHAR(191) NULL,
    `authorizedByName` VARCHAR(191) NULL,
    `products` JSON NOT NULL,
    `events` JSON NOT NULL,
    `activeSlotContainerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TumblingProcess_processCode_key`(`processCode`),
    UNIQUE INDEX `TumblingProcess_activeSlotContainerId_key`(`activeSlotContainerId`),
    INDEX `TumblingProcess_status_idx`(`status`),
    INDEX `TumblingProcess_containerId_idx`(`containerId`),
    INDEX `TumblingProcess_startedAt_idx`(`startedAt`),
    INDEX `TumblingProcess_expectedCompletionAt_idx`(`expectedCompletionAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `TumblingConfiguration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `defaultDurationMinutes` INTEGER NOT NULL DEFAULT 720,
    `additionalFieldLabel` VARCHAR(191) NOT NULL DEFAULT 'Additional Reference',
    `nearCompletionThresholdMinutes` INTEGER NOT NULL DEFAULT 60,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey (new table only — no existing table is altered)
ALTER TABLE `TumblingProcess` ADD CONSTRAINT `TumblingProcess_containerId_fkey` FOREIGN KEY (`containerId`) REFERENCES `TumblingContainer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed: 44 containers (22 stations x Left/Right), idempotent via the unique
-- (stationNumber, side) index above.
INSERT IGNORE INTO `TumblingContainer` (`stationNumber`, `side`, `displayName`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'LEFT', 'Left Container', true, NOW(), NOW()), (1, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(2, 'LEFT', 'Left Container', true, NOW(), NOW()), (2, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(3, 'LEFT', 'Left Container', true, NOW(), NOW()), (3, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(4, 'LEFT', 'Left Container', true, NOW(), NOW()), (4, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(5, 'LEFT', 'Left Container', true, NOW(), NOW()), (5, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(6, 'LEFT', 'Left Container', true, NOW(), NOW()), (6, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(7, 'LEFT', 'Left Container', true, NOW(), NOW()), (7, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(8, 'LEFT', 'Left Container', true, NOW(), NOW()), (8, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(9, 'LEFT', 'Left Container', true, NOW(), NOW()), (9, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(10, 'LEFT', 'Left Container', true, NOW(), NOW()), (10, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(11, 'LEFT', 'Left Container', true, NOW(), NOW()), (11, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(12, 'LEFT', 'Left Container', true, NOW(), NOW()), (12, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(13, 'LEFT', 'Left Container', true, NOW(), NOW()), (13, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(14, 'LEFT', 'Left Container', true, NOW(), NOW()), (14, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(15, 'LEFT', 'Left Container', true, NOW(), NOW()), (15, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(16, 'LEFT', 'Left Container', true, NOW(), NOW()), (16, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(17, 'LEFT', 'Left Container', true, NOW(), NOW()), (17, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(18, 'LEFT', 'Left Container', true, NOW(), NOW()), (18, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(19, 'LEFT', 'Left Container', true, NOW(), NOW()), (19, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(20, 'LEFT', 'Left Container', true, NOW(), NOW()), (20, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(21, 'LEFT', 'Left Container', true, NOW(), NOW()), (21, 'RIGHT', 'Right Container', true, NOW(), NOW()),
(22, 'LEFT', 'Left Container', true, NOW(), NOW()), (22, 'RIGHT', 'Right Container', true, NOW(), NOW());

-- Seed: single configuration row (id=1), idempotent — INSERT IGNORE skips on
-- primary-key conflict if it already exists.
INSERT IGNORE INTO `TumblingConfiguration` (`id`, `defaultDurationMinutes`, `additionalFieldLabel`, `nearCompletionThresholdMinutes`, `updatedAt`) VALUES
(1, 720, 'Additional Reference', 60, NOW());
