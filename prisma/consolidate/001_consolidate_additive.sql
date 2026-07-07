-- ConsolidAte — additive schema changes for the `dispatch_ptl` database.
-- Run ONCE against 192.168.27.157/dispatch_ptl. Additive only: it does NOT touch
-- the existing racks/locations rows or the legacy AWB tables.
--   mysql -h 192.168.27.157 -u Hero -p dispatch_ptl < prisma/consolidate/001_consolidate_additive.sql

-- Slot now tracks the Shipping Package ID currently consolidating in it.
ALTER TABLE locations ADD COLUMN current_package_id VARCHAR(191) NULL;
CREATE INDEX locations_current_package_id_idx ON locations (current_package_id);

-- Every barcode ever seen in the CL: Order QC dump (upserted each poll cycle).
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

-- One row per Shipping Package ID being consolidated into a PTL slot.
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

-- One row per barcode scanned/placed into a package's slot (the "accounted" set).
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
