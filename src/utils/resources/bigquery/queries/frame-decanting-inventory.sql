-- Frame Decanting inventory and product enrichment. Power BI ROS PIDs are
-- included, and live inventory-only six-digit PIDs are retained to reproduce
-- the legacy dump discovery/New PID behavior.
WITH
  ros_pids AS (
    SELECT DISTINCT TRIM(pid) AS pid
    FROM UNNEST(@pids) AS pid
    WHERE REGEXP_CONTAINS(TRIM(pid), r'^\d{5,6}$')
  ),
  barcode_counts AS (
    SELECT
      CAST(item.pid AS STRING) AS pid,
      COUNTIF(item.status = 'AVAILABLE' AND item.location LIKE 'NXS1-ASRS%') AS asrs_count,
      COUNTIF(
        item.status = 'AVAILABLE'
        AND item.location LIKE 'NXS1-EGL_Manual-05%'
      ) AS egl_manual_05_count,
      COUNTIF(item.status = 'PUTAWAY_PENDING') AS putaway_pending_count
    FROM `__DATA_PROJECT__.nexs_ims.barcode_item` AS item
    WHERE
      item.facility = 'NXS1'
      AND item.condition = 'GOOD'
      AND item.availability = 'AVAILABLE'
      AND item.status IN ('AVAILABLE', 'PUTAWAY_PENDING')
      AND (
        item.status = 'PUTAWAY_PENDING'
        OR item.location LIKE 'NXS1-ASRS%'
        OR item.location LIKE 'NXS1-EGL_Manual-05%'
      )
      AND REGEXP_CONTAINS(CAST(item.pid AS STRING), r'^\d{5,6}$')
    GROUP BY pid
  ),
  warehouse_inventory AS (
    SELECT
      CAST(inventory.pid AS STRING) AS pid,
      inventory.facility,
      inventory.legal_owner,
      SUM(CAST(inventory.quantity AS INT64)) AS quantity
    FROM `__DATA_PROJECT__.nexs_cid.warehouse_inventory` AS inventory
    WHERE
      inventory.facility IN ('NXS1', 'NXS2')
      AND inventory.legal_owner = 'LKIN'
      AND inventory.condition = 'GOOD'
      AND inventory.availability = 'AVAILABLE'
      AND inventory.status = 'AVAILABLE'
      AND inventory.location_type = 'DEFAULT'
      AND REGEXP_CONTAINS(CAST(inventory.pid AS STRING), r'^\d{5,6}$')
    GROUP BY pid, inventory.facility, inventory.legal_owner
  ),
  blocked_inventory AS (
    SELECT
      CAST(blocked.pid AS STRING) AS pid,
      blocked.facility,
      blocked.legal_owner,
      SUM(CAST(blocked.quantity AS INT64)) AS quantity
    FROM `__DATA_PROJECT__.nexs_cid.warehouse_blocked_inventory` AS blocked
    INNER JOIN (
      SELECT DISTINCT pid, facility, legal_owner FROM warehouse_inventory
    ) AS relevant
      ON CAST(blocked.pid AS STRING) = relevant.pid
      AND blocked.facility = relevant.facility
      AND blocked.legal_owner = relevant.legal_owner
    GROUP BY CAST(blocked.pid AS STRING), blocked.facility, blocked.legal_owner
  ),
  available_inventory AS (
    SELECT
      inventory.pid,
      inventory.facility,
      inventory.quantity - COALESCE(blocked.quantity, 0) AS available_quantity
    FROM warehouse_inventory AS inventory
    LEFT JOIN blocked_inventory AS blocked USING (pid, facility, legal_owner)
  ),
  inventory_by_pid AS (
    SELECT
      pid,
      SUM(IF(facility = 'NXS1', available_quantity, 0)) AS nxs1_count,
      SUM(IF(facility = 'NXS2', available_quantity, 0)) AS nxs2_count
    FROM available_inventory
    GROUP BY pid
  ),
  scoped_pids AS (
    SELECT pid FROM ros_pids
    UNION DISTINCT
    SELECT pid FROM barcode_counts WHERE REGEXP_CONTAINS(pid, r'^\d{6}$')
    UNION DISTINCT
    SELECT pid FROM inventory_by_pid WHERE REGEXP_CONTAINS(pid, r'^\d{6}$')
  ),
  product_details AS (
    SELECT
      CAST(product.product_id AS STRING) AS pid,
      MIN(NULLIF(TRIM(CAST(product.product_type AS STRING)), '')) AS product_type,
      MIN(NULLIF(TRIM(CAST(product.brand AS STRING)), '')) AS brand
    FROM `__DATA_PROJECT__.inventory.products` AS product
    INNER JOIN scoped_pids AS scoped ON CAST(product.product_id AS STRING) = scoped.pid
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
  COALESCE(barcode.egl_manual_05_count, 0) AS egl_manual_05_count,
  COALESCE(barcode.putaway_pending_count, 0) AS putaway_pending_count
FROM scoped_pids AS scoped
LEFT JOIN barcode_counts AS barcode USING (pid)
LEFT JOIN inventory_by_pid AS inventory USING (pid)
LEFT JOIN product_details AS product USING (pid)
ORDER BY SAFE_CAST(scoped.pid AS INT64), scoped.pid
