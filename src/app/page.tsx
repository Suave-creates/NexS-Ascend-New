// src/app/page.tsx
import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  FiGrid,
  FiLayers,
  FiEye,
  FiTool,
  FiPackage,
  FiBarChart2,
  FiArrowRight,
} from 'react-icons/fi';

// Quick-launch module tiles. `color` and `href` are literals so Tailwind's JIT
// keeps the gradient utilities and Next can prefetch the routes.
const FEATURES: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href: string;
  color: string;
}[] = [
  { icon: FiGrid, title: 'ConsolidAte', href: '/consolidate', color: 'from-sky-400 to-blue-600' },
  { icon: FiLayers, title: 'ASRS & Warehouse', href: '/asrs/tote-master', color: 'from-violet-400 to-purple-600' },
  { icon: FiEye, title: 'Lens Lab', href: '/lens-lab/fqc', color: 'from-emerald-400 to-teal-600' },
  { icon: FiTool, title: 'Metal Frame', href: '/metal-frame/fitting', color: 'from-amber-400 to-orange-600' },
  { icon: FiPackage, title: 'Packing & Dispatch', href: '/packing-dispatch/packing', color: 'from-rose-400 to-pink-600' },
  { icon: FiBarChart2, title: 'Info-Corner', href: '/infocorner/order-information-corner', color: 'from-cyan-400 to-indigo-600' },
];

const STATS = [
  { n: '11', l: 'modules' },
  { n: '50+', l: 'workflows' },
  { n: '1', l: 'unified console' },
  { n: '24/7', l: 'floor-ready' },
];

export default function DashboardPage() {
  return (
    // Cinematic hero: the building photo is the backdrop; a left-weighted scrim
    // keeps it visible on the right while the landing content reads on the left.
    // Crop biased downward (center 70%) so surplus sky is trimmed, not the building.
    <div
      className="relative min-h-[82vh] overflow-hidden rounded-2xl bg-cover shadow-sm"
      style={{ backgroundImage: 'url(/images/home-bg.png)', backgroundPosition: 'center 70%' }}
    >
      {/* Scrims for legibility + depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/55 to-brand-900/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-transparent to-brand-900/10" />

      {/* Content layer */}
      <div className="relative z-10 flex min-h-[82vh] flex-col justify-between gap-10 p-8 sm:p-12">
        {/* Top — headline + description + live stats */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/25 backdrop-blur-sm">
            Warehouse Operations Suite
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
              NexS Ascend
            </span>
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-white/55">Crafted by ARYA</p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            One console for the entire fulfilment floor — from ASRS inbound and manual warehouse,
            through Lens Lab and Metal-Frame QC, to packing, dispatch and courier handover. Fast,
            scanner-first, backed by live analytics.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-9 gap-y-4">
            {STATS.map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-bold text-white">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-white/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — glassy quick-launch module tiles */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
            Explore the suite
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURES.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/20"
              >
                <div className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-lg', f.color)}>
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{f.title}</span>
                <FiArrowRight className="h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
