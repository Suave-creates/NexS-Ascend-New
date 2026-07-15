'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import {
  FiHome,
  FiLayers,
  FiArchive,
  FiSettings,
  FiEye,
  FiPackage,
  FiTruck,
  FiInfo,
  FiTool,
  FiShield,
  FiMaximize,
  FiChevronDown,
  FiMenu,
  FiDownload,
  FiGrid,
  FiZap,
} from 'react-icons/fi';
import { cn } from '@/lib/cn';

type Child = { href: string; label: string };
type NavItem = { href?: string; icon: IconType; label: string; children?: Child[] };

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const path = usePathname();

  // Hand-held scanners (4.6"-5.8" screens) can't spare 256px for the expanded
  // sidebar — default to the icon rail there; still manually expandable.
  useEffect(() => {
    if (window.innerWidth < 640) setCollapsed(true);
  }, []);

  const navItems: NavItem[] = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/consolidate', icon: FiGrid, label: 'ConsolidAte' },
    { href: '/consolidate-ptl', icon: FiZap, label: 'ConsolidAte PTL' },

    {
      icon: FiLayers,
      label: 'ASRS',
      children: [
        { href: '/asrs/tote-master', label: 'Tote Master' },
        { href: '/asrs/pid-hunter', label: 'PID Hunter' },
        { href: '/asrs/pid-hunter-transfer', label: 'PID Hunter Transfer' },
        { href: '/asrs/pid-hunted-stock-out', label: 'PID Stock-out' },
        { href: '/operations/manual-warehouse', label: 'MWarehouse Scan' },
        { href: '/asrs/order-master', label: 'Order Master' },
        { href: '/asrs/order-update-upload', label: 'O-U-D Upload' },
      ],
    },

    {
      icon: FiArchive,
      label: 'Manual Warehouse',
      children: [
        { href: '/manual-warehouse/lookup', label: 'Location Finder' },
        { href: '/manual-warehouse/cycle-count-mini', label: 'Cycle Count' },
        { href: '/manual-warehouse/upload', label: 'Excel Upload' },
      ],
    },

    {
      icon: FiSettings,
      label: 'Operations',
      children: [
        { href: '/operations/tray-finder', label: 'Tray Finder' },
        { href: 'https://whrfid.lenskart.com/tray-rfid', label: 'Tray RFID' },
        { href: '/operations/tray-scanner', label: 'Tray Scanner' },
        { href: '/operations/tray-pro-mei', label: 'Tray PRO MEI' },
        { href: '/operations/excel-upload', label: 'Excel Upload' },
      ],
    },

    {
      icon: FiEye,
      label: 'Lens Lab',
      children: [
        { href: '/lens-lab/fqc', label: 'Final QC' },
        { href: '/lens-lab/location-blank-check', label: 'Blank IN_PICKING' },
        { href: '/lens-lab/jit-PD-stamp', label: 'JIT PD Stamp' },
      ],
    },

    {
      icon: FiPackage,
      label: 'Packing Dispatch',
      children: [
        { href: '/packing-dispatch/packing', label: 'Packing Scans' },
        { href: '/packing-dispatch/dispatch', label: 'Dispatch Scans' },
        { href: '/packing-dispatch/tray-releaser', label: 'Tray Releaser' },
        { href: '/packing-dispatch/cl-cls', label: 'CL/CLs Scans' },
        { href: '/packing-dispatch/fr0', label: 'FR0 Scans' },
        { href: '/packing-dispatch/bulk', label: 'Bulk Scans' },
        { href: '/packing-dispatch/fr0bulkhoto', label: 'FR0/BULK HOTO' },
        { href: '/packing-dispatch/ndd-shipment', label: 'NDD Shipment' },
        { href: '/packing-dispatch/ndd-rca', label: 'NDD RCA' },
        { href: '/packing-dispatch/kitne-parcel-the', label: 'Kinte parcel the' },
        { href: '/packing-dispatch/kitne-parcel-the-cl-cls', label: 'कितने पार्सल थे' },
        { href: '/packing-dispatch/upload', label: 'Excel Upload' },
      ],
    },

    {
      icon: FiMaximize,
      label: 'Metal Frame',
      children: [
        { href: '/metal-frame/fitting', label: 'Fitting Dashboard' },
        { href: '/metal-frame/qc', label: 'QC Dashboard' },
        { href: '/metal-frame/tumbling', label: 'Tumbling' },
      ],
    },

    {
      icon: FiTruck,
      label: 'Courier Handover',
      children: [{ href: '/courier-handover', label: 'Facility Out Scan' }],
    },

    {
      icon: FiInfo,
      label: 'Info-Corner',
      children: [
        { href: '/infocorner/order-information-corner', label: 'Order Logs' },
        { href: '/infocorner/barcode-details', label: 'Barcode Details' },
        { href: '/infocorner/plant-pid-finder', label: 'Plant PID Finder' },
        { href: '/infocorner/QCF-information-corner', label: 'QCF Logs' },
        { href: '/infocorner/tracer-pro', label: 'Tracer pro MQCF' },
        { href: '/infocorner/sync-time-inventory', label: 'Sync Time Inventory' },
        { href: '/infocorner/order-created-when', label: 'Order Created When' },
        { href: '/infocorner/sync-time-location', label: 'Sync-time  Location' },
        { href: '/infocorner/shippment-rtd', label: 'Shipment RTDetails' },
        { href: '/infocorner/PO-Details', label: 'PO Details' },
        { href: '/infocorner/Bulk-status-information', label: 'Bulk Status Info' },
        { href: '/infocorner/numbers', label: 'Numbers (BQ)' },
      ],
    },

    {
      icon: FiTool,
      label: 'Maintenance',
      children: [{ href: '/maintenance/shop-issue', label: 'Shop Issue' }],
    },

    {
      icon: FiShield,
      label: 'EHS',
      children: [{ href: '/ehs/report-deviation', label: 'Report Deviation' }],
    },

    {
      icon: FiDownload,
      label: 'Extensions',
      children: [
        { href: '/extensions', label: 'Browser Extensions' },
        { href: '/extensions/rules', label: 'Flash Rules' },
      ],
    },
  ];

  const toggleSection = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <aside
      className={cn(
        'flex flex-col bg-brand-900 text-gray-300 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Brand / collapse toggle */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-3">
        {!collapsed && (
          <div className="flex items-center gap-2 pl-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
              N
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          // Top-level link (Home)
          if (item.href) {
            const isActive = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  collapsed && 'justify-center',
                  isActive ? 'bg-brand-700 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          }

          // Collapsed sections render as an icon-only shortcut to the first child
          if (collapsed) {
            const first = item.children?.[0];
            return (
              <Link
                key={item.label}
                href={first?.href ?? '#'}
                title={item.label}
                className="flex items-center justify-center rounded-lg px-3 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
              </Link>
            );
          }

          const isOpen = openSections[item.label] ?? true;

          return (
            <div key={item.label}>
              <button
                onClick={() => toggleSection(item.label)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                <FiChevronDown
                  className={cn('h-4 w-4 transition-transform', isOpen ? 'rotate-0' : '-rotate-90')}
                />
              </button>

              <div
                className={cn(
                  'grid transition-all duration-300 ease-in-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <ul className="mt-0.5 space-y-0.5 overflow-hidden" aria-hidden={!isOpen}>
                  {item.children!.map((child) => {
                    const isActive = path === child.href;
                    return (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          tabIndex={isOpen ? undefined : -1}
                          className={cn(
                            'flex items-center gap-2 rounded-lg py-1.5 pl-11 pr-3 text-sm transition',
                            isActive
                              ? 'bg-white/10 font-medium text-white'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white',
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 shrink-0 rounded-full',
                              isActive ? 'bg-gold-500' : 'bg-white/25',
                            )}
                          />
                          <span className="truncate">{child.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
