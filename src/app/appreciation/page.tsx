import Image from 'next/image';
import { Card, PageHeader } from '@/components/ui';

export default function AppreciationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <Card>
        <div className="p-6 flex flex-col items-center">
          <PageHeader title="🌟 Appreciation Wall 🌟" />

          <Image
            src="/images/appriciation-bg.jpg" // This matches your file path in the public folder
            alt="Appreciation Message"
            width={800}
            height={600}
            className="rounded-xl shadow-xl"
          />
        </div>
      </Card>
    </div>
  );
}
