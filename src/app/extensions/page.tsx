'use client';

// src/app/extensions/page.tsx

import Link from 'next/link';
import { FiDownload, FiZap, FiArrowRight } from 'react-icons/fi';
import { Card, CardBody, PageHeader, Badge } from '@/components/ui';
import { cn } from '@/lib/cn';

type ExtFile = { label: string; file: string; hint: string };

const EXTENSIONS: { name: string; description: string; files: ExtFile[]; badge?: string }[] = [
  {
    name: 'NexS Flash Watcher',
    badge: 'Configurable',
    description:
      'Generic watcher: flashes a full-screen message when a scan/panel response matches rules you define in the Flash Rules builder (any field, any condition). Rules are live-fetched from this app — no rebuild needed to change them.',
    files: [
      {
        label: 'Chrome (.zip)',
        file: 'nexs-flash-watcher.zip',
        hint: 'Extract → chrome://extensions → Developer mode → Load unpacked',
      },
      {
        label: 'Firefox (.xpi)',
        file: 'nexs-flash-watcher.xpi',
        hint: 'Drag the .xpi onto about:addons, or Add-ons → Install Add-on From File',
      },
    ],
  },
  {
    name: 'Fitting Siren',
    description:
      'Original fixed watcher: triggers a full-screen siren when a sensitive PID or lens package (substring match) is detected in a getFittingDetail response.',
    files: [
      {
        label: 'Chrome (.zip)',
        file: 'Fitting Siren.zip',
        hint: 'Extract → chrome://extensions → Load unpacked',
      },
      {
        label: 'Firefox (.xpi)',
        file: 'nexs-sensitive-pid-watcher.xpi',
        hint: 'Drag the .xpi onto about:addons or install via Firefox menu',
      },
    ],
  },
];

const CODE = 'rounded bg-gray-100 px-1 font-mono text-[0.85em] text-gray-700';

export default function ExtensionsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Extensions"
        subtitle={
          <>
            Download browser extensions below. Chrome uses the{' '}
            <code className={CODE}>.zip</code> (load unpacked); Firefox uses the{' '}
            <code className={CODE}>.xpi</code>.
          </>
        }
      />

      <Link
        href="/extensions/rules"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4 transition-colors hover:bg-brand-100"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-semibold text-brand-700">
            <FiZap className="h-4 w-4 flex-shrink-0" />
            Flash Rules builder
          </div>
          <div className="mt-0.5 text-xs text-brand-600">
            Define which response fields to watch and what full-screen message to flash. The Flash
            Watcher extension picks up changes automatically.
          </div>
        </div>
        <FiArrowRight className="h-5 w-5 flex-shrink-0 text-brand-500 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <div className="space-y-4">
        {EXTENSIONS.map((ext) => (
          <Card key={ext.name}>
            <CardBody className="space-y-3">
              <div>
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  {ext.name}
                  {ext.badge && <Badge tone="navy">{ext.badge}</Badge>}
                </div>
                <div className="mt-0.5 text-xs text-gray-500">{ext.description}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {ext.files.map((f) => (
                  <a
                    key={f.file}
                    href={`/extensions/${encodeURIComponent(f.file)}`}
                    download={f.file}
                    title={f.hint}
                    className={cn(
                      'inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors',
                      'hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
                    )}
                  >
                    <FiDownload className="h-4 w-4" />
                    {f.label}
                  </a>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="space-y-2 text-xs text-gray-500">
          <p>
            <strong className="text-gray-700">Chrome:</strong> extract the .zip →{' '}
            <code className={CODE}>chrome://extensions</code> → enable Developer mode → Load unpacked
            → select the folder.
          </p>
          <p>
            <strong className="text-gray-700">Firefox:</strong> drag the .xpi onto{' '}
            <code className={CODE}>about:addons</code>, or open Firefox menu → Add-ons → Install
            Add-on From File.
          </p>
          <p className="pt-2">
            After installing NexS Flash Watcher, open its popup and set the{' '}
            <strong className="text-gray-700">Rules URL</strong> to this app&apos;s{' '}
            <code className={CODE}>/api/flash-rules</code> endpoint.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
