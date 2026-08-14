-- Additive-only authentication migration. No rows or columns are removed.
-- APPROVED is the default so every existing production user keeps access.
ALTER TABLE `User`
    ADD COLUMN `role` ENUM('USER', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER',
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedBy` VARCHAR(64) NULL,
    ADD COLUMN `rejectionReason` VARCHAR(255) NULL;

CREATE INDEX `User_status_createdAt_idx` ON `User`(`status`, `createdAt`);
