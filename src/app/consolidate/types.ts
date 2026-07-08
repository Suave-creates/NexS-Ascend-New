// src/app/consolidate/types.ts

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
