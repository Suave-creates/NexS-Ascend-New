-- =============================================================================
-- 05_schedule_retention_event.sql
-- -----------------------------------------------------------------------------
-- Purpose : Make the 6-month retention cleanup RECURRING via a server-side MySQL
--           EVENT (chosen because mydb is on a private IP that an external/cloud
--           scheduler cannot reach). Creates two stored procedures + a monthly
--           event that archives >6-month rows into mydb_history then batch-deletes.
--
-- Prereq  : 01_create_history_schema.sql (history tables must exist).
-- Engine  : MySQL 8.0+. Run via a client that supports DELIMITER.
-- Privs   : CREATE ROUTINE, EVENT, and (to start the scheduler) a privilege that
--           allows SET GLOBAL event_scheduler (SUPER or SYSTEM_VARIABLES_ADMIN).
--
-- Idempotent: DROP ... IF EXISTS before each CREATE; CREATE EVENT IF NOT EXISTS.
--
-- NOTE (bug-class to avoid): do NOT read ROW_COUNT() after DEALLOCATE PREPARE --
--       DEALLOCATE resets it to 0 and the purge loop becomes a silent no-op.
--       We count the staging table directly instead.
-- =============================================================================

-- ── Generic helper: archive + batched-delete ONE table older than 6 months ────
DROP PROCEDURE IF EXISTS `mydb`.`sp_archive_purge_table`;
DELIMITER //
CREATE PROCEDURE `mydb`.`sp_archive_purge_table`(
  IN p_table  VARCHAR(64),
  IN p_ts_col VARCHAR(64),
  IN p_batch  INT
)
BEGIN
  DECLARE v_rows INT DEFAULT 1;
  CREATE TEMPORARY TABLE IF NOT EXISTS `_rp_ids` (`id` BIGINT PRIMARY KEY);
  DELETE FROM `_rp_ids`;

  WHILE v_rows > 0 DO
    DELETE FROM `_rp_ids`;
    SET @pick = CONCAT(
      'INSERT INTO `_rp_ids` (`id`) SELECT `id` FROM `mydb`.`', p_table, '` ',
      'WHERE `', p_ts_col, '` < (NOW() - INTERVAL 6 MONTH) ORDER BY `id` LIMIT ', p_batch
    );
    PREPARE s FROM @pick; EXECUTE s; DEALLOCATE PREPARE s;

    -- Count staging directly (ROW_COUNT() is reset by DEALLOCATE PREPARE).
    SELECT COUNT(*) INTO v_rows FROM `_rp_ids`;

    IF v_rows > 0 THEN
      SET @arch = CONCAT(
        'INSERT IGNORE INTO `mydb_history`.`', p_table, '` ',
        'SELECT m.* FROM `mydb`.`', p_table, '` m JOIN `_rp_ids` p ON m.`id` = p.`id`'
      );
      PREPARE s FROM @arch; EXECUTE s; DEALLOCATE PREPARE s;

      SET @del = CONCAT(
        'DELETE m FROM `mydb`.`', p_table, '` m JOIN `_rp_ids` p ON m.`id` = p.`id`'
      );
      PREPARE s FROM @del; EXECUTE s; DEALLOCATE PREPARE s;

      DO SLEEP(0.1);
    END IF;
  END WHILE;

  DROP TEMPORARY TABLE IF EXISTS `_rp_ids`;
END //
DELIMITER ;

-- ── Orchestrator: purge every eligible event/log table (see report §8) ────────
DROP PROCEDURE IF EXISTS `mydb`.`sp_retention_purge`;
DELIMITER //
CREATE PROCEDURE `mydb`.`sp_retention_purge`()
BEGIN
  CALL `mydb`.`sp_archive_purge_table`('PackingScan',                        'timestamp',   5000);
  CALL `mydb`.`sp_archive_purge_table`('DispatchScan',                       'timestamp',   5000);
  CALL `mydb`.`sp_archive_purge_table`('BulkScan',                           'timestamp',   5000);
  CALL `mydb`.`sp_archive_purge_table`('FR0Scan',                            'createdAt',   5000);
  CALL `mydb`.`sp_archive_purge_table`('CLScans',                            'createdAt',   5000);
  CALL `mydb`.`sp_archive_purge_table`('ManualWarehouse',                    'timestamp',   5000);
  CALL `mydb`.`sp_archive_purge_table`('FR0BulkHOTO',                        'timestamp',   5000);
  CALL `mydb`.`sp_archive_purge_table`('fasttrackscan',                      'time',        5000);
  CALL `mydb`.`sp_archive_purge_table`('CourierHandover',                    'lastScan',    5000);
  CALL `mydb`.`sp_archive_purge_table`('MetalFrameFittingScan',              'timestamp',   5000);
  CALL `mydb`.`sp_archive_purge_table`('ndd_shipments',                      'created_at',  5000);
  CALL `mydb`.`sp_archive_purge_table`('MaintenanceShopIssue',               'issuedAt',    5000);
  CALL `mydb`.`sp_archive_purge_table`('scanned_barcode_inventory_transfer', 'injested_at', 5000);
END //
DELIMITER ;

-- ── Monthly event: 1st of next month at 02:00 (server runs in IST) ────────────
DROP EVENT IF EXISTS `mydb`.`ev_retention_purge_monthly`;
CREATE EVENT IF NOT EXISTS `mydb`.`ev_retention_purge_monthly`
ON SCHEDULE EVERY 1 MONTH
  STARTS (DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') + INTERVAL 1 MONTH + INTERVAL 2 HOUR)
ON COMPLETION PRESERVE
COMMENT 'Archive rows >6 months into mydb_history, then batched delete'
DO
  CALL `mydb`.`sp_retention_purge`();

-- ── Ensure the scheduler is running ───────────────────────────────────────────
SET GLOBAL event_scheduler = ON;

-- ── Verify ────────────────────────────────────────────────────────────────────
-- SELECT EVENT_NAME, STATUS, INTERVAL_VALUE, INTERVAL_FIELD, STARTS, LAST_EXECUTED
-- FROM information_schema.EVENTS WHERE EVENT_SCHEMA = 'mydb';
--
-- Run once on demand (also useful to validate):  CALL `mydb`.`sp_retention_purge`();

-- ── Teardown / rollback ───────────────────────────────────────────────────────
-- DROP EVENT     IF EXISTS `mydb`.`ev_retention_purge_monthly`;
-- DROP PROCEDURE IF EXISTS `mydb`.`sp_retention_purge`;
-- DROP PROCEDURE IF EXISTS `mydb`.`sp_archive_purge_table`;
-- =============================================================================
