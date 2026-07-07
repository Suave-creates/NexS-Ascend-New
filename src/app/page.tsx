// src/app/page.tsx
import { Card } from '@/components/ui';

export default function DashboardPage() {
  return (
    <div
      className="relative flex min-h-[70vh] items-start justify-start overflow-hidden rounded-2xl bg-cover bg-center shadow-sm"
      style={{ backgroundImage: 'url(/images/home-bg.png)' }}
    >
      <Card variant="floating" className="m-8 mt-32 px-8 py-6">
        <h1 className="text-3xl font-bold text-brand-700">
          Welcome to NexS Ascend by ARYA
        </h1>
      </Card>
    </div>
  );
}
