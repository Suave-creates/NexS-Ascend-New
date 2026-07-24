ALTER TABLE `scanned_barcode_inventory`
  ADD COLUMN `nexs_location` VARCHAR(255) NULL AFTER `scan_location`;

ALTER TABLE `scanned_barcode_inventory_transfer`
  ADD COLUMN `nexs_location` VARCHAR(255) NULL AFTER `scan_location`;
