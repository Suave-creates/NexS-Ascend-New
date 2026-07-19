-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeCode` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_employeeCode_key`(`employeeCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingMetadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shippingID` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ShippingMetadata_shippingID_key`(`shippingID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackingScan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` VARCHAR(191) NOT NULL,
    `stationId` VARCHAR(191) NOT NULL,
    `nexsId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DispatchScan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` VARCHAR(191) NOT NULL,
    `stationId` VARCHAR(191) NOT NULL,
    `nexsId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationsMetadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` VARCHAR(191) NOT NULL,
    `city_odd` VARCHAR(191) NOT NULL,
    `ship_to_cust` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceShopIssue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pid` VARCHAR(191) NOT NULL,
    `partName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `rate` DOUBLE NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `total` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NULL,
    `destination` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fasttrackscan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` VARCHAR(191) NOT NULL,
    `city_odd` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FR0Scan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` VARCHAR(191) NOT NULL,
    `stationId` VARCHAR(191) NOT NULL,
    `nexsId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BulkScan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` VARCHAR(191) NOT NULL,
    `stationId` VARCHAR(191) NOT NULL,
    `nexsId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ManualWarehouse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scanId` VARCHAR(191) NOT NULL,
    `stationId` VARCHAR(191) NOT NULL,
    `nexsId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EHSDeviation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `month` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `timeOfRound` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `responsibleDepartment` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `observations` TEXT NOT NULL,
    `photographBefore` VARCHAR(500) NULL,
    `controlMeasures` TEXT NOT NULL,
    `photographAfter` VARCHAR(500) NULL,
    `categorization` VARCHAR(191) NOT NULL DEFAULT 'Yellow',
    `remarksByDepartment` TEXT NULL,
    `complianceStatus` VARCHAR(191) NOT NULL DEFAULT 'Open',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `complianceDate` DATETIME(3) NULL,

    INDEX `EHSDeviation_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
