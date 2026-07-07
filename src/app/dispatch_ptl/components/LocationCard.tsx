import { Location } from '../types'

const GLOW_CLASSES: Record<string, string> = {
  YELLOW: 'bg-yellow-500/30 border-yellow-400 shadow-yellow-500/40',
  BLUE: 'bg-blue-500/30 border-blue-400 shadow-blue-500/40',
  GREEN: 'bg-green-500/30 border-green-400 shadow-green-500/40',
  PINK: 'bg-pink-500/30 border-pink-400 shadow-pink-500/40',
  RED: 'bg-red-500/30 border-red-400 shadow-red-500/40'
}

export default function LocationCard({ location }: { location: Location }) {

  const isOn = location.lightState === 'ON'

  const glowClass =
    location.operatorColor && GLOW_CLASSES[location.operatorColor]
      ? GLOW_CLASSES[location.operatorColor]
      : ''

  return (
    <div
      className={`p-4 rounded-lg border text-center transition-all ${
        isOn
          ? `${glowClass} shadow-lg`
          : 'bg-slate-800 border-slate-700'
      }`}
    >
      <div className="text-sm text-slate-400">
        {location.barcode}
      </div>

      <div className="mt-2 font-semibold">
        {location.locationNumber}
      </div>

      {isOn && (
        <div className="text-xs mt-1 text-white">
          {location.currentRoutingCode}
        </div>
      )}
    </div>
  )
}
