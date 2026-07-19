import Image from 'next/image';
import { Card, CardBody, PageHeader } from '@/components/ui';

export default function AppreciationPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Appreciation Wall"
        subtitle="Celebrating the people and moments that make the team shine."
      />

      <Card>
        <CardBody className="flex flex-col items-center">
          <Image
            src="/images/appriciation-bg.jpg" // This matches your file path in the public folder
            alt="Appreciation Message"
            width={800}
            height={600}
            className="rounded-xl shadow-md max-w-full h-auto"
          />
        </CardBody>
      </Card>
    </div>
  );
}
