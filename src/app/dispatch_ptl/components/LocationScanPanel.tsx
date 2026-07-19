//src/app/dispatch_ptl/components/LocationScanPanel.tsx

'use client'

import { useState } from 'react'

export default function LocationScanPanel({ onSuccess }: any) {
  const [awb, setAwb] = useState('')
  const [location, setLocation] = useState('')
  const [assignedLocation, setAssignedLocation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAwbScan = async () => {
    if (!awb) return

    try {
      setLoading(true)
      setError(null)

      const operatorColor = localStorage.getItem('operatorColor')

      const res = await fetch('/api/dispatch-ptl/scan-awb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ awb, operatorColor })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Scan failed')
        return
      }

      setAssignedLocation(data.location.barcode)
      if (onSuccess) onSuccess()

    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationScan = async () => {
    if (!awb || !location) return

    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/dispatch-ptl/confirm-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          awb,
          locationBarcode: location
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Placement failed')
        return
      }

      setAwb('')
      setLocation('')
      setAssignedLocation(null)
      if (onSuccess) onSuccess()

    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h3 className="mb-3 font-semibold text-white">Scan & Place</h3>

      <input
        value={awb}
        onChange={(e) => setAwb(e.target.value)}
        onBlur={handleAwbScan}
        className="w-full bg-slate-900 border border-slate-600 p-2 rounded mb-2 text-white"
        placeholder="Scan AWB"
        disabled={loading}
      />

      {assignedLocation && (
        <div className="mb-2 text-sm text-white">
          Assigned Location: {assignedLocation}
        </div>
      )}

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onBlur={handleLocationScan}
        className="w-full bg-slate-900 border border-slate-600 p-2 rounded text-white"
        placeholder="Scan Location Barcode"
        disabled={loading}
      />

      {error && (
        <div className="mt-2 text-red-400 text-sm font-semibold">
          {error}
        </div>
      )}
    </div>
  )
}
