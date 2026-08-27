"""Fetch order-cancellation data for the Planning & Process Excellence dashboard.

The script intentionally keeps OAuth and Power BI tokens on the server.  It emits
one JSON document on stdout for the Next.js route and sends diagnostic messages to
stderr.  Power BI rows are limited to reasons that can become a plant concern (plus
new/unknown reasons that need review); all-order KPIs are calculated separately in
DAX so the browser never receives the full cancellation dump.
"""

from __future__ import annotations

import contextlib
import json
import math
import os
import sys
import time
from collections import defaultdict
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
    "ORDER_CANCELLATION_POWER_BI_DATASET_ID",
    "6b5acf78-e529-4e2f-a946-2b9dae776371",
)
POWER_BI_URL = (
    f"https://api.powerbi.com/v1.0/myorg/datasets/{DATASET_ID}/executeQueries"
)
ROWS_PER_CHUNK = 4_000

# Reasons with a rule that can resolve to CONCERN.  Known exclusions stay out of
# the detail pull; their order counts are still present in the all-order metrics.
CANDIDATE_REASONS = {
    "Need a different product/Lens package",
    "Delivery time too long",
    "Frame Damaged/Broken by LF Vendor",
    "Need to change power/ Power not available",
    "Power Not Compatible",
    "Base curvature Issue",
    "TAT Breached",
    "Frame / Lens change needed",
    "Lf Order added into CWH Gatepass",
    "Delay in Dispatch",
    "Wrong Power Details",
    "High Power Restriction",
    "Frame Height Issue / Precal / Dia",
    "Frame Lost by LF vendor",
    "Getting delayed due to any reason",
    "Stock Not available",
    "Product out of stock",
}

KNOWN_OUT_OF_SCOPE_REASONS = {
    "Auto Cancelled due to prolonged no response from customer",
    "Ordered by mistake",
    "Medibuddy panel rejected case",
    "Others",
    "Other",
    "Found lower price elsewhere",
    "Shipping address incorrect",
    "Customer Mind Changed",
    "No Response for 15+ days",
    "CS team requested for cancellation",
    "No response",
    "Wrong Frame selection",
    "Test order",
    "Medibuddy customer requested agent driven cancelation",
    "Tech issue",
    "Medibuddy UNFF/Lost in courier/Lost in warehouse cases",
    "market place order cancellation request",
    "Not Synced Order",
    "Urgent Delivery unfulfilled by LF Vendor",
    "CUT LENS",
}

# The two explicitly referenced LF/CWH tabs and the power exception tab.  Two
# additional spreadsheets were supplied without a decision rule, so they are not
# silently used as evidence here.
FRAME_SHEET_ID = "1h22STSyGiR1YyZey1pFKuLf7EH8DutiKgv5-zsWnavE"
FRAME_SHEET_RANGES = {
    "localFitting": "'LO(Local Fitting)'!C2:C",
    "plant": "'LO(Plant)'!B2:B",
}
POWER_SHEET_ID = "1mkDUryAJVlRmg5lfDoz6U2XezLxn2YC4SyVm9PTk00Q"
POWER_SHEET_RANGE = "'UNFF Single File 20 Dec 2025 Onward'!B2:B"


def dax_text(value: str) -> str:
    return '"' + value.replace('"', '""') + '"'


def base_filter(start: date, end: date) -> str:
    next_day = end + timedelta(days=1)
    return f"""
        'Raw Data'[cancelled_date] >= DATE({start.year}, {start.month}, {start.day})
        && 'Raw Data'[cancelled_date] < DATE({next_day.year}, {next_day.month}, {next_day.day})
        && 'Raw Data'[_country] = "India"
        && ('Raw Data'[jit flag] = 1 || ISBLANK('Raw Data'[jit flag]))
        && NOT CONTAINSSTRING('Raw Data'[product_name], "Carry Bag")
        && NOT CONTAINSSTRING('Raw Data'[product_name], "Zipper Case")
    """


def normalize_rows(payload: dict[str, Any]) -> list[dict[str, Any]]:
    try:
        rows = payload["results"][0]["tables"][0].get("rows", [])
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError("Power BI returned an unexpected response shape") from exc

    normalized: list[dict[str, Any]] = []
    for row in rows:
        clean: dict[str, Any] = {}
        for key, value in row.items():
            # SELECTCOLUMNS aliases arrive as "[alias]".
            name = key.split("[")[-1].rstrip("]")
            clean[name] = value
        normalized.append(clean)
    return normalized


class PowerBiClient:
    def __init__(self) -> None:
        self._refresh_token(force=False)

    def _refresh_token(self, *, force: bool) -> None:
        # pbi_auth prints the account name for interactive scripts. Keep stdout
        # machine-readable for the parent Next.js route.
        with contextlib.redirect_stdout(sys.stderr):
            token = get_token(interactive=False, force_refresh=force)
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    def execute(self, query: str) -> list[dict[str, Any]]:
        request = {
            "queries": [{"query": query}],
            "serializerSettings": {"includeNulls": True},
        }
        response = requests.post(
            POWER_BI_URL,
            headers=self.headers,
            json=request,
            timeout=90,
        )
        if response.status_code == 401:
            # A token can be rejected before its advertised expiry (revocation,
            # clock skew, or policy changes). Force one silent renewal and retry;
            # never loop and never retry unrelated query failures.
            response.close()
            print(
                "Power BI rejected the cached access token; renewing it and retrying once.",
                file=sys.stderr,
            )
            self._refresh_token(force=True)
            response = requests.post(
                POWER_BI_URL,
                headers=self.headers,
                json=request,
                timeout=90,
            )
        if response.status_code != 200:
            try:
                message = response.json()["error"]["pbi.error"]["details"][0][
                    "detail"
                ]["value"]
            except (KeyError, IndexError, TypeError, ValueError):
                message = f"HTTP {response.status_code}"
            raise RuntimeError(f"Power BI query failed: {message}")
        return normalize_rows(response.json())

    def scalar(self, query: str, key: str) -> int:
        rows = self.execute(query)
        if not rows:
            return 0
        value = rows[0].get(key, 0)
        try:
            return int(value or 0)
        except (TypeError, ValueError):
            return 0


def volume_audit_query(filters: str) -> str:
    return f"""
EVALUATE
ROW(
    "sourceRows",
    COUNTROWS(FILTER('Raw Data', {filters})),
    "orders",
    COUNTROWS(
        SUMMARIZE(
            FILTER(
                'Raw Data',
                ({filters}) && NOT(ISBLANK('Raw Data'[increment_id]))
            ),
            'Raw Data'[increment_id]
        )
    ),
    "itemIds",
    COUNTROWS(
        SUMMARIZE(
            FILTER(
                'Raw Data',
                ({filters}) && NOT(ISBLANK('Raw Data'[item_id]))
            ),
            'Raw Data'[item_id]
        )
    ),
    "uwItems",
    COUNTROWS(
        SUMMARIZE(
            FILTER(
                'Raw Data',
                ({filters}) && NOT(ISBLANK('Raw Data'[uw_item_id]))
            ),
            'Raw Data'[uw_item_id]
        )
    ),
    "missingUwItemRows",
    COUNTROWS(
        FILTER(
            'Raw Data',
            ({filters}) && ISBLANK('Raw Data'[uw_item_id])
        )
    )
)
"""


def reason_summary_query(filters: str) -> str:
    return f"""
EVALUATE
SUMMARIZE(
    FILTER('Raw Data', {filters}),
    'Raw Data'[reason_for_cancellation],
    "orders", DISTINCTCOUNT('Raw Data'[increment_id])
)
"""


def facility_summary_query(filters: str) -> str:
    return f"""
EVALUATE
SUMMARIZE(
    FILTER('Raw Data', {filters}),
    'Raw Data'[fulfilment facility],
    'Raw Data'[facility_code],
    "orders", DISTINCTCOUNT('Raw Data'[increment_id])
)
"""


def candidate_reason_filter(reasons: set[str], include_blank: bool) -> str:
    parts: list[str] = []
    if reasons:
        values = ", ".join(dax_text(value) for value in sorted(reasons))
        parts.append(f"'Raw Data'[reason_for_cancellation] IN {{ {values} }}")
    if include_blank:
        parts.append("ISBLANK('Raw Data'[reason_for_cancellation])")
    return "(" + " || ".join(parts or ["FALSE()"]) + ")"


def candidate_rows_query(filters: str, reason_filter: str, chunks: int, index: int) -> str:
    chunk_filter = ""
    if chunks > 1:
        chunk_filter = (
            f"&& MOD(COALESCE('Raw Data'[item_id], 0), {chunks}) = {index}"
        )
    return f"""
EVALUATE
SELECTCOLUMNS(
    FILTER(
        'Raw Data',
        {filters}
        && {reason_filter}
        {chunk_filter}
    ),
    "created_at", 'Raw Data'[created_at],
    "increment_id", 'Raw Data'[increment_id],
    "item_id", 'Raw Data'[item_id],
    "uw_item_id", 'Raw Data'[uw_item_id],
    "cancelled_date", 'Raw Data'[cancelled_date],
    "cancelled_by", 'Raw Data'[cancelled_by],
    "reason_for_cancellation", 'Raw Data'[reason_for_cancellation],
    "facility", 'Raw Data'[fulfilment facility],
    "facility_code", 'Raw Data'[facility_code],
    "handover_type", 'Raw Data'[handover type],
    "city", 'Raw Data'[city],
    "channel", 'Raw Data'[channel],
    "brand", 'Raw Data'[brand],
    "lens_package", 'Raw Data'[lens_package],
    "power_type", 'Raw Data'[power_type],
    "payment_method", 'Raw Data'[payment_method],
    "unicom_order_code", 'Raw Data'[unicom_order_code],
    "item_delivery_status", 'Raw Data'[itemdeliverystatus]
)
"""


def odd_chunk_count(row_count: int) -> int:
    if row_count <= ROWS_PER_CHUNK:
        return 1
    chunks = max(3, math.ceil(row_count / ROWS_PER_CHUNK))
    return chunks if chunks % 2 else chunks + 1


def load_google_evidence() -> tuple[dict[str, list[str]], str, list[str]]:
    warnings: list[str] = []
    evidence: dict[str, list[str]] = {
        "frameLocalFitting": [],
        "framePlant": [],
        "power": [],
    }
    if os.environ.get("ORDER_CANCELLATION_SKIP_GOOGLE") == "1":
        warnings.append("Google Sheet evidence is disabled by server configuration.")
        return evidence, "unavailable", warnings
    try:
        from gsheet_auth import get_sheets_service, read_nonblank_strings

        service = get_sheets_service(interactive=False)
        for key, range_name in FRAME_SHEET_RANGES.items():
            evidence_key = "frameLocalFitting" if key == "localFitting" else "framePlant"
            evidence[evidence_key] = sorted(
                read_nonblank_strings(service, FRAME_SHEET_ID, range_name)
            )
        evidence["power"] = sorted(
            read_nonblank_strings(service, POWER_SHEET_ID, POWER_SHEET_RANGE)
        )
        return evidence, "ok", warnings
    except Exception as exc:  # Google is enrichment; Power BI remains usable.
        message = str(exc).strip() or exc.__class__.__name__
        warnings.append(f"Google Sheet evidence is unavailable: {message}")
        return evidence, "unavailable", warnings


def fetch_dashboard_data(start: date, end: date) -> dict[str, Any]:
    client = PowerBiClient()
    filters = base_filter(start, end)

    volume_rows = client.execute(volume_audit_query(filters))
    volume = volume_rows[0] if volume_rows else {}
    source_rows = int(volume.get("sourceRows") or 0)
    total_orders = int(volume.get("orders") or 0)
    total_item_ids = int(volume.get("itemIds") or 0)
    total_uw_item_ids = int(volume.get("uwItems") or 0)
    missing_uw_item_rows = int(volume.get("missingUwItemRows") or 0)
    duplicate_uw_item_rows = max(
        0, source_rows - missing_uw_item_rows - total_uw_item_ids
    )
    reason_rows = client.execute(reason_summary_query(filters))
    facility_rows = client.execute(facility_summary_query(filters))

    reason_totals: list[dict[str, Any]] = []
    unknown_reasons: set[str] = set()
    observed_candidate_reasons: set[str] = set()
    include_blank = False
    candidate_folded = {reason.casefold() for reason in CANDIDATE_REASONS}
    excluded_folded = {reason.casefold() for reason in KNOWN_OUT_OF_SCOPE_REASONS}
    for row in reason_rows:
        reason = str(row.get("reason_for_cancellation") or "").strip()
        total = int(row.get("orders") or 0)
        reason_totals.append({"name": reason or "Unspecified", "total": total})
        folded = " ".join(reason.split()).casefold()
        if not reason:
            include_blank = True
        elif folded in candidate_folded:
            observed_candidate_reasons.add(reason)
        elif folded not in candidate_folded and folded not in excluded_folded:
            unknown_reasons.add(reason)

    detail_reasons = observed_candidate_reasons | unknown_reasons
    reason_filter = candidate_reason_filter(detail_reasons, include_blank)
    candidate_filters = f"({filters}) && {reason_filter}"
    candidate_item_count = client.scalar(
        f"EVALUATE ROW(\"items\", COUNTROWS(FILTER('Raw Data', {candidate_filters})))",
        "items",
    )
    chunks = odd_chunk_count(candidate_item_count)
    rows: list[dict[str, Any]] = []
    for index in range(chunks):
        rows.extend(
            client.execute(
                candidate_rows_query(filters, reason_filter, chunks, index)
            )
        )
        if chunks > 1 and index + 1 < chunks:
            time.sleep(0.2)
    if len(rows) != candidate_item_count:
        raise RuntimeError(
            "Power BI returned an incomplete candidate dump "
            f"({len(rows):,}/{candidate_item_count:,} rows)."
        )

    facilities: defaultdict[str, int] = defaultdict(int)
    for row in facility_rows:
        name = str(
            row.get("facility")
            or row.get("fulfilment facility")
            or row.get("facility_code")
            or "Unassigned"
        ).strip()
        facilities[name or "Unassigned"] += int(row.get("orders") or 0)

    sheet_evidence, google_status, warnings = load_google_evidence()
    return {
        "report": "Fulfilment Order Analytics_Final",
        "datasetId": DATASET_ID,
        "totalOrders": total_orders,
        "sourceRows": source_rows,
        "totalItemIds": total_item_ids,
        "totalUwItemIds": total_uw_item_ids,
        "missingUwItemRows": missing_uw_item_rows,
        "duplicateUwItemRows": duplicate_uw_item_rows,
        "candidateItemCount": candidate_item_count,
        "rows": rows,
        "reasonTotals": sorted(
            reason_totals, key=lambda item: (-item["total"], item["name"])
        ),
        "facilityTotals": [
            {"name": name, "total": total}
            for name, total in sorted(
                facilities.items(), key=lambda item: (-item[1], item[0])
            )
        ],
        "unknownReasons": sorted(unknown_reasons),
        "sheetEvidence": sheet_evidence,
        "sources": {"powerBi": "ok", "googleSheets": google_status},
        "warnings": warnings,
    }


def parse_args() -> tuple[date, date]:
    if len(sys.argv) != 3:
        raise ValueError("Usage: fetch_data.py START_DATE END_DATE")
    start = date.fromisoformat(sys.argv[1])
    end = date.fromisoformat(sys.argv[2])
    if end < start:
        raise ValueError("END_DATE must be on or after START_DATE")
    if (end - start).days + 1 > 31:
        raise ValueError("Date range cannot exceed 31 days")
    return start, end


def main() -> int:
    try:
        start, end = parse_args()
        payload = fetch_dashboard_data(start, end)
        json.dump(payload, sys.stdout, separators=(",", ":"), default=str)
        sys.stdout.write("\n")
        return 0
    except Exception as exc:
        print(f"Order-cancellation fetch failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
