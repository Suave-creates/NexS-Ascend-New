//src/app/dispatch_ptl/components/AwbScanPanel.tsx

import { useState } from 'react'

export default function AwbScanPanel({ onSuccess }: any) {
  const [awb, setAwb] = useState('')
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    if (!awb) return
    setLoading(true)

    await fetch('/api/dispatch-ptl/scan-awb', {
      method: 'POST',
      body: JSON.stringify({ awb })
    })

    setAwb('')
    setLoading(false)
    onSuccess()
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h3 className="mb-3 font-semibold">AWB Scan</h3>

      <input
        value={awb}
        onChange={e => setAwb(e.target.value)}
        className="w-full bg-slate-900 border border-slate-600 p-2 rounded"
        placeholder="Scan AWB"
      />

      <button
        onClick={handleScan}
        className="mt-3 w-full bg-yellow-500 text-black py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'SCAN'}
      </button>
    </div>
  )
}
