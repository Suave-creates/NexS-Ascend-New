'use client';

import type { Slot } from '../types';

const COLOR_HEX: Record<string, string> = {
  YELLOW: '#f5b942', BLUE: '#5b9cf6', GREEN: '#46d39a', PINK: '#f26fb8', RED: '#e5484d',
};

function Tile({ slot, highlight }: { slot: Slot; highlight: boolean }) {
  const done = slot.status === 'COMPLETE';                        // complete → GREEN (wins)
  const lit = !done && slot.lightState === 'ON';                  // active put-to-light target
  const assigned = !done && slot.status === 'CONSOLIDATING';      // holds a package, light off (dark)
  const colors = slot.operatorColors?.length ? slot.operatorColors : slot.operatorColor ? [slot.operatorColor] : [];
  const dual = lit && colors.length === 2;                        // 2 concurrent operators sharing this slot
  const color = COLOR_HEX[colors[0] || 'YELLOW'] || '#f5b942';
  const color2 = dual ? COLOR_HEX[colors[1]] || color : null;
  const hasPkg = lit || assigned || done;

  // Each PTL slot has 2 physical LEDs. Normally only the active item glows a
  // single colour (one operator on that slot). If 2 concurrent operators
  // each have a live pending item on the SAME slot, both LEDs — and this
  // tile, as a diagonal split — show both colours instead of collapsing to
  // whichever operator scanned most recently. A completed slot glows GREEN
  // until its location is scanned to release it. An assigned-but-dark slot
  // shows a calm marker + count.
  const style: React.CSSProperties = done
    ? { borderColor: '#46d39a', boxShadow: '0 0 0 1px #46d39a, 0 0 16px #46d39a88', color: '#46d39a' }
    : dual
    ? {
        borderColor: color,
        boxShadow: `0 0 0 1px ${color}, 0 0 16px ${color2}88`,
        background: `linear-gradient(135deg, ${color} 0 49%, ${color2} 51% 100%)`,
        color: '#0b0d11',
      }
    : lit
    ? { borderColor: color, boxShadow: `0 0 0 1px ${color}, 0 0 16px ${color}88`, color }
    : assigned
    ? { borderColor: `${color}55`, color }
    : {};

  return (
    <div
      className={
        'csl-slot' + (lit || done ? ' on' : '') + (assigned ? ' asg' : '') + (done ? ' done' : '') + (highlight ? ' hi' : '')
      }
      style={style}
      title={slot.shippingPackageId || slot.barcode}
    >
      <span className="csl-slot-no">{slot.locationNumber}</span>
      {hasPkg && <span className="csl-slot-count">{slot.accounted}/{slot.expected}</span>}
      {done && <span className="csl-slot-tag">READY</span>}
    </div>
  );
}

export default function ConsolidateGrid({
  slots,
  highlightLocationId,
}: {
  slots: Slot[];
  highlightLocationId?: number | null;
}) {
  const racks = new Map<number, Slot[]>();
  for (const s of slots) {
    if (!racks.has(s.rackNumber)) racks.set(s.rackNumber, []);
    racks.get(s.rackNumber)!.push(s);
  }

  return (
    <div className="csl-grids">
      {[...racks.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([rackNumber, rackSlots]) => (
          <div className="csl-rack" key={rackNumber}>
            <h3>Rack {rackNumber}</h3>
            <div className="csl-grid">
              {rackSlots
                .slice()
                .sort((a, b) => a.locationNumber - b.locationNumber)
                .map((slot) => (
                  <Tile key={slot.id} slot={slot} highlight={highlightLocationId === slot.id} />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
