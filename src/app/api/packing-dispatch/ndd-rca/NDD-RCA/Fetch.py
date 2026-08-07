import os
import sys
import glob
import time
import urllib.error
import urllib.request
import json as json_module
from datetime import date, timedelta
import pandas as pd

# Authentication helpers live centrally, outside the API route tree.
HERE = os.path.dirname(os.path.abspath(__file__))
RESOURCE_ROOT = os.path.abspath(os.path.join(HERE, "../../../../../..", "src", "utils", "resources"))
sys.path.insert(0, os.path.join(RESOURCE_ROOT, "power-bi"))
from pbi_auth import get_token

import importlib

try:
    requests = importlib.import_module("requests")
except ImportError:
    from types import SimpleNamespace

    def post(url, headers=None, json=None, timeout=None):
        body = json_module.dumps(json).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=body,
            headers=headers or {},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                content = resp.read()
                text = content.decode("utf-8")
                return SimpleNamespace(
                    status_code=resp.getcode(),
                    text=text,
                    json=lambda: json_module.loads(text),
                )
        except urllib.error.HTTPError as err:
            content = err.read()
            text = content.decode("utf-8", errors="replace")
            return SimpleNamespace(
                status_code=err.code,
                text=text,
                json=lambda: json_module.loads(text) if text else {},
            )

    requests = SimpleNamespace(post=post)

# --- Config ---
ACCESS_TOKEN = get_token()
DATASET_ID = "cccc9c0d-5ed3-49bd-9d46-60afa8bce8be"   # "ODD Dashboard"

# Date range (inclusive). Format: YYYY-MM-DD. The Dashboard sets NDD_RCA_DATE;
# override it here only when running Fetch.py standalone for a different day.
START_DATE = os.environ.get("NDD_RCA_DATE", "2026-06-13")
END_DATE   = START_DATE

# The 85 columns of the report's "Order Level Data" visual, in export order,
# named exactly as they appear in the Excel export ("Order Level Data (49).xlsx").
# Most map straight to 'Raw Data'[<name>]; the OVERRIDE entries below are either
# per-visual renames or columns the visual pulls from related tables. The related
# tables join to 'Raw Data' many-to-one, so RELATED() resolves them inside the
# row context of the FILTER over 'Raw Data'. Mapping verified by value-matching
# every output column against the export (delivery-lifecycle timestamps drift
# forward over time as orders progress, but never contradict the export).
ORDER = [
    "created_at", "Dispatch_asper_sla_new", "increment_id", "item_id", "pos_item_id",
    "overall_unicom_at", "PowerUpdatedOverall", "payment_capture_time",
    "uw_item_id", "ref_uw_item_id", "brand", "unicom_order_code",
    "reference_unicom_order_code", "channel", "inv_status_type", "handover type",
    "Order_Country", "lens_package", "power_type", "product_id",
    "left_lens_pid", "right_lens_pid", "left_power_cyl", "left_power_sph",
    "right_power_cyl", "right_power_sph", "power type lens", "pfu_ever_flag",
    "jit flag", "franchise_id", "facility_code", "ship_to_cust", "pincode",
    "first_delivery_attempt", "delivery_date", "mark_receive_time", "handover_time",
    "nps_response_date", "nps_value", "nps_scale", "revenue_without_vat",
    "primary_return_reason", "secondary_return_reason", "shipment_at", "rts_at",
    "picking_at", "manifest_at", "cx_packing", "shipment_handover_time",
    "shipping_time", "dispatch_date_new", "min_complete_at", "city",
    "ship_to_cust_store", "Tracking Number", "lf_vendor", "lf_delivered_date",
    "overall_delivery_at", "lf_mark_sent_date", "frame_uff", "lens_uff",
    "qc_damage_nos", "order_fulfillable_time", "min_picklist_created",
    "min_shipment_creation", "min_asrs_allocated", "min_nxs_mei_entry",
    "qc_done", "mei_done", "fitting_done", "Final_Remark_NDDPerformance",
    "NDD_Deep_Dive_reason", "Breach_Type", "edd_time", "pnc_ever_flag",
    "dc_arrival_time", "out_for_delivery", "routing_code", "dc_courier_code",
    "priority", "Refund Status", "lk_cash_amount", "failure_reason",
    "shipping_package_code", "fulfilment facility",
]
# export name -> DAX source (anything not listed is 'Raw Data'[<export name>])
OVERRIDE = {
    "Order_Country":    "'Raw Data'[_country]",                          # visual rename
    "Tracking Number":  "'Raw Data'[tracking_no]",                       # visual rename
    "dc_arrival_time":  "RELATED('dc_arrival_ofd_data'[dc_arrival_time])",   # join on tracking_no
    "out_for_delivery": "RELATED('dc_arrival_ofd_data'[out_for_delivery])",  # join on tracking_no
    "routing_code":     "RELATED('DC_Location'[routing_code])",          # join on dc_key
    "dc_courier_code":  "RELATED('DC_Location'[courier_code])",          # join on dc_key
    "priority":         "RELATED('priority_flag'[priority])",            # join on ref_uw_item_id_uw_item_id
    "lk_cash_amount":   "RELATED('Refund_table'[lk_cash_amount])",       # join on ref_uw_item_id_uw_item_id
    "failure_reason":   "RELATED('Refund_table'[failure_reason])",       # join on ref_uw_item_id_uw_item_id
}
COLUMNS = [(name, OVERRIDE.get(name, f"'Raw Data'[{name}]")) for name in ORDER]

# Row-level translation of the report's "NDD SPL" view, validated against the
# "Applied filters" footer of the visual's own Excel export (ground truth).
# Prefix any line's "&&" with "//" to disable it.
# Skipped on purpose: Duration/Stages/Hour field parameters and "mins_meta = +30 mins"
# (they tune visuals/measures, not rows), and the page's second Date filter
# (the date range above replaces it).
NDD_SPL_FILTER = """
        && 'Raw Data'[New flag1] = 1
        && 'Raw Data'[_country] = "India"
        && 'Raw Data'[eligible_pincode_flag] = "Yes"
        && 'Raw Data'[handover type] = "Warehouse"
        && 'Raw Data'[fulfilment facility] IN {"NXS1", "BR01"}
        && NOT 'Raw Data'[fr tag] IN {"FR1_Lens Only", "FR2_Power Sun"}
        && 'Raw Data'[NDD_EDD_Eligible_flag] = 1
        && 'Raw Data'[Gold_Channel_Flag] = 1
        && 'Raw Data'[OneDayDelivery Flag] = "Yes"
        && 'Raw Data'[PowerType_New] IN {"SV", "FR0"}
        // [SyncedItems1] is a measure; the next two lines are its row-level equivalent
        && HOUR('Raw Data'[PowerUpdatedOverall]) < 21
        && TIMEVALUE('Raw Data'[odd_unicom_at]) <= TIME(21, 30, 0)
        // --- report-level filters (apply to all pages) ---
        && 'Raw Data'[channel] <> "Marketplace"
        && NOT 'Raw Data'[lens_package] IN {"Transition Progressive", "Rodenstock SV", "Tinted", "Tinted Eyeglasses Brown Lenses", "Tinted Eyeglasses Green Lenses", "Tinted Eyeglasses Grey Lenses", "Tinted Progressive Brown Lenses", "Tinted Progressive Green Lenses", "Tinted Progressive Grey Lenses", "Tokai", "Tokai Lutina", "Tokai Progressive", "Rodenstock Progressive", "Transition"}
        && 'Raw Data'[order_hour_flag] = 1
        && NOT CONTAINSSTRING('Raw Data'[product_name], "Carry Bag")
        && NOT CONTAINSSTRING('Raw Data'[product_name], "Zipper Case")
        && 'Raw Data'[City_Exclusion_flag] = 0
        && NOT CONTAINSSTRING('Raw Data'[payment_method], "medibuddy")
        && 'Raw Data'[tlp_ever_flag] <> "Yes"
        && ('Raw Data'[jit flag] = 1 || ISBLANK('Raw Data'[jit flag]))
        && 'Raw Data'[brand] <> "Phonic"
        && NOT 'Raw Data'[product_id] IN {208251, 47552}
"""

url = f"https://api.powerbi.com/v1.0/myorg/datasets/{DATASET_ID}/executeQueries"
headers = {"Authorization": f"Bearer {ACCESS_TOKEN}", "Content-Type": "application/json"}

# executeQueries SILENTLY truncates a wide result at ~530k values (NOT the documented
# 1M, and no error is raised). So we split each day's ROWS into atomic chunks (all 85
# columns per chunk) sized to stay well under that, then stack them. The chunk key is
# item_id MOD N with N forced ODD: item_ids here are all EVEN, so an even modulus would
# leave half the buckets empty and overfill the rest (that bug silently dropped ~6% of
# rows). run_pull() also verifies the row total against COUNTROWS to catch truncation.
ROWS_PER_CHUNK = 3000     # 3000 x 85 = 255k values, comfortably under the ~530k cap


def _odd_chunks(count):
    n = max(3, -(-count // ROWS_PER_CHUNK))   # ceil division
    return n if n % 2 else n + 1              # odd so even item_ids spread across all buckets


def fetch(day, nxt, i, n_chunks):
    cols_dax = ",\n        ".join(f"\"{name}\", {src}" for name, src in COLUMNS)
    dax_query = f"""
EVALUATE
SELECTCOLUMNS (
    FILTER (
        'Raw Data',
        'Raw Data'[created_at] >= DATE({day.year}, {day.month}, {day.day})
            && 'Raw Data'[created_at] < DATE({nxt.year}, {nxt.month}, {nxt.day})
            && MOD('Raw Data'[item_id], {n_chunks}) = {i}
{NDD_SPL_FILTER}
    ),
        {cols_dax}
)
"""
    t0 = time.monotonic()
    print(f"  {day} chunk {i + 1}/{n_chunks}: querying...", end="", flush=True)
    resp = requests.post(
        url, headers=headers,
        json={"queries": [{"query": dax_query}],
              "serializerSettings": {"includeNulls": True}},
        timeout=300,   # without this a stuck connection hangs forever
    )
    print(f" {time.monotonic() - t0:.0f}s", flush=True)
    if resp.status_code != 200:
        raise RuntimeError(f"Error {resp.status_code}: {resp.text}")
    df = pd.DataFrame(resp.json()["results"][0]["tables"][0]["rows"])
    df.columns = [c.split("[")[-1].rstrip("]") for c in df.columns]
    return df


def count_rows(day, nxt):
    dax = f"""EVALUATE ROW("n", COUNTROWS(FILTER('Raw Data',
        'Raw Data'[created_at] >= DATE({day.year}, {day.month}, {day.day})
            && 'Raw Data'[created_at] < DATE({nxt.year}, {nxt.month}, {nxt.day})
{NDD_SPL_FILTER})))"""
    resp = requests.post(url, headers=headers, json={"queries": [{"query": dax}]}, timeout=120)
    if resp.status_code != 200:
        raise RuntimeError(f"Error {resp.status_code}: {resp.text}")
    rows = resp.json()["results"][0]["tables"][0]["rows"]
    val = list(rows[0].values())[0] if rows else 0
    return int(val) if val else 0

def fetch_ids(ids):
    """Pull whole rows for specific item_ids, with NO NDD-SPL filter — used to recover
    orders that were in a Power BI export but have since drifted out of the live filter."""
    cols_dax = ",\n        ".join(f"\"{name}\", {src}" for name, src in COLUMNS)
    frames = []
    CHUNK = 2000   # ids/query (2000 x 85 = 170k cells, well under the 1M cap)
    for k in range(0, len(ids), CHUNK):
        id_list = ", ".join(ids[k:k + CHUNK])
        dax_query = f"""
EVALUATE
SELECTCOLUMNS (
    FILTER ( 'Raw Data', 'Raw Data'[item_id] IN {{ {id_list} }} ),
        {cols_dax}
)
"""
        t0 = time.monotonic()
        print(f"  recovering {min(CHUNK, len(ids) - k)} ids...", end="", flush=True)
        resp = requests.post(url, headers=headers,
            json={"queries": [{"query": dax_query}], "serializerSettings": {"includeNulls": True}},
            timeout=300)
        print(f" {time.monotonic() - t0:.0f}s", flush=True)
        if resp.status_code != 200:
            raise RuntimeError(f"Error {resp.status_code}: {resp.text}")
        df = pd.DataFrame(resp.json()["results"][0]["tables"][0]["rows"])
        df.columns = [c.split("[")[-1].rstrip("]") for c in df.columns]
        frames.append(df)
        time.sleep(1)
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


def run_pull():
    frames = []
    day = date.fromisoformat(START_DATE)
    while day <= date.fromisoformat(END_DATE):
        nxt = day + timedelta(days=1)
        try:
            count = count_rows(day, nxt)
            nc = _odd_chunks(count)
            print(f"{day}: {count} rows -> {nc} chunks")
            parts = []
            for i in range(nc):
                parts.append(fetch(day, nxt, i, nc))
                time.sleep(1)   # stay clear of the 120-requests/min throttle
        except RuntimeError as e:
            print(f"{day}: {e}")
            break
        day_df = pd.concat(parts, ignore_index=True)   # each chunk holds whole rows; just stack
        if len(day_df) != count:
            print(f"  WARNING: pulled {len(day_df)} but expected {count} "
                  f"(truncation or live drift) — increase chunks if persistent")
        if day_df.empty:
            print(f"{day}: 0 rows")
        else:
            print(f"{day}: {len(day_df)} rows")
            frames.append(day_df)
        day = nxt
    if not frames:
        print("No rows returned for the whole range.")
        return
    df = pd.concat(frames, ignore_index=True)
    df = df[[name for name, _ in COLUMNS if name in df.columns]]   # restore visual column order
    df.to_csv("order_level_data.csv", index=False)
    print(f"Saved {len(df)} rows x {len(df.columns)} cols to order_level_data.csv")


def reconcile(export_path=None):
    """Append to order_level_data.csv any item_ids that are in a Power BI 'Order Level
    Data' export but missing from the CSV (orders that left the live NDD-SPL filter
    between the export and the pull). Defaults to the newest 'Order Level Data*.xlsx'."""
    if export_path is None:
        xs = sorted(glob.glob("Order Level Data*.xlsx"), key=os.path.getmtime)
        if not xs:
            print("No 'Order Level Data*.xlsx' export found to reconcile against.")
            return
        export_path = xs[-1]
    print(f"Reconciling against: {export_path}")
    xl = pd.read_excel(export_path, dtype=str)
    xl = xl[xl["item_id"].notna()]
    cv = pd.read_csv("order_level_data.csv", dtype=str)
    have = set(cv["item_id"].astype(str))
    missing = sorted((set(xl["item_id"].astype(str)) - have), key=int)
    print(f"  export {len(xl)} rows | csv {len(cv)} rows | missing {len(missing)}")
    if not missing:
        print("  nothing to add — CSV already covers the export.")
        return
    extra = fetch_ids(missing)
    extra = extra[[name for name, _ in COLUMNS if name in extra.columns]]
    full = pd.concat([cv, extra], ignore_index=True).drop_duplicates(subset="item_id")
    full.to_csv("order_level_data.csv", index=False)
    print(f"  added {len(extra)} rows -> {len(full)} total in order_level_data.csv")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].lower() == "reconcile":
        reconcile(sys.argv[2] if len(sys.argv) > 2 else None)
    else:
        run_pull()
