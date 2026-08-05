'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RACK_COUNT = 40;
const POSITIONS_PER_RACK = 20;
const TRAYS_PER_POSITION = 5;
const TRAY_ID_PATTERN = /^[A-Z]{2}\d{5}$/;

type EventTone = 'ok' | 'error' | 'info';

type Position = {
  rack: number;
  position: number;
  barcode: string;
  trays: string[];
};

type Activity = {
  id: number;
  time: string;
  message: string;
  tone: EventTone;
};

type Feedback = {
  title: string;
  detail: string;
  tone: EventTone;
};

type StoredPosition = {
  barcode: string;
  trays: string[];
};

type PutawayDetails = {
  scannedTrayId: string;
  fittingId: string;
  shipmentId: string;
  priority: string;
  priorityClassification: string;
  orderDate: string;
  orderAge: string;
  orderAgeDays: number | null;
  orderMode: 'JIT' | 'REGULAR';
  rawOrderType: string;
  maxQcfCount: number;
  parentTrayId: string;
  childTrayId: string;
  trayRole: 'PARENT' | 'CHILD' | 'UNKNOWN';
  relatedTrayIds: string[];
  lookupMs: number;
  lookupToken: string;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function positionBarcode(rack: number, position: number) {
  return `NXS1-OMT-${pad(rack)}-${String(position).padStart(3, '0')}`;
}

function positionLabel(position: number) {
  return `P${String(position).padStart(3, '0')}`;
}

function createPositions(): Position[] {
  return Array.from({ length: RACK_COUNT * POSITIONS_PER_RACK }, (_, index) => {
    const rack = Math.floor(index / POSITIONS_PER_RACK) + 1;
    const position = (index % POSITIONS_PER_RACK) + 1;
    return { rack, position, barcode: positionBarcode(rack, position), trays: [] };
  });
}

function parsePositionBarcode(raw: string) {
  const normalized = raw.trim().toUpperCase().replaceAll('_', '-').replaceAll(' ', '');
  const match = normalized.match(/^NXS1-OMT-(\d{2})-(\d{3})$/);
  if (!match) return null;
  const rack = Number(match[1]);
  const position = Number(match[2]);
  if (rack < 1 || rack > RACK_COUNT || position < 1 || position > POSITIONS_PER_RACK) return null;
  return positionBarcode(rack, position);
}

function rackFromPositionBarcode(raw: string) {
  const match = raw.match(/^NXS1-OMT-(\d{2})-(\d{3})$/);
  const rack = Number(match?.[1]);
  return rack >= 1 && rack <= RACK_COUNT ? rack : null;
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TrayPutawayPage() {
  const [positions, setPositions] = useState<Position[]>(createPositions);
  const [operatorId, setOperatorId] = useState('');
  const [selectedRack, setSelectedRack] = useState(1);
  const [activeBarcode, setActiveBarcode] = useState<string | null>(null);
  const [pendingTray, setPendingTray] = useState<PutawayDetails | null>(null);
  const [scanValue, setScanValue] = useState('');
  const [removeScanValue, setRemoveScanValue] = useState('');
  const [removeMessage, setRemoveMessage] = useState('Scan a tray to remove it from its current position.');
  const [removing, setRemoving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({
    title: 'Ready for putaway',
    detail: 'Scan the parent tray to verify its details.',
    tone: 'info',
  });
  const scanRef = useRef<HTMLInputElement>(null);
  const removeRef = useRef<HTMLInputElement>(null);
  const operatorRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  const refreshPositions = useCallback(async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/omt/tray-putaway', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load rack state');
      const stored = new Map(
        ((data.positions ?? []) as StoredPosition[]).map((position) => [position.barcode, position.trays]),
      );
      setPositions(createPositions().map((position) => ({
        ...position,
        trays: stored.get(position.barcode) ?? [],
      })));
    } catch (error) {
      setFeedback({ title: 'Rack sync unavailable', detail: (error as Error).message, tone: 'error' });
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshPositions();
    const interval = window.setInterval(refreshPositions, 5_000);
    return () => window.clearInterval(interval);
  }, [refreshPositions]);

  const focusScanner = useCallback(() => {
    window.setTimeout(() => {
      if (!operatorId.trim()) {
        operatorRef.current?.focus();
      } else if (document.activeElement !== removeRef.current && document.activeElement !== operatorRef.current) {
        scanRef.current?.focus();
      }
    }, 20);
  }, [operatorId]);

  const focusRemoval = useCallback(() => {
    window.setTimeout(() => removeRef.current?.focus(), 20);
  }, []);

  useEffect(() => {
    setOperatorId(window.localStorage.getItem('omtOperatorId') ?? '');
  }, []);

  useEffect(() => {
    focusScanner();
  }, [focusScanner]);

  const updateOperatorId = (value: string) => {
    const normalized = value.toUpperCase().replace(/\s+/g, '').slice(0, 64);
    setOperatorId(normalized);
    window.localStorage.setItem('omtOperatorId', normalized);
  };

  const logRejectedScan = useCallback((scanValue: string, reason: string, eventType = 'PUTAWAY') => {
    void fetch('/api/omt/tray-putaway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'LOG_REJECTION', operatorId, scanValue, reason, eventType }),
    });
  }, [operatorId]);

  const activePosition = useMemo(
    () => positions.find((position) => position.barcode === activeBarcode) ?? null,
    [activeBarcode, positions],
  );

  const visiblePositions = useMemo(
    () => positions.filter((position) => position.rack === selectedRack),
    [positions, selectedRack],
  );

  const storedTrays = useMemo(
    () => positions.reduce((total, position) => total + position.trays.length, 0),
    [positions],
  );
  const occupiedPositions = useMemo(
    () => positions.filter((position) => position.trays.length > 0).length,
    [positions],
  );
  const fullPositions = useMemo(
    () => positions.filter((position) => position.trays.length === TRAYS_PER_POSITION).length,
    [positions],
  );
  const totalCapacity = RACK_COUNT * POSITIONS_PER_RACK * TRAYS_PER_POSITION;

  const addActivity = useCallback((message: string, tone: EventTone) => {
    setActivities((current) => [
      { id: Date.now() + Math.random(), time: timeNow(), message, tone },
      ...current,
    ].slice(0, 30));
  }, []);

  const lookupTray = useCallback(async (rawBarcode: string) => {
    const trayBarcode = rawBarcode.trim().toUpperCase();
    if (!TRAY_ID_PATTERN.test(trayBarcode)) {
      setFeedback({
        title: 'Invalid tray ID',
        detail: 'Use exactly 2 letters followed by 5 digits, for example CT00003.',
        tone: 'error',
      });
      addActivity(`${trayBarcode || 'Blank scan'} rejected · expected format CT00000`, 'error');
      logRejectedScan(trayBarcode, 'INVALID_TRAY_FORMAT');
      return;
    }

    setFeedback({ title: 'Checking parent tray', detail: `Loading live details for ${trayBarcode}…`, tone: 'info' });
    try {
      const response = await fetch('/api/omt/tray-putaway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOOKUP_TRAY', trayBarcode, operatorId }),
      });
      const data = await response.json();
      if (!response.ok) {
        const detail = data.positionBarcode
          ? `${trayBarcode} already exists at ${data.positionBarcode}.`
          : data.error || 'Tray could not be verified.';
        setPendingTray(null);
        setFeedback({
          title: data.code === 'CHILD_TRAY' ? 'Child tray rejected' : 'Putaway rejected',
          detail,
          tone: 'error',
        });
        addActivity(`${trayBarcode} rejected · ${data.error || 'verification failed'}`, 'error');
        return;
      }

      const details = { ...data.data, lookupToken: data.lookupToken } as PutawayDetails;
      setPendingTray(details);
      setFeedback({
        title: 'Parent tray verified',
        detail: `${trayBarcode} is ready · now scan its putaway location.`,
        tone: 'ok',
      });
      addActivity(`${trayBarcode} verified as parent · ${details.lookupMs} ms`, 'info');
    } catch (error) {
      setPendingTray(null);
      setFeedback({ title: 'Tray lookup failed', detail: (error as Error).message, tone: 'error' });
      addActivity(`${trayBarcode} failed · connection error`, 'error');
    }
  }, [addActivity, logRejectedScan, operatorId]);

  const putawayAtLocation = useCallback(async (rawPosition: string) => {
    if (!pendingTray) return;
    const barcode = parsePositionBarcode(rawPosition);
    if (!barcode) {
      setFeedback({
        title: 'Invalid putaway location',
        detail: 'Scan a valid location such as NXS1-OMT-01-001.',
        tone: 'error',
      });
      addActivity(`${rawPosition.toUpperCase()} rejected · invalid putaway location`, 'error');
      logRejectedScan(rawPosition, 'INVALID_POSITION');
      return;
    }

    const targetPosition = positions.find((position) => position.barcode === barcode);
    if (!targetPosition || targetPosition.trays.length >= TRAYS_PER_POSITION) {
      setFeedback({
        title: 'Position is already full',
        detail: `${barcode} contains 5 of 5 trays. Scan another location.`,
        tone: 'error',
      });
      addActivity(`${barcode} rejected · position full`, 'error');
      return;
    }

    setFeedback({
      title: 'Storing parent tray',
      detail: `${pendingTray.scannedTrayId} → ${barcode}…`,
      tone: 'info',
    });
    try {
      const response = await fetch('/api/omt/tray-putaway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PUTAWAY',
          positionBarcode: barcode,
          trayBarcode: pendingTray.scannedTrayId,
          lookupToken: pendingTray.lookupToken,
          operatorId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.code === 'LOOKUP_REQUIRED') setPendingTray(null);
        const detail = data.positionBarcode
          ? `${pendingTray.scannedTrayId} already exists at ${data.positionBarcode}.`
          : data.error || 'Tray could not be stored.';
        setFeedback({ title: 'Putaway rejected', detail, tone: 'error' });
        addActivity(`${pendingTray.scannedTrayId} rejected · ${data.error || 'putaway failed'}`, 'error');
        return;
      }

      const trayBarcode = pendingTray.scannedTrayId;
      const newCount = Number(data.stackLevel);
      setPositions((current) => current.map((position) => (
        position.barcode === barcode
          ? { ...position, trays: [...position.trays, trayBarcode] }
          : position
      )));
      const rack = rackFromPositionBarcode(barcode);
      if (rack) setSelectedRack(rack);
      setActiveBarcode(barcode);
      setPendingTray(null);
      setFeedback(newCount === TRAYS_PER_POSITION
        ? { title: 'Putaway complete', detail: `${barcode} is full · scan the next parent tray.`, tone: 'ok' }
        : { title: 'Tray stored', detail: `${barcode} now has ${newCount} of 5 · scan the next parent tray.`, tone: 'ok' });
      addActivity(`${trayBarcode} → ${barcode} · ${newCount}/5`, 'ok');
    } catch (error) {
      setFeedback({ title: 'Putaway failed', detail: (error as Error).message, tone: 'error' });
      addActivity(`${pendingTray.scannedTrayId} failed · connection error`, 'error');
    }
  }, [addActivity, logRejectedScan, operatorId, pendingTray, positions]);

  const handleScan = useCallback(async () => {
    const value = scanValue.trim();
    if (!value || busyRef.current) return;
    if (!operatorId.trim()) {
      setFeedback({ title: 'Operator ID required', detail: 'Enter your Operator ID before scanning.', tone: 'error' });
      operatorRef.current?.focus();
      return;
    }
    setScanValue('');

    busyRef.current = true;
    try {
      if (pendingTray) await putawayAtLocation(value);
      else await lookupTray(value);
    } finally {
      busyRef.current = false;
      focusScanner();
    }
  }, [focusScanner, lookupTray, operatorId, pendingTray, putawayAtLocation, scanValue]);

  const clearPendingTray = () => {
    if (!pendingTray) return;
    addActivity(`${pendingTray.scannedTrayId} verification cleared`, 'info');
    setPendingTray(null);
    setFeedback({ title: 'Ready for putaway', detail: 'Scan the parent tray to verify its details.', tone: 'info' });
    focusScanner();
  };

  const removeTray = useCallback(async () => {
    const trayBarcode = removeScanValue.trim().toUpperCase();
    setRemoveScanValue('');
    if (!trayBarcode || removing) return;
    if (!operatorId.trim()) {
      setRemoveMessage('Operator ID is required before removing a tray.');
      operatorRef.current?.focus();
      return;
    }
    if (!TRAY_ID_PATTERN.test(trayBarcode)) {
      setRemoveMessage('Invalid tray ID · use exactly 2 letters followed by 5 digits, for example CT00003.');
      addActivity(`${trayBarcode} removal rejected · expected format CT00000`, 'error');
      logRejectedScan(trayBarcode, 'INVALID_TRAY_FORMAT', 'REMOVE_TRAY');
      focusRemoval();
      return;
    }

    setRemoving(true);
    setRemoveMessage(`Checking ${trayBarcode}…`);
    try {
      const response = await fetch('/api/omt/tray-putaway', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REMOVE_TRAY', trayBarcode, operatorId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Tray could not be removed');

      setPositions((current) => current.map((position) => (
        position.barcode === data.positionBarcode
          ? { ...position, trays: position.trays.filter((tray) => tray !== trayBarcode) }
          : position
      )));
      const removedRack = rackFromPositionBarcode(String(data.positionBarcode));
      if (removedRack) setSelectedRack(removedRack);
      setRemoveMessage(`${trayBarcode} removed from ${data.positionBarcode} · ${data.remaining}/5 trays remain.`);
      addActivity(`${trayBarcode} removed ← ${data.positionBarcode} · ${data.remaining}/5`, 'ok');
    } catch (error) {
      setRemoveMessage((error as Error).message);
      addActivity(`${trayBarcode} removal failed · ${(error as Error).message}`, 'error');
    } finally {
      setRemoving(false);
      focusRemoval();
    }
  }, [addActivity, focusRemoval, logRejectedScan, operatorId, removeScanValue, removing]);

  const masterReset = useCallback(async () => {
    if (resetting) return;
    if (!operatorId.trim()) {
      setFeedback({ title: 'Operator ID required', detail: 'Enter your Operator ID before using Master Reset.', tone: 'error' });
      operatorRef.current?.focus();
      return;
    }
    const password = window.prompt(
      'Enter the Master Reset password.\n\nThis removes every tray from all 800 OMT positions.',
    );
    if (password === null) { focusScanner(); return; }

    setResetting(true);
    try {
      const response = await fetch('/api/omt/tray-putaway', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MASTER_RESET', password, operatorId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Master Reset failed');

      setPositions(createPositions());
      setActiveBarcode(null);
      setPendingTray(null);
      setFeedback({ title: 'Board reset complete', detail: `${data.deleted} stored trays were removed.`, tone: 'ok' });
      setRemoveMessage('All positions are empty. Scan a tray to remove it from its current position.');
      addActivity(`Master Reset complete · ${data.deleted} trays removed`, 'ok');
    } catch (error) {
      setFeedback({ title: 'Master Reset rejected', detail: (error as Error).message, tone: 'error' });
      addActivity(`Master Reset failed · ${(error as Error).message}`, 'error');
    } finally {
      setResetting(false);
      focusScanner();
    }
  }, [addActivity, focusScanner, operatorId, resetting]);

  const activeCount = activePosition?.trays.length ?? 0;
  const scannerLabel = pendingTray ? 'Scan putaway location' : 'Scan parent tray';

  return (
    <div className="omt-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="omt-header">
        <div className="omt-brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>
            <b>OMT</b>
            <small>Tray Putaway</small>
          </span>
        </div>
        <span className="header-spacer" />
        <span className="metric"><b>{RACK_COUNT}</b> racks</span>
        <span className="metric"><b>{RACK_COUNT * POSITIONS_PER_RACK}</b> positions</span>
        <span className="metric"><b className="gold">{storedTrays}</b> trays stored</span>
        <span className="metric"><b className="green">{totalCapacity - storedTrays}</b> capacity left</span>
        <span className={`live-pill ${syncing ? 'syncing' : ''}`}><i /> {syncing ? 'Syncing' : 'Live floor view'}</span>
        <button type="button" className="master-reset" onClick={masterReset} disabled={resetting}>
          {resetting ? 'Resetting…' : '↻ Master Reset'}
        </button>
      </header>

      <main className="omt-layout">
        <section className={`putaway-card ${feedback.tone}`}>
          <div className="card-head">
            <div>
              <span className="eyebrow">HHD workflow</span>
              <h1>Tray Putaway</h1>
            </div>
            <label className="operator-field">
              <span>Operator ID</span>
              <input
                ref={operatorRef}
                value={operatorId}
                placeholder="Enter ID"
                autoComplete="off"
                onChange={(event) => updateOperatorId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && operatorId.trim()) {
                    event.preventDefault();
                    scanRef.current?.focus();
                  }
                }}
              />
            </label>
          </div>

          <div className={`feedback ${feedback.tone}`} role="status" aria-live="polite">
            <span className="feedback-icon" aria-hidden="true">
              {feedback.tone === 'error' ? '!' : feedback.tone === 'ok' ? '✓' : '→'}
            </span>
            <span><b>{feedback.title}</b><small>{feedback.detail}</small></span>
          </div>

          <div className={`position-hero ${pendingTray || activePosition ? 'active' : ''} ${activeCount === TRAYS_PER_POSITION ? 'complete' : ''}`}>
            {pendingTray ? (
              <>
                <span className="hero-kicker">Verified parent tray</span>
                <strong className="pending-tray-id">{pendingTray.scannedTrayId}</strong>
                <small className="idle-copy">Scan the putaway location to store this tray</small>
              </>
            ) : activePosition ? (
              <>
                <span className="hero-kicker">Last putaway position</span>
                <div className="hero-location">
                  <span className="rack-label">Rack <b>{pad(activePosition.rack)}</b></span>
                  <strong>{positionLabel(activePosition.position)}</strong>
                </div>
                <code>{activePosition.barcode}</code>
              </>
            ) : (
              <>
                <span className="scan-glyph" aria-hidden="true"><i /><i /><i /><i /></span>
                <strong className="idle-title">Scan a parent tray</strong>
                <small className="idle-copy">Tray details are verified before a location can be scanned</small>
              </>
            )}
          </div>

          {pendingTray && (
            <section className="putaway-details" aria-label="Verified tray details">
              <div className="details-metrics">
                <article><small>Priority</small><b>{pendingTray.priority}</b></article>
                <article><small>Order age</small><b>{pendingTray.orderAge}</b><em>{pendingTray.orderDate} IST</em></article>
                <article className={pendingTray.orderMode === 'JIT' ? 'jit' : ''}><small>Order type</small><b>{pendingTray.orderMode}</b><em>{pendingTray.rawOrderType}</em></article>
                <article className={pendingTray.maxQcfCount > 2 ? 'danger' : ''}><small>Max QCF count</small><b>{pendingTray.maxQcfCount}</b><em>Across fitting shipments</em></article>
              </div>
              <div className="details-identity">
                <span><small>Scanned tray</small><b>{pendingTray.scannedTrayId}</b></span>
                <span><small>Fitting ID</small><b>{pendingTray.fittingId}</b></span>
                <span><small>Shipment ID</small><b>{pendingTray.shipmentId}</b></span>
                <span><small>Lookup</small><b>{pendingTray.lookupMs} ms</b></span>
              </div>
            </section>
          )}

          <div className="stack-progress">
            <div className="progress-copy">
              <span>Tray stack</span>
              <b>{activeCount}<em>/ {TRAYS_PER_POSITION}</em></b>
            </div>
            <div className="tray-stack" aria-label={`${activeCount} of ${TRAYS_PER_POSITION} trays stored`}>
              {Array.from({ length: TRAYS_PER_POSITION }, (_, index) => {
                const trayId = activePosition?.trays[index];
                return (
                  <span key={index} className={trayId ? 'filled' : ''} title={trayId || `Stack level ${index + 1} is empty`}>
                    {trayId ? <b>{trayId}</b> : <i>Empty</i>}
                  </span>
                );
              })}
            </div>
          </div>

          <label className="scan-field">
            <span>{scannerLabel}</span>
            <div>
              <span className="barcode-icon" aria-hidden="true">▥</span>
              <input
                ref={scanRef}
                autoFocus
                autoComplete="off"
                value={scanValue}
                placeholder={pendingTray ? 'NXS1-OMT-01-001' : 'CT00003'}
                onChange={(event) => setScanValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleScan();
                  }
                }}
                onBlur={focusScanner}
                aria-label={scannerLabel}
              />
              <button type="button" onClick={handleScan}>Enter</button>
            </div>
          </label>

          {pendingTray && (
            <button type="button" className="finish-button" onClick={clearPendingTray}>
              Clear tray &amp; scan again
            </button>
          )}

          <div className="workflow-hint">
            <span><b>1</b> Scan parent tray</span><i />
            <span><b>2</b> Verify details</span><i />
            <span><b>3</b> Scan location</span>
          </div>
        </section>

        <section className="remove-panel">
          <div className="remove-head">
            <div><span className="eyebrow">Inventory correction</span><h2>Remove tray</h2></div>
            <span className="remove-badge">Tray out</span>
          </div>
          <p aria-live="polite">{removeMessage}</p>
          <label className="remove-field">
            <span className="barcode-icon" aria-hidden="true">▥</span>
            <input
              ref={removeRef}
              value={removeScanValue}
              autoComplete="off"
              maxLength={7}
              pattern="[A-Za-z]{2}[0-9]{5}"
              placeholder="CT00003"
              onChange={(event) => setRemoveScanValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  removeTray();
                }
              }}
              aria-label="Scan tray barcode to remove"
            />
            <button type="button" onClick={removeTray} disabled={removing}>
              {removing ? 'Removing…' : 'Remove'}
            </button>
          </label>
        </section>

        <section className="rack-panel">
          <div className="rack-panel-head">
            <div>
              <span className="eyebrow">Storage overview</span>
              <h2>Rack map</h2>
              <p>20 positions per rack · 4 across × 5 rows · 5 trays per position</p>
            </div>
            <div className="overview-stats">
              <span><b>{occupiedPositions}</b> occupied</span>
              <span><b>{fullPositions}</b> full</span>
            </div>
          </div>

          <div className="rack-picker" aria-label="Choose rack">
            {Array.from({ length: RACK_COUNT }, (_, index) => index + 1).map((rack) => {
              const trays = positions
                .filter((position) => position.rack === rack)
                .reduce((total, position) => total + position.trays.length, 0);
              return (
                <button
                  type="button"
                  key={rack}
                  className={selectedRack === rack ? 'selected' : ''}
                  onClick={() => setSelectedRack(rack)}
                  aria-pressed={selectedRack === rack}
                >
                  <span>R{pad(rack)}</span>
                  <i><em style={{ width: `${trays}%` }} /></i>
                  <small>{trays}/100</small>
                </button>
              );
            })}
          </div>

          <div className="rack-frame">
            <div className="rack-title">
              <span>Rack {pad(selectedRack)}</span>
              <small>{visiblePositions.reduce((total, position) => total + position.trays.length, 0)} / 100 trays</small>
            </div>
            <div className="position-grid">
              {visiblePositions.map((position) => {
                const count = position.trays.length;
                const state = count === 0 ? 'empty' : count === TRAYS_PER_POSITION ? 'full' : 'partial';
                return (
                  <article
                    key={position.barcode}
                    className={`position-cell ${state} ${activeBarcode === position.barcode ? 'active' : ''}`}
                    title={`${position.barcode} · ${count}/5 trays`}
                  >
                    <div className="cell-top">
                      <strong>{positionLabel(position.position)}</strong>
                      <span>{count}/5</span>
                    </div>
                    <div className="mini-stack" aria-hidden="true">
                      {Array.from({ length: TRAYS_PER_POSITION }, (_, index) => (
                        <i key={index} className={index < count ? 'filled' : ''} />
                      ))}
                    </div>
                    <small>{state === 'empty' ? 'Empty' : state === 'full' ? 'Full' : `${TRAYS_PER_POSITION - count} spaces`}</small>
                  </article>
                );
              })}
            </div>
            <div className="rack-legend">
              <span><i className="empty" /> Empty</span>
              <span><i className="partial" /> In use</span>
              <span><i className="full" /> Full</span>
              <code>Position barcode: {positionBarcode(selectedRack, 1)}</code>
            </div>
          </div>
        </section>

        <aside className="activity-panel">
          <div className="activity-head">
            <div><span className="eyebrow">This device</span><h2>Recent putaway</h2></div>
            <span>{activities.length} scans</span>
          </div>
          <div className="activity-list">
            {activities.length === 0 ? (
              <div className="activity-empty"><span>▥</span><b>No scans yet</b><small>Your latest position and tray scans will appear here.</small></div>
            ) : activities.map((activity) => (
              <div className={`activity-row ${activity.tone}`} key={activity.id}>
                <span className="activity-dot" />
                <span><b>{activity.message}</b><small>{activity.time}</small></span>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

const CSS = `
.omt-root{
  --bg-0:#090b0e; --bg-1:#101318; --bg-2:#151920; --bg-3:#1b2028;
  --line:rgba(255,255,255,.075); --line-strong:rgba(255,255,255,.14);
  --text:#f5f6f8; --text-2:#b8bec8; --muted:#737b88;
  --gold:#d9b75a; --gold-hi:#efd98f; --green:#47d59c; --red:#f16b73; --blue:#66a7ff;
  --shadow:0 18px 48px -22px rgba(0,0,0,.82);
  min-height:calc(100vh - 3rem); margin:-1.5rem; color:var(--text);
  background:radial-gradient(900px 480px at 85% -15%,rgba(217,183,90,.065),transparent 62%),linear-gradient(180deg,#0d0f13,var(--bg-0));
  font-family:var(--font-inter,"Inter",ui-sans-serif,system-ui,sans-serif); font-size:14px; line-height:1.5;
  display:flex; flex-direction:column; letter-spacing:-.01em; -webkit-font-smoothing:antialiased;
}
.omt-root *{box-sizing:border-box}
.omt-header{min-height:66px;padding:14px 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:linear-gradient(180deg,rgba(255,255,255,.025),transparent)}
.omt-brand{display:flex;align-items:center;gap:11px}.omt-brand>span:last-child{display:flex;align-items:baseline;gap:9px}.omt-brand b{font-size:20px;letter-spacing:2.5px}.omt-brand small{font-size:10px;text-transform:uppercase;letter-spacing:2.2px;color:var(--muted);font-weight:700}
.brand-mark{width:30px;height:30px;border:1px solid rgba(217,183,90,.35);border-radius:9px;display:flex;flex-direction:column-reverse;align-items:center;justify-content:center;gap:2px;background:rgba(217,183,90,.06)}
.brand-mark i{display:block;height:3px;border-radius:2px;background:var(--gold)}.brand-mark i:nth-child(1){width:16px}.brand-mark i:nth-child(2){width:12px;opacity:.8}.brand-mark i:nth-child(3){width:8px;opacity:.6}
.header-spacer{flex:1}.metric{display:inline-flex;align-items:baseline;gap:5px;padding:6px 11px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.02);color:var(--muted);font-size:9.5px;text-transform:uppercase;letter-spacing:.65px;font-weight:700}.metric b{font-size:14px;color:var(--text);font-variant-numeric:tabular-nums;letter-spacing:0}.metric b.gold{color:var(--gold-hi)}.metric b.green{color:var(--green)}
.live-pill{display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;border:1px solid rgba(71,213,156,.25);background:rgba(71,213,156,.09);color:var(--green);font-size:9.5px;text-transform:uppercase;letter-spacing:.7px;font-weight:800}.live-pill i{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 9px var(--green)}
.master-reset{padding:7px 11px;border:1px solid var(--line-strong);border-radius:9px;background:rgba(255,255,255,.02);color:var(--muted);font:800 9px var(--font-inter,"Inter",sans-serif);letter-spacing:.65px;text-transform:uppercase;cursor:pointer;transition:.15s}.master-reset:hover{border-color:var(--red);background:rgba(241,107,115,.08);color:var(--red)}.master-reset:disabled{opacity:.45;cursor:wait}
.omt-layout{display:grid;grid-template-columns:minmax(340px,390px) minmax(520px,1fr);grid-template-areas:"putaway rack" "remove rack" "activity rack";gap:18px;padding:20px 24px;align-items:start}
.putaway-card,.rack-panel,.activity-panel,.remove-panel{background:linear-gradient(180deg,rgba(255,255,255,.018),transparent),var(--bg-1);border:1px solid var(--line);border-radius:17px;box-shadow:var(--shadow)}
.putaway-card{grid-area:putaway;padding:18px;display:flex;flex-direction:column;gap:14px;transition:border-color .2s}.putaway-card.ok{border-color:rgba(71,213,156,.2)}.putaway-card.error{border-color:rgba(241,107,115,.22)}
.card-head,.rack-panel-head,.activity-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.eyebrow{display:block;margin-bottom:2px;color:var(--muted);font-size:9px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase}.card-head h1,.rack-panel h2,.activity-panel h2{margin:0;font-size:19px;line-height:1.2;letter-spacing:-.3px}.parent-only{padding:5px 8px;border-radius:999px;border:1px solid rgba(217,183,90,.23);background:rgba(217,183,90,.07);color:var(--gold-hi);font-size:8.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;white-space:nowrap}
.operator-field{display:flex;align-items:center;gap:7px;padding:5px 6px 5px 9px;border:1px solid var(--line);border-radius:10px;background:var(--bg-0)}.operator-field span{color:var(--muted);font-size:7.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;white-space:nowrap}.operator-field input{width:92px;height:28px;padding:0 8px;border:1px solid var(--line-strong);border-radius:7px;background:var(--bg-2);color:var(--text);font:800 11px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;outline:none}.operator-field input:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(217,183,90,.1)}
.feedback{min-height:54px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;display:flex;align-items:center;gap:10px;background:var(--bg-2)}.feedback-icon{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;flex:none;font-size:15px;font-weight:900}.feedback>span:last-child{min-width:0;display:flex;flex-direction:column}.feedback b{font-size:12.5px}.feedback small{color:var(--muted);font-size:10.5px;white-space:normal}.feedback.info .feedback-icon{color:var(--blue);background:rgba(102,167,255,.1)}.feedback.ok .feedback-icon{color:var(--green);background:rgba(71,213,156,.1)}.feedback.error .feedback-icon{color:var(--red);background:rgba(241,107,115,.1)}
.position-hero{min-height:146px;border:1px dashed var(--line-strong);border-radius:15px;background:radial-gradient(circle at 50% 20%,rgba(217,183,90,.06),transparent 55%),var(--bg-0);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:14px}.position-hero.active{border-style:solid;border-color:rgba(217,183,90,.32)}.position-hero.complete{border-color:rgba(71,213,156,.38);background:radial-gradient(circle at 50% 20%,rgba(71,213,156,.09),transparent 55%),var(--bg-0)}
.hero-kicker{font-size:8.5px;text-transform:uppercase;letter-spacing:2px;color:var(--muted);font-weight:800}.hero-location{display:flex;align-items:center;gap:16px;margin:1px 0}.hero-location strong{font-size:56px;line-height:1;font-weight:900;letter-spacing:-2px;color:var(--gold-hi);font-variant-numeric:tabular-nums}.complete .hero-location strong{color:var(--green)}.rack-label{display:flex;flex-direction:column;text-align:right;color:var(--muted);font-size:9px;text-transform:uppercase;letter-spacing:1.3px;font-weight:700}.rack-label b{color:var(--text-2);font-size:24px;line-height:1.1;letter-spacing:-.5px}.position-hero code{font:600 9px/1.4 var(--font-inter,"Inter",sans-serif);letter-spacing:1.2px;color:var(--muted)}
.scan-glyph{position:relative;width:41px;height:41px;margin-bottom:9px}.scan-glyph i{position:absolute;width:15px;height:15px;border-color:var(--gold);border-style:solid}.scan-glyph i:nth-child(1){left:0;top:0;border-width:2px 0 0 2px}.scan-glyph i:nth-child(2){right:0;top:0;border-width:2px 2px 0 0}.scan-glyph i:nth-child(3){left:0;bottom:0;border-width:0 0 2px 2px}.scan-glyph i:nth-child(4){right:0;bottom:0;border-width:0 2px 2px 0}.idle-title{font-size:18px;color:var(--text-2)}.idle-copy{font-size:10px;color:var(--muted)}
.pending-tray-id{margin:4px 0;color:var(--gold-hi);font-size:34px;line-height:1;letter-spacing:1px}.putaway-details{display:flex;flex-direction:column;gap:8px}.details-metrics,.details-identity{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.details-metrics article,.details-identity span{min-width:0;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--bg-2);display:flex;flex-direction:column}.details-metrics article{min-height:72px}.details-metrics small,.details-identity small{color:var(--muted);font-size:7.5px;font-weight:800;letter-spacing:.65px;text-transform:uppercase}.details-metrics b{margin-top:3px;color:var(--text-2);font-size:13px;line-height:1.2;overflow-wrap:anywhere}.details-metrics em{margin-top:auto;color:var(--muted);font-size:7.5px;font-style:normal}.details-metrics .jit b{color:#a78bfa}.details-metrics .danger{border-color:rgba(241,107,115,.32)}.details-metrics .danger b{color:var(--red)}.details-identity b{margin-top:2px;color:var(--text-2);font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stack-progress{padding:13px;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.015)}.progress-copy{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px}.progress-copy span{font-size:9px;color:var(--muted);font-weight:800;letter-spacing:1.3px;text-transform:uppercase}.progress-copy b{font-size:18px;color:var(--text);font-variant-numeric:tabular-nums}.progress-copy em{font-style:normal;font-size:11px;color:var(--muted)}
.tray-stack{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.tray-stack span{height:36px;min-width:0;padding:0 4px;border-radius:8px;border:1px solid var(--line);background:var(--bg-0);color:var(--muted);display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:800;text-transform:uppercase;letter-spacing:.25px;transition:all .18s;overflow:hidden}.tray-stack span i{font-style:normal;font-size:7px}.tray-stack span b{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:8px;font-weight:850;font-variant-numeric:tabular-nums}.tray-stack span.filled{border-color:rgba(217,183,90,.4);background:linear-gradient(180deg,rgba(217,183,90,.18),rgba(217,183,90,.06));color:var(--gold-hi);box-shadow:inset 0 1px rgba(255,255,255,.05)}
.scan-field{display:flex;flex-direction:column;gap:6px}.scan-field>span{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:var(--gold-hi);font-weight:800}.scan-field>div{position:relative;display:flex}.scan-field input{width:100%;height:58px;padding:0 70px 0 43px;border:1px solid var(--gold);border-radius:13px;background:var(--bg-3);color:var(--text);font:650 17px/1 var(--font-inter,"Inter",sans-serif);letter-spacing:.2px;outline:none;box-shadow:0 0 0 4px rgba(217,183,90,.1)}.scan-field input::placeholder{color:#6c727c;font-weight:500}.barcode-icon{position:absolute;left:15px;top:17px;color:var(--gold-hi);font-size:20px;line-height:1;z-index:1}.scan-field button{position:absolute;right:7px;top:7px;height:44px;padding:0 12px;border:0;border-radius:9px;background:var(--gold);color:#17140b;font:800 9px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;letter-spacing:.8px;cursor:pointer}.scan-field button:hover{background:var(--gold-hi)}
.finish-button{margin-top:-5px;border:0;background:transparent;color:var(--muted);font:700 10px var(--font-inter,"Inter",sans-serif);text-decoration:underline;text-underline-offset:3px;cursor:pointer}.finish-button:hover{color:var(--text-2)}
.workflow-hint{display:flex;align-items:center;justify-content:center;gap:7px;color:var(--muted);font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.45px}.workflow-hint span{display:flex;align-items:center;gap:4px;white-space:nowrap}.workflow-hint span b{width:16px;height:16px;border:1px solid var(--line-strong);border-radius:50%;display:grid;place-items:center;color:var(--text-2);font-size:8px}.workflow-hint>i{width:12px;height:1px;background:var(--line-strong)}
.remove-panel{grid-area:remove;padding:16px}.remove-head{display:flex;align-items:center;justify-content:space-between}.remove-head h2{margin:0;font-size:15px}.remove-badge{padding:4px 7px;border:1px solid rgba(241,107,115,.23);border-radius:999px;background:rgba(241,107,115,.07);color:var(--red);font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.7px}.remove-panel>p{min-height:30px;margin:8px 0;color:var(--muted);font-size:10px}.remove-field{position:relative;display:flex}.remove-field input{width:100%;height:48px;padding:0 82px 0 40px;border:1px solid var(--line-strong);border-radius:11px;background:var(--bg-3);color:var(--text);font:650 14px var(--font-inter,"Inter",sans-serif);outline:none}.remove-field input:focus{border-color:var(--red);box-shadow:0 0 0 3px rgba(241,107,115,.09)}.remove-field input::placeholder{color:var(--muted)}.remove-field .barcode-icon{left:13px;top:14px;color:var(--red)}.remove-field button{position:absolute;right:6px;top:6px;height:36px;padding:0 10px;border:0;border-radius:8px;background:rgba(241,107,115,.14);color:var(--red);font:800 8px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;letter-spacing:.6px;cursor:pointer}.remove-field button:hover{background:var(--red);color:#24070a}.remove-field button:disabled{opacity:.5;cursor:wait}
.rack-panel{grid-area:rack;padding:19px;min-width:0}.rack-panel-head{align-items:center;margin-bottom:14px}.rack-panel-head p{margin:4px 0 0;color:var(--muted);font-size:10px}.overview-stats{display:flex;gap:7px}.overview-stats span{padding:7px 9px;border:1px solid var(--line);border-radius:9px;color:var(--muted);font-size:8.5px;text-transform:uppercase;letter-spacing:.7px;font-weight:700}.overview-stats b{color:var(--text);font-size:12px;margin-right:3px}
.rack-picker{display:grid;grid-template-columns:repeat(10,minmax(48px,1fr));gap:6px;padding:10px;border:1px solid var(--line);border-radius:13px;background:var(--bg-0);margin-bottom:14px}.rack-picker button{min-width:0;padding:7px 5px 6px;border:1px solid transparent;border-radius:8px;background:var(--bg-2);color:var(--muted);cursor:pointer;font-family:inherit;transition:.15s}.rack-picker button:hover{color:var(--text-2);border-color:var(--line-strong)}.rack-picker button.selected{color:#151208;background:var(--gold);border-color:var(--gold);box-shadow:0 6px 16px -9px var(--gold)}.rack-picker button>span{display:block;font-size:10px;font-weight:850}.rack-picker button>i{display:block;height:2px;margin:5px 1px 3px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden}.rack-picker button>i em{display:block;height:100%;background:var(--green)}.rack-picker button.selected>i{background:rgba(0,0,0,.17)}.rack-picker button.selected>i em{background:#193c2d}.rack-picker button small{display:block;font-size:7px;font-weight:700;font-variant-numeric:tabular-nums}
.rack-frame{border:1px solid var(--line-strong);border-radius:15px;padding:14px;background:linear-gradient(90deg,rgba(255,255,255,.018),transparent 3%,transparent 97%,rgba(255,255,255,.018)),var(--bg-0)}.rack-title{display:flex;align-items:center;justify-content:space-between;padding:0 3px 11px}.rack-title span{font-size:10px;text-transform:uppercase;letter-spacing:1.4px;font-weight:800;color:var(--gold-hi)}.rack-title small{font-size:9px;color:var(--muted);font-weight:700;font-variant-numeric:tabular-nums}
.position-grid{display:grid;grid-template-columns:repeat(4,minmax(85px,1fr));gap:7px}.position-cell{min-height:85px;border:1px solid var(--line);border-radius:11px;padding:9px 10px;background:var(--bg-2);display:flex;flex-direction:column;justify-content:space-between;transition:.15s}.position-cell.active{outline:2px solid var(--gold);outline-offset:2px;box-shadow:0 0 22px -5px rgba(217,183,90,.28)}.position-cell.partial{border-color:rgba(217,183,90,.22);background:linear-gradient(145deg,rgba(217,183,90,.065),var(--bg-2))}.position-cell.full{border-color:rgba(71,213,156,.24);background:linear-gradient(145deg,rgba(71,213,156,.07),var(--bg-2))}.cell-top{display:flex;align-items:center;justify-content:space-between}.cell-top strong{font-size:15px;line-height:1;color:var(--text-2);font-variant-numeric:tabular-nums}.partial .cell-top strong{color:var(--gold-hi)}.full .cell-top strong{color:var(--green)}.cell-top span{font-size:8px;color:var(--muted);font-weight:800}.mini-stack{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin:8px 0}.mini-stack i{height:7px;border:1px solid var(--line);border-radius:2px;background:var(--bg-0)}.mini-stack i.filled{border-color:rgba(217,183,90,.42);background:var(--gold)}.full .mini-stack i.filled{border-color:rgba(71,213,156,.45);background:var(--green)}.position-cell>small{font-size:7.5px;color:var(--muted);font-weight:750;text-transform:uppercase;letter-spacing:.65px}
.rack-legend{display:flex;align-items:center;gap:13px;margin-top:12px;color:var(--muted);font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}.rack-legend span{display:flex;align-items:center;gap:5px}.rack-legend span i{width:7px;height:7px;border-radius:2px;border:1px solid var(--line-strong);background:var(--bg-2)}.rack-legend span i.partial{background:var(--gold);border-color:var(--gold)}.rack-legend span i.full{background:var(--green);border-color:var(--green)}.rack-legend code{margin-left:auto;font:650 8px var(--font-inter,"Inter",sans-serif);color:var(--muted);text-transform:none;letter-spacing:.4px}
.activity-panel{grid-area:activity;padding:16px;min-height:168px}.activity-head{align-items:center;padding-bottom:11px;border-bottom:1px solid var(--line)}.activity-head h2{font-size:14px}.activity-head>span{font-size:8px;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;font-weight:800}.activity-list{max-height:180px;overflow:auto}.activity-empty{min-height:108px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--muted)}.activity-empty>span{font-size:22px;opacity:.4}.activity-empty b{font-size:10px;color:var(--text-2)}.activity-empty small{font-size:8.5px}.activity-row{display:flex;gap:9px;padding:9px 2px;border-bottom:1px solid var(--line)}.activity-row:last-child{border:0}.activity-dot{width:7px;height:7px;margin-top:5px;border-radius:50%;background:var(--blue);flex:none}.activity-row.ok .activity-dot{background:var(--green)}.activity-row.error .activity-dot{background:var(--red)}.activity-row>span:last-child{display:flex;flex-direction:column;min-width:0}.activity-row b{font-size:9.5px;color:var(--text-2);font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.activity-row small{font-size:8px;color:var(--muted)}
@media(max-width:1100px){.omt-layout{grid-template-columns:minmax(320px,360px) 1fr}.rack-picker{grid-template-columns:repeat(5,1fr)}.position-grid{grid-template-columns:repeat(4,minmax(65px,1fr))}.position-cell{min-height:78px;padding:8px}.metric:nth-of-type(2){display:none}}
@media(max-width:820px){.omt-header,.rack-panel,.activity-panel,.remove-panel{display:none}.omt-layout{display:block;padding:14px}.putaway-card{width:100%;max-width:520px;margin:0 auto}.metric{display:none}}
@media(max-width:560px){
  .omt-root{min-height:calc(100vh - 3rem);font-size:15px}.omt-layout{padding:10px}.putaway-card{padding:14px;border-radius:16px;box-shadow:none;gap:12px}.card-head h1{font-size:21px}.parent-only{font-size:8px}.feedback{min-height:58px}.feedback b{font-size:13px}.feedback small{font-size:11px}.position-hero{min-height:165px}.hero-location strong{font-size:68px}.rack-label b{font-size:28px}.scan-glyph{width:48px;height:48px}.idle-title{font-size:21px}.idle-copy{font-size:11px}.stack-progress{padding:12px}.tray-stack span{height:42px}.scan-field input{height:66px;font-size:19px;padding-left:45px}.barcode-icon{top:21px}.scan-field button{top:8px;height:50px}.workflow-hint{font-size:7.5px;gap:5px}.workflow-hint>i{width:7px}
}
@media(max-width:390px){.omt-layout{padding:7px}.putaway-card{padding:12px}.workflow-hint span{letter-spacing:.1px}.workflow-hint span b{display:none}.parent-only{max-width:92px;white-space:normal;text-align:center}.tray-stack{gap:4px}}
`;
