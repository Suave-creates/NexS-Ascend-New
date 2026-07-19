-- =============================================================================
-- 99_rollback.sql
-- -----------------------------------------------------------------------------
-- Reverses the changes made by 02 (indexes) and 03 (archive/purge). Each section
-- is independent and individually runnable -- run only the part you need.
--
-- Engine : MySQL 8.0+. Run via a client that supports DELIMITER.
-- Safety : Index drops and re-inserts are guarded / idempotent. Section C is
--          destructive (drops the whole history schema) and is commented out.
-- =============================================================================


-- =============================================================================
-- SECTION A -- Restore purged rows  (undo 03_archive_and_purge.sql)
-- -----------------------------------------------------------------------------
-- Copies everything still held in mydb_history back into the live mydb tables.
-- INSERT IGNORE means rows that already survive in mydb are left untouched and
-- only the deleted ones are re-created. Safe to run more than once.
-- Only the tables that 03 actually purges are listed here.
-- =============================================================================
DROP PROCEDURE IF EXISTS `mydb`.`_restore_from_history`;
DELIMITER //
CREATE PROCEDURE `mydb`.`_restore_from_history`(IN p_table VARCHAR(64))
BEGIN
  SET @q = CONCAT(
    'INSERT IGNORE INTO `mydb`.`', p_table, '` ',
    'SELECT * FROM `mydb_history`.`', p_table, '`'
  );
  PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;
  SELECT p_table AS restored_table, ROW_COUNT() AS rows_reinserted;
END //
DELIMITER ;

CALL `mydb`.`_restore_from_history`('PackingScan');
CALL `mydb`.`_restore_from_history`('DispatchScan');
CALL `mydb`.`_restore_from_history`('BulkScan');
CALL `mydb`.`_restore_from_history`('FR0Scan');
CALL `mydb`.`_restore_from_history`('CLScans');
CALL `mydb`.`_restore_from_history`('ManualWarehouse');
CALL `mydb`.`_restore_from_history`('FR0BulkHOTO');
CALL `mydb`.`_restore_from_history`('fasttrackscan');
CALL `mydb`.`_restore_from_history`('CourierHandover');
CALL `mydb`.`_restore_from_history`('MetalFrameFittingScan');
CALL `mydb`.`_restore_from_history`('ndd_shipments');
CALL `mydb`.`_restore_from_history`('MaintenanceShopIssue');
CALL `mydb`.`_restore_from_history`('scanned_barcode_inventory_transfer');

DROP PROCEDURE IF EXISTS `mydb`.`_restore_from_history`;


-- =============================================================================
-- SECTION B -- Drop the indexes created by 02_create_indexes.sql
-- -----------------------------------------------------------------------------
-- Guarded + online. Does NOT touch pre-existing indexes (e.g. EHSDeviation.date,
-- the unique keys, order_update_dashboard_study.fitting_id).
-- =============================================================================
DROP PROCEDURE IF EXISTS `mydb`.`_drop_index_if_exists`;
DELIMITER //
CREATE PROCEDURE `mydb`.`_drop_index_if_exists`(
  IN p_schema VARCHAR(64), IN p_table VARCHAR(64), IN p_index VARCHAR(64)
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = p_schema AND TABLE_NAME = p_table AND INDEX_NAME = p_index
  ) THEN
    SET @ddl = CONCAT('DROP INDEX `', p_index, '` ON `', p_schema, '`.`', p_table, '` ',
                      'ALGORITHM=INPLACE LOCK=NONE');
    PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

CALL `mydb`.`_drop_index_if_exists`('mydb','PackingScan','idx_PackingScan_scanId');
CALL `mydb`.`_drop_index_if_exists`('mydb','PackingScan','idx_PackingScan_station_ts');
CALL `mydb`.`_drop_index_if_exists`('mydb','DispatchScan','idx_DispatchScan_scanId');
CALL `mydb`.`_drop_index_if_exists`('mydb','DispatchScan','idx_DispatchScan_station_ts');
CALL `mydb`.`_drop_index_if_exists`('mydb','BulkScan','idx_BulkScan_scanId');
CALL `mydb`.`_drop_index_if_exists`('mydb','BulkScan','idx_BulkScan_station_ts');
CALL `mydb`.`_drop_index_if_exists`('mydb','FR0Scan','idx_FR0Scan_scanId');
CALL `mydb`.`_drop_index_if_exists`('mydb','FR0Scan','idx_FR0Scan_station_created');
CALL `mydb`.`_drop_index_if_exists`('mydb','CLScans','idx_CLScans_scanId');
CALL `mydb`.`_drop_index_if_exists`('mydb','CLScans','idx_CLScans_station_created');
CALL `mydb`.`_drop_index_if_exists`('mydb','ManualWarehouse','idx_ManualWarehouse_timestamp');
CALL `mydb`.`_drop_index_if_exists`('mydb','FR0BulkHOTO','idx_FR0BulkHOTO_scanId_ts');
CALL `mydb`.`_drop_index_if_exists`('mydb','CourierHandover','idx_CourierHandover_partner_awb');
CALL `mydb`.`_drop_index_if_exists`('mydb','OperationsMetadata','idx_OperationsMetadata_location_id');
CALL `mydb`.`_drop_index_if_exists`('mydb','scanned_barcode_inventory','idx_sbi_location_scanned');
CALL `mydb`.`_drop_index_if_exists`('mydb','ndd_shipments','idx_ndd_created_at');
CALL `mydb`.`_drop_index_if_exists`('mydb','ndd_shipments','idx_ndd_awb');

DROP PROCEDURE IF EXISTS `mydb`.`_drop_index_if_exists`;


-- =============================================================================
-- SECTION C -- Tear down the history schema  (DESTRUCTIVE -- commented out)
-- -----------------------------------------------------------------------------
-- Only run this once you are certain you no longer need the archive, AND you have
-- already run SECTION A if you wanted the data back in mydb. This permanently
-- deletes all archived rows.
-- =============================================================================
-- DROP DATABASE IF EXISTS `mydb_history`;
-- =============================================================================
