
Can we add Inventroy Dumps in the frontend only
Heavy Queries and Heavy Data
??
No output to display only processing load bar and Dump download

Queiers are

ASRS TOTE DUMP
#Complete ASRS Dump Long Query Dont Kill till 1500 Secs
SELECT
    pid,
    location,
    COUNT(*) AS barcode_count,
    MAX(updated_at) AS last_updated_at
FROM barcode_item
WHERE facility = 'NXS1'
  AND location LIKE 'NXS1-ASRS%'
  AND `condition` = 'GOOD'
  AND availability = 'AVAILABLE'
  AND `status` = 'AVAILABLE'
GROUP BY pid, location;

# Blocked Inventory

SELECT pid, quantity
FROM nexs_cid.warehouse_blocked_inventory
WHERE facility = 'NXS1'
  AND legal_owner = 'LKIN'
  AND pid > 10000 AND pid < 10000000
  AND quantity <> 0   -- ✅ non zero only

UNION ALL

SELECT pid, quantity
FROM nexs_cid.warehouse_blocked_inventory
WHERE facility = 'NXS1'
  AND legal_owner = 'LKIN'
  AND pid > 1000001 AND pid < 800000000
  AND quantity <> 0

UNION ALL

SELECT pid, quantity
FROM nexs_cid.warehouse_blocked_inventory
WHERE facility = 'NXS1'
  AND legal_owner = 'LKIN'
  AND pid > 80000001 AND pid < 1000000000
  AND quantity <> 0

UNION ALL

SELECT pid, quantity
FROM nexs_cid.warehouse_blocked_inventory
WHERE facility = 'NXS1'
  AND legal_owner = 'LKIN'
  AND pid > 100000001 AND pid < 10000000000
  AND quantity <> 0;

# Dubai Inventory



SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'DXB1'
  AND wi.legal_owner = 'LKAE'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 10000 AND wi.pid < 10000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0   -- ✅ non zero only

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'DXB1'
  AND wi.legal_owner = 'LKAE'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 1000001 AND wi.pid < 800000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'DXB1'
  AND wi.legal_owner = 'LKAE'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 80000001 AND wi.pid < 1000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'DXB1'
  AND wi.legal_owner = 'LKAE'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 100000001 AND wi.pid < 10000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0;


# EGL MANUAL

SELECT pid, location, COUNT(*) AS barcode_count, MAX(updated_at) AS last_updated_at
FROM barcode_item
WHERE facility = "NXS1"
  AND location LIKE "NXS1-EGL_Manual%"
  AND `condition` = 'GOOD'
  AND availability = 'AVAILABLE'
  AND status = 'AVAILABLE'
GROUP BY pid, location;



# Manual Location Stock Progressive

#manual stk prg
SELECT pid, location, COUNT(*) AS barcode_count
FROM nexs_ims.barcode_item
WHERE facility = "NXS1"
  AND location LIKE "NXS1-156%"
  OR location LIKE "NXS1-160%"
  OR location LIKE "NXS1-PL_Manual-02%"
  OR location LIKE "NXS1-PL_Manual-01%"
  AND `condition` = 'GOOD'
  AND availability = 'AVAILABLE'
  AND status = 'AVAILABLE'
GROUP BY pid, location



# Manual Warehouse Replenishment

#Manual Warehouse Replenishent
SELECT pid, location, COUNT(*) AS barcode_count
FROM nexs_ims.barcode_item
WHERE facility = 'NXS1'
  AND `condition` = 'GOOD'
  AND availability = 'AVAILABLE'
  AND status = 'AVAILABLE'
  AND
    location LIKE 'NXS1-156%'
    OR location LIKE 'NXS1-160%'
    OR location LIKE 'NXS1-EGL_Fastzone%'
    OR location LIKE 'NXS1-PL_Tinted_HIGH%'
    OR location LIKE 'NXS1-PL_Tinted_LOW%'
    OR location LIKE 'NXS1-PL_TOKAI%'
    OR location LIKE 'NXS1-PL_Photochromatic%'
    OR location LIKE 'NXS1-PL_Other%'
    OR location LIKE 'NXS1-PL_Nightdrive%'
    OR location LIKE 'NXS1-Progressive_MR8%'
    OR location LIKE 'NXS1-PL_Rodenstock%'
    OR location LIKE 'NXS1-Progressive_Acrylic%'
    OR location LIKE 'NXS1-PL_167_160Bluecut%'
    OR location LIKE 'NXS1-PL_174Bluecut%'
    OR location LIKE 'NXS1-PL_ARC%'
    OR location LIKE 'NXS1-PL_MR8_IR%'
    OR location LIKE 'NXS1-156_Bluecut%'
    OR location LIKE 'NXS1-EGL_Eye%'
    OR location LIKE 'NXS1-EGL_Sun%'
 OR location LIKE 'NXS1-Bhiwadi_Manual-EGL_Eye%'
 OR location LIKE 'NXS1-Bhiwadi_Manual-EGL_Fastzone%'
OR location LIKE 'NXS1-Bhiwadi_Manual-EGL_Sun%'
GROUP BY pid, location;


# NXS1 Inventory



# NXS1 Inventory

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS1'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 10000 AND wi.pid < 10000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0   -- ✅ non zero only

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS1'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 1000001 AND wi.pid < 800000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS1'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 80000001 AND wi.pid < 1000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS1'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 100000001 AND wi.pid < 10000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0;



## NXS2 INVENTORY


# NXS2 Inventory

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS2'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 10000 AND wi.pid < 10000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0   -- ✅ non zero only

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS2'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 1000001 AND wi.pid < 800000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS2'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 80000001 AND wi.pid < 1000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM nexs_cid.warehouse_inventory wi
LEFT JOIN nexs_cid.warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'NXS2'
  AND wi.legal_owner = 'LKIN'
  AND wi.condition = 'GOOD'
  AND wi.availability = 'AVAILABLE'
  AND wi.status = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 100000001 AND wi.pid < 10000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0;



# Reserve Inventory

select pid,sum(quantity) from nexs_cid.warehouse_inventory
where facility = 'NXS1'
and location_type = 'RESERVED'
group by pid;


# Singapore Inventory



SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'SGNXS1'
  AND wi.legal_owner = 'LKSG'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 10000 AND wi.pid < 10000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0   -- ✅ non zero only

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'SGNXS1'
  AND wi.legal_owner = 'LKSG'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 1000001 AND wi.pid < 800000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'SGNXS1'
  AND wi.legal_owner = 'LKSG'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 80000001 AND wi.pid < 1000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'SGNXS1'
  AND wi.legal_owner = 'LKSG'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 100000001 AND wi.pid < 10000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0;



# Thailand Inventory



SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'TH01'
  AND wi.legal_owner = 'LKTH'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 10000 AND wi.pid < 10000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0   -- ✅ non zero only

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'TH01'
  AND wi.legal_owner = 'LKTH'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 1000001 AND wi.pid < 800000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'TH01'
  AND wi.legal_owner = 'LKTH'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 80000001 AND wi.pid < 1000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0

UNION ALL

SELECT wi.pid, wi.facility, wi.quantity - IFNULL(wbi.quantity, 0) AS available_quantity
FROM warehouse_inventory wi
LEFT JOIN warehouse_blocked_inventory wbi
    ON wi.pid = wbi.pid
   AND wi.facility = wbi.facility
   AND wi.legal_owner = wbi.legal_owner
WHERE wi.facility = 'TH01'
  AND wi.legal_owner = 'LKTH'
  AND wi.`condition` = 'GOOD'
  AND wi.`availability` = 'AVAILABLE'
  AND wi.`status` = 'AVAILABLE'
  AND wi.location_type = 'DEFAULT'
  AND wi.pid > 100000001 AND wi.pid < 10000000000
  AND (wi.quantity - IFNULL(wbi.quantity, 0)) <> 0;


# BR01 Inventory Dump

#Vistaclara Inventory Dump
SELECT
    pid,
    location,
    COUNT(*) AS barcode_count,
    MAX(updated_at) AS last_updated_at
FROM nexs_ims.barcode_item
WHERE facility = 'BR01'
  AND location LIKE 'BR01-BRCL%'
  AND `condition` = 'GOOD'
  AND availability = 'AVAILABLE'
  AND status = 'AVAILABLE'
GROUP BY pid, location;


# BR01 Putaway Pending

SELECT
    pid,
    location,
    barcode,
    updated_at
FROM nexs_ims.barcode_item
WHERE (pid, location) IN (
        SELECT pid, location
        FROM nexs_ims.barcode_item
        WHERE facility = 'BR01'
          AND location LIKE 'BR01.GOOD%'
          AND `condition` = 'GOOD'
          AND availability = 'AVAILABLE'
          AND status = 'PUTAWAY_PENDING'
        GROUP BY pid, location
    )
  AND availability = 'AVAILABLE'
  AND `condition` = 'GOOD'
  AND status = 'PUTAWAY_PENDING';
