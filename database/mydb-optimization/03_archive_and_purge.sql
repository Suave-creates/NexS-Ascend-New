-- =============================================================================
-- 03_archive_and_purge.sql
-- -----------------------------------------------------------------------------
-- Purpose : Data-retention cleanup for `mydb`. For each ELIGIBLE event/log table,
--           archive rows older than 6 months into `mydb_history`, then delete them
--           from `mydb` in small batches (no long locks).
--
-- Prereq  : Run 01_create_history_schema.sql first (history tables must exist).
-- Engine  : MySQL 8.0+ (InnoDB). Run via a client that supports DELIMITER.
--
-- Safety  : * Archive-before-delete: a row is copied to history and only then
--             removed, batch by batch, inside the same loop -> no data loss.
--           * INSERT IGNORE keeps it idempotent: re-running skips rows already
--             archived (same PK) and simply purges whatever is still older than
--             the cutoff.
--           * Batched DELETE (default 2000 rows) + a short SLEEP between batches
--             keeps transactions tiny and lets concurrent traffic through.
--           * A single cutoff timestamp (@cutoff) is computed ONCE so every table
--             uses the exact same 6-month boundary for this run.
--
-- ROLLBACK: 99_rollback.sql restores archived rows from mydb_history back into mydb.
--
-- !!  SCOPE DECISION (read 00_analysis_report.md §8) ---------------------------
--     Only true append-only EVENT/LOG tables are purged below. State, master-data
--     and compliance tables are intentionally EXCLUDED because age-based deletion
--     would corrupt live data:
--       - User                       (auth accounts; deleting = lockout)
--       - ShippingMetadata           (reference; app does full-refresh, no ts)
--       - OperationsMetadata         (reference; full-refresh, no ts)
--       - ManualWarehouseSetUp       (PID->location master data; createdAt != expiry)
--       - InventoryPID               (reference, no ts)
--       - scanned_barcode_inventory  (LIVE stock; purge would drop current inventory)
--       - order_update_dashboard_study (snapshot; TRUNCATE+reload each upload)
--       - EHSDeviation               (safety/compliance; retain per policy, usually >6mo)
--     To opt any of these in later, add a CALL with its timestamp column -- but
--     confirm the retention policy first.
-- =============================================================================

-- Fixed cutoff for this run (6 months ago).  Change INTERVAL to re-scope.
SET @cutoff := (NOW() - INTERVAL 6 MONTH);
SELECT CONCAT('Purging rows strictly older than: ', @cutoff) AS info;

-- -----------------------------------------------------------------------------
-- Reusable archive + batched purge procedure.
--   p_table  : table name present in BOTH mydb and mydb_history
--   p_ts_col : timestamp column to compare against the cutoff
--   p_cutoff : cutoff datetime (pass @cutoff so all tables share one boundary)
--   p_batch  : rows per delete batch
--   p_sleep  : seconds to pause between batches
-- Assumes an integer/bigint surrogate PK named `id` (true for every eligible table).
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `mydb`.`_archive_and_purge`;
DELIMITER //
CREATE PROCEDURE `mydb`.`_archive_and_purge`(
  IN p_table  VARCHAR(64),
  IN p_ts_col VARCHAR(64),
  IN p_cutoff DATETIME,
  IN p_batch  INT,
  IN p_sleep  DECIMAL(4,2)
)
BEGIN
  DECLARE v_rows     INT DEFAULT 1;
  DECLARE v_archived BIGINT DEFAULT 0;
  DECLARE v_purged   BIGINT DEFAULT 0;

  -- Per-connection staging table for the current batch of PKs.
  CREATE TEMPORARY TABLE IF NOT EXISTS `_purge_ids` (`id` BIGINT PRIMARY KEY);
  DELETE FROM `_purge_ids`;

  retention_loop: LOOP
    -- 1) Grab a batch of PKs older than the cutoff.
    DELETE FROM `_purge_ids`;
    SET @q_pick = CONCAT(
      'INSERT INTO `_purge_ids` (`id`) ',
      'SELECT `id` FROM `mydb`.`', p_table, '` ',
      'WHERE `', p_ts_col, '` < ''', p_cutoff, ''' ',
      'ORDER BY `id` LIMIT ', p_batch
    );
    PREPARE s FROM @q_pick; EXECUTE s; DEALLOCATE PREPARE s;
    -- Count the staging table directly. DO NOT use ROW_COUNT() here: DEALLOCATE
    -- PREPARE resets it to 0, which would make this loop a silent no-op.
    SELECT COUNT(*) INTO v_rows FROM `_purge_ids`;
    IF v_rows = 0 THEN
      LEAVE retention_loop;
    END IF;

    -- 2) Archive that exact batch (idempotent on PK collision).
    SET @q_arch = CONCAT(
      'INSERT IGNORE INTO `mydb_history`.`', p_table, '` ',
      'SELECT m.* FROM `mydb`.`', p_table, '` m ',
      'JOIN `_purge_ids` p ON m.`id` = p.`id`'
    );
    PREPARE s FROM @q_arch; EXECUTE s; SET v_archived = v_archived + ROW_COUNT(); DEALLOCATE PREPARE s;

    -- 3) Delete that exact batch from the live table.
    SET @q_del = CONCAT(
      'DELETE m FROM `mydb`.`', p_table, '` m ',
      'JOIN `_purge_ids` p ON m.`id` = p.`id`'
    );
    PREPARE s FROM @q_del; EXECUTE s; SET v_purged = v_purged + ROW_COUNT(); DEALLOCATE PREPARE s;

    -- 4) Breathe: let other transactions run between batches.
    IF p_sleep > 0 THEN DO SLEEP(p_sleep); END IF;
  END LOOP;

  DROP TEMPORARY TABLE IF EXISTS `_purge_ids`;
  SELECT p_table AS table_name, v_archived AS archived_rows, v_purged AS purged_rows;
END //
DELIMITER ;

-- -----------------------------------------------------------------------------
-- Eligible EVENT / LOG tables  (table, timestamp column, cutoff, batch, sleep)
-- -----------------------------------------------------------------------------
CALL `mydb`.`_archive_and_purge`('PackingScan',                        'timestamp',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('DispatchScan',                       'timestamp',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('BulkScan',                           'timestamp',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('FR0Scan',                            'createdAt',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('CLScans',                            'createdAt',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('ManualWarehouse',                    'timestamp',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('FR0BulkHOTO',                        'timestamp',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('fasttrackscan',                      'time',       @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('CourierHandover',                    'lastScan',   @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('MetalFrameFittingScan',              'timestamp',  @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('ndd_shipments',                      'created_at', @cutoff, 2000, 0.20);
CALL `mydb`.`_archive_and_purge`('MaintenanceShopIssue',               'issuedAt',   @cutoff, 1000, 0.20);
CALL `mydb`.`_archive_and_purge`('scanned_barcode_inventory_transfer', 'injested_at',@cutoff, 2000, 0.20);

-- -----------------------------------------------------------------------------
-- Clean up helper.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `mydb`.`_archive_and_purge`;

-- -----------------------------------------------------------------------------
-- Verify (rows remaining older than cutoff should be 0 for each table above):
--   SELECT 'PackingScan' t, COUNT(*) older_than_cutoff
--   FROM `mydb`.`PackingScan` WHERE `timestamp` < (NOW() - INTERVAL 6 MONTH);
-- =============================================================================
