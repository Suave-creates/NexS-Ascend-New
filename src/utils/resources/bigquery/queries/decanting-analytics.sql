WITH
  bounds AS (
    SELECT
      -- The dashboard inputs are IST wall-clock values while updated_at is a
      -- UTC DATETIME. Convert the bounds once before comparing them.
      DATETIME(
        TIMESTAMP(
          DATETIME(CONCAT(@start_date, 'T', @start_time, ':00')),
          'Asia/Kolkata'
        ),
        'UTC'
      ) AS start_dt,
      DATETIME(
        TIMESTAMP(
          DATETIME_ADD(
            DATETIME(CONCAT(@end_date, 'T', @end_time, ':00')),
            INTERVAL 1 MINUTE
          ),
          'Asia/Kolkata'
        ),
        'UTC'
      ) AS end_dt
  ),
  configured_destinations AS (
    SELECT
      pattern,
      ENDS_WITH(pattern, '%') AS is_prefix,
      IF(
        ENDS_WITH(pattern, '%'),
        REGEXP_REPLACE(pattern, r'%+$', ''),
        pattern
      ) AS match_value
    FROM UNNEST(@destination_patterns) AS pattern
  ),
  destination_candidates AS (
    SELECT DISTINCT barcode
    FROM `__DATA_PROJECT__.nexs_ims.barcode_item_history`
    CROSS JOIN bounds AS b
    WHERE
      EXISTS (
        SELECT 1
        FROM configured_destinations AS destination
        WHERE
          (
            destination.is_prefix
            AND STARTS_WITH(COALESCE(location, ''), destination.match_value)
          )
          OR (
            NOT destination.is_prefix
            AND COALESCE(location, '') = destination.match_value
          )
      )
      AND (
        @destination_facility = ''
        OR COALESCE(CAST(facility AS STRING), '') = @destination_facility
      )
      AND updated_at >= b.start_dt
      AND updated_at < b.end_dt
  ),
  candidate_history AS (
    SELECT h.id, h.barcode, h.pid, h.facility, h.location, h.updated_at, h.rev
    FROM `__DATA_PROJECT__.nexs_ims.barcode_item_history` AS h
    INNER JOIN destination_candidates AS candidate USING (barcode)
    CROSS JOIN bounds AS b
    WHERE h.updated_at < b.end_dt
  ),
  with_previous_location AS (
    SELECT
      id,
      barcode,
      pid,
      facility,
      location,
      updated_at,
      rev,
      LAG(facility) OVER (
        PARTITION BY barcode
        ORDER BY updated_at, rev, id
      ) AS previous_facility,
      LAG(location) OVER (
        PARTITION BY barcode
        ORDER BY updated_at, rev, id
      ) AS previous_location
    FROM candidate_history
  ),
  destination_movements AS (
    SELECT
      id,
      barcode,
      pid,
      facility,
      location AS destination_location,
      previous_facility,
      previous_location,
      updated_at AS movement_ts,
      rev AS movement_rev,
      DATE(TIMESTAMP(updated_at, 'UTC'), 'Asia/Kolkata') AS movement_date
    FROM with_previous_location
    CROSS JOIN bounds AS b
    WHERE
      EXISTS (
        SELECT 1
        FROM configured_destinations AS destination
        WHERE
          (
            destination.is_prefix
            AND STARTS_WITH(COALESCE(location, ''), destination.match_value)
          )
          OR (
            NOT destination.is_prefix
            AND COALESCE(location, '') = destination.match_value
          )
      )
      AND (
        @destination_facility = ''
        OR COALESCE(CAST(facility AS STRING), '') = @destination_facility
      )
      AND (
        previous_location IS NULL
        OR (
          @destination_facility != ''
          AND COALESCE(CAST(previous_facility AS STRING), '') != @destination_facility
        )
        OR NOT EXISTS (
          SELECT 1
          FROM configured_destinations AS destination
          WHERE
            (
              destination.is_prefix
              AND STARTS_WITH(COALESCE(previous_location, ''), destination.match_value)
            )
            OR (
              NOT destination.is_prefix
              AND COALESCE(previous_location, '') = destination.match_value
            )
        )
      )
      AND updated_at >= b.start_dt
      AND updated_at < b.end_dt
  ),
  first_destination_movement AS (
    -- A barcode can leave and re-enter the destination more than once in one
    -- day. Keep its first boundary crossing so input-scope totals always add
    -- up to the dashboard's distinct barcode-day total.
    SELECT *
    FROM destination_movements
    QUALIFY ROW_NUMBER() OVER (
      PARTITION BY movement_date, barcode
      ORDER BY movement_ts, movement_rev, id
    ) = 1
  ),
  input_scoped AS (
    SELECT
      movement.barcode,
      movement.pid,
      movement.movement_date,
      movement.movement_ts,
      movement.facility AS destination_facility,
      movement.destination_location,
      movement.previous_facility,
      movement.previous_location,
      IF(
        @include_input_location = 'true',
        COALESCE(NULLIF(TRIM(CAST(movement.previous_location AS STRING)), ''), 'No prior'),
        ''
      ) AS input_location,
      IF(
        @include_input_location = 'true',
        COALESCE(NULLIF(TRIM(CAST(movement.previous_facility AS STRING)), ''), 'No prior'),
        ''
      ) AS input_facility,
      CASE
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
      EXISTS (
        SELECT 1
        FROM candidate_history AS history
        WHERE
          history.barcode = movement.barcode
          AND (
            history.updated_at < movement.movement_ts
            OR (
              history.updated_at = movement.movement_ts
              AND history.rev < movement.movement_rev
            )
          )
          AND (
            REGEXP_CONTAINS(
              UPPER(COALESCE(history.location, '')),
              r'^NXS1-EGL-(24|23|22|21|20|05|06)'
            )
            OR REGEXP_CONTAINS(
              UPPER(COALESCE(history.location, '')),
              r'^NXS1-PL-(10|40|11)'
            )
          )
      ) AS ever_in_egl_pl
    FROM first_destination_movement AS movement
  ),
  scoped_product_pids AS (
    SELECT DISTINCT CAST(pid AS STRING) AS pid
    FROM input_scoped
    WHERE pid IS NOT NULL
  ),
  product_types AS (
    -- inventory.products can contain more than one source row for a PID. Fold
    -- it to one deterministic classification before joining so a barcode-day
    -- cannot be counted twice in two output groups.
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
  scoped.movement_date,
  COALESCE(product.item_type, 'Unclassified') AS item_type,
  scoped.input_scope,
  scoped.input_location,
  scoped.input_facility,
  IF(@include_barcode_details = 'true', CAST(scoped.barcode AS STRING), '') AS barcode,
  IF(@include_barcode_details = 'true', CAST(scoped.pid AS STRING), '') AS pid,
  IF(
    @include_barcode_details = 'true',
    FORMAT_DATETIME(
      '%H:%M:%S',
      DATETIME(TIMESTAMP(scoped.movement_ts, 'UTC'), 'Asia/Kolkata')
    ),
    ''
  ) AS movement_time_ist,
  IF(
    @include_barcode_details = 'true',
    COALESCE(CAST(scoped.destination_facility AS STRING), ''),
    ''
  ) AS destination_facility,
  IF(
    @include_barcode_details = 'true',
    COALESCE(CAST(scoped.destination_location AS STRING), ''),
    ''
  ) AS destination_location,
  COUNT(DISTINCT scoped.barcode) AS new_inbound_to_destination,
  COUNT(DISTINCT IF(scoped.ever_in_egl_pl, scoped.barcode, NULL)) AS count_ever_in_egl_pl,
  COUNT(DISTINCT IF(NOT scoped.ever_in_egl_pl, scoped.barcode, NULL)) AS count_never_in_egl_pl
FROM input_scoped AS scoped
LEFT JOIN product_types AS product
  ON CAST(scoped.pid AS STRING) = product.pid
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
ORDER BY 1, 8, 3, 2, 4, 5, 6
