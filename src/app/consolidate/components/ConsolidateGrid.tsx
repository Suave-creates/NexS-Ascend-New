'use client';

import { cn } from '@/lib/cn';
import type { Slot } from '../types';

const COLOR_BG: Record<string, string> = {
  YELLOW: 'bg-yellow-400 border-yellow-500 text-yellow-950',
  BLUE: 'bg-blue-500 border-blue-600 text-white',
  GREEN: 'bg-green-500 border-green-600 text-white',
  PINK: 'bg-pink-500 border-pink-600 text-white',
  RED: 'bg-red-500 border-red-600 text-white',
};

function tileClass(slot: Slot): string {
  if (slot.status === 'COMPLETE') {
    return 'bg-green-500 border-green-600 text-white animate-pulse';
  }
  if (slot.status === 'CONSOLIDATING') {
    return cn(COLOR_BG[slot.operatorColor || 'YELLOW'] || COLOR_BG.YELLOW, 'shadow-md');
  }
  return 'bg-gray-100 border-gray-200 text-gray-400';
}

function Tile({ slot, highlight }: { slot: Slot; highlight: boolean }) {
  const active = slot.status === 'CONSOLIDATING' || slot.status === 'COMPLETE';
  return (
    <div
      className={cn(
        'relative flex aspect-square flex-col items-center justify-center rounded-lg border p-1 transition-all',
        tileClass(slot),
        highlight && 'ring-2 ring-offset-2 ring-brand-600',
      )}
      title={slot.shippingPackageId || slot.barcode}
    >
      <span className="absolute left-1 top-0.5 text-[9px] font-medium opacity-70 sm:text-[10px]">
        {slot.locationNumber}
      </span>
      {active ? (
        <>
          <span className="text-sm font-bold leading-none sm:text-lg">
            {slot.accounted}/{slot.expected}
          </span>
          {slot.status === 'COMPLETE' && (
            <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide sm:text-[9px]">
              Ready
            </span>
          )}
        </>
      ) : (
        <span className="text-[9px] uppercase tracking-wide sm:text-[10px]">Free</span>
      )}
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
    <div className="space-y-5">
      {[...racks.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([rackNumber, rackSlots]) => (
          <div key={rackNumber}>
            <h3 className="mb-2 text-sm font-semibold text-brand-700">Rack {rackNumber}</h3>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
              {rackSlots
                .slice()
                .sort((a, b) => a.locationNumber - b.locationNumber)
                .map((slot) => (
                  <Tile
                    key={slot.id}
                    slot={slot}
                    highlight={highlightLocationId === slot.id}
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
