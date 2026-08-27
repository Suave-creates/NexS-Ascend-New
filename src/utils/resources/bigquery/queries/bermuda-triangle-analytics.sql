-- The audit source is monthly partitioned, so rebuilding every complete
-- barcode timeline makes even a two-hour request scan and shuffle years of
-- history. Materialize the requested slice and collapse older history to the
-- one state that can affect the slice. This retains barcode-based semantics
-- and, critically, still detects an exit by stock that entered Bermuda long
-- before the requested range.
DECLARE start_dt DATETIME DEFAULT DATETIME(
  TIMESTAMP(
    DATETIME(CONCAT(@start_date, 'T', @start_time, ':00')),
    'Asia/Kolkata'
  ),
  'UTC'
);
DECLARE end_dt DATETIME DEFAULT DATETIME(
  TIMESTAMP(
    DATETIME_ADD(
      DATETIME(CONCAT(@end_date, 'T', @end_time, ':00')),
      INTERVAL 1 MINUTE
    ),
    'Asia/Kolkata'
  ),
  'UTC'
);

-- Keep the public parameter contract intact. Bermuda itself is deliberately
-- fixed below to the canonical exact pair NXS1 / Bermuda Triangle.
DECLARE supplied_destination_patterns ARRAY<STRING> DEFAULT @destination_patterns;
DECLARE supplied_destination_facility STRING DEFAULT @destination_facility;

CREATE TEMP TABLE range_history
CLUSTER BY barcode AS
SELECT
  history.id,
  history.rev,
  history.barcode,
  history.pid,
  history.facility,
  history.location,
  history.updated_at
FROM `__DATA_PROJECT__.nexs_ims.barcode_item_history` AS history
WHERE
  history.barcode IS NOT NULL
  AND history.updated_at >= start_dt
  AND history.updated_at < end_dt;

CREATE TEMP TABLE range_barcodes
CLUSTER BY barcode AS
SELECT DISTINCT barcode
FROM range_history;

CREATE TEMP TABLE pre_start_summary
CLUSTER BY barcode AS
SELECT
  history.barcode,
  ARRAY_AGG(
    STRUCT(
      history.id AS id,
      history.rev AS rev,
      history.pid AS pid,
      history.facility AS facility,
      history.location AS location,
      history.updated_at AS updated_at
    )
    ORDER BY history.updated_at DESC, history.rev DESC, history.id DESC
    LIMIT 1
  )[OFFSET(0)] AS last_state,
  LOGICAL_OR(
    REGEXP_CONTAINS(
      UPPER(COALESCE(history.location, '')),
      r'^NXS1-EGL-(24|23|22|21|20|05|06)'
    )
    OR REGEXP_CONTAINS(
      UPPER(COALESCE(history.location, '')),
      r'^NXS1-PL-(10|40|11)'
    )
  ) AS ever_in_egl_pl_before_start
FROM `__DATA_PROJECT__.nexs_ims.barcode_item_history` AS history
INNER JOIN range_barcodes AS candidate USING (barcode)
WHERE history.updated_at < start_dt
GROUP BY history.barcode;

CREATE TEMP TABLE timeline
CLUSTER BY barcode AS
SELECT
  previous.last_state.id,
  previous.last_state.rev,
  previous.barcode,
  previous.last_state.pid,
  previous.last_state.facility,
  previous.last_state.location,
  previous.last_state.updated_at
FROM pre_start_summary AS previous
UNION ALL
SELECT
  history.id,
  history.rev,
  history.barcode,
  history.pid,
  history.facility,
  history.location,
  history.updated_at
FROM range_history AS history;

CREATE TEMP TABLE state_flags
CLUSTER BY barcode AS
SELECT
  history.*,
  (
    COALESCE(CAST(history.facility AS STRING), '') = 'NXS1'
    AND COALESCE(history.location, '') = 'Bermuda Triangle'
  ) AS is_destination
FROM timeline AS history;

CREATE TEMP TABLE with_previous_state
CLUSTER BY barcode AS
SELECT
  state.*,
  LAG(pid) OVER item_timeline AS previous_pid,
  LAG(facility) OVER item_timeline AS previous_facility,
  LAG(location) OVER item_timeline AS previous_location,
  LAG(is_destination) OVER item_timeline AS previous_is_destination
FROM state_flags AS state
WINDOW item_timeline AS (
  PARTITION BY barcode
  ORDER BY updated_at, rev, id
);

CREATE TEMP TABLE boundary_movements
CLUSTER BY barcode AS
SELECT
  id,
  rev AS movement_rev,
  barcode,
  pid,
  previous_pid,
  facility,
  location,
  previous_facility,
  previous_location,
  updated_at AS movement_ts,
  DATE(TIMESTAMP(updated_at, 'UTC'), 'Asia/Kolkata') AS movement_date,
  IF(is_destination, 'inbound', 'outward') AS movement_direction
FROM with_previous_state
WHERE
  updated_at >= start_dt
  AND updated_at < end_dt
  AND is_destination != IFNULL(previous_is_destination, FALSE);

CREATE TEMP TABLE first_boundary_movement
CLUSTER BY barcode AS
SELECT *
FROM boundary_movements
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY movement_date, barcode, movement_direction
  ORDER BY movement_ts, movement_rev, id
) = 1;

-- The former correlated EXISTS was repeatedly expanding candidate_history.
-- Grouping by the exact comparison key preserves its rule: history is earlier
-- when updated_at is lower, or when updated_at ties and rev is lower. Rows with
-- the same timestamp and revision remain excluded regardless of id.
CREATE TEMP TABLE range_egl_by_order_key
CLUSTER BY barcode AS
SELECT
  barcode,
  updated_at,
  rev,
  LOGICAL_OR(
    REGEXP_CONTAINS(
      UPPER(COALESCE(location, '')),
      r'^NXS1-EGL-(24|23|22|21|20|05|06)'
    )
    OR REGEXP_CONTAINS(
      UPPER(COALESCE(location, '')),
      r'^NXS1-PL-(10|40|11)'
    )
  ) AS egl_pl_at_order_key
FROM range_history
GROUP BY barcode, updated_at, rev;

CREATE TEMP TABLE range_egl_history
CLUSTER BY barcode AS
WITH
  by_timestamp AS (
    SELECT
      barcode,
      updated_at,
      LOGICAL_OR(egl_pl_at_order_key) AS egl_pl_at_timestamp
    FROM range_egl_by_order_key
    GROUP BY barcode, updated_at
  ),
  before_timestamp AS (
    SELECT
      barcode,
      updated_at,
      COALESCE(
        LOGICAL_OR(egl_pl_at_timestamp) OVER (
          PARTITION BY barcode
          ORDER BY updated_at
          ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
        ),
        FALSE
      ) AS egl_pl_at_earlier_timestamp
    FROM by_timestamp
  ),
  before_revision AS (
    SELECT
      barcode,
      updated_at,
      rev,
      IF(
        rev IS NULL,
        FALSE,
        COALESCE(
          LOGICAL_OR(IF(rev IS NULL, FALSE, egl_pl_at_order_key)) OVER (
            PARTITION BY barcode, updated_at
            ORDER BY rev
            ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
          ),
          FALSE
        )
      ) AS egl_pl_at_lower_revision
    FROM range_egl_by_order_key
  )
SELECT
  revision.barcode,
  revision.updated_at,
  revision.rev,
  timestamp.egl_pl_at_earlier_timestamp
    OR revision.egl_pl_at_lower_revision AS ever_in_egl_pl_earlier_in_range
FROM before_revision AS revision
INNER JOIN before_timestamp AS timestamp USING (barcode, updated_at);

WITH
  classified_movements AS (
    SELECT
      movement.*,
      IF(
        movement.movement_direction = 'outward',
        COALESCE(movement.previous_pid, movement.pid),
        movement.pid
      ) AS movement_pid,
      CASE
        -- Keep the established inbound Location categorization unchanged.
        WHEN movement.movement_direction != 'inbound' THEN ''
        WHEN TRIM(COALESCE(movement.previous_location, '')) = '' THEN 'No prior'
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.previous_location)),
          r'^NXS1-EGL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN REGEXP_EXTRACT(
          UPPER(TRIM(movement.previous_location)),
          r'^(NXS1-EGL-[0-9]{2})'
        )
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.previous_location)),
          r'^NXS1-EGL_MANUAL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN CONCAT(
          'NXS1-EGL_Manual-',
          REGEXP_EXTRACT(
            UPPER(TRIM(movement.previous_location)),
            r'^NXS1-EGL_MANUAL-([0-9]{2})'
          )
        )
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.previous_location)),
          r'^NXS1-PL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN REGEXP_EXTRACT(
          UPPER(TRIM(movement.previous_location)),
          r'^(NXS1-PL-[0-9]{2})'
        )
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.previous_location)),
          r'^NXS1-PL_MANUAL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN CONCAT(
          'NXS1-PL_Manual-',
          REGEXP_EXTRACT(
            UPPER(TRIM(movement.previous_location)),
            r'^NXS1-PL_MANUAL-([0-9]{2})'
          )
        )
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-ASRS')
          THEN 'NXS1-ASRS'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-EG1')
          THEN 'NXS1-EG1'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-PB_PICKINGZONE')
          THEN 'NXS1-PB_PickingZone'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-BULK_RESERVE')
          THEN 'NXS1-Bulk Reserve'
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.previous_location)),
          r'^(?:LKST|ST)[0-9]+'
        ) THEN 'Stores'
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.previous_location)),
          r'^(?:IN_TRANSIT|QC_DESK)(?:[-_. ]|$)'
        ) THEN 'In Transit/System'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS2-')
          OR UPPER(TRIM(movement.previous_location)) = 'NXS2'
          THEN 'NXS2'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-EGL_')
          THEN 'NXS1-EGL Manual'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-EGL-')
          THEN 'NXS1-EGL'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-PL_')
          THEN 'NXS1-PL Manual'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-PL-')
          THEN 'NXS1-PL'
        WHEN STARTS_WITH(UPPER(TRIM(movement.previous_location)), 'NXS1-')
          THEN 'NXS1 Other'
        ELSE 'Other'
      END AS input_scope,
      CASE
        WHEN movement.movement_direction != 'outward' THEN ''
        WHEN UPPER(TRIM(COALESCE(CAST(movement.facility AS STRING), ''))) = 'NXS2'
          OR STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS2-')
          OR UPPER(TRIM(movement.location)) = 'NXS2'
          THEN 'NXS2'
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(COALESCE(CAST(movement.facility AS STRING), ''))),
          r'^(?:LKST|ST)[0-9]+'
        ) THEN 'Stores'
        WHEN TRIM(COALESCE(movement.location, '')) = '' THEN 'No outward location'
        WHEN UPPER(TRIM(movement.location)) = 'PICKING_ZONE'
          OR STARTS_WITH(UPPER(TRIM(movement.location)), 'PICKING_ZONE-')
          THEN 'Picking Zone'
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.location)),
          r'^NXS1-EGL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN REGEXP_EXTRACT(
          UPPER(TRIM(movement.location)),
          r'^(NXS1-EGL-[0-9]{2})'
        )
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.location)),
          r'^NXS1-EGL_MANUAL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN CONCAT(
          'NXS1-EGL_Manual-',
          REGEXP_EXTRACT(
            UPPER(TRIM(movement.location)),
            r'^NXS1-EGL_MANUAL-([0-9]{2})'
          )
        )
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.location)),
          r'^NXS1-PL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN REGEXP_EXTRACT(
          UPPER(TRIM(movement.location)),
          r'^(NXS1-PL-[0-9]{2})'
        )
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.location)),
          r'^NXS1-PL_MANUAL-[0-9]{2}(?:[^0-9]|$)'
        ) THEN CONCAT(
          'NXS1-PL_Manual-',
          REGEXP_EXTRACT(
            UPPER(TRIM(movement.location)),
            r'^NXS1-PL_MANUAL-([0-9]{2})'
          )
        )
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-ASRS')
          THEN 'NXS1-ASRS'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-EG1')
          THEN 'NXS1-EG1'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-PB_PICKINGZONE')
          THEN 'NXS1-PB_PickingZone'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-BULK_RESERVE')
          THEN 'NXS1-Bulk Reserve'
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.location)),
          r'^(?:LKST|ST)[0-9]+'
        ) THEN 'Stores'
        WHEN REGEXP_CONTAINS(
          UPPER(TRIM(movement.location)),
          r'^(?:IN_TRANSIT|QC_DESK)(?:[-_. ]|$)'
        ) THEN 'In Transit/System'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-EGL_')
          THEN 'NXS1-EGL Manual'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-EGL-')
          THEN 'NXS1-EGL'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-PL_')
          THEN 'NXS1-PL Manual'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-PL-')
          THEN 'NXS1-PL'
        WHEN STARTS_WITH(UPPER(TRIM(movement.location)), 'NXS1-')
          THEN 'NXS1 Other'
        ELSE 'Other'
      END AS output_scope,
      (
        movement.movement_direction = 'inbound'
        AND (
          COALESCE(previous.ever_in_egl_pl_before_start, FALSE)
          OR COALESCE(
            recent.ever_in_egl_pl_earlier_in_range,
            FALSE
          )
        )
      ) AS ever_in_egl_pl
    FROM first_boundary_movement AS movement
    LEFT JOIN pre_start_summary AS previous USING (barcode)
    LEFT JOIN range_egl_history AS recent
      ON recent.barcode = movement.barcode
      AND recent.updated_at = movement.movement_ts
      AND recent.rev IS NOT DISTINCT FROM movement.movement_rev
  ),
  scoped_product_pids AS (
    SELECT DISTINCT CAST(movement_pid AS STRING) AS pid
    FROM classified_movements
    WHERE movement_pid IS NOT NULL
  ),
  product_types AS (
    SELECT
      CAST(product.product_id AS STRING) AS pid,
      COALESCE(
        MIN(NULLIF(TRIM(CAST(product.hsn_classification AS STRING)), '')),
        'Unclassified'
      ) AS item_type
    FROM `__DATA_PROJECT__.inventory.products` AS product
    INNER JOIN scoped_product_pids AS scoped
      ON CAST(product.product_id AS STRING) = scoped.pid
    GROUP BY CAST(product.product_id AS STRING)
  )
SELECT
  movement.movement_direction,
  movement.movement_date,
  COALESCE(product.item_type, 'Unclassified') AS item_type,
  movement.input_scope,
  movement.output_scope,
  IF(
    @include_barcode_details = 'true',
    CAST(movement.barcode AS STRING),
    ''
  ) AS barcode,
  IF(
    @include_barcode_details = 'true',
    CAST(movement.movement_pid AS STRING),
    ''
  ) AS pid,
  IF(
    @include_barcode_details = 'true',
    FORMAT_DATETIME(
      '%H:%M:%S',
      DATETIME(TIMESTAMP(movement.movement_ts, 'UTC'), 'Asia/Kolkata')
    ),
    ''
  ) AS movement_time_ist,
  IF(
    @include_barcode_details = 'true',
    COALESCE(CAST(movement.previous_facility AS STRING), ''),
    ''
  ) AS source_facility,
  IF(
    @include_barcode_details = 'true',
    COALESCE(CAST(movement.previous_location AS STRING), ''),
    ''
  ) AS source_location,
  IF(
    @include_barcode_details = 'true',
    COALESCE(CAST(movement.facility AS STRING), ''),
    ''
  ) AS destination_facility,
  IF(
    @include_barcode_details = 'true',
    COALESCE(CAST(movement.location AS STRING), ''),
    ''
  ) AS destination_location,
  COUNT(DISTINCT IF(
    movement.movement_direction = 'inbound',
    movement.barcode,
    NULL
  )) AS new_inbound_to_destination,
  COUNT(DISTINCT IF(
    movement.movement_direction = 'outward',
    movement.barcode,
    NULL
  )) AS new_outward_from_destination,
  COUNT(DISTINCT IF(
    movement.movement_direction = 'inbound' AND movement.ever_in_egl_pl,
    movement.barcode,
    NULL
  )) AS count_ever_in_egl_pl,
  COUNT(DISTINCT IF(
    movement.movement_direction = 'inbound' AND NOT movement.ever_in_egl_pl,
    movement.barcode,
    NULL
  )) AS count_never_in_egl_pl
FROM classified_movements AS movement
LEFT JOIN product_types AS product
  ON CAST(movement.movement_pid AS STRING) = product.pid
WHERE
  @movement_direction = 'all'
  OR movement.movement_direction = @movement_direction
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
ORDER BY 1, 2, 8, 5, 3, 10, 6
