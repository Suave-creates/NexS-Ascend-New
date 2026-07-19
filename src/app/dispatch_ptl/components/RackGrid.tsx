//src/app/dispatch_ptl/components/RackGrid.tsx

import { Location } from '../types'
import LocationCard from './LocationCard'

interface Props {
  locations: Location[]
}

export default function RackGrid({ locations }: Props) {
  const grouped = groupByRack(locations)

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([rackNumber, rackLocations]) => (
        <div key={rackNumber}>
          <h2 className="text-lg font-semibold mb-3">
            Rack {rackNumber}
          </h2>

          <div className="grid grid-cols-5 gap-4">
            {rackLocations.map(loc => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function groupByRack(locations: Location[]): Record<string, Location[]> {
  return locations.reduce((acc: Record<string, Location[]>, loc) => {
    if (!acc[loc.rackNumber]) acc[loc.rackNumber] = []
    acc[loc.rackNumber].push(loc)
    return acc
  }, {})
}
