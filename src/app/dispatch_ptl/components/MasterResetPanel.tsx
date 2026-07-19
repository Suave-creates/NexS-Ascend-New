//src/app/dispatch_ptl/components/MasterResetPanel.tsx

'use client'

import { useState } from 'react'

export default function MasterResetPanel({ onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async () => {
    const confirmed = window.confirm(
      '⚠️ This will clear ALL routing assignments and turn OFF all lights.\n\nAre you sure?'
    )

    if (!confirmed) return

    try {
      setLoading(true)
      setError(null)
      setMessage(null)

      const res = await fetch('/api/dispatch-ptl/master-reset', {
        method: 'POST'
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Reset failed')
        return
      }

      setMessage('Master Reset Completed Successfully')
      if (onSuccess) onSuccess()

    } catch (err) {
      setError('Network error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg mt-6">
      <h3 className="font-semibold text-red-400 mb-3">
        System Control
      </h3>

      <button
        onClick={handleReset}
        disabled={loading}
        className={`w-full py-2 rounded font-semibold ${
          loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {loading ? 'Resetting...' : 'MASTER RESET'}
      </button>

      {message && (
        <div className="mt-3 text-green-400 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-3 text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
