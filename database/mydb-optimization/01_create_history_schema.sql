-- =============================================================================
-- 01_create_history_schema.sql
-- -----------------------------------------------------------------------------
-- Purpose : Create the `mydb_history` schema as a structural clone of `mydb`.
--           Copies every table's columns, primary keys, unique constraints and
--           secondary indexes.  No data is copied here (see 03_archive_and_purge).
--
-- Engine  : MySQL 8.0+ (InnoDB).  Also valid on 5.7.
-- Safety  : Fully idempotent.  Re-running is a no-op (IF NOT EXISTS everywhere).
--           `CREATE TABLE ... LIKE` does NOT copy data and does NOT copy foreign
--           keys (mydb defines none).  It DOES copy PK / UNIQUE / INDEX / column
--           definitions exactly -- which is what we need for a history clone.
--
-- IMPORTANT: If your live database is NOT literally named `mydb`, replace every
--            occurrence of `mydb` below with the real database name from your
--            Prisma DATABASE_URL.  Keep `mydb_history` (or rename consistently).
--
-- Run order : 01 (this) -> 02_create_indexes -> 03_archive_and_purge
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `mydb_history`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- One structural clone per table.  Table names below are the REAL MySQL table
-- names (after Prisma @@map), not the Prisma model names.
-- -----------------------------------------------------------------------------

-- Auth / reference -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb_history`.`User`                                 LIKE `mydb`.`User`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`ShippingMetadata`                     LIKE `mydb`.`ShippingMetadata`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`OperationsMetadata`                   LIKE `mydb`.`OperationsMetadata`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`InventoryPID`                         LIKE `mydb`.`InventoryPID`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`ManualWarehouseSetUp`                 LIKE `mydb`.`ManualWarehouseSetUp`;

-- Scan / event logs ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb_history`.`PackingScan`                          LIKE `mydb`.`PackingScan`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`DispatchScan`                         LIKE `mydb`.`DispatchScan`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`BulkScan`                             LIKE `mydb`.`BulkScan`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`FR0Scan`                              LIKE `mydb`.`FR0Scan`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`CLScans`                              LIKE `mydb`.`CLScans`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`ManualWarehouse`                      LIKE `mydb`.`ManualWarehouse`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`FR0BulkHOTO`                          LIKE `mydb`.`FR0BulkHOTO`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`fasttrackscan`                        LIKE `mydb`.`fasttrackscan`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`CourierHandover`                      LIKE `mydb`.`CourierHandover`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`MetalFrameFittingScan`               LIKE `mydb`.`MetalFrameFittingScan`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`ndd_shipments`                        LIKE `mydb`.`ndd_shipments`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`MaintenanceShopIssue`                 LIKE `mydb`.`MaintenanceShopIssue`;

-- Inventory state / snapshots --------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb_history`.`scanned_barcode_inventory`            LIKE `mydb`.`scanned_barcode_inventory`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`scanned_barcode_inventory_transfer`   LIKE `mydb`.`scanned_barcode_inventory_transfer`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`order_update_dashboard_study`         LIKE `mydb`.`order_update_dashboard_study`;
CREATE TABLE IF NOT EXISTS `mydb_history`.`EHSDeviation`                         LIKE `mydb`.`EHSDeviation`;

-- -----------------------------------------------------------------------------
-- Verification (optional): confirm 21 tables now exist in mydb_history.
-- -----------------------------------------------------------------------------
-- SELECT TABLE_NAME
-- FROM information_schema.TABLES
-- WHERE TABLE_SCHEMA = 'mydb_history'
-- ORDER BY TABLE_NAME;
