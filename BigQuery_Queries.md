# BigQuery Queries (excluding `grafana-dumps`)

Every query in this document is issued through `runBigQuery()` in
[src/utils/resources/bigquery/client.ts](src/utils/resources/bigquery/client.ts)
(REST calls to `bigquery.googleapis.com`, Standard SQL, named `@param`
placeholders). The `grafana-dumps` module's queries are intentionally
excluded here — see [Queires.md](Queires.md) for those.

Tables are qualified as `` `${BIGQUERY_DATA_PROJECT_ID}.<dataset>.<table>` ``
at runtime; `BIGQUERY_DATA_PROJECT_ID` defaults to `lenskart-datahub`
(env `BQ_DATA_PROJECT_ID`). One route (`infocorner/numbers`) hardcodes
`lenskart-datahub` instead of using the env var.

---

## OMT

### `omt/tracer-pro` — single tray trace
File: [src/app/api/omt/tracer-pro/route.ts](src/app/api/omt/tracer-pro/route.ts)
`POST /api/omt/tracer-pro`

**1. Latest order item for the scanned tray**
```sql
SELECT
  oi.location_id,
  oi.fitting_id,
  oi.shipping_package_id,
  oi.qc_fail_count,
  oih.order_item_type,
  DATE_DIFF(CURRENT_DATE(), DATE(oi.created_at), DAY) AS created_at_days,
  oi.created_at
FROM `wms.order_items` oi
LEFT JOIN `wms.order_item_header` oih
  ON oih.shipping_package_id = oi.shipping_package_id
WHERE CAST(oi.location_id AS STRING) = @tray_id
ORDER BY oi.id DESC
LIMIT 1
```

**2. All trays sharing the same fitting** (to derive parent/child rank)
```sql
SELECT
  location_id,
  qc_fail_count,
  created_at
FROM `wms.order_items`
WHERE CAST(fitting_id AS STRING) = @fitting_id
ORDER BY qc_fail_count ASC, created_at ASC
```

**3. QC-fail reasons for the shipment**
```sql
SELECT TRIM(UPPER(reason_name)) AS reason_name
FROM `orderqc.qc_status_history`
WHERE CAST(shipping_package_id AS STRING) = @shipping_package_id
  AND status = 'QCFailed'
ORDER BY updated_at DESC
```

**4. Distinct QC-fail event count** (hourly-truncated, run in parallel with #3)
```sql
SELECT
  COUNT(DISTINCT TIMESTAMP_TRUNC(updated_at, HOUR)) AS qcf_count
FROM `orderqc.qc_status_history`
WHERE CAST(shipping_package_id AS STRING) = @shipping_package_id
  AND status = 'QCFailed'
```

---

### `omt/tracer-pro/bulk` — up to 50 trays at once
File: [src/app/api/omt/tracer-pro/bulk/route.ts](src/app/api/omt/tracer-pro/bulk/route.ts)
`POST /api/omt/tracer-pro/bulk`

**1. Latest order item per tray** (one row per `location_id` via `QUALIFY`)
```sql
SELECT
   oi.location_id,
   oi.fitting_id,
   oi.shipping_package_id,
   oi.qc_fail_count,
   oih.order_item_type,
   DATE_DIFF(CURRENT_DATE(), DATE(oi.created_at), DAY) AS created_at_days,
   oi.created_at
 FROM `wms.order_items` oi
 LEFT JOIN `wms.order_item_header` oih
   ON oih.shipping_package_id = oi.shipping_package_id
 WHERE CAST(oi.location_id AS STRING) IN UNNEST(@tray_ids)
 QUALIFY ROW_NUMBER() OVER (PARTITION BY oi.location_id ORDER BY oi.id DESC) = 1
```

**2. All fitting siblings for every fitting in the batch**
```sql
SELECT location_id, fitting_id, qc_fail_count, created_at
FROM `wms.order_items`
WHERE CAST(fitting_id AS STRING) IN UNNEST(@fitting_ids)
ORDER BY fitting_id ASC, qc_fail_count ASC, created_at ASC
```

**3. QC-fail reasons for every shipment in the batch**
```sql
SELECT shipping_package_id, TRIM(UPPER(reason_name)) AS reason_name
FROM `orderqc.qc_status_history`
WHERE CAST(shipping_package_id AS STRING) IN UNNEST(@shipping_ids)
  AND  status = 'QCFailed'
ORDER BY updated_at DESC
```

**4. QC-fail event counts per shipment** (run in parallel with #3)
```sql
SELECT shipping_package_id,
       COUNT(DISTINCT TIMESTAMP_TRUNC(updated_at, HOUR)) AS qcf_count
FROM `orderqc.qc_status_history`
WHERE CAST(shipping_package_id AS STRING) IN UNNEST(@shipping_ids)
  AND  status = 'QCFailed'
GROUP BY shipping_package_id
```

---

## InfoCorner

### `infocorner/sync-time-location`
File: [src/app/api/infocorner/sync-time-location/route.ts](src/app/api/infocorner/sync-time-location/route.ts)
`POST /api/infocorner/sync-time-location` — chunked, 20 shipment IDs per call
```sql
SELECT
  increment_id,
  product_id,
  shipment_id,
  FORMAT_DATETIME('%F %T', scm_order_created_at) AS scm_order_created_at,
  FORMAT_TIMESTAMP('%F %T', updated_at) AS updated_at,
  location_barcode,
  asrs_location_barcode,
  item_type,
  location_type,
  fullfill_type,
  facility,
  order_state,
  jit_order,
  repick_status,
  repick_count
FROM `picking.picklist_order_item`
WHERE CAST(shipment_id AS STRING) IN UNNEST(@shipment_ids)
```

---

### `infocorner/sync-time-inventory`
File: [src/app/api/infocorner/sync-time-inventory/route.ts](src/app/api/infocorner/sync-time-inventory/route.ts)
`POST /api/infocorner/sync-time-inventory` — run once per shipping-package ID (sequential loop)

**1. WMS lookup for the shipment**
```sql
SELECT
    o.wms_order_code        AS shipment_id,
    o.shipping_package_id,
    MIN(o.created_at)       AS shipment_creation_date
FROM `wms.order_items` o
WHERE CAST(o.shipping_package_id AS STRING) = @shipping_package_id
GROUP BY o.wms_order_code, o.shipping_package_id
LIMIT 1
```

**2. Inventory score lookup, both facilities**
```sql
SELECT
    shipment_id,
    product_id,
    inventory_count,
    facility
FROM `optimadb.shipment_item_score_details`
WHERE facility IN ('NXS1', 'NXS2')
  AND CAST(shipment_id AS STRING) = @shipment_id
```

---

### `infocorner/shippment-rtd`
File: [src/app/api/infocorner/shippment-rtd/route.ts](src/app/api/infocorner/shippment-rtd/route.ts)
`POST /api/infocorner/shippment-rtd` — chunked, 20 shipping-package IDs per call; returns CSV
```sql
WITH latest AS (
  SELECT * EXCEPT(row_num)
  FROM (
    SELECT oih.*,
      ROW_NUMBER() OVER (
        PARTITION BY oih.shipping_package_id, oih.item_type
        ORDER BY oih.updated_at DESC
      ) AS row_num
    FROM `wms.order_items_history` oih
    WHERE CAST(oih.shipping_package_id AS STRING) IN UNNEST(@shipping_ids)
  )
  WHERE row_num = 1
)
SELECT
    oih.shipping_package_id AS shipping_id,
    MAX(oih.fitting_id) AS fitting_id,

    MAX(CASE WHEN oih.item_type = 'LEFTLENS' THEN oih.status END) AS leftlens_status,
    MAX(CASE WHEN oih.item_type = 'RIGHTLENS' THEN oih.status END) AS rightlens_status,
    MAX(CASE WHEN oih.item_type = 'FRAME' THEN oih.status END) AS frame_status,

    MAX(CASE WHEN oih.item_type = 'LEFTLENS' THEN oih.product_id END) AS leftlens_pid,
    MAX(CASE WHEN oih.item_type = 'RIGHTLENS' THEN oih.product_id END) AS rightlens_pid,
    MAX(CASE WHEN oih.item_type = 'FRAME' THEN oih.product_id END) AS frame_pid

FROM latest oih
GROUP BY oih.shipping_package_id
ORDER BY oih.shipping_package_id
```

---

### `infocorner/qcf-order-info`
File: [src/app/api/infocorner/qcf-order-info/route.ts](src/app/api/infocorner/qcf-order-info/route.ts)
`POST /api/infocorner/qcf-order-info`
```sql
SELECT
  shipping_package_id,
  barcode,
  qc_fail_count,
  reason_name,
  status,
  updated_by,
  FORMAT_TIMESTAMP('%F %T', updated_at) AS updated_at
FROM `orderqc.qc_status_history`
WHERE CAST(shipping_package_id AS STRING) = @shipping_package_id
ORDER BY updated_at DESC
```

---

### `infocorner/po-details`
File: [src/app/api/infocorner/po-details/route.ts](src/app/api/infocorner/po-details/route.ts)
`POST /api/infocorner/po-details` — max 10 PO numbers per call; returns CSV
```sql
SELECT
  po_num,
  product_id,
  version,
  quantity,
  pending_quantity,
  vendor_unit_cost_price,
  created_at,
  updated_at
FROM `nexs.purchase_order_item`
WHERE CAST(po_num AS STRING) IN UNNEST(@po_nums)
ORDER BY po_num, product_id
```

---

### `infocorner/plant-pid-finder`
File: [src/app/api/infocorner/plant-pid-finder/route.ts](src/app/api/infocorner/plant-pid-finder/route.ts)
`POST /api/infocorner/plant-pid-finder` — max 50 PIDs; JSON or CSV depending on `download`
```sql
SELECT
  pid,
  location,
  barcode
FROM `nexs_ims.barcode_item`
WHERE CAST(pid AS STRING) IN UNNEST(@pids)
  AND facility = 'NXS1'
  AND `condition` = 'GOOD'
  AND status = 'AVAILABLE'
  AND availability = 'AVAILABLE'
  AND location_type <> 'RESERVED'
ORDER BY pid, location
```

---

### `infocorner/plant-pid-finder/bulk`
File: [src/app/api/infocorner/plant-pid-finder/bulk/route.ts](src/app/api/infocorner/plant-pid-finder/bulk/route.ts)
`POST /api/infocorner/plant-pid-finder/bulk` — always returns CSV
```sql
SELECT
  pid,
  location,
  barcode
FROM `nexs_ims.barcode_item`
WHERE CAST(pid AS STRING) IN UNNEST(@pids)
  AND facility = 'NXS1'
  AND `condition` = 'GOOD'
  AND status = 'AVAILABLE'
  AND availability = 'AVAILABLE'
  AND location_type <> 'RESERVED'
GROUP BY pid, location, barcode
ORDER BY pid, location, barcode
```

---

### `infocorner/order-created-when`
File: [src/app/api/infocorner/order-created-when/route.ts](src/app/api/infocorner/order-created-when/route.ts)
`POST /api/infocorner/order-created-when` — chunked, 20 increment IDs per call
```sql
SELECT
  increment_id,
  order_created_at
FROM `wms.orders`
WHERE CAST(increment_id AS STRING) IN UNNEST(@increment_ids)
```

---

### `infocorner/numbers`
File: [src/app/api/infocorner/numbers/route.ts](src/app/api/infocorner/numbers/route.ts)
`GET /api/infocorner/numbers` — JIT/Regular order counts for D-2/D-1/Today.
Note: this one hardcodes `lenskart-datahub` rather than using `BIGQUERY_DATA_PROJECT_ID`.
```sql
SELECT
  oi.facility_code,
  oih.order_item_type,
  COUNT(DISTINCT IF(DATE(oi.created_at) = CURRENT_DATE() - INTERVAL 2 DAY,
    oi.shipping_package_id, NULL)) AS D_2,
  COUNT(DISTINCT IF(DATE(oi.created_at) = CURRENT_DATE() - INTERVAL 1 DAY,
    oi.shipping_package_id, NULL)) AS D_1,
  COUNT(DISTINCT IF(DATE(oi.created_at) = CURRENT_DATE()
    AND oih.order_priority = 1, oi.shipping_package_id, NULL)) AS TODAY
FROM `lenskart-datahub.wms.order_items` oi
JOIN `lenskart-datahub.wms.order_item_header` oih
  ON oi.shipping_package_id = oih.shipping_package_id
WHERE oi.facility_code IN ('NXS1', 'NXS2')
  AND oi.fitting_type IN ('REQD', 'DONE')
  AND DATE(oi.created_at) BETWEEN CURRENT_DATE() - INTERVAL 2 DAY AND CURRENT_DATE()
  AND oih.order_item_type IN ('JIT', 'REGULAR')
GROUP BY oi.facility_code, oih.order_item_type
```

---

### `infocorner/barcode-scan`
File: [src/app/api/infocorner/barcode-scan/route.ts](src/app/api/infocorner/barcode-scan/route.ts)
`POST /api/infocorner/barcode-scan` — single-barcode scan lookup (barcode = last 12 chars of scan input)
```sql
SELECT
  barcode,
  pid,
  location,
  TRIM(UPPER(`condition`)) AS `condition`,
  TRIM(UPPER(status))       AS status,
  TRIM(UPPER(availability)) AS availability
FROM `nexs_ims.barcode_item`
WHERE barcode = @barcode
LIMIT 1
```

---

### `infocorner/order-info`
File: [src/app/api/infocorner/order-info/route.ts](src/app/api/infocorner/order-info/route.ts)
`POST /api/infocorner/order-info` — single fitting ID, or bulk (chunked 350 fitting IDs per call, up to 150,000 total)
```sql
SELECT
  FORMAT_TIMESTAMP('%Y/%m/%d %H:%M:%S', TIMESTAMP_ADD(TIMESTAMP(action_time), INTERVAL 330 MINUTE)) AS action_time,
  product_id,
  barcode,
  shipping_package_id,
  status,
  facility_code,
  fitting_id,
  parent_location,
  updated_by,
  item_type,
  qc_fail_count,
  operation,
  hold_reason
FROM `wms.order_items_history`
WHERE CAST(fitting_id AS STRING) IN UNNEST(@fitting_ids)
ORDER BY fitting_id, action_time ASC
```
(The single-fitting path runs the same query without the `fitting_id` in the
`ORDER BY`, over one ID.)

---

### `infocorner/barcode-details`
File: [src/app/api/infocorner/barcode-details/route.ts](src/app/api/infocorner/barcode-details/route.ts)
`POST /api/infocorner/barcode-details` — chunked, 1,000 barcodes per call (up to 100,000 total), streamed CSV of each barcode's last 4 locations
```sql
WITH ranked AS (
  SELECT
    bi.*,
    ROW_NUMBER() OVER (
      PARTITION BY bi.barcode
      ORDER BY bi.updated_at DESC
    ) AS rn
  FROM `nexs_ims.barcode_item_history` bi
  WHERE bi.barcode IN UNNEST(@barcodes)
)
SELECT
    t.pid,
    t.barcode,

    MAX(CASE WHEN t.rn = 1 THEN t.location END) AS Latest_Location,
    MAX(CASE WHEN t.rn = 2 THEN t.location END) AS Second_Latest_Location,
    MAX(CASE WHEN t.rn = 3 THEN t.location END) AS Third_Latest_Location,
    MAX(CASE WHEN t.rn = 4 THEN t.location END) AS Fourth_Latest_Location,

    MAX(CASE WHEN t.rn = 1 THEN t.updated_at END) AS updated_at_latest,
    MAX(CASE WHEN t.rn = 1 THEN t.status END) AS status,
    MAX(CASE WHEN t.rn = 1 THEN t.condition END) AS condition,
    MAX(CASE WHEN t.rn = 1 THEN t.availability END) AS availability

FROM ranked t
WHERE t.rn <= 4
GROUP BY t.pid, t.barcode
ORDER BY t.barcode
```

---

## Packing / Dispatch

### `packing-dispatch/dump`
File: [src/app/api/packing-dispatch/dump/route.ts](src/app/api/packing-dispatch/dump/route.ts)
`GET /api/packing-dispatch/dump?facility=NXS1&days=7` — unassigned-orders dump (server-side replacement for a slower extension endpoint); `days` is a bounded integer inlined into the interval
```sql
SELECT
  store_code,
  soft_courier,
  channel,
  order_priroity,
  order_created_at,
  updated_at,
  shipment_id,
  increment_id
FROM `wms.store_order_consolidation`
WHERE shipment_status = 'INVOICED'
  AND box_status = 'UNASSIGNED'
  AND facility = @facility
  AND TIMESTAMP(updated_at) >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL <days> DAY)
```
Note: `order_priroity` is misspelled in the source schema and matched as-is.

---

## ASRS

### `asrs/tote-master`
File: [src/app/api/asrs/tote-master/route.ts](src/app/api/asrs/tote-master/route.ts)
`POST /api/asrs/tote-master` — tote scan, partitions results by `_PR<n>` suffix in `location`
```sql
SELECT pid, barcode, location
FROM `nexs_ims.barcode_item`
WHERE location LIKE @location_prefix
```

---

## Summary table

| Route | Method | Tables touched |
|---|---|---|
| `omt/tracer-pro` | POST | `wms.order_items`, `wms.order_item_header`, `orderqc.qc_status_history` |
| `omt/tracer-pro/bulk` | POST | `wms.order_items`, `wms.order_item_header`, `orderqc.qc_status_history` |
| `infocorner/sync-time-location` | POST | `picking.picklist_order_item` |
| `infocorner/sync-time-inventory` | POST | `wms.order_items`, `optimadb.shipment_item_score_details` |
| `infocorner/shippment-rtd` | POST | `wms.order_items_history` |
| `infocorner/qcf-order-info` | POST | `orderqc.qc_status_history` |
| `infocorner/po-details` | POST | `nexs.purchase_order_item` |
| `infocorner/plant-pid-finder` | POST | `nexs_ims.barcode_item` |
| `infocorner/plant-pid-finder/bulk` | POST | `nexs_ims.barcode_item` |
| `infocorner/order-created-when` | POST | `wms.orders` |
| `infocorner/numbers` | GET | `wms.order_items`, `wms.order_item_header` |
| `infocorner/barcode-scan` | POST | `nexs_ims.barcode_item` |
| `infocorner/order-info` | POST | `wms.order_items_history` |
| `infocorner/barcode-details` | POST | `nexs_ims.barcode_item_history` |
| `packing-dispatch/dump` | GET | `wms.store_order_consolidation` |
| `asrs/tote-master` | POST | `nexs_ims.barcode_item` |
