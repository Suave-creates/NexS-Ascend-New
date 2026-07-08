'use client';

import type { Slot } from '../types';

const COLOR_HEX: Record<string, string> = {
  YELLOW: '#f5b942', BLUE: '#5b9cf6', GREEN: '#46d39a', PINK: '#f26fb8', RED: '#e5484d',
};

function Tile({ slot, highlight }: { slot: Slot; highlight: boolean }) {
  const lit = slot.lightState === 'ON';                         // active put-to-light target
  const done = slot.status === 'COMPLETE';
  const assigned = slot.status === 'CONSOLIDATING' || done;     // holds a package
  const color = COLOR_HEX[slot.operatorColor || 'YELLOW'] || '#f5b942';

  // BRIGHT glow ONLY while the light is ON ("put here"). Because the light turns
  // off on PUT, exactly one slot is ever lit — so two concurrent orders stay
  // segregable. Assigned-but-placed slots show a calm marker; done shows green.
  const style: React.CSSProperties = lit
    ? { borderColor: color, boxShadow: `0 0 0 1px ${color}, 0 0 16px ${color}88`, color }
    : done
    ? { borderColor: 'rgba(70,211,154,.45)', color: '#46d39a' }
    : assigned
    ? { borderColor: `${color}55`, color }
    : {};

  return (
    <div
      className={
        'csl-slot' + (lit ? ' on' : '') + (assigned ? ' asg' : '') + (done ? ' done' : '') + (highlight ? ' hi' : '')
      }
      style={style}
      title={slot.shippingPackageId || slot.barcode}
    >
      <span className="csl-slot-no">{slot.locationNumber}</span>
      {assigned && <span className="csl-slot-count">{slot.accounted}/{slot.expected}</span>}
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
