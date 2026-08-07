// src/app/cl-cls/consolidate/types.ts

export type SlotStatus = 'FREE' | 'CONSOLIDATING' | 'COMPLETE' | 'RELEASED';
export type OperatorColor = 'YELLOW' | 'BLUE' | 'GREEN' | 'PINK' | 'RED';

export interface Slot {
  id: number;
  rackNumber: number;
  level: number;
  position: number;
  locationNumber: number;
  barcode: string;
  lightState: 'ON' | 'OFF';
  shippingPackageId: string | null;
  operatorColor: OperatorColor | null;
  // All operators currently active on this slot (1, or 2 when a shared slot
  // has two concurrent operators each with a live pending item). Falls back
  // to [operatorColor] when absent (e.g. an optimistic client-side patch).
  operatorColors?: OperatorColor[];
  status: SlotStatus;
  expected: number;
  accounted: number;
}

export interface Stats {
  totalSlots: number;
  activeLights: number;
  consolidating: number;
  complete: number;
  freeSlots: number;
}

export interface ScanResult {
  shippingPackageId: string;
  itemType: string | null;
  location: {
    id: number;
    locationNumber: number;
    barcode: string;
    rackNumber: number;
    level: number;
    position: number;
  } | null;
  expected: number;
  placed: number;
  scanned: number;
  alreadyScanned: boolean;
  color: string;
}
