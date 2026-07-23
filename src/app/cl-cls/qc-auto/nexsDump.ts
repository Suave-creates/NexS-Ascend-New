export type DumpProgress = { loaded: number; total: number; page: number };

export async function syncAutoQcDump(onProgress?: (progress: DumpProgress) => void) {
  await fetch('/api/cl-cls/qc-auto/dump', { method: 'POST' });
  for (;;) {
    const response = await fetch('/api/cl-cls/qc-auto/dump', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Central dump status failed: HTTP ${response.status}`);
    const status = await response.json();
    onProgress?.({ loaded: status.loaded || 0, total: status.total || 0, page: 0 });
    if (!status.running) {
      if (status.error) throw new Error(status.error);
      return status;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
