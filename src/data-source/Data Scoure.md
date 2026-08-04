# Data Source Map

The modules are grouped according to the application sidebar. "None" means the module does not persist data to a server-side destination.

## Grafana Dumps

| Module        | Read source and query/lookup                                                                                                                                                                                                                                            | Write                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Grafana Dumps | BigQuery (`nexs_ims`, `nexs_cid`) — selectable queries over `barcode_item`, `warehouse_inventory`, and `warehouse_blocked_inventory`; filters by facility, location, owner, condition, availability, status, and PID range; groups inventory by PID/location | None; CSV downloaded in browser |

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
| PID Hunter Transfer | MyDB —`scannedBarcodeInventory.findMany` for submitted barcodes and current locations                                                          | MyDB scan inventory/location       |
| PID Stock-out       | MyDB — inventory lookup by scanned barcode before stock-out                                                                                      | MyDB - deletes stocked-out records |
| MWarehouse Scan     | NexS MySQL; MyDB — NexS barcode/order lookup; shipping metadata by shipping ID; existing manual-warehouse scan by barcode/tray                   | MyDB manual-warehouse scans        |
| Order Master        | NexS MySQL; MyDB — order/product lookup in NexS; existing order and validation/check records by order ID                                         | MyDB order/check records           |
| O-U-D Upload        | Uploaded CSV — parses header-mapped order-update rows and checks required values                                                                 | MyDB order-update data             |

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
| Final QC         | NexS MySQL; Lens Lab DB; local scanner agent — fitting/order lookup by fitting ID; tray QC state and prior scan lookup; scanner-agent status/data call | Lens Lab DB; local scanner-agent state |
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
