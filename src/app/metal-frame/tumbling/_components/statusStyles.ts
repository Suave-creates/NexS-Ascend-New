import type { IconType } from 'react-icons';
import { FiPlay, FiCheckCircle, FiClock, FiOctagon, FiCircle, FiSlash, FiEdit3 } from 'react-icons/fi';
import type { ContainerDisplayStatus, StationOverallStatus } from '@/services/metal-frame/tumbling/types';

type Tone = 'gray' | 'navy' | 'good' | 'danger' | 'notice' | 'gold';

interface StatusStyle {
  label: string;
  tone: Tone;
  icon: IconType;
}

const CONTAINER_STYLES: Record<ContainerDisplayStatus, StatusStyle> = {
  AVAILABLE: { label: 'Available', tone: 'good', icon: FiCircle },
  DRAFT: { label: 'Draft', tone: 'gold', icon: FiEdit3 },
  RUNNING: { label: 'Running', tone: 'navy', icon: FiPlay },
  COMPLETED: { label: 'Completed', tone: 'good', icon: FiCheckCircle },
  STOPPED: { label: 'Stopped', tone: 'danger', icon: FiOctagon },
  INACTIVE: { label: 'Inactive', tone: 'gray', icon: FiSlash },
};

const STATION_STYLES: Record<StationOverallStatus, StatusStyle> = {
  ...CONTAINER_STYLES,
  COMPLETING_SOON: { label: 'Completing Soon', tone: 'notice', icon: FiClock },
};

export function containerStatusStyle(status: ContainerDisplayStatus): StatusStyle {
  return CONTAINER_STYLES[status];
}

export function stationStatusStyle(status: StationOverallStatus): StatusStyle {
  return STATION_STYLES[status];
}
