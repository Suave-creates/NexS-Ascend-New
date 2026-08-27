# Data Source Map

The modules are grouped according to the application sidebar. "None" means the module does not persist data to a server-side destination.

## Grafana Dumps

| Module        | Read source and query/lookup                                                                                                                                                                                                                                            | Write                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Grafana Dumps | BigQuery (`nexs_ims`, `nexs_cid`) inventory dumps; MEI JobViewer SQL Server (`dbEvents` plus END CUT detail/dictionary tables) — authenticated fixed rolling 48-hour IST export queried in calendar-day chunks | None; CSV downloaded in browser |

## CL-CLs

| Module            | Read source and query/lookup                                                                                                                         | Write                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| ConsolidAte       | Dispatch DB — available locations; order-QC dump by scanned order/barcode; active package/location assignment; consolidation history by date/filter | Dispatch DB                        |
| ConsolidAte PTL   | Dispatch DB — same order-QC and active-location lookups as ConsolidAte, plus PTL rack/location state                                                | Dispatch DB; rack/light controller |
| Auto Order QC     | Dispatch DB; BigQuery/NexS dump — pending QC rows, existing processed orders, and refreshed order-QC dump records                                   | Dispatch DB; NexS QC workflow      |
| Kitne Parcel The? | NexS MySQL — aggregate parcel/order counts from NexS order tables for the requested date/filter                                                     | None; CSV downloaded in browser    |

## ASRS

| Module              | Read source and query/lookup                                                                                                                      | Write                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Tote Master         | BigQuery —`SELECT pid, barcode, location FROM nexs_ims.barcode_item WHERE location LIKE @location_prefix`                                      | None                               |
| PID Hunter          | NexS IMS history API; MyDB — history lookup for scanned barcode/PID;`scannedBarcodeInventory.findUnique/findFirst` to detect current inventory | MyDB scan inventory                |
| PID Stock-out       | MyDB — inventory lookup by scanned barcode or location before stock-out                                                                          | MyDB transfer archive with handover input; removes live inventory |
| MWarehouse Scan     | NexS MySQL; MyDB — NexS barcode/order lookup; shipping metadata by shipping ID; existing manual-warehouse scan by barcode/tray                   | MyDB manual-warehouse scans        |
| Order Master        | NexS MySQL; MyDB — order/product lookup in NexS; existing order and validation/check records by order ID                                         | MyDB order/check records           |
| O-U-D Upload        | Uploaded CSV — parses header-mapped order-update rows and checks required values                                                                 | MyDB order-update data             |

## Stock In

| Module              | Read source and query/lookup                                                                                                                                                              | Write                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Decanting Analytics | BigQuery (`nexs_ims.barcode_item_history`, `inventory.products`) - inbound to ASRS tote locations by date, prior EGL/PL history, and HSN classification; defaults to a rolling 48-hour IST range and permits up to 62 days | None; CSV downloaded in browser |
| Bermuda Triangle Analytics | BigQuery (`nexs_ims.barcode_item_history`, `inventory.products`) - inbound to and outward from the exact Bermuda Triangle location at fixed facility `NXS1`; each direction is counted independently as the first qualifying movement per IST date and barcode; defaults to a rolling 48-hour IST range | None; Inbound/Outward/Net reporting CSVs plus separate inbound and outward barcode-level CSV dumps downloaded in browser |
| Lens Decanting      | Power BI (`rs_order_lens_level`) for the T-2 seven-day PID ROS scope; BigQuery (`nexs_ims.barcode_item`, `nexs_cid.warehouse_inventory`, `nexs_cid.warehouse_blocked_inventory`, `inventory.products`) for current stock and enrichment; Google Sheets `EyeFrame!R:U` for GRN | None; colored XLSX downloaded in browser |
| Frame Decanting     | Power BI (`fulfilment_data`) for three-calendar-month highest-month ROS, `increff_wh_dispatch_report` for Bulk Required, and `transfer_data` for NXS2-to-NXS1 transfer pendency; BigQuery for live inventory/product enrichment; Google Sheets `EyeFrame!R:U` for GRN; bundled `src/lib/plc flag.csv` and `src/lib/pid excusion.csv` snapshots for PLC and PID exclusions (server-path overrides supported) | None; colored XLSX downloaded in browser |
| Manual WH Analytics | BigQuery (`nexs_ims.barcode_item_history`, `inventory.products`) - inbound to the configured manual-warehouse location prefixes with the same day-wise HSN and input-scope reporting; defaults to a rolling 48-hour IST range | None; scope-detailed CSV downloaded in browser |
| Reserve Inventory   | BigQuery (`nexs_ims.barcode_item_history`, `inventory.products`) - day-wise inward, outward, and closing available inventory for the configured EGL/PL reserve locations, split by HSN classification; defaults to two IST calendar days (48 hours) while permitting ranges up to 62 days | Persistent two-day read-through snapshot cache; CSV downloaded in browser |

### Bermuda Triangle reporting details

- The facility is fixed to `NXS1`; the page does not offer facility selection. Its default range is the rolling previous 48 hours in IST.
- The rolling 48-hour view is served from the last successful persistent snapshot and refreshed at most once in the background after its 10-minute freshness window. The snapshot survives app-only Docker recreation through the `app_data` volume; manually applied date/time ranges remain exact live queries.
- Inbound is the first entry into `NXS1` / `Bermuda Triangle` for each IST date and barcode. Outward is the first exit from that same facility/location for each IST date and barcode. The two directions are evaluated independently, so a barcode can contribute once to each direction on the same date.
- In number reporting, the metric can be switched between Inbound, Outward, and Net (`Inbound - Outward`). Datewise Location reporting places the categorized Locations in columns: Location means the movement's origin for inbound and its destination for outward.
- The public, unauthenticated inbound barcode dump is `GET /api/stock-in/bermuda-triangle-analytics/barcode-dump`; the public, unauthenticated outward barcode dump is `GET /api/stock-in/bermuda-triangle-analytics/outward-barcode-dump`. Each endpoint accepts a maximum 7-day range.

## Manual Warehouse

| Module          | Read source and query/lookup                                                                                             | Write                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| Location Finder | NexS MySQL; MyDB — NexS inventory/order lookup by scanned ID;`manualWarehouseSetUp.findUnique` by identifier/location | None                        |
| Cycle Count     | NexS MySQL — barcode item/inventory lookup for scanned tray/location and quantity                                       | None                        |
| Excel Upload    | Uploaded Excel workbook — reads the first sheet, maps setup columns, and validates non-empty rows                       | MyDB manual-warehouse setup |

## Operations

| Module       | Read source and query/lookup                                                                           | Write                                 |
| ------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Tray Finder  | Bosch CV MySQL — tray/location mapping lookup by tray ID, PID, or uploaded identifier list            | None; CSV/Excel downloaded in browser |
| Tray RFID    | External`whrfid.lenskart.com` application — query behavior is owned by the external application     | External application                  |
| Tray Scanner | MyDB —`shippingMetadata.findUnique` by scanned shipping/location identifier                         | None                                  |
| Tray PRO MEI | NexS MySQL — tray/order QC lookup for submitted tray IDs; returns tray, order, PID, and QC status     | None; Excel downloaded in browser     |
| Excel Upload | Uploaded Excel workbook — parses tray/shipping metadata rows and checks existing metadata identifiers | MyDB operations/shipping metadata     |

## Lens Lab

| Module           | Read source and query/lookup                                                                                                                            | Write                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Final QC         | BigQuery (`wms.order_items`, `wms.power`) — fitting/order lookup and prescribed-power/lens metadata via `order_items.power_id = power.id`; local lensometer agent — device status and live measurements | Lens Lab MySQL (`blanks-fqc`) — transactional inspection-result insert |
| Blank IN_PICKING | NexS WMS API; Lens Lab DB —`GET fittingDetails/{locationId}`; existing location-blank result/state lookup                                            | Lens Lab DB                            |
| JIT PD Stamp     | NexS MySQL — joins fitting/order workflow data for the scanned fitting ID and evaluates PD/JIT status                                                  | None; CSV downloaded in browser        |

## Packing Dispatch

| Module           | Read source and query/lookup                                                                                          | Write                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Packing Scans    | MyDB — shipping metadata by shipping ID and existing packing scans/count by station                                  | MyDB packing scans                                 |
| Dispatch Scans   | MyDB — shipping metadata by shipping ID and existing dispatch scans/count by station                                 | MyDB dispatch scans                                |
| Tray Releaser    | BigQuery — tray/order dump by facility and status; NexS WMS APIs — fetch tray contents/order QC state               | NexS order-QC/tray-release APIs; local lock file   |
| CL/CLs Scans     | MyDB — shipping metadata lookup and CL scan history/count by station                                                 | MyDB CL scans                                      |
| FR0 Scans        | MyDB — shipping metadata lookup and FR0 scan history/count by station                                                | MyDB FR0 scans                                     |
| Bulk Scans       | MyDB — shipping metadata lookup and bulk scan history/count by station                                               | MyDB bulk scans                                    |
| FR0/BULK HOTO    | MyDB — matching FR0/Bulk records by scanned shipment and existing handover state                                     | MyDB HOTO records                                  |
| NDD Shipment     | MyDB — NDD shipment rows filtered by selected date; existing shipment by identifier                                  | MyDB NDD shipment data                             |
| NDD RCA          | NexS MySQL — shipment/order RCA lookup by date; local CSV backup lookup; Google Sheet/Drive file lookup by date/name | Local CSV backups; Google Sheets; Google Drive     |
| Kinte parcel the | NexS MySQL — aggregate parcel/order count query for submitted date/filter                                            | None; CSV downloaded in browser                    |
| Excel Upload     | Uploaded Excel workbook — reads first-sheet shipping metadata; checks/matches shipping ID and city columns           | MyDB shipping metadata - existing data is replaced |

## Metal Frame

| Module            | Read source and query/lookup                                                                                                   | Write          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Fitting Dashboard | Metal Frame DB — fitting scans filtered/count by line number; existing barcode scan lookup                                    | Metal Frame DB |
| QC Dashboard      | Metal Frame DB; configured QC reasons — QC scan by barcode; counts by QC person; configured reason list                       | Metal Frame DB |
| Tumbling          | Metal Frame DB — process, container, station, configuration, dashboard-progress, and history queries with status/date filters | Metal Frame DB |

## Courier Handover

| Module            | Read source and query/lookup                                                                  | Write                         |
| ----------------- | --------------------------------------------------------------------------------------------- | ----------------------------- |
| Facility Out Scan | MyDB — existing courier handover by scanned ID;`courierHandover.count` filtered by partner | MyDB courier-handover records |

## Planning and Process Excellence

| Module                 | Read source and query/lookup                                                                                                                                                                                                                                                                    | Write                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Order Cancellation RCA | Power BI `Fulfilment Order Analytics_Final` - distinct orders, `uw_item_id` reconciliation, handover types, and cancellation rows for the selected range; Google Sheets - LF/local-fitting, plant, and power-exception evidence; NexS Cancellation Portal - matching cancellation requests; decisions are deduplicated at increment-ID level | None; CSV downloaded in browser |

## Info-Corner

| Module              | Read source and query/lookup                                                           | Write                                 |
| ------------------- | -------------------------------------------------------------------------------------- | ------------------------------------- |
| Order Logs          | BigQuery — order workflow/log rows by submitted order IDs                             | None; Excel downloaded in browser     |
| Barcode Details     | BigQuery — barcode item and order details by barcode/order identifier                 | None; CSV downloaded in browser       |
| Plant PID Finder    | BigQuery — inventory/barcode records filtered by plant/facility and PID list          | None; CSV downloaded in browser       |
| QCF Logs            | BigQuery — QCF order information by order/fitting identifier                          | None                                  |
| Tracer pro MQCF     | BigQuery — MQCF/tracer records for submitted tray/order values, including bulk lookup | None; Excel downloaded in browser     |
| Sync Time Inventory | BigQuery — inventory event timestamps and current item state by barcode/order list    | None; CSV downloaded in browser       |
| Order Created When  | BigQuery — order creation timestamp/status by order ID list                           | None; CSV/Excel downloaded in browser |
| Sync-time Location  | BigQuery — barcode location and location-sync timestamps by submitted values          | None; CSV/Excel downloaded in browser |
| Shipment RTDetails  | BigQuery — shipment RT details filtered by shipment/order identifiers                 | None; CSV downloaded in browser       |
| PO Details          | BigQuery — purchase-order details by PO/order identifiers                             | None; CSV downloaded in browser       |
| Bulk Status Info    | NexS MySQL — bulk order/status query by submitted order or tray IDs                   | None                                  |
| Numbers (BQ)        | BigQuery — dashboard aggregate/count queries defined by the Numbers endpoint          | None                                  |

## Extensions

| Module             | Read source and query/lookup                                                     | Write            |
| ------------------ | -------------------------------------------------------------------------------- | ---------------- |
| Browser Extensions | Static application assets;`GET /api/flash-rules` for the current rule document | None             |
| Flash Rules        | Server JSON file — reads and JSON-parses`data/flash-rules.json`               | Server JSON file |
