-- BigQuery scripts materialize the expensive audit-history stages once.
-- A plain CTE version is inlined for every downstream reference, which made
-- the former query scan barcode_item_history and inventory.products many times.
DECLARE requested_start_date DATE DEFAULT DATE(@start_date);
DECLARE requested_end_date DATE DEFAULT DATE(@end_date);
-- Dashboard dates are IST calendar days; history.updated_at is a UTC DATETIME.
DECLARE start_dt DATETIME DEFAULT DATETIME(
  TIMESTAMP(requested_start_date, 'Asia/Kolkata'),
  'UTC'
);
DECLARE end_dt DATETIME DEFAULT DATETIME(
  TIMESTAMP(DATE_ADD(requested_end_date, INTERVAL 1 DAY), 'Asia/Kolkata'),
  'UTC'
);

CREATE TEMP TABLE configured_locations AS
SELECT
  prefix,
  REGEXP_REPLACE(prefix, r'%+$', '') AS location,
  location_order
FROM UNNEST(@location_prefixes) AS prefix WITH OFFSET AS location_order;

CREATE TEMP TABLE candidate_items
CLUSTER BY id AS
SELECT DISTINCT h.id
FROM `__DATA_PROJECT__.nexs_ims.barcode_item_history` AS h
INNER JOIN configured_locations AS l
  ON STARTS_WITH(COALESCE(h.location, ''), l.location)
WHERE
  h.id IS NOT NULL
  AND h.updated_at < end_dt;

CREATE TEMP TABLE timeline
CLUSTER BY id AS
WITH
  pre_start_state AS (
    SELECT
      h.id,
      h.barcode,
      h.pid,
      h.location,
      h.status,
      h.`condition`,
      h.availability,
      h.updated_at,
      h.rev
    FROM `__DATA_PROJECT__.nexs_ims.barcode_item_history` AS h
    INNER JOIN candidate_items AS candidate USING (id)
    WHERE h.updated_at < start_dt
    QUALIFY ROW_NUMBER() OVER (
      PARTITION BY h.id
      ORDER BY h.updated_at DESC, h.rev DESC
    ) = 1
  ),
  in_range_history AS (
    SELECT
      h.id,
      h.barcode,
      h.pid,
      h.location,
      h.status,
      h.`condition`,
      h.availability,
      h.updated_at,
      h.rev
    FROM `__DATA_PROJECT__.nexs_ims.barcode_item_history` AS h
    INNER JOIN candidate_items AS candidate USING (id)
    WHERE
      h.updated_at >= start_dt
      AND h.updated_at < end_dt
  )
SELECT * FROM pre_start_state
UNION ALL
SELECT * FROM in_range_history;

CREATE TEMP TABLE sequenced
CLUSTER BY id AS
WITH
  located_states AS (
    SELECT
      timeline.*,
      location.location AS reserve_location
    FROM timeline
    LEFT JOIN configured_locations AS location
      ON STARTS_WITH(COALESCE(timeline.location, ''), location.location)
  ),
  inventory_states AS (
    SELECT
      state.*,
      (
        state.reserve_location IS NOT NULL
        AND TRIM(UPPER(COALESCE(state.`condition`, ''))) = 'GOOD'
        AND TRIM(UPPER(COALESCE(state.status, ''))) = 'AVAILABLE'
        AND TRIM(UPPER(COALESCE(state.availability, ''))) = 'AVAILABLE'
      ) AS is_inventory
    FROM located_states AS state
  )
SELECT
  state.*,
  LAG(state.is_inventory, 1, FALSE) OVER item_timeline AS previous_is_inventory,
  LAG(state.pid) OVER item_timeline AS previous_pid,
  LAG(state.reserve_location) OVER item_timeline AS previous_reserve_location
FROM inventory_states AS state
WINDOW item_timeline AS (
  PARTITION BY state.id
  ORDER BY state.updated_at, state.rev
);

CREATE TEMP TABLE scoped_product_pids
CLUSTER BY pid AS
SELECT DISTINCT CAST(pid AS STRING) AS pid
FROM sequenced
WHERE pid IS NOT NULL
UNION DISTINCT
SELECT DISTINCT CAST(previous_pid AS STRING) AS pid
FROM sequenced
WHERE previous_pid IS NOT NULL;

CREATE TEMP TABLE product_types
CLUSTER BY pid AS
SELECT
  CAST(product.product_id AS STRING) AS pid,
  COALESCE(
    MIN(NULLIF(TRIM(CAST(product.hsn_classification AS STRING)), '')),
    'Unclassified'
  ) AS item_type
FROM `__DATA_PROJECT__.inventory.products` AS product
INNER JOIN scoped_product_pids AS scoped
  ON CAST(product.product_id AS STRING) = scoped.pid
GROUP BY CAST(product.product_id AS STRING);

CREATE TEMP TABLE typed_states
CLUSTER BY id AS
SELECT
  state.*,
  COALESCE(current_product.item_type, 'Unclassified') AS item_type,
  COALESCE(previous_product.item_type, 'Unclassified') AS previous_item_type
FROM sequenced AS state
LEFT JOIN product_types AS current_product
  ON CAST(state.pid AS STRING) = current_product.pid
LEFT JOIN product_types AS previous_product
  ON CAST(state.previous_pid AS STRING) = previous_product.pid;

WITH
  calendar AS (
    SELECT inventory_date
    FROM UNNEST(
      GENERATE_DATE_ARRAY(
        requested_start_date,
        requested_end_date
      )
    ) AS inventory_date
  ),
  opening_by_bucket AS (
    SELECT
      state.item_type,
      state.reserve_location AS location,
      COUNT(*) AS opening_inventory
    FROM typed_states AS state
    WHERE
      state.updated_at < start_dt
      AND state.is_inventory
    GROUP BY state.item_type, location
  ),
  inward_events AS (
    SELECT
      DATE(TIMESTAMP(state.updated_at, 'UTC'), 'Asia/Kolkata') AS inventory_date,
      state.item_type,
      state.reserve_location AS location,
      1 AS inward,
      0 AS outward
    FROM typed_states AS state
    WHERE
      state.updated_at >= start_dt
      AND state.updated_at < end_dt
      AND state.is_inventory
      AND (
        NOT state.previous_is_inventory
        OR state.reserve_location != state.previous_reserve_location
        OR state.item_type != state.previous_item_type
      )
  ),
  outward_events AS (
    SELECT
      DATE(TIMESTAMP(state.updated_at, 'UTC'), 'Asia/Kolkata') AS inventory_date,
      state.previous_item_type AS item_type,
      state.previous_reserve_location AS location,
      0 AS inward,
      1 AS outward
    FROM typed_states AS state
    WHERE
      state.updated_at >= start_dt
      AND state.updated_at < end_dt
      AND state.previous_is_inventory
      AND (
        NOT state.is_inventory
        OR state.reserve_location != state.previous_reserve_location
        OR state.item_type != state.previous_item_type
      )
  ),
  movement_events AS (
    SELECT * FROM inward_events
    UNION ALL
    SELECT * FROM outward_events
  ),
  daily_flows AS (
    SELECT
      inventory_date,
      item_type,
      location,
      SUM(inward) AS inward,
      SUM(outward) AS outward
    FROM movement_events
    GROUP BY inventory_date, item_type, location
  ),
  observed_item_types AS (
    SELECT item_type FROM opening_by_bucket
    UNION DISTINCT
    SELECT item_type FROM daily_flows
  ),
  item_types AS (
    SELECT item_type FROM observed_item_types
    UNION ALL
    SELECT 'Unclassified'
    FROM (SELECT 1)
    WHERE NOT EXISTS (SELECT 1 FROM observed_item_types)
  ),
  date_item_location_grid AS (
    SELECT
      calendar.inventory_date,
      item_type.item_type,
      location.location,
      location.location_order
    FROM calendar
    CROSS JOIN item_types AS item_type
    CROSS JOIN configured_locations AS location
  )
SELECT
  grid.inventory_date,
  grid.item_type,
  grid.location,
  COALESCE(flow.inward, 0) AS inward,
  COALESCE(flow.outward, 0) AS outward,
  COALESCE(opening.opening_inventory, 0)
    + SUM(COALESCE(flow.inward, 0) - COALESCE(flow.outward, 0)) OVER (
      PARTITION BY grid.item_type, grid.location
      ORDER BY grid.inventory_date
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS inventory
FROM date_item_location_grid AS grid
LEFT JOIN daily_flows AS flow
  ON flow.inventory_date = grid.inventory_date
  AND flow.item_type = grid.item_type
  AND flow.location = grid.location
LEFT JOIN opening_by_bucket AS opening
  ON opening.item_type = grid.item_type
  AND opening.location = grid.location
ORDER BY grid.inventory_date, grid.location_order, grid.item_type;
