'use client';

// src/app/extensions/page.tsx

import Link from 'next/link';

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

export default function ExtensionsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Extensions</h1>
      <p className="text-gray-500 text-sm mb-6">
        Download browser extensions below. Chrome uses the{' '}
        <code className="bg-gray-100 px-1 rounded">.zip</code> (load unpacked); Firefox uses the{' '}
        <code className="bg-gray-100 px-1 rounded">.xpi</code>.
      </p>

      <Link
        href="/extensions/rules"
        className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 hover:bg-blue-100 transition-colors"
      >
        <div>
          <div className="font-semibold text-blue-800">⚡ Flash Rules builder</div>
          <div className="text-xs text-blue-600 mt-0.5">
            Define which response fields to watch and what full-screen message to flash. The Flash
            Watcher extension picks up changes automatically.
          </div>
        </div>
        <span className="text-blue-500 text-xl">→</span>
      </Link>

      <div className="flex flex-col gap-4">
        {EXTENSIONS.map((ext) => (
          <div
            key={ext.name}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm"
          >
            <div className="mb-3">
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                {ext.name}
                {ext.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {ext.badge}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{ext.description}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {ext.files.map((f) => (
                <a
                  key={f.file}
                  href={`/extensions/${encodeURIComponent(f.file)}`}
                  download={f.file}
                  title={f.hint}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-6.707a1 1 0 011.414 0L9 11.586V3a1 1 0 112 0v8.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-400 mt-8 space-y-1">
        <p>
          <strong>Chrome:</strong> extract the .zip →{' '}
          <code className="bg-gray-100 px-1 rounded">chrome://extensions</code> → enable Developer
          mode → Load unpacked → select the folder.
        </p>
        <p>
          <strong>Firefox:</strong> drag the .xpi onto{' '}
          <code className="bg-gray-100 px-1 rounded">about:addons</code>, or open Firefox menu →
          Add-ons → Install Add-on From File.
        </p>
        <p className="pt-2">
          After installing NexS Flash Watcher, open its popup and set the{' '}
          <strong>Rules URL</strong> to this app&apos;s{' '}
          <code className="bg-gray-100 px-1 rounded">/api/flash-rules</code> endpoint.
        </p>
      </div>
    </div>
  );
}
