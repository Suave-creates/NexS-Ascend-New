//src/app/dispatch_ptl/page.tsx

'use client'

import { useEffect, useState } from 'react'
import RackGrid from './components/RackGrid'
import LocationScanPanel from './components/LocationScanPanel'
import StatusBar from './components/StatusBar'
import MasterResetPanel from './components/MasterResetPanel'
import OperatorColorPanel from './components/OperatorColorPanel'
import { Location } from './types'

export default function DispatchPTLPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [activeLights, setActiveLights] = useState(0)
  const [assignedCount, setAssignedCount] = useState(0)
  const [placedCount, setPlacedCount] = useState(0)

  const fetchLocations = async () => {
    const res = await fetch('/api/dispatch-ptl/locations')
    const data = await res.json()
    setLocations(data.locations)
    setActiveLights(data.activeLights)
    setAssignedCount(data.assignedCount)
    setPlacedCount(data.placedCount)
  }

  useEffect(() => {
    fetchLocations()
    const interval = setInterval(fetchLocations, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-brand-900 text-white p-6">
      <StatusBar
        activeLights={activeLights}
        assignedCount={assignedCount}
        placedCount={placedCount}
      />

      <div className="grid grid-cols-4 gap-6 mt-6">
        {/* LEFT SIDE — RACK GRID */}
        <div className="col-span-3">
          <RackGrid locations={locations} />
        </div>

        {/* RIGHT SIDE — CONTROL PANEL */}
        <div className="col-span-1 space-y-6">
          <OperatorColorPanel />
          <LocationScanPanel onSuccess={fetchLocations} />
          <MasterResetPanel onSuccess={fetchLocations} />
        </div>
      </div>
    </div>
  )
}
