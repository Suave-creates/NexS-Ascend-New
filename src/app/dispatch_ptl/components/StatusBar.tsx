//src/app/dispatch_ptl/components/StatusBar.tsx

interface Props {
  activeLights: number
  assignedCount: number
  placedCount: number
}

export default function StatusBar({
  activeLights,
  assignedCount,
  placedCount
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card title="Active Lights" value={activeLights} />
      <Card title="Assigned" value={assignedCount} />
      <Card title="Placed" value={placedCount} />
    </div>
  )
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}
