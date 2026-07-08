// src/app/page.tsx
import { cn } from '@/lib/cn';
import { Card } from '@/components/ui';
import {
  FiGrid,
  FiLayers,
  FiEye,
  FiTool,
  FiPackage,
  FiBarChart2,
  FiTruck,
  FiShield,
} from 'react-icons/fi';

// Module highlights for the landing section. Each colour is a literal string so
// Tailwind's JIT keeps the gradient utilities.
const FEATURES: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; color: string }[] = [
  { icon: FiGrid, title: 'ConsolidAte', desc: 'Order-QC → PTL put-to-light consolidation — live, scanner-driven, zero clicks.', color: 'from-sky-400 to-blue-600' },
  { icon: FiLayers, title: 'ASRS & Warehouse', desc: 'Tote Master, PID Hunter, Order Master, cycle counts and location finding.', color: 'from-violet-400 to-purple-600' },
  { icon: FiEye, title: 'Lens Lab', desc: 'Final QC, blank-in-picking checks and JIT PD stamping.', color: 'from-emerald-400 to-teal-600' },
  { icon: FiTool, title: 'Metal Frame', desc: 'Fitting and QC dashboards for metal-frame processing.', color: 'from-amber-400 to-orange-600' },
  { icon: FiPackage, title: 'Packing & Dispatch', desc: 'Packing/dispatch scans, Tray Releaser, CL/CLs, NDD RCA and HOTO.', color: 'from-rose-400 to-pink-600' },
  { icon: FiBarChart2, title: 'Info-Corner', desc: 'Order logs, Tracer Pro, barcode details and BigQuery numbers.', color: 'from-cyan-400 to-indigo-600' },
];

const STATS = [
  { n: '11', l: 'modules' },
  { n: '50+', l: 'workflows' },
  { n: '1', l: 'unified console' },
  { n: '24/7', l: 'floor-ready' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero — the subject (building + branding) sits in the lower-middle of
          home-bg.png; the top ~45% is empty sky. Bias the cover crop downward
          (center 70%) so surplus sky is trimmed instead of the building. */}
      <div
        className="relative flex min-h-[60vh] items-start justify-start overflow-hidden rounded-2xl bg-cover shadow-sm"
        style={{ backgroundImage: 'url(/images/home-bg.png)', backgroundPosition: 'center 70%' }}
      >
        <Card variant="floating" className="m-8 mt-28 px-8 py-6">
          <h1 className="text-3xl font-bold text-brand-700">Welcome to NexS Ascend by ARYA</h1>
        </Card>
      </div>

      {/* Colourful "about the app" section — fills what was empty white space. */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 via-blue-700 to-emerald-500 px-6 py-12 shadow-sm sm:px-10">
        {/* soft decorative glows for depth */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/25">
            Warehouse Operations Suite
          </span>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            One console for the entire fulfilment floor
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85">
            NexS Ascend unifies every Lenskart warehouse workflow — from ASRS inbound and manual
            warehouse, through Lens Lab and Metal-Frame QC, to packing, dispatch and courier
            handover — into a single fast, scanner-first interface backed by live analytics.
          </p>

          {/* Module cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/15"
              >
                <div className={cn('mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', f.color)}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats + trust row */}
          <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/15 pt-7">
            {STATS.map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-white">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-white/70">{s.l}</div>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-4 text-white/80">
              <span className="inline-flex items-center gap-1.5 text-sm">
                <FiTruck className="h-4 w-4" /> Real-time dispatch
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm">
                <FiShield className="h-4 w-4" /> Built for the floor
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
