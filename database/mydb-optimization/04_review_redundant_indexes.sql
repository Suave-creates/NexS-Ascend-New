-- =============================================================================
-- 04_review_redundant_indexes.sql   (OPTIONAL -- review before running)
-- -----------------------------------------------------------------------------
-- Purpose : Remove duplicate / unused secondary indexes identified in
--           00_analysis_report.md §6. Dropping indexes speeds up writes and
--           shrinks storage, but is only safe once you've confirmed nothing
--           outside src/app/api relies on them (BI tools, ad-hoc queries, etc.).
--
-- Engine  : MySQL 8.0+. Run via a client that supports DELIMITER.
-- Safety  : Each drop is guarded -- it only runs if the index actually exists,
--           so a wrong/renamed index name is a harmless no-op. Online by default.
--
-- STEP 1 : Inspect what exists today (Prisma may name indexes differently across
--          versions). Adjust the index names in STEP 3 to match this output.
-- =============================================================================

-- STEP 1 -- current indexes on the affected tables -----------------------------
SELECT TABLE_NAME,
       INDEX_NAME,
       NON_UNIQUE,
       GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS columns
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'mydb'
  AND TABLE_NAME IN (
    'ManualWarehouseSetUp',
    'scanned_barcode_inventory',
    'scanned_barcode_inventory_transfer',
    'FR0BulkHOTO',
    'order_update_dashboard_study'
  )
GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE
ORDER BY TABLE_NAME, INDEX_NAME;

-- STEP 2 -- guarded drop helper (online) ---------------------------------------
DROP PROCEDURE IF EXISTS `mydb`.`_drop_index_if_exists`;
DELIMITER //
CREATE PROCEDURE `mydb`.`_drop_index_if_exists`(
  IN p_schema VARCHAR(64),
  IN p_table  VARCHAR(64),
  IN p_index  VARCHAR(64)
)
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = p_schema AND TABLE_NAME = p_table AND INDEX_NAME = p_index
  ) THEN
    -- algorithm/lock options are SPACE-separated in DROP INDEX (no comma).
    SET @ddl = CONCAT('DROP INDEX `', p_index, '` ON `', p_schema, '`.`', p_table, '` ',
                      'ALGORITHM=INPLACE LOCK=NONE');
    PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;
    SELECT CONCAT('DROPPED  ', p_index, ' ON ', p_table) AS result;
  ELSE
    SELECT CONCAT('SKIPPED  ', p_index, ' (not present on ', p_table, ')') AS result;
  END IF;
END //
DELIMITER ;

-- STEP 3 -- definitely-redundant DUPLICATE indexes (safe to drop) --------------

-- ManualWarehouseSetUp: `pid` is already UNIQUE (ManualWarehouseSetUp_pid_key),
-- so the extra plain index on `pid` is a pure duplicate.
CALL `mydb`.`_drop_index_if_exists`('mydb','ManualWarehouseSetUp','ManualWarehouseSetUp_pid_idx');

-- scanned_barcode_inventory: UNIQUE(barcode, scan_location) already covers any
-- `barcode`-leading lookup, so the standalone `barcode` index is redundant.
CALL `mydb`.`_drop_index_if_exists`('mydb','scanned_barcode_inventory','scanned_barcode_inventory_barcode_idx');

-- scanned_barcode_inventory_transfer: same -- UNIQUE(barcode, scan_location) covers it.
CALL `mydb`.`_drop_index_if_exists`('mydb','scanned_barcode_inventory_transfer','scanned_barcode_inventory_transfer_barcode_idx');

-- FR0BulkHOTO: single-column `scanId` index is superseded by the composite
-- (scanId, timestamp) created in 02. Drop only AFTER 02 has run successfully.
CALL `mydb`.`_drop_index_if_exists`('mydb','FR0BulkHOTO','FR0BulkHOTO_scanId_idx');

-- STEP 4 -- UNUSED indexes: REVIEW, do not drop blindly --------------------------
-- order_update_dashboard_study is TRUNCATE+bulk-loaded; only `fitting_id` is read
-- by src/app/api (order-prod). The indexes on order_id / updated_fitting_id /
-- station_id / sku are NOT used by any mydb API route and slow every bulk load.
-- They may, however, back an external dashboard/BI consumer (the table name
-- suggests it). Confirm with information_schema + your BI owners, then uncomment:
--
-- CALL `mydb`.`_drop_index_if_exists`('mydb','order_update_dashboard_study','order_update_dashboard_study_order_id_idx');
-- CALL `mydb`.`_drop_index_if_exists`('mydb','order_update_dashboard_study','order_update_dashboard_study_updated_fitting_id_idx');
-- CALL `mydb`.`_drop_index_if_exists`('mydb','order_update_dashboard_study','order_update_dashboard_study_station_id_idx');
-- CALL `mydb`.`_drop_index_if_exists`('mydb','order_update_dashboard_study','order_update_dashboard_study_sku_idx');
--
-- Likewise ManualWarehouseSetUp `location` is never filtered by src/app/api:
-- CALL `mydb`.`_drop_index_if_exists`('mydb','ManualWarehouseSetUp','ManualWarehouseSetUp_location_idx');
--
-- Tip: on MySQL 8 with sys schema, confirm zero usage first:
--   SELECT * FROM sys.schema_unused_indexes WHERE object_schema = 'mydb';

-- Clean up helper.
DROP PROCEDURE IF EXISTS `mydb`.`_drop_index_if_exists`;

-- NOTE: After dropping any index, remove the matching @@index line from
--       prisma/schema.prisma so `prisma migrate` does not recreate it (see report §7).
-- =============================================================================
