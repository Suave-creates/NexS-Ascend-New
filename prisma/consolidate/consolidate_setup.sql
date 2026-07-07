-- ============================================================================
-- ConsolidAte — ONE-SHOT DB setup for the dispatch_ptl database.
-- Schema (additive) + 5x5 grid seed (4 racks x 25 = 100 slots), in one script.
--
--   mysql -h 192.168.27.157 -u Hero -p dispatch_ptl < prisma/consolidate/consolidate_setup.sql
--
-- Safe to re-run (idempotent schema + fresh re-seed).
-- DESTRUCTIVE: clears racks/locations + ConsolidAte consolidation state and
-- reseeds the grid. Legacy AWB rows are left orphaned (that flow is retired);
-- location surrogate ids are NOT reused (auto_increment continues), so nothing
-- mislinks. Slot business key = location_number (1..100) + barcode NXS-PTL-###.
--
-- IMPORTANT: run the WHOLE script in one go (the @vars + PREPARE must run in the
-- same session). In MySQL Workbench use "Execute all" (⚡), not single-line run.
-- ============================================================================

-- Make sure every statement targets the right schema (DATABASE() must not be NULL).
USE dispatch_ptl;

-- 1) locations.current_package_id  (add only if missing) --------------------
SET @add_col := (SELECT COUNT(*) FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'locations'
                   AND COLUMN_NAME = 'current_package_id');
SET @sql := IF(@add_col = 0,
  'ALTER TABLE locations ADD COLUMN current_package_id VARCHAR(191) NULL', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_idx := (SELECT COUNT(*) FROM information_schema.STATISTICS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'locations'
                   AND INDEX_NAME = 'locations_current_package_id_idx');
SET @sql := IF(@add_idx = 0,
  'CREATE INDEX locations_current_package_id_idx ON locations (current_package_id)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) new ConsolidAte tables --------------------------------------------------
CREATE TABLE IF NOT EXISTS qc_dump_entries (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  barcode             VARCHAR(191) NOT NULL,
  shipping_package_id VARCHAR(191) NOT NULL,
  increment_id        VARCHAR(191) NULL,
  item_type           VARCHAR(191) NULL,
  tray_no             VARCHAR(191) NULL,
  current_status      VARCHAR(191) NULL,
  order_created_at    DATETIME(3) NULL,
  order_updated_at    DATETIME(3) NULL,
  first_seen_at       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  last_seen_at        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  in_dump             TINYINT(1) NOT NULL DEFAULT 1,
  scanned             TINYINT(1) NOT NULL DEFAULT 0,
  scanned_at          DATETIME(3) NULL,
  UNIQUE KEY qc_dump_entries_barcode_key (barcode),
  KEY qc_dump_entries_shipping_package_id_idx (shipping_package_id),
  KEY qc_dump_entries_in_dump_idx (in_dump)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS package_consolidations (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  shipping_package_id VARCHAR(191) NOT NULL,
  location_id         INT NULL,
  operator_color      ENUM('YELLOW','BLUE','GREEN','PINK','RED') NULL,
  status              ENUM('PENDING','CONSOLIDATING','COMPLETE','RELEASED') NOT NULL DEFAULT 'PENDING',
  expected_count      INT NOT NULL DEFAULT 0,
  accounted_count     INT NOT NULL DEFAULT 0,
  created_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  completed_at        DATETIME(3) NULL,
  released_at         DATETIME(3) NULL,
  UNIQUE KEY package_consolidations_shipping_package_id_key (shipping_package_id),
  KEY package_consolidations_status_idx (status),
  KEY package_consolidations_location_id_idx (location_id),
  CONSTRAINT package_consolidations_location_id_fkey
    FOREIGN KEY (location_id) REFERENCES locations (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS consolidation_scans (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  shipping_package_id VARCHAR(191) NOT NULL,
  barcode             VARCHAR(191) NOT NULL,
  location_id         INT NOT NULL,
  placed              TINYINT(1) NOT NULL DEFAULT 0,
  scanned_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  placed_at           DATETIME(3) NULL,
  UNIQUE KEY consolidation_scans_pkg_barcode_key (shipping_package_id, barcode),
  KEY consolidation_scans_location_id_idx (location_id),
  CONSTRAINT consolidation_scans_pkg_fkey
    FOREIGN KEY (shipping_package_id) REFERENCES package_consolidations (shipping_package_id),
  CONSTRAINT consolidation_scans_location_id_fkey
    FOREIGN KEY (location_id) REFERENCES locations (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) fresh 5x5 grid seed -----------------------------------------------------
-- SQL_SAFE_UPDATES=0 is required: MySQL Workbench enables "safe updates" which
-- blocks DELETE without a keyed WHERE (Error 1175). This disables it for the session.
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM consolidation_scans;
DELETE FROM package_consolidations;
DELETE FROM locations;
DELETE FROM racks;

INSERT INTO racks (rack_number, total_levels, total_positions, created_at) VALUES
  (1,5,5,NOW()), (2,5,5,NOW()), (3,5,5,NOW()), (4,5,5,NOW());

-- 100 slots: location_number = (rack-1)*25 + (row-1)*5 + col ; slot 1 = rack1 top-left.
INSERT INTO locations
  (rack_id, level, position, location_number, barcode, light_state, is_active, created_at)
SELECT
  r.id,
  ((g.n - 1) % 25) DIV 5 + 1                 AS level,      -- row 1..5
  ((g.n - 1) % 25) % 5 + 1                   AS position,   -- col 1..5
  g.n                                        AS location_number,
  CONCAT('NXS-PTL-', LPAD(g.n, 3, '0'))      AS barcode,
  'OFF', 1, NOW()
FROM (
  SELECT (t.i * 10 + u.i + 1) AS n
  FROM (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
        UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t
  CROSS JOIN (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
        UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u
) g
JOIN racks r ON r.rack_number = ((g.n - 1) DIV 25) + 1
WHERE g.n BETWEEN 1 AND 100;

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- 4) verify ------------------------------------------------------------------
SELECT (SELECT COUNT(*) FROM racks) AS racks,
       (SELECT COUNT(*) FROM locations) AS slots,
       (SELECT MIN(location_number) FROM locations) AS min_slot,
       (SELECT MAX(location_number) FROM locations) AS max_slot;
