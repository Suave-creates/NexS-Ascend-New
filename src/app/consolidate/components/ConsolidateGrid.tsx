'use client';

import type { Slot } from '../types';

const COLOR_HEX: Record<string, string> = {
  YELLOW: '#f5b942', BLUE: '#5b9cf6', GREEN: '#46d39a', PINK: '#f26fb8', RED: '#e5484d',
};

function Tile({ slot, highlight }: { slot: Slot; highlight: boolean }) {
  const active = slot.status === 'CONSOLIDATING' || slot.status === 'COMPLETE';
  const done = slot.status === 'COMPLETE';
  const glow = done ? '#46d39a' : COLOR_HEX[slot.operatorColor || 'YELLOW'] || '#f5b942';

  const style: React.CSSProperties = active
    ? { borderColor: glow, boxShadow: `0 0 0 1px ${glow}, 0 0 14px ${glow}66`, color: glow }
    : {};

  return (
    <div
      className={
        'csl-slot' + (active ? ' on' : '') + (done ? ' done' : '') + (highlight ? ' hi' : '')
      }
      style={style}
      title={slot.shippingPackageId || slot.barcode}
    >
      <span className="csl-slot-no">{slot.locationNumber}</span>
      {active && <span className="csl-slot-count">{slot.accounted}/{slot.expected}</span>}
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
