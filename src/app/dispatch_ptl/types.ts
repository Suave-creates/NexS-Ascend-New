//src/app/dispatch_ptl/types.ts

export type LightState = 'ON' | 'OFF'

export type OperatorColor =
  | 'YELLOW'
  | 'BLUE'
  | 'GREEN'
  | 'PINK'
  | 'RED'

export interface Location {
  id: number
  rackNumber: number
  level: number
  position: number
  locationNumber: number
  barcode: string
  lightState: 'ON' | 'OFF'
  currentRoutingCode?: string | null
  operatorColor?: OperatorColor | null
}
