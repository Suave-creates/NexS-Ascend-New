// src/app/page.tsx
import { Card } from '@/components/ui';

export default function DashboardPage() {
  // The subject (building + branding) sits in the lower-middle of home-bg.png; the
  // top ~45% is empty sky. Bias the cover crop downward (center 70%) so surplus sky
  // is trimmed instead of the building. cover still fills the box edge-to-edge.
  return (
    <div
      className="relative flex min-h-[70vh] items-start justify-start overflow-hidden rounded-2xl bg-cover shadow-sm"
      style={{ backgroundImage: 'url(/images/home-bg.png)', backgroundPosition: 'center 70%' }}
    >
      <Card variant="floating" className="m-8 mt-32 px-8 py-6">
        <h1 className="text-3xl font-bold text-brand-700">
          Welcome to NexS Ascend by ARYA
        </h1>
      </Card>
    </div>
  );
}
