-- Source predicates mirror the repository's native inventory-dump definitions.
-- Putaway Pending is deliberately facility-wide because it represents the full
-- NXS1 pending queue rather than one storage-location family.
WITH
  scoped_pids AS (
    SELECT DISTINCT TRIM(pid) AS pid
    FROM UNNEST(@pids) AS pid
    WHERE TRIM(pid) != ''
  ),
  barcode_counts AS (
    SELECT
      CAST(item.pid AS STRING) AS pid,
      COUNTIF(
        item.status = 'AVAILABLE'
        AND item.location LIKE 'NXS1-ASRS%'
      ) AS asrs_count,
      COUNTIF(
        item.status = 'AVAILABLE'
        AND item.location LIKE 'NXS1-EGL_Manual%'
      ) AS egl_manual_count,
      COUNTIF(
        item.status = 'PUTAWAY_PENDING'
      ) AS putaway_pending_count,
      COUNTIF(
        item.status = 'AVAILABLE'
        AND (
          item.location LIKE 'NXS1-PL_Manual-01%'
          OR item.location LIKE 'NXS1-PL_Manual-02%'
        )
      ) AS pl_manual_count,
      COUNTIF(item.status = 'AVAILABLE' AND item.location LIKE 'NXS1-PL-10%') AS pl_10_count,
      COUNTIF(item.status = 'AVAILABLE' AND item.location LIKE 'NXS1-PL-11%') AS pl_11_count,
      COUNTIF(item.status = 'AVAILABLE' AND item.location LIKE 'NXS1-PL-40%') AS pl_40_count
    FROM `__DATA_PROJECT__.nexs_ims.barcode_item` AS item
    INNER JOIN scoped_pids AS scoped
      ON CAST(item.pid AS STRING) = scoped.pid
    WHERE
      item.facility = 'NXS1'
      AND item.condition = 'GOOD'
      AND item.availability = 'AVAILABLE'
      AND item.status IN ('AVAILABLE', 'PUTAWAY_PENDING')
      AND (
        item.status = 'PUTAWAY_PENDING'
        OR item.location LIKE 'NXS1-ASRS%'
        OR item.location LIKE 'NXS1-EGL_Manual%'
        OR item.location LIKE 'NXS1-PL_Manual-01%'
        OR item.location LIKE 'NXS1-PL_Manual-02%'
        OR item.location LIKE 'NXS1-PL-10%'
        OR item.location LIKE 'NXS1-PL-11%'
        OR item.location LIKE 'NXS1-PL-40%'
      )
    GROUP BY CAST(item.pid AS STRING)
  ),
  warehouse_inventory AS (
    SELECT
      CAST(inventory.pid AS STRING) AS pid,
      inventory.facility,
      inventory.legal_owner,
      SUM(CAST(inventory.quantity AS INT64)) AS quantity
    FROM `__DATA_PROJECT__.nexs_cid.warehouse_inventory` AS inventory
    INNER JOIN scoped_pids AS scoped
      ON CAST(inventory.pid AS STRING) = scoped.pid
    WHERE
      inventory.facility IN ('NXS1', 'NXS2')
      AND inventory.legal_owner = 'LKIN'
      AND inventory.condition = 'GOOD'
      AND inventory.availability = 'AVAILABLE'
      AND inventory.status = 'AVAILABLE'
      AND inventory.location_type = 'DEFAULT'
    GROUP BY pid, inventory.facility, inventory.legal_owner
  ),
  blocked_inventory AS (
    SELECT
      CAST(blocked.pid AS STRING) AS pid,
      blocked.facility,
      blocked.legal_owner,
      SUM(CAST(blocked.quantity AS INT64)) AS quantity
    FROM `__DATA_PROJECT__.nexs_cid.warehouse_blocked_inventory` AS blocked
    INNER JOIN scoped_pids AS scoped
      ON CAST(blocked.pid AS STRING) = scoped.pid
    WHERE
      blocked.facility IN ('NXS1', 'NXS2')
      AND blocked.legal_owner = 'LKIN'
    GROUP BY pid, blocked.facility, blocked.legal_owner
  ),
  available_inventory AS (
    SELECT
      inventory.pid,
      inventory.facility,
      inventory.quantity - COALESCE(blocked.quantity, 0) AS available_quantity
    FROM warehouse_inventory AS inventory
    LEFT JOIN blocked_inventory AS blocked
      USING (pid, facility, legal_owner)
  ),
  inventory_by_pid AS (
    SELECT
      pid,
      SUM(IF(facility = 'NXS1', available_quantity, 0)) AS nxs1_count,
      SUM(IF(facility = 'NXS2', available_quantity, 0)) AS nxs2_count
    FROM available_inventory
    GROUP BY pid
  ),
  product_details AS (
    SELECT
      CAST(product.product_id AS STRING) AS pid,
      MIN(NULLIF(TRIM(CAST(product.product_type AS STRING)), '')) AS product_type,
      MIN(NULLIF(TRIM(CAST(product.brand AS STRING)), '')) AS brand
    FROM `__DATA_PROJECT__.inventory.products` AS product
    INNER JOIN scoped_pids AS scoped
      ON CAST(product.product_id AS STRING) = scoped.pid
    GROUP BY pid
  )
SELECT
  scoped.pid,
  IF(barcode.pid IS NOT NULL OR inventory.pid IS NOT NULL, 1, 0) AS inventory_match,
  IF(product.pid IS NOT NULL, 1, 0) AS product_match,
  product.product_type,
  product.brand,
  COALESCE(barcode.asrs_count, 0) AS asrs_count,
  COALESCE(inventory.nxs1_count, 0) AS nxs1_count,
  COALESCE(inventory.nxs2_count, 0) AS nxs2_count,
  COALESCE(barcode.egl_manual_count, 0) AS egl_manual_count,
  COALESCE(barcode.putaway_pending_count, 0) AS putaway_pending_count,
  COALESCE(barcode.pl_manual_count, 0) AS pl_manual_count,
  COALESCE(barcode.pl_10_count, 0) AS pl_10_count,
  COALESCE(barcode.pl_11_count, 0) AS pl_11_count,
  COALESCE(barcode.pl_40_count, 0) AS pl_40_count
FROM scoped_pids AS scoped
LEFT JOIN barcode_counts AS barcode USING (pid)
LEFT JOIN inventory_by_pid AS inventory USING (pid)
LEFT JOIN product_details AS product USING (pid)
ORDER BY SAFE_CAST(scoped.pid AS INT64), scoped.pid
