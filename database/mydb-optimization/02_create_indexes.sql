-- =============================================================================
-- 02_create_indexes.sql
-- -----------------------------------------------------------------------------
-- Purpose : Create ONLY the indexes justified by real query patterns observed in
--           src/app/api against the `mydb` Prisma client (see 00_analysis_report).
--
-- Engine  : MySQL 8.0+ (InnoDB). Run via a client that supports DELIMITER
--           (mysql CLI, MySQL Workbench, DBeaver).
--
-- Safety  : * Idempotent  -- each index is created only if absent (checked in
--             information_schema.STATISTICS). Re-running is a no-op.
--           * Online DDL  -- ALGORITHM=INPLACE, LOCK=NONE lets concurrent reads
--             AND writes continue while a secondary index is built. If the server
--             cannot honour LOCK=NONE for a given index it raises an error rather
--             than silently locking; see fallback note at the bottom.
--           * No application logic is touched.
--
-- Prisma  : Indexes added here are invisible to Prisma. To stop `prisma migrate`
--           from trying to drop them later, mirror them in prisma/schema.prisma
--           (the exact @@index lines are listed in 00_analysis_report.md §7).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helper: create an index only if it does not already exist, using online DDL.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `mydb`.`_create_index_if_absent`;
DELIMITER //
CREATE PROCEDURE `mydb`.`_create_index_if_absent`(
  IN p_schema VARCHAR(64),
  IN p_table  VARCHAR(64),
  IN p_index  VARCHAR(64),
  IN p_cols   VARCHAR(512)   -- already backtick-quoted, comma-separated
)
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = p_schema
      AND TABLE_NAME   = p_table
      AND INDEX_NAME   = p_index
  ) THEN
    -- NOTE: in CREATE INDEX, algorithm/lock options are SPACE-separated (no comma;
    -- the comma form is only valid inside ALTER TABLE).
    SET @ddl = CONCAT(
      'CREATE INDEX `', p_index, '` ON `', p_schema, '`.`', p_table, '` (', p_cols, ') ',
      'ALGORITHM=INPLACE LOCK=NONE'
    );
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SELECT CONCAT('CREATED  ', p_index, ' ON ', p_table) AS result;
  ELSE
    SELECT CONCAT('SKIPPED  ', p_index, ' (already exists on ', p_table, ')') AS result;
  END IF;
END //
DELIMITER ;

-- =============================================================================
-- SCAN TABLES
-- Pattern per scan API: POST does findFirst({where:{scanId}}) duplicate check;
-- stats GET does count/findMany({where:{stationId, <ts> >= ...}}).
-- => one index on scanId (equality dedup) + one composite (stationId, <ts>).
-- =============================================================================

-- PackingScan  (POST /api/packing, GET /api/packing/stats)
CALL `mydb`.`_create_index_if_absent`('mydb','PackingScan','idx_PackingScan_scanId',        '`scanId`');
CALL `mydb`.`_create_index_if_absent`('mydb','PackingScan','idx_PackingScan_station_ts',     '`stationId`, `timestamp`');

-- DispatchScan (POST /api/dispatch, GET /api/dispatch/stats)
CALL `mydb`.`_create_index_if_absent`('mydb','DispatchScan','idx_DispatchScan_scanId',       '`scanId`');
CALL `mydb`.`_create_index_if_absent`('mydb','DispatchScan','idx_DispatchScan_station_ts',    '`stationId`, `timestamp`');

-- BulkScan     (POST /api/bulk, GET /api/bulk/stats)
CALL `mydb`.`_create_index_if_absent`('mydb','BulkScan','idx_BulkScan_scanId',               '`scanId`');
CALL `mydb`.`_create_index_if_absent`('mydb','BulkScan','idx_BulkScan_station_ts',            '`stationId`, `timestamp`');

-- FR0Scan      (POST /api/fr0, GET /api/fr0/stats -- stats orders/distincts on createdAt)
CALL `mydb`.`_create_index_if_absent`('mydb','FR0Scan','idx_FR0Scan_scanId',                 '`scanId`');
CALL `mydb`.`_create_index_if_absent`('mydb','FR0Scan','idx_FR0Scan_station_created',         '`stationId`, `createdAt`');

-- CLScans      (POST /api/cl-cls, GET /api/cl-cls/stats)
CALL `mydb`.`_create_index_if_absent`('mydb','CLScans','idx_CLScans_scanId',                 '`scanId`');
CALL `mydb`.`_create_index_if_absent`('mydb','CLScans','idx_CLScans_station_created',         '`stationId`, `createdAt`');

-- ManualWarehouse (GET /api/manual-warehouse/stats: aggregate count WHERE timestamp >= ...)
-- No scanId dedup on this table (POST only inserts) -> single timestamp index.
CALL `mydb`.`_create_index_if_absent`('mydb','ManualWarehouse','idx_ManualWarehouse_timestamp','`timestamp`');

-- FR0BulkHOTO  (POST /api/fr0bulkhoto: findFirst({where:{scanId}, orderBy:{timestamp desc}}))
-- Composite (scanId, timestamp) serves equality + ordered "latest" lookup without
-- a filesort. Makes the existing single-column `FR0BulkHOTO_scanId_idx` redundant
-- (drop it via 04_review_redundant_indexes.sql).
CALL `mydb`.`_create_index_if_absent`('mydb','FR0BulkHOTO','idx_FR0BulkHOTO_scanId_ts',        '`scanId`, `timestamp`');

-- =============================================================================
-- COURIER
-- POST /api/courier/scan : findFirst({where:{partner, awb}})  (dedup)
-- GET  /api/courier/stats: count({where:{partner}})           (prefix of composite)
-- => single composite (partner, awb) serves both.
-- =============================================================================
CALL `mydb`.`_create_index_if_absent`('mydb','CourierHandover','idx_CourierHandover_partner_awb','`partner`, `awb`');

-- =============================================================================
-- OPERATIONS METADATA (reference table, bulk-replaced occasionally)
-- GET /api/operations/metadata and .../tray-scanner: findFirst({where:{locationId}})
-- =============================================================================
CALL `mydb`.`_create_index_if_absent`('mydb','OperationsMetadata','idx_OperationsMetadata_location_id','`location_id`');

-- =============================================================================
-- SCANNED BARCODE INVENTORY (live stock)
-- preview : findMany({where:{scanLocation}, orderBy:{scannedAt desc}})
-- execute : count({where:{scanLocation}}) + raw INSERT..SELECT/DELETE WHERE scan_location
-- => composite (scan_location, scanned_at) covers filter + sort.
-- (Dedup findFirst({barcode, scanLocation}) and deleteMany({barcode}) are already
--  served by the existing UNIQUE(barcode, scan_location); see report.)
-- =============================================================================
CALL `mydb`.`_create_index_if_absent`('mydb','scanned_barcode_inventory','idx_sbi_location_scanned','`scan_location`, `scanned_at`');

-- =============================================================================
-- NDD SHIPMENTS
-- GET  /api/packing-dispatch/ndd-shipment : findMany + groupBy WHERE created_at range,
--                                           orderBy created_at  -> index (created_at)
-- POST (upsert) : deleteMany({where:{awb:{in:[...]}}}) on every write -> index (awb)
-- =============================================================================
CALL `mydb`.`_create_index_if_absent`('mydb','ndd_shipments','idx_ndd_created_at','`created_at`');
CALL `mydb`.`_create_index_if_absent`('mydb','ndd_shipments','idx_ndd_awb',        '`awb`');

-- -----------------------------------------------------------------------------
-- Clean up helper.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `mydb`.`_create_index_if_absent`;

-- -----------------------------------------------------------------------------
-- Verify result:
--   SELECT TABLE_NAME, INDEX_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols
--   FROM information_schema.STATISTICS
--   WHERE TABLE_SCHEMA = 'mydb'
--   GROUP BY TABLE_NAME, INDEX_NAME
--   ORDER BY TABLE_NAME, INDEX_NAME;
--
-- Fallback: if any CREATE fails with "LOCK=NONE is not supported", re-run that one
-- CALL after editing the helper to use `ALGORITHM=INPLACE LOCK=SHARED` (still allows
-- concurrent reads). Adding a plain secondary index on these column types should
-- always support LOCK=NONE on InnoDB 5.6+.
-- (Reminder: in CREATE/DROP INDEX these options are space-separated, not comma-separated.)
-- =============================================================================
