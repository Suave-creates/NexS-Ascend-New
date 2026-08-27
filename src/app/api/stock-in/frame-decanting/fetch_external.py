"""Fetch Frame Decanting Power BI, GRN, PLC, and exclusion inputs.

All authenticated sources use NexS Ascend's shared, server-only helpers. The
script writes one compact JSON document to stdout for the Next.js route.
"""

from __future__ import annotations

import contextlib
import csv
import json
import math
import os
import sys
import time
from datetime import date, timedelta
from typing import Any

import requests


PACKAGED_RESOURCE_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "utils", "resources")
)
RESOURCE_ROOT = os.environ.get("NEXS_RESOURCE_ROOT") or (
    PACKAGED_RESOURCE_ROOT
    if os.path.isdir(PACKAGED_RESOURCE_ROOT)
    else os.path.join(os.getcwd(), "src", "utils", "resources")
)
sys.path.insert(0, os.path.join(RESOURCE_ROOT, "power-bi"))
sys.path.insert(0, os.path.join(RESOURCE_ROOT, "google"))

from pbi_auth import get_token  # noqa: E402


FRAME_DATASET_ID = os.environ.get(
    "PBI_FRAME_ROS_DATASET_ID", "e30504e3-a2a6-4cd2-9ba6-b2b2a6456d15"
).strip()
FRAME_TABLE = os.environ.get("PBI_FRAME_ROS_TABLE", "fulfilment_data").strip()
FRAME_PID_COLUMN = os.environ.get("PBI_FRAME_ROS_PID_COL", "product_id").strip()
FRAME_ORDER_COLUMN = os.environ.get("PBI_FRAME_ROS_ORDER_COL", "increment_id").strip()
FRAME_STATUS_COLUMN = os.environ.get("PBI_FRAME_ROS_STATUS_COL", "Overall Status").strip()
FRAME_DATE_TABLE = os.environ.get("PBI_FRAME_ROS_DATE_TABLE", "Dim_Date_TimeLine").strip()
FRAME_DATE_COLUMN = os.environ.get("PBI_FRAME_ROS_DATE_COL", "Date").strip()
FRAME_STATUSES = (
    "1 Frame 1 Lens",
    "1 Frame No Lens",
    "No Frame 1 Lens",
    "No Frame Both Lens",
    "No Frame No Lens",
    "All 3 elements FF",
)

INCREFF_DATASET_ID = os.environ.get(
    "FRAME_DECANTING_INCREFF_DATASET_ID", "0ceb1d75-315f-448e-8e92-2c2ed9683d21"
).strip()
INCREFF_TABLE = os.environ.get(
    "FRAME_DECANTING_INCREFF_TABLE", "increff_wh_dispatch_report"
).strip()
INCREFF_PID_COLUMN = os.environ.get("FRAME_DECANTING_INCREFF_PID_COL", "style").strip()
INCREFF_QTY_COLUMN = os.environ.get(
    "FRAME_DECANTING_INCREFF_QTY_COL", "final_order_qty"
).strip()
INCREFF_DATE_COLUMN = os.environ.get(
    "FRAME_DECANTING_INCREFF_DATE_COL", "created_at"
).strip()
INCREFF_CHANNEL_COLUMN = os.environ.get(
    "FRAME_DECANTING_INCREFF_CHANNEL_COL", "channel_type"
).strip()

TRANSFER_DATASET_ID = os.environ.get(
    "FRAME_DECANTING_TRANSFER_DATASET_ID", "df27c97c-adca-4e29-b965-85e51294dff2"
).strip()
TRANSFER_TABLE = os.environ.get("FRAME_DECANTING_TRANSFER_TABLE", "transfer_data").strip()
TRANSFER_PID_COLUMN = os.environ.get("FRAME_DECANTING_TRANSFER_PID_COL", "pid").strip()
TRANSFER_QTY_COLUMN = os.environ.get(
    "FRAME_DECANTING_TRANSFER_QTY_COL", "scanned_qty"
).strip()
TRANSFER_STATUS_COLUMN = os.environ.get(
    "FRAME_DECANTING_TRANSFER_STATUS_COL", "status"
).strip()
TRANSFER_STATUS_VALUE = os.environ.get(
    "FRAME_DECANTING_TRANSFER_STATUS_VALUE", "READY_TO_RECEIVE"
).strip()
TRANSFER_SOURCE_COLUMN = os.environ.get(
    "FRAME_DECANTING_TRANSFER_SOURCE_COL", "source_facility"
).strip()
TRANSFER_DESTINATION_COLUMN = os.environ.get(
    "FRAME_DECANTING_TRANSFER_DESTINATION_COL", "destination_facility"
).strip()

GRN_SHEET_ID = os.environ.get(
    "FRAME_DECANTING_GRN_SHEET_ID",
    os.environ.get("LENS_DECANTING_GRN_SHEET_ID", os.environ.get("DRIVE_SHEET_GRN", "")),
).strip()
GRN_RANGE = os.environ.get(
    "FRAME_DECANTING_GRN_RANGE",
    os.environ.get("LENS_DECANTING_GRN_RANGE", "'EyeFrame'!R:U"),
).strip()
PACKAGED_LIB_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "lib")
)
# These mappings are versioned with the application so source/dev, standalone,
# and Docker runs use the same deterministic snapshot. Production can still
# override either path when an independently mounted revision is required.
PLC_FILE = os.environ.get("FRAME_DECANTING_PLC_FILE", "").strip() or os.path.join(
    PACKAGED_LIB_ROOT, "plc flag.csv"
)
EXCLUSION_FILE = os.environ.get(
    "FRAME_DECANTING_PID_EXCLUSION_FILE", ""
).strip() or os.path.join(PACKAGED_LIB_ROOT, "pid excusion.csv")

PBI_TIMEOUT_SECONDS = 300
PBI_MAX_RETRIES = 4
MAX_MONTH_PIDS = 100_000
DETAIL_BUCKET_TARGET = 10_000


def dax_table(name: str) -> str:
    return "'" + str(name).replace("'", "''") + "'"


def dax_column(table: str, column: str) -> str:
    return f"{dax_table(table)}[{str(column).replace(']', ']]')}]"


def month_segments(start: date, end: date) -> list[tuple[date, date]]:
    segments: list[tuple[date, date]] = []
    current = date(start.year, start.month, 1)
    while current <= end:
        following = date(current.year + 1, 1, 1) if current.month == 12 else date(
            current.year, current.month + 1, 1
        )
        segments.append((current, min(end, following - timedelta(days=1))))
        current = following
    return segments


def build_month_scope(
    start: date,
    end: date,
    *,
    bucket_count: int | None = None,
    bucket_index: int | None = None,
) -> tuple[str, str]:
    pid = dax_column(FRAME_TABLE, FRAME_PID_COLUMN)
    order_id = dax_column(FRAME_TABLE, FRAME_ORDER_COLUMN)
    status = dax_column(FRAME_TABLE, FRAME_STATUS_COLUMN)
    timeline = dax_column(FRAME_DATE_TABLE, FRAME_DATE_COLUMN)
    end_exclusive = end + timedelta(days=1)
    allowed = ", ".join(json.dumps(value) for value in FRAME_STATUSES)
    partition = ""
    if bucket_count is not None:
        if bucket_count < 1 or bucket_index is None or not 0 <= bucket_index < bucket_count:
            raise ValueError("Invalid Frame ROS partition")
        partition = f''',
        KEEPFILTERS(
            FILTER(
                ALL({pid}),
                MOD({pid}, {bucket_count}) = {bucket_index}
            )
        )'''
    scope = f'''VAR WindowStart = DATE({start.year}, {start.month}, {start.day})
VAR WindowEndExclusive = DATE({end_exclusive.year}, {end_exclusive.month}, {end_exclusive.day})
VAR AllowedStatuses = {{{allowed}}}
VAR MonthlyRows =
    CALCULATETABLE(
        SUMMARIZECOLUMNS(
            {pid},
            "Sales", COUNTA({order_id})
        ),
        FILTER(
            ALL({timeline}),
            {timeline} >= WindowStart && {timeline} < WindowEndExclusive
        ),
        TREATAS(AllowedStatuses, {status}),
        FILTER(ALL({pid}), {pid} >= 10000 && {pid} <= 999999){partition}
    )'''
    return scope, pid


def build_month_count_dax(start: date, end: date) -> str:
    scope, pid = build_month_scope(start, end)
    return f'''EVALUATE
{scope}
RETURN
    ROW(
        "Expected Detail Row Count", COUNTROWS(MonthlyRows),
        "Expected PID Count",
        COUNTROWS(DISTINCT(SELECTCOLUMNS(MonthlyRows, "PID", {pid})))
    )'''


def build_month_detail_dax(
    start: date,
    end: date,
    bucket_count: int,
    bucket_index: int,
) -> str:
    scope, pid = build_month_scope(
        start, end, bucket_count=bucket_count, bucket_index=bucket_index
    )
    month = start.strftime("%Y-%m")
    return f'''EVALUATE
{scope}
RETURN
    SELECTCOLUMNS(
        MonthlyRows,
        "PID", {pid},
        "Month", "{month}",
        "Sales", [Sales]
    )
ORDER BY [PID]'''


def build_increff_dax() -> str:
    table = INCREFF_TABLE
    pid = dax_column(table, INCREFF_PID_COLUMN)
    qty = dax_column(table, INCREFF_QTY_COLUMN)
    created = dax_column(table, INCREFF_DATE_COLUMN)
    channel = dax_column(table, INCREFF_CHANNEL_COLUMN)
    return f'''EVALUATE
VAR LastNDates =
    TOPN(
        1,
        VALUES({created}),
        {created},
        DESC
    )
RETURN
    SELECTCOLUMNS(
        SUMMARIZECOLUMNS(
            {pid},
            "Count",
            CALCULATE(
                SUM({qty}),
                {created} IN LastNDates,
                {channel} <> "SINGAPORE"
            )
        ),
        "PID", {pid},
        "Count", [Count]
    )
ORDER BY [PID]'''


def build_transfer_dax() -> str:
    table = TRANSFER_TABLE
    pid = dax_column(table, TRANSFER_PID_COLUMN)
    qty = dax_column(table, TRANSFER_QTY_COLUMN)
    status = dax_column(table, TRANSFER_STATUS_COLUMN)
    source = dax_column(table, TRANSFER_SOURCE_COLUMN)
    destination = dax_column(table, TRANSFER_DESTINATION_COLUMN)
    return f'''EVALUATE
SELECTCOLUMNS(
    CALCULATETABLE(
        SUMMARIZECOLUMNS(
            {pid},
            "Count", SUM({qty})
        ),
        KEEPFILTERS({status} = {json.dumps(TRANSFER_STATUS_VALUE)}),
        KEEPFILTERS({source} = "NXS2"),
        KEEPFILTERS({destination} = "NXS1")
    ),
    "PID", {pid},
    "Count", [Count]
)
ORDER BY [PID]'''


def clean_column(name: Any) -> str:
    value = str(name)
    if "[" in value and value.endswith("]"):
        return value.rsplit("[", 1)[1][:-1]
    return value


def power_bi_rows(payload: dict[str, Any]) -> list[dict[str, Any]]:
    try:
        result = payload["results"][0]
        if result.get("error"):
            raise RuntimeError("Power BI returned a query error")
        table = (result.get("tables") or [{}])[0]
        if table.get("error"):
            raise RuntimeError("Power BI returned a table-level query error")
        rows = table.get("rows", [])
    except (KeyError, IndexError, TypeError, AttributeError) as exc:
        raise RuntimeError("Power BI returned an unexpected response shape") from exc
    if not isinstance(rows, list):
        raise RuntimeError("Power BI returned an unexpected row set")
    if len(rows) >= 100_000:
        raise RuntimeError("Power BI reached the executeQueries row limit")
    return [{clean_column(key): value for key, value in row.items()} for row in rows]


def normalize_pid(value: Any) -> str:
    normalized = str(value or "").strip()
    if normalized.endswith(".0") and normalized[:-2].isdigit():
        return normalized[:-2]
    return normalized


def nonnegative_int(value: Any, label: str) -> int:
    try:
        raw = float(str(value).strip())
        integer = int(raw)
    except (TypeError, ValueError):
        raise RuntimeError(f"Power BI returned an invalid {label}") from None
    if integer < 0 or raw != integer:
        raise RuntimeError(f"Power BI returned an invalid {label}")
    return integer


class PowerBiClient:
    def __init__(self) -> None:
        self.session = requests.Session()
        self._refresh_token(force=False)

    def _refresh_token(self, *, force: bool) -> None:
        with contextlib.redirect_stdout(sys.stderr):
            token = get_token(interactive=False, force_refresh=force)
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    def execute(self, dataset_id: str, dax: str) -> dict[str, Any]:
        url = f"https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/executeQueries"
        refreshed = False
        for attempt in range(1, PBI_MAX_RETRIES + 1):
            response = self.session.post(
                url,
                headers=self.headers,
                json={
                    "queries": [{"query": dax}],
                    "serializerSettings": {"includeNulls": True},
                },
                timeout=PBI_TIMEOUT_SECONDS,
            )
            if response.status_code < 400:
                payload = response.json()
                if not isinstance(payload, dict):
                    raise RuntimeError("Power BI returned an unexpected response")
                return payload
            if response.status_code == 401 and not refreshed:
                response.close()
                self._refresh_token(force=True)
                refreshed = True
                continue
            if response.status_code not in (429, 503) or attempt == PBI_MAX_RETRIES:
                status = response.status_code
                try:
                    detail = str(response.json().get("error") or "")[:800]
                except (ValueError, AttributeError):
                    detail = response.text[:800]
                response.close()
                suffix = f": {detail}" if detail else ""
                raise RuntimeError(f"Power BI request failed (HTTP {status}){suffix}")
            retry_after = response.headers.get("Retry-After", "")
            response.close()
            delay = int(retry_after) if retry_after.isdigit() else 2**attempt
            time.sleep(min(delay, 30))
        raise RuntimeError("Power BI request failed after retries")

    def frame_ros_rows(self, start: date, end: date) -> list[dict[str, Any]]:
        combined: list[dict[str, Any]] = []
        for month_start, month_end in month_segments(start, end):
            count_rows = power_bi_rows(
                self.execute(FRAME_DATASET_ID, build_month_count_dax(month_start, month_end))
            )
            if len(count_rows) != 1:
                raise RuntimeError("Power BI returned an unexpected Frame count response")
            expected_rows = nonnegative_int(
                count_rows[0].get("Expected Detail Row Count"), "Frame detail-row count"
            )
            expected_pids = nonnegative_int(
                count_rows[0].get("Expected PID Count"), "Frame PID count"
            )
            if expected_pids > MAX_MONTH_PIDS:
                raise RuntimeError(
                    f"Power BI returned {expected_pids} Frame PIDs in one month; "
                    f"the safe limit is {MAX_MONTH_PIDS}"
                )
            bucket_count = max(1, math.ceil(max(expected_pids, 1) / DETAIL_BUCKET_TARGET))
            month_rows: list[dict[str, Any]] = []
            for bucket in range(bucket_count):
                month_rows.extend(
                    power_bi_rows(
                        self.execute(
                            FRAME_DATASET_ID,
                            build_month_detail_dax(
                                month_start, month_end, bucket_count, bucket
                            ),
                        )
                    )
                )
            returned_pids = {normalize_pid(row.get("PID")) for row in month_rows}
            returned_pids.discard("")
            if len(month_rows) != expected_rows or len(returned_pids) != expected_pids:
                raise RuntimeError(
                    "Power BI returned an incomplete Frame ROS month "
                    f"({len(month_rows)}/{expected_rows} rows, "
                    f"{len(returned_pids)}/{expected_pids} PIDs)"
                )
            combined.extend(
                {
                    "pid": normalize_pid(row.get("PID")),
                    "month": str(row.get("Month") or month_start.strftime("%Y-%m")),
                    "sales": row.get("Sales", 0),
                }
                for row in month_rows
            )
        return combined

    def count_rows(self, dataset_id: str, dax: str) -> list[dict[str, Any]]:
        parsed = []
        for row in power_bi_rows(self.execute(dataset_id, dax)):
            pid = normalize_pid(row.get("PID"))
            if pid:
                parsed.append({"pid": pid, "count": row.get("Count", 0)})
        return parsed


def as_number(value: Any) -> int:
    try:
        cleaned = str(value or "").replace(",", "").strip()
        return int(float(cleaned)) if cleaned else 0
    except (TypeError, ValueError):
        return 0


def transform_grn_values(values: Any) -> list[dict[str, Any]]:
    if not isinstance(values, list) or (values and not isinstance(values[0], list)):
        raise RuntimeError("Google Sheets returned malformed GRN values")
    if not values:
        return []

    def header(value: Any) -> str:
        return " ".join(str(value or "").replace("_", " ").split()).casefold()

    aliases = {
        "iqcStatus": {"iqc status"},
        "pid": {"pid", "product id"},
        "pidQty": {"pid qty", "pid quantity"},
        "grnQty": {"grn qty", "grn quantity"},
    }
    positions: dict[str, int] = {}
    for index, value in enumerate(values[0]):
        normalized = header(value)
        for field, candidates in aliases.items():
            if field not in positions and normalized in candidates:
                positions[field] = index
    missing = [field for field in aliases if field not in positions]
    if missing:
        raise RuntimeError("Google Sheets GRN range is missing: " + ", ".join(missing))

    grouped: dict[str, dict[str, Any]] = {}
    width = max(positions.values()) + 1
    for raw in values[1:]:
        if not isinstance(raw, list):
            raise RuntimeError("Google Sheets returned a malformed GRN row")
        row = raw + [""] * max(0, width - len(raw))
        pid = normalize_pid(row[positions["pid"]])
        if not pid:
            continue
        aggregate = grouped.setdefault(
            pid, {"statuses": set(), "pidQty": 0, "grnQty": 0}
        )
        iqc = str(row[positions["iqcStatus"]] or "").strip()
        if iqc:
            aggregate["statuses"].add(iqc)
        aggregate["pidQty"] += as_number(row[positions["pidQty"]])
        aggregate["grnQty"] += as_number(row[positions["grnQty"]])
    return [
        {
            "pid": pid,
            "iqcStatus": " | ".join(sorted(value["statuses"])),
            "pidQty": value["pidQty"],
            "grnQty": value["grnQty"],
        }
        for pid, value in sorted(grouped.items())
    ]


def read_grn_rows() -> tuple[list[dict[str, Any]], str, list[str]]:
    if os.environ.get("FRAME_DECANTING_SKIP_GOOGLE") == "1":
        return [], "skipped", ["GRN enrichment is disabled by server configuration."]
    if not GRN_SHEET_ID:
        return [], "notConfigured", ["GRN sheet is not configured; GRN fields are blank."]
    try:
        from gsheet_auth import get_sheets_service

        service = get_sheets_service(interactive=False)
        response = service.spreadsheets().values().get(
            spreadsheetId=GRN_SHEET_ID,
            range=GRN_RANGE,
            majorDimension="ROWS",
            valueRenderOption="FORMATTED_VALUE",
        ).execute()
        if not isinstance(response, dict):
            raise RuntimeError("Google Sheets returned an unexpected response")
        return transform_grn_values(response.get("values", [])), "ok", []
    except Exception as exc:
        print(f"Frame Decanting GRN read failed: {exc}", file=sys.stderr)
        return [], "unavailable", ["GRN sheet is temporarily unavailable; GRN fields are blank."]


def read_csv_mapping(path: str, kind: str) -> tuple[list[dict[str, str]], list[str]]:
    if not path:
        return [], [
            f"Frame {kind} file is not configured; the legacy local mapping is unavailable."
        ]
    if not os.path.isfile(path):
        return [], [f"Frame {kind} file was not found at the configured server path."]
    try:
        with open(path, "r", encoding="utf-8-sig", newline="") as handle:
            records = list(csv.DictReader(handle))
        if not records:
            return [], []
        headers = {str(key).strip().casefold(): key for key in records[0]}
        pid_key = next(
            (headers[key] for key in ("style_code", "parent_product_id", "pid") if key in headers),
            None,
        )
        if not pid_key:
            raise RuntimeError("no PID/style column")
        if kind == "PLC":
            plc_key = next(
                (headers[key] for key in ("core_new", "plc") if key in headers),
                None,
            )
            if not plc_key:
                raise RuntimeError("no Core_New/PLC column")
            return [
                {"pid": normalize_pid(row.get(pid_key)), "plc": str(row.get(plc_key) or "").strip()}
                for row in records
                if normalize_pid(row.get(pid_key))
            ], []
        return [
            {"pid": normalize_pid(row.get(pid_key))}
            for row in records
            if normalize_pid(row.get(pid_key))
        ], []
    except Exception as exc:
        print(f"Frame {kind} file read failed: {exc}", file=sys.stderr)
        return [], [f"Frame {kind} file could not be read; continuing without that mapping."]


def parse_dates() -> tuple[date, date]:
    if len(sys.argv) != 3:
        raise ValueError("Usage: fetch_external.py START_DATE END_DATE")
    start = date.fromisoformat(sys.argv[1])
    end = date.fromisoformat(sys.argv[2])
    segments = month_segments(start, end)
    if start.day != 1 or len(segments) != 3 or segments[0][0] != start:
        raise ValueError("Frame ROS window must span exactly three calendar months")
    return start, end


def main() -> int:
    try:
        start, end = parse_dates()
        client = PowerBiClient()
        ros_rows = client.frame_ros_rows(start, end)
        if not ros_rows:
            raise RuntimeError(
                f"Power BI returned no 5/6-digit Frame PIDs for {start} through {end}"
            )
        warnings: list[str] = []

        try:
            increff_rows = client.count_rows(INCREFF_DATASET_ID, build_increff_dax())
            increff_status = "ok"
        except Exception as exc:
            print(f"Frame Decanting Increff read failed: {exc}", file=sys.stderr)
            increff_rows = []
            increff_status = "unavailable"
            warnings.append("Bulk Required is temporarily unavailable and defaults to zero.")

        try:
            transfer_rows = client.count_rows(TRANSFER_DATASET_ID, build_transfer_dax())
            transfer_status = "ok"
        except Exception as exc:
            print(f"Frame Decanting transfer read failed: {exc}", file=sys.stderr)
            transfer_rows = []
            transfer_status = "unavailable"
            warnings.append("Transfer Pendency is temporarily unavailable and defaults to zero.")

        grn_rows, google_status, grn_warnings = read_grn_rows()
        warnings.extend(grn_warnings)
        plc_rows, plc_warnings = read_csv_mapping(PLC_FILE, "PLC")
        exclusion_rows, exclusion_warnings = read_csv_mapping(EXCLUSION_FILE, "PID exclusion")
        warnings.extend(plc_warnings)
        warnings.extend(exclusion_warnings)
        scoped_pids = {normalize_pid(row.get("pid")) for row in ros_rows}
        scoped_pids.discard("")

        json.dump(
            {
                "rosRows": ros_rows,
                "grnRows": grn_rows,
                "increffRows": increff_rows,
                "transferRows": transfer_rows,
                "plcRows": plc_rows,
                "excludedPids": [row["pid"] for row in exclusion_rows],
                "sources": {
                    "powerBi": "ok",
                    "googleSheets": google_status,
                    "increff": increff_status,
                    "transfer": transfer_status,
                    "plc": "ok" if plc_rows else "notConfigured",
                    "exclusions": "ok" if exclusion_rows else "notConfigured",
                },
                "warnings": warnings,
                "metadata": {
                    "powerBiRows": len(ros_rows),
                    "scopedPids": len(scoped_pids),
                    "grnRows": len(grn_rows),
                    "increffRows": len(increff_rows),
                    "transferRows": len(transfer_rows),
                    "plcRows": len(plc_rows),
                    "excludedPids": len(exclusion_rows),
                    "windowStart": start.isoformat(),
                    "windowEnd": end.isoformat(),
                },
            },
            sys.stdout,
            separators=(",", ":"),
            default=str,
        )
        sys.stdout.write("\n")
        return 0
    except Exception as exc:
        print(f"Frame Decanting external fetch failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
