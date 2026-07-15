import { FiCircle } from 'react-icons/fi';
import type { ProcessEventEntry } from '@/services/metal-frame/tumbling/types';
import { formatClockTime } from '../_lib/format';

const EVENT_LABELS: Record<string, string> = {
  PROCESS_CREATED: 'Process Started (Draft Created)',
  PROCESS_STARTED: 'Tumbling Started',
  PROCESS_COMPLETED_AUTOMATICALLY: 'Completed Automatically',
  PROCESS_COMPLETED_EARLY: 'Completed Early by Supervisor',
  PROCESS_STOPPED: 'Stopped by Supervisor',
  PROCESS_CANCELLED: 'Draft Cancelled',
};

function eventDetail(event: ProcessEventEntry): string | null {
  if (event.type === 'PROCESS_COMPLETED_EARLY' || event.type === 'PROCESS_STOPPED') {
    const who = [event.by, event.authorizedBy ? `authorized by ${event.authorizedBy}` : null].filter(Boolean).join(' · ');
    return [who, event.reason].filter(Boolean).join(' — ') || null;
  }
  if (event.by) return `by ${event.by}`;
  return null;
}

/** "Operators love this because they instantly understand what happened at that station without opening reports." */
export function ProcessTimeline({ events }: { events: ProcessEventEntry[] }) {
  if (events.length === 0) {
    return <p className="text-xs text-gray-400">No activity recorded yet.</p>;
  }

  return (
    <ol className="space-y-0">
      {events.map((event, i) => (
        <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
          {i < events.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-gray-200" aria-hidden="true" />}
          <FiCircle className="mt-1 h-[15px] w-[15px] shrink-0 fill-brand-100 text-brand-600" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-gray-400">{formatClockTime(event.at)}</div>
            <div className="text-sm font-medium text-gray-800">{EVENT_LABELS[event.type] ?? event.type}</div>
            {eventDetail(event) && <div className="text-xs text-gray-500">{eventDetail(event)}</div>}
            {event.remarks && <div className="mt-0.5 text-xs italic text-gray-400">"{event.remarks}"</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
