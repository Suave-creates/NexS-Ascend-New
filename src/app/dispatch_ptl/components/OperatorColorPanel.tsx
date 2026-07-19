'use client'

import { useEffect, useState } from 'react'
import { OperatorColor } from '../types'

const COLORS: OperatorColor[] = [
  'YELLOW',
  'BLUE',
  'GREEN',
  'PINK',
  'RED'
]

const COLOR_CLASSES: Record<OperatorColor, string> = {
  YELLOW: 'bg-yellow-500',
  BLUE: 'bg-blue-500',
  GREEN: 'bg-green-500',
  PINK: 'bg-pink-500',
  RED: 'bg-red-500'
}

export default function OperatorColorPanel() {
  const [selected, setSelected] = useState<OperatorColor>('YELLOW')

  useEffect(() => {
    const stored = localStorage.getItem('operatorColor') as OperatorColor
    if (stored) setSelected(stored)
  }, [])

  const handleSelect = (color: OperatorColor) => {
    setSelected(color)
    localStorage.setItem('operatorColor', color)
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h3 className="mb-3 font-semibold">Choose your Power Ranger</h3>

      <div className="flex gap-3">
        {COLORS.map(color => (
          <button
            key={color}
            onClick={() => handleSelect(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selected === color
                ? 'border-white scale-110'
                : 'border-transparent'
            } ${COLOR_CLASSES[color]}`}
          />
        ))}
      </div>
    </div>
  )
}
