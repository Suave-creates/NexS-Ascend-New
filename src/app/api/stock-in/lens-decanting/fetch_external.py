"""Fetch Lens Decanting ROS and GRN inputs with NexS Ascend's shared auth.

The script is intentionally a narrow server-only adapter. Power BI and Google
credential acquisition stays in ``src/utils/resources``; stdout contains one
JSON document for the parent Next.js route and diagnostics go to stderr.
"""

from __future__ import annotations

import contextlib
import json
import os
import sys
import time
from datetime import date, timedelta
from typing import Any

import requests


HERE = os.path.dirname(os.path.abspath(__file__))
PACKAGED_RESOURCE_ROOT = os.path.abspath(
    os.path.join(HERE, "../../../..", "utils", "resources")
)
RESOURCE_ROOT = os.environ.get("NEXS_RESOURCE_ROOT") or (
    PACKAGED_RESOURCE_ROOT
    if os.path.isdir(PACKAGED_RESOURCE_ROOT)
    else os.path.join(os.getcwd(), "src", "utils", "resources")
)
sys.path.insert(0, os.path.join(RESOURCE_ROOT, "power-bi"))
sys.path.insert(0, os.path.join(RESOURCE_ROOT, "google"))

from pbi_auth import get_token  # noqa: E402


DATASET_ID = os.environ.get(
    "LENS_DECANTING_POWER_BI_DATASET_ID",
    os.environ.get("PBI_ROS_DATASET_ID", "d87d7c18-ccb0-4dc6-b638-57283c146d4b"),
).strip()
REPORT_ID = os.environ.get(
    "LENS_DECANTING_POWER_BI_REPORT_ID",
    "f6f2e3b2-25a3-4bd3-8582-e3a67d9cc6fc",
).strip()
ROS_TABLE = os.environ.get("PBI_ROS_TABLE", "rs_order_lens_level").strip()
ROS_PID_COLUMN = os.environ.get("PBI_ROS_PID_COL", "master_product_id").strip()
ROS_HSN_COLUMN = os.environ.get("PBI_ROS_HSN_COL", "classification").strip()
ROS_BRAND_COLUMN = os.environ.get("PBI_ROS_BRAND_COL", "brand").strip()
ROS_TYPE_COLUMN = os.environ.get("PBI_ROS_TYPE_COL", "lens_type").strip()
ROS_DATE_TABLE = os.environ.get("PBI_ROS_DATE_TABLE", "Dim_Date_TimeLine").strip()
ROS_DATE_COLUMN = os.environ.get("PBI_ROS_DATE_COL", "Date").strip()
ROS_VALUE_EXPRESSION = os.environ.get("PBI_ROS_VALUE_EXPR", "").strip()
GRN_SHEET_ID = os.environ.get(
    "LENS_DECANTING_GRN_SHEET_ID",
    os.environ.get("DRIVE_SHEET_GRN", ""),
).strip()
GRN_RANGE = os.environ.get(
    "LENS_DECANTING_GRN_RANGE",
    "'EyeFrame'!R:U",
).strip()

PBI_TIMEOUT_SECONDS = 300
PBI_MAX_RETRIES = 4
MAX_SCOPED_PIDS = 100_000

# A scoped PID can produce one row for each of the two allowed HSN values. Keep
# the normal partition near 5,000 detail rows, leaving substantial headroom
# below both the executeQueries row limit and its 15 MB response limit.
DETAIL_BUCKET_TARGET_PIDS = 2_500


def dax_table(name: str) -> str:
    return "'" + str(name).replace("'", "''") + "'"


def dax_column(table: str, column: str) -> str:
    return f"{dax_table(table)}[{str(column).replace(']', ']]')}]"


def build_pid_partition_dax(
    pid: str,
    bucket_count: int,
    bucket_index: int | None,
) -> str:
    if bucket_count < 1:
        raise ValueError("Power BI detail bucket count must be positive")
    if bucket_index is not None and not 0 <= bucket_index < bucket_count:
        raise ValueError("Power BI detail bucket index is out of range")

    if bucket_index is None:
        # Blank, text, and non-integral values cannot be assigned safely with
        # integer modulo. Keep them in one explicit, disjoint fallback query.
        condition = "ISBLANK(NumericPID) || NumericPID <> INT(NumericPID)"
    else:
        condition = (
            "NOT ISBLANK(NumericPID) "
            "&& NumericPID = INT(NumericPID) "
            f"&& MOD(NumericPID, {bucket_count}) = {bucket_index}"
        )

    return f''',
        KEEPFILTERS(
            FILTER(
                ALL({pid}),
                VAR PIDText = TRIM({pid} & "")
                VAR NumericPID = IFERROR(VALUE(PIDText), BLANK())
                RETURN {condition}
            )
        )'''


def build_scoped_ros_dax(
    start: date,
    end: date,
    *,
    bucket_count: int | None = None,
    bucket_index: int | None = None,
) -> tuple[str, str]:
    pid = dax_column(ROS_TABLE, ROS_PID_COLUMN)
    hsn = dax_column(ROS_TABLE, ROS_HSN_COLUMN)
    brand = dax_column(ROS_TABLE, ROS_BRAND_COLUMN)
    product_type = dax_column(ROS_TABLE, ROS_TYPE_COLUMN)
    sale_date = dax_column(ROS_DATE_TABLE, ROS_DATE_COLUMN)
    value_expression = ROS_VALUE_EXPRESSION or dax_column("KPI's", "Qty")
    end_exclusive = end + timedelta(days=1)
    if bucket_count is None:
        if bucket_index is not None:
            raise ValueError("Power BI detail bucket index requires a bucket count")
        partition = ""
    else:
        partition = build_pid_partition_dax(pid, bucket_count, bucket_index)

    scope = f'''VAR WindowStart = DATE({start.year}, {start.month}, {start.day})
VAR WindowEndExclusive = DATE({end_exclusive.year}, {end_exclusive.month}, {end_exclusive.day})
VAR ScopedROS =
    CALCULATETABLE(
        SUMMARIZECOLUMNS(
            {pid},
            {hsn},
            "Brand", CALCULATE(SELECTEDVALUE({brand}, ""), REMOVEFILTERS({sale_date})),
            "Product_Type", CALCULATE(SELECTEDVALUE({product_type}, ""), REMOVEFILTERS({sale_date})),
            "ROS Units (7-Day)", {value_expression}
        ),
        KEEPFILTERS({sale_date} >= WindowStart),
        KEEPFILTERS({sale_date} < WindowEndExclusive),
        KEEPFILTERS({hsn} IN {{"prescription_lens", "prescription_blank"}}){partition}
    )'''
    return scope, pid


def build_ros_count_dax(start: date, end: date) -> str:
    scope, pid = build_scoped_ros_dax(start, end)
    return f'''EVALUATE
{scope}
RETURN
    ROW(
        "Expected Detail Row Count", COUNTROWS(ScopedROS),
        "Expected PID Count",
        COUNTROWS(
            DISTINCT(
                SELECTCOLUMNS(
                    FILTER(
                        ScopedROS,
                        NOT ISBLANK({pid}) && TRIM({pid} & "") <> ""
                    ),
                    "PID", {pid}
                )
            )
        )
    )'''


def build_ros_dax(
    start: date,
    end: date,
    bucket_count: int,
    bucket_index: int | None,
) -> str:
    scope, pid = build_scoped_ros_dax(
        start,
        end,
        bucket_count=bucket_count,
        bucket_index=bucket_index,
    )
    hsn = dax_column(ROS_TABLE, ROS_HSN_COLUMN)
    return f'''EVALUATE
{scope}
RETURN
    SELECTCOLUMNS(
        ScopedROS,
        "Product ID", {pid},
        "HSN Classification", {hsn},
        "Brand", [Brand],
        "Product_Type", [Product_Type],
        "ROS Units (7-Day)", [ROS Units (7-Day)]
    )
ORDER BY [Product ID], [HSN Classification]'''


def clean_column(name: Any) -> str:
    value = str(name)
    if "[" in value and value.endswith("]"):
        return value.rsplit("[", 1)[1][:-1]
    return value


def power_bi_table(payload: dict[str, Any]) -> dict[str, Any]:
    try:
        result = payload["results"][0]
        if not isinstance(result, dict):
            raise RuntimeError("Power BI returned an unexpected query result")
        if result.get("error"):
            raise RuntimeError("Power BI returned a query error")
        table = (result.get("tables") or [{}])[0]
        if not isinstance(table, dict):
            raise RuntimeError("Power BI returned an unexpected table shape")
        if table.get("error"):
            raise RuntimeError("Power BI returned a table-level query error")
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("Power BI returned an unexpected response shape") from exc
    if not isinstance(table, dict) or not isinstance(table.get("rows", []), list):
        raise RuntimeError("Power BI returned an unexpected table shape")
    return table


def parse_nonnegative_integer(row: dict[str, Any], column: str) -> int:
    if column not in row:
        raise RuntimeError(f"Power BI PID-count response omitted {column}")
    try:
        raw_value = float(str(row[column]).strip())
        value = int(raw_value)
    except (TypeError, ValueError):
        raise RuntimeError(f"Power BI returned an invalid {column}") from None
    if raw_value != value or value < 0:
        raise RuntimeError(f"Power BI returned an invalid {column}")
    return value


def normalize_power_bi_count(payload: dict[str, Any]) -> tuple[int, int]:
    rows = power_bi_table(payload).get("rows", [])
    if len(rows) != 1 or not isinstance(rows[0], dict):
        raise RuntimeError("Power BI returned an unexpected PID-count response")
    row = {clean_column(key): value for key, value in rows[0].items()}
    return (
        parse_nonnegative_integer(row, "Expected Detail Row Count"),
        parse_nonnegative_integer(row, "Expected PID Count"),
    )


def normalize_power_bi_rows(payload: dict[str, Any]) -> list[dict[str, Any]]:
    rows = power_bi_table(payload).get("rows", [])

    # executeQueries caps a result at 100,000 rows. Treat the boundary as a
    # failed refresh instead of quietly presenting a potentially truncated,
    # non-authoritative PID list.
    if len(rows) >= 100_000:
        raise RuntimeError(
            "Power BI reached the 100,000-row executeQueries limit; narrow or partition the ROS query"
        )

    normalized: list[dict[str, Any]] = []
    for raw_row in rows:
        row = {clean_column(key): value for key, value in raw_row.items()}
        normalized.append(
            {
                "pid": row.get("Product ID"),
                "hsn": row.get("HSN Classification"),
                "brand": row.get("Brand"),
                "productType": row.get("Product_Type"),
                "rosUnits": row.get("ROS Units (7-Day)", 0),
            }
        )
    return normalized


def normalize_pid(value: Any) -> str:
    normalized = str(value or "").strip()
    if normalized.endswith(".0") and normalized[:-2].isdigit():
        return normalized[:-2]
    return normalized


class PowerBiClient:
    def __init__(self) -> None:
        self.session = requests.Session()
        self._refresh_token(force=False)

    def _refresh_token(self, *, force: bool) -> None:
        # Shared auth prints the selected identity for interactive scripts. Keep
        # stdout machine-readable for the Next.js parent process.
        with contextlib.redirect_stdout(sys.stderr):
            token = get_token(interactive=False, force_refresh=force)
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    def _request(self, method: str, url: str, **kwargs: Any) -> requests.Response:
        refreshed = False
        for attempt in range(1, PBI_MAX_RETRIES + 1):
            response = self.session.request(
                method,
                url,
                headers=self.headers,
                timeout=PBI_TIMEOUT_SECONDS,
                **kwargs,
            )
            if response.status_code < 400:
                return response
            if response.status_code == 401 and not refreshed:
                response.close()
                print(
                    "Power BI rejected the cached token; renewing and retrying once.",
                    file=sys.stderr,
                )
                self._refresh_token(force=True)
                refreshed = True
                continue
            # executeQueries occasionally returns a transient gateway/service
            # 5xx even when the same deterministic partition succeeds on the
            # next call. Retry those responses just like throttling so one
            # partition cannot discard the complete authoritative ROS set.
            if response.status_code not in (429, 500, 502, 503, 504) or attempt == PBI_MAX_RETRIES:
                status = response.status_code
                response.close()
                raise RuntimeError(f"Power BI request failed (HTTP {status})")
            retry_after = response.headers.get("Retry-After", "")
            delay = int(retry_after) if retry_after.isdigit() else 2**attempt
            response.close()
            time.sleep(min(delay, 30))
        raise RuntimeError("Power BI request failed after retries")

    def resolve_dataset_id(self) -> str:
        if DATASET_ID:
            return DATASET_ID
        response = self._request(
            "GET",
            f"https://api.powerbi.com/v1.0/myorg/reports/{REPORT_ID}",
        )
        dataset_id = str(response.json().get("datasetId") or "").strip()
        if not dataset_id:
            raise RuntimeError("The configured Power BI report has no dataset")
        return dataset_id

    def execute_dax(self, dataset_id: str, dax: str) -> dict[str, Any]:
        response = self._request(
            "POST",
            f"https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/executeQueries",
            json={
                "queries": [{"query": dax}],
                "serializerSettings": {"includeNulls": True},
            },
        )
        payload = response.json()
        if not isinstance(payload, dict):
            raise RuntimeError("Power BI returned an unexpected response")
        return payload

    def ros_rows(self, start: date, end: date) -> tuple[list[dict[str, Any]], int]:
        dataset_id = self.resolve_dataset_id()
        expected_rows, expected_pids = normalize_power_bi_count(
            self.execute_dax(dataset_id, build_ros_count_dax(start, end))
        )
        if expected_pids > MAX_SCOPED_PIDS:
            raise RuntimeError(
                f"Power BI returned {expected_pids} scoped PIDs; "
                f"the safe dashboard limit is {MAX_SCOPED_PIDS}"
            )
        if expected_rows == 0:
            if expected_pids != 0:
                raise RuntimeError(
                    "Power BI returned inconsistent ROS row and PID counts"
                )
            return [], 0

        bucket_count = max(
            1,
            (max(expected_pids, 1) + DETAIL_BUCKET_TARGET_PIDS - 1)
            // DETAIL_BUCKET_TARGET_PIDS,
        )
        rows: list[dict[str, Any]] = []
        for bucket_index in range(bucket_count):
            rows.extend(
                normalize_power_bi_rows(
                    self.execute_dax(
                        dataset_id,
                        build_ros_dax(start, end, bucket_count, bucket_index),
                    )
                )
            )

        # Values that cannot be represented as integral numeric IDs are
        # deliberately outside every modulo bucket and are fetched once here.
        rows.extend(
            normalize_power_bi_rows(
                self.execute_dax(
                    dataset_id,
                    build_ros_dax(start, end, bucket_count, None),
                )
            )
        )
        if len(rows) != expected_rows:
            raise RuntimeError(
                "Power BI returned an incomplete ROS detail set "
                f"({len(rows)} of {expected_rows} detail rows)"
            )
        returned_pids = {normalize_pid(row.get("pid")) for row in rows}
        returned_pids.discard("")
        if len(returned_pids) != expected_pids:
            raise RuntimeError(
                "Power BI returned an incomplete ROS detail set "
                f"({len(returned_pids)} of {expected_pids} scoped PIDs)"
            )
        return rows, expected_pids


def as_number(value: Any) -> int:
    try:
        cleaned = str(value or "").replace(",", "").strip()
        return int(float(cleaned)) if cleaned else 0
    except (TypeError, ValueError):
        return 0


def transform_grn_values(values: Any) -> list[dict[str, Any]]:
    """Map configured GRN columns by header and apply the legacy aggregation."""
    if not isinstance(values, list):
        raise RuntimeError("Google Sheets returned malformed GRN values")
    if not values:
        return []
    if not isinstance(values[0], list):
        raise RuntimeError("Google Sheets returned a malformed GRN header row")

    def normalized_header(value: Any) -> str:
        return " ".join(str(value or "").replace("_", " ").split()).casefold()

    header_positions: dict[str, int] = {}
    aliases = {
        "iqcStatus": {"iqc status"},
        "pid": {"pid", "product id"},
        "pidQty": {"pid qty", "pid quantity"},
        "grnQty": {"grn qty", "grn quantity"},
    }
    for index, header in enumerate(values[0]):
        normalized = normalized_header(header)
        for field, field_aliases in aliases.items():
            if field not in header_positions and normalized in field_aliases:
                header_positions[field] = index

    missing = [field for field in aliases if field not in header_positions]
    if missing:
        raise RuntimeError(
            "Google Sheets GRN range is missing required columns: "
            + ", ".join(missing)
        )

    grouped: dict[str, dict[str, Any]] = {}
    for raw_row in values[1:]:
        if not isinstance(raw_row, list):
            raise RuntimeError("Google Sheets returned a malformed GRN row")
        required_width = max(header_positions.values()) + 1
        cells = raw_row + [""] * max(0, required_width - len(raw_row))
        iqc_status = str(cells[header_positions["iqcStatus"]] or "").strip()
        pid = str(cells[header_positions["pid"]] or "").strip()
        if not pid:
            continue

        aggregate = grouped.setdefault(
            pid,
            {"statuses": set(), "pidQty": 0, "grnQty": 0},
        )
        if iqc_status:
            aggregate["statuses"].add(iqc_status)
        aggregate["pidQty"] += as_number(cells[header_positions["pidQty"]])
        aggregate["grnQty"] += as_number(cells[header_positions["grnQty"]])

    return [
        {
            "pid": pid,
            "iqcStatus": " | ".join(sorted(aggregate["statuses"])),
            "pidQty": aggregate["pidQty"],
            "grnQty": aggregate["grnQty"],
        }
        for pid, aggregate in sorted(grouped.items())
    ]


def read_grn_rows() -> tuple[list[dict[str, Any]], str, list[str]]:
    if os.environ.get("LENS_DECANTING_SKIP_GOOGLE") == "1":
        return [], "skipped", ["GRN enrichment is disabled by server configuration."]
    if not GRN_SHEET_ID:
        return [], "notConfigured", ["GRN sheet is not configured; GRN fields are blank."]

    try:
        from gsheet_auth import get_sheets_service

        service = get_sheets_service(interactive=False)
        response = (
            service.spreadsheets()
            .values()
            .get(
                spreadsheetId=GRN_SHEET_ID,
                range=GRN_RANGE,
                majorDimension="ROWS",
                valueRenderOption="FORMATTED_VALUE",
            )
            .execute()
        )
        if not isinstance(response, dict):
            raise RuntimeError("Google Sheets returned an unexpected GRN response")
        rows = transform_grn_values(response.get("values", []))
        return rows, "ok", []
    except Exception as exc:
        print(f"Lens Decanting GRN read failed: {exc}", file=sys.stderr)
        return [], "unavailable", ["GRN sheet is temporarily unavailable; GRN fields are blank."]


def parse_dates() -> tuple[date, date]:
    if len(sys.argv) != 3:
        raise ValueError("Usage: fetch_external.py START_DATE END_DATE")
    start = date.fromisoformat(sys.argv[1])
    end = date.fromisoformat(sys.argv[2])
    if end < start or (end - start).days != 6:
        raise ValueError("The ROS window must contain exactly seven days")
    return start, end


def main() -> int:
    try:
        start, end = parse_dates()
        ros_rows, scoped_pids = PowerBiClient().ros_rows(start, end)
        grn_rows, google_status, warnings = read_grn_rows()
        json.dump(
            {
                "rosRows": ros_rows,
                "grnRows": grn_rows,
                "sources": {"powerBi": "ok", "googleSheets": google_status},
                "warnings": warnings,
                "metadata": {
                    "powerBiRows": len(ros_rows),
                    "scopedPids": scoped_pids,
                    "grnRows": len(grn_rows),
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
        print(f"Lens Decanting external fetch failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
