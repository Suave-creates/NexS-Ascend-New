'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const POSITION_PATTERN = /^NXS1-OMT-\d{2}-\d{3}$/;
const TRAY_PATTERN = /^[A-Z]{2}\d{5}$/;
const STACK_CAPACITY = 5;

type TrayDetail = {
  trayBarcode: string;
  stackLevel: number;
  fittingId: string | null;
  shipmentId: string | null;
  maxQcfCount: number;
  operatorId: string | null;
  priority: string | null;
  priorityClassification: string | null;
  orderType: string | null;
  orderMode: string | null;
  orderDate: string | null;
  liveStatus: 'VALID' | 'INVALID' | 'ERROR' | 'PENDING';
  statusMessage: string | null;
  validatedAt: string | null;
  putawayAt: string | null;
};

type PositionResult = {
  position: { barcode: string; rack: number; position: number };
  trays: TrayDetail[];
  health: { checked: number; valid: number; invalid: number; errors: number; checkedAt: string };
};

function isNddTray(tray: TrayDetail) {
  const priority = String(tray.priority ?? '').trim().toUpperCase();
  return priority === '1'
    || priority === 'NDD'
    || tray.orderMode?.toUpperCase() === 'NDD'
    || tray.priorityClassification?.toUpperCase().startsWith('NDD') === true;
}

type Phase = 'LOCATION' | 'CHECKING' | 'COUNTING' | 'REMOVING' | 'ERROR';

function formatDate(value: string | null) {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toLocaleString() : value;
}

export default function OmtCycleCountPage() {
  const [operatorId, setOperatorId] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [trayValue, setTrayValue] = useState('');
  const [result, setResult] = useState<PositionResult | null>(null);
  const [countedTrays, setCountedTrays] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('LOCATION');
  const [message, setMessage] = useState('Scan an OMT location to begin the live cycle count.');
  const operatorRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const trayRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    setOperatorId(window.localStorage.getItem('omtOperatorId') ?? '');
  }, []);

  const focusActiveScanner = useCallback(() => {
    window.setTimeout(() => {
      if (!operatorId.trim()) operatorRef.current?.focus();
      else if (result) trayRef.current?.focus();
      else locationRef.current?.focus();
    }, 30);
  }, [operatorId, result]);

  useEffect(() => {
    focusActiveScanner();
  }, [focusActiveScanner]);

  const updateOperatorId = (value: string) => {
    const normalized = value.toUpperCase().replace(/\s+/g, '').slice(0, 64);
    setOperatorId(normalized);
    window.localStorage.setItem('omtOperatorId', normalized);
  };

  const scanLocation = useCallback(async () => {
    const positionBarcode = locationValue.trim().toUpperCase().replaceAll('_', '-').replaceAll(' ', '');
    if (busyRef.current) return;
    if (!operatorId.trim()) {
      setPhase('ERROR');
      setMessage('Enter your Operator ID before scanning a location.');
      operatorRef.current?.focus();
      return;
    }
    if (!POSITION_PATTERN.test(positionBarcode)) {
      setPhase('ERROR');
      setMessage('Invalid location. Scan a barcode such as NXS1-OMT-01-001.');
      setLocationValue('');
      focusActiveScanner();
      return;
    }

    busyRef.current = true;
    setPhase('CHECKING');
    setMessage(`Validating every tray in ${positionBarcode} against NexS…`);
    try {
      const response = await fetch('/api/omt/cycle-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionBarcode, operatorId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to load this position');
      const next = body as PositionResult;
      setResult(next);
      setCountedTrays([]);
      setLocationValue('');
      setPhase('COUNTING');
      const problems = next.trays.filter((tray) => tray.liveStatus !== 'VALID').length;
      setMessage(problems
        ? `${problems} problem tray${problems === 1 ? '' : 's'} flashing red. Scan all trays and remove only the red tray cards.`
        : next.trays.length
          ? 'All trays passed the live API check. Scan each physical tray to complete the count.'
          : 'This position is empty. Confirm the physical location is also empty.');
    } catch (error) {
      setResult(null);
      setPhase('ERROR');
      setMessage((error as Error).message);
    } finally {
      busyRef.current = false;
      focusActiveScanner();
    }
  }, [focusActiveScanner, locationValue, operatorId]);

  const scanTray = useCallback(() => {
    const trayBarcode = trayValue.trim().toUpperCase();
    setTrayValue('');
    if (!result || !trayBarcode) return;
    if (!TRAY_PATTERN.test(trayBarcode)) {
      setMessage('Invalid tray barcode. Use 2 letters followed by 5 digits.');
      focusActiveScanner();
      return;
    }
    const expected = result.trays.find((tray) => tray.trayBarcode === trayBarcode);
    if (!expected) {
      setMessage(`${trayBarcode} is not assigned to ${result.position.barcode}. Keep it aside for correction.`);
      focusActiveScanner();
      return;
    }
    setCountedTrays((current) => current.includes(trayBarcode) ? current : [...current, trayBarcode]);
    if (expected.liveStatus !== 'VALID') {
      setMessage(`${trayBarcode} confirmed in slot ${expected.stackLevel}, but its API status is ${expected.liveStatus}. Remove this red tray.`);
    } else {
      const nextCount = countedTrays.includes(trayBarcode) ? countedTrays.length : countedTrays.length + 1;
      setMessage(`${trayBarcode} counted · ${nextCount}/${result.trays.length} physical trays verified.`);
    }
    focusActiveScanner();
  }, [countedTrays, focusActiveScanner, result, trayValue]);

  const removeProblemTray = useCallback(async (tray: TrayDetail) => {
    if (!result || tray.liveStatus === 'VALID' || busyRef.current) return;
    busyRef.current = true;
    setPhase('REMOVING');
    setMessage(`Removing ${tray.trayBarcode} from ${result.position.barcode}…`);
    try {
      const response = await fetch('/api/omt/tray-putaway', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REMOVE_TRAY', trayBarcode: tray.trayBarcode, operatorId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to remove tray');
      setResult((current) => current ? {
        ...current,
        trays: current.trays
          .filter((item) => item.trayBarcode !== tray.trayBarcode)
          .map((item, index) => ({ ...item, stackLevel: index + 1 })),
      } : current);
      setCountedTrays((current) => current.filter((barcode) => barcode !== tray.trayBarcode));
      setPhase('COUNTING');
      setMessage(`${tray.trayBarcode} removed from OMT. Physically remove that tray and continue counting.`);
    } catch (error) {
      setPhase('ERROR');
      setMessage((error as Error).message);
    } finally {
      busyRef.current = false;
      focusActiveScanner();
    }
  }, [focusActiveScanner, operatorId, result]);

  const reset = () => {
    setResult(null);
    setCountedTrays([]);
    setTrayValue('');
    setPhase('LOCATION');
    setMessage('Scan an OMT location to begin the live cycle count.');
  };

  const problems = useMemo(() => result?.trays.filter((tray) => tray.liveStatus !== 'VALID').length ?? 0, [result]);
  const allCounted = Boolean(result?.trays.length) && countedTrays.length === result?.trays.length;

  return (
    <div className="cc-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="cc-header">
        <div className="cc-brand"><span className="cc-mark"><i /><i /><i /></span><span><b>OMT</b><small>HHD Cycle Count</small></span></div>
        <span className="spacer" />
        <span className="flow-pill">Location → Live check → Tray count → Correction</span>
      </header>

      <main className="cc-layout">
        <section className={`count-card ${phase.toLowerCase()} ${problems ? 'has-problems' : ''}`}>
          <div className="card-head">
            <div><span className="eyebrow">Inventory correction</span><h1>Cycle Count</h1></div>
            <label className="operator-field"><span>Operator ID</span><input ref={operatorRef} value={operatorId} placeholder="Enter ID" onChange={(event) => updateOperatorId(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') focusActiveScanner(); }} /></label>
          </div>

          <div className={`status-banner ${problems ? 'problem' : phase.toLowerCase()}`} role="status" aria-live="polite">
            <span className="status-icon">{phase === 'CHECKING' || phase === 'REMOVING' ? '↻' : problems ? '!' : allCounted ? '✓' : '→'}</span>
            <span><b>{phase === 'CHECKING' ? 'Running live tray checks' : phase === 'REMOVING' ? 'Updating OMT stock' : problems ? 'Remove red tray only' : allCounted ? 'Position counted' : result ? 'Scan every physical tray' : 'Scan location first'}</b><small>{message}</small></span>
          </div>

          {!result ? (
            <label className="scan-field">
              <span>1 · Scan OMT location</span>
              <div><span className="scan-icon">⌗</span><input ref={locationRef} autoFocus value={locationValue} placeholder="NXS1-OMT-01-001" onChange={(event) => setLocationValue(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); void scanLocation(); } }} onBlur={focusActiveScanner} /><button type="button" onClick={() => void scanLocation()} disabled={phase === 'CHECKING'}>{phase === 'CHECKING' ? 'Check' : 'Enter'}</button></div>
            </label>
          ) : (
            <>
              <section className="location-hero">
                <span><small>Rack</small><b>{String(result.position.rack).padStart(2, '0')}</b></span><i /><span><small>Position</small><strong>P{String(result.position.position).padStart(3, '0')}</strong></span><i /><span><small>Live result</small><b className={problems ? 'red' : 'green'}>{problems ? `${problems} REMOVE` : 'CLEAR'}</b></span>
                <code>{result.position.barcode}</code>
              </section>

              <div className="slot-grid">
                {Array.from({ length: STACK_CAPACITY }, (_, index) => {
                  const level = index + 1;
                  const tray = result.trays.find((item) => item.stackLevel === level);
                  const problem = tray && tray.liveStatus !== 'VALID';
                  const counted = tray && countedTrays.includes(tray.trayBarcode);
                  const ndd = tray && isNddTray(tray);
                  return (
                    <article key={level} className={`${tray ? 'occupied' : 'empty'} ${ndd && !problem ? 'ndd' : ''} ${problem ? 'problem' : ''} ${counted ? 'counted' : ''}`}>
                      <div className="slot-head"><span>Slot {level}</span>{tray && <em>{problem ? 'REMOVE' : ndd ? 'NDD' : counted ? 'COUNTED' : 'SCAN'}</em>}</div>
                      {tray ? <>
                        <strong>{tray.trayBarcode}</strong>
                        <div className="slot-meta"><span><small>Fitting</small><b>{tray.fittingId ?? 'N/A'}</b></span><span><small>Priority</small><b className={ndd ? 'ndd' : ''}>{tray.priority ?? 'N/A'}</b></span><span><small>QCF</small><b>{tray.maxQcfCount}</b></span><span><small>Order</small><b className={ndd ? 'ndd' : ''}>{tray.orderMode ?? 'N/A'}</b></span></div>
                        {problem && <div className="problem-reason">{tray.statusMessage || `${tray.liveStatus} API response`}</div>}
                        <small className="putaway-copy">Putaway by {tray.operatorId ?? 'N/A'} · {formatDate(tray.putawayAt)}</small>
                        {problem && <button type="button" className="remove-button" onClick={() => void removeProblemTray(tray)} disabled={phase === 'REMOVING'}>Remove Tray</button>}
                      </> : <div className="empty-slot">Empty</div>}
                    </article>
                  );
                })}
              </div>

              <label className="scan-field tray-scan">
                <span>2 · Scan all physical trays in this position</span>
                <div><span className="scan-icon">⌗</span><input ref={trayRef} value={trayValue} placeholder="CT00003" maxLength={7} onChange={(event) => setTrayValue(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); scanTray(); } }} onBlur={focusActiveScanner} /><button type="button" onClick={scanTray}>Count</button></div>
              </label>
              <div className="count-progress"><span><i style={{ width: `${result.trays.length ? (countedTrays.length / result.trays.length) * 100 : 100}%` }} /></span><b>{countedTrays.length}/{result.trays.length} scanned</b></div>
              <button type="button" className="next-location" onClick={reset}>{allCounted && !problems ? '✓ Count complete · scan next location' : 'Finish / scan next location'}</button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

const CSS = `
.cc-root{--bg0:#090b0e;--bg1:#101318;--bg2:#151920;--bg3:#1c2129;--line:rgba(255,255,255,.08);--line2:rgba(255,255,255,.15);--text:#f5f6f8;--text2:#bdc3cd;--muted:#747d89;--gold:#d9b75a;--gold2:#efd98f;--green:#47d59c;--red:#f16b73;--blue:#66a7ff;--magenta:#e44dff;min-height:calc(100vh - 3rem);margin:-1.5rem;color:var(--text);background:radial-gradient(850px 430px at 85% -10%,rgba(217,183,90,.07),transparent 65%),linear-gradient(180deg,#0d1014,var(--bg0));font-family:var(--font-inter,"Inter",ui-sans-serif,system-ui,sans-serif);font-size:14px}.cc-root *{box-sizing:border-box}.cc-header{min-height:66px;padding:13px 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px}.cc-brand{display:flex;align-items:center;gap:10px}.cc-brand>span:last-child{display:flex;align-items:baseline;gap:9px}.cc-brand b{font-size:20px;letter-spacing:2.4px}.cc-brand small{color:var(--muted);font-size:9px;font-weight:850;letter-spacing:1.8px;text-transform:uppercase}.cc-mark{width:33px;height:33px;padding:7px;border:1px solid rgba(217,183,90,.35);border-radius:9px;display:flex;flex-direction:column;gap:3px}.cc-mark i{height:3px;border-radius:3px;background:var(--gold)}.cc-mark i:nth-child(2){width:70%}.cc-mark i:nth-child(3){width:42%}.spacer{flex:1}.flow-pill{padding:6px 10px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:8px;font-weight:850;letter-spacing:.7px;text-transform:uppercase}.cc-layout{padding:20px;display:flex;justify-content:center}.count-card{width:min(1050px,100%);padding:18px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.018),transparent),var(--bg1);box-shadow:0 20px 55px -25px rgba(0,0,0,.8);display:flex;flex-direction:column;gap:13px}.count-card.has-problems{border-color:rgba(241,107,115,.32)}.card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.eyebrow{display:block;color:var(--muted);font-size:8.5px;font-weight:850;letter-spacing:1.6px;text-transform:uppercase}.card-head h1{margin:2px 0 0;font-size:22px}.operator-field{display:flex;align-items:center;gap:7px;padding:5px 6px 5px 9px;border:1px solid var(--line);border-radius:10px;background:var(--bg0)}.operator-field span{color:var(--muted);font-size:7.5px;font-weight:850;text-transform:uppercase}.operator-field input{width:96px;height:29px;padding:0 8px;border:1px solid var(--line2);border-radius:7px;background:var(--bg2);color:var(--text);font:800 11px inherit;text-transform:uppercase;outline:none}.operator-field input:focus{border-color:var(--gold)}
.status-banner{min-height:59px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--bg2);display:flex;align-items:center;gap:10px}.status-icon{width:31px;height:31px;border-radius:9px;display:grid;place-items:center;flex:none;background:rgba(102,167,255,.1);color:var(--blue);font-size:17px;font-weight:950}.status-banner>span:last-child{display:flex;flex-direction:column}.status-banner b{font-size:12.5px}.status-banner small{color:var(--muted);font-size:10.5px}.status-banner.problem{border-color:rgba(241,107,115,.34);background:rgba(241,107,115,.07)}.status-banner.problem .status-icon{color:var(--red);background:rgba(241,107,115,.14);animation:red-pulse 1s ease-in-out infinite}.status-banner.checking .status-icon,.status-banner.removing .status-icon{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@keyframes red-pulse{50%{box-shadow:0 0 16px rgba(241,107,115,.75);background:rgba(241,107,115,.32)}}
.scan-field{display:flex;flex-direction:column;gap:6px}.scan-field>span{color:var(--gold2);font-size:9px;font-weight:850;letter-spacing:1.3px;text-transform:uppercase}.scan-field>div{position:relative}.scan-field input{width:100%;height:64px;padding:0 78px 0 44px;border:1px solid var(--gold);border-radius:13px;background:var(--bg3);color:var(--text);font:750 21px inherit;letter-spacing:.5px;outline:none;box-shadow:0 0 0 4px rgba(217,183,90,.1)}.scan-field input::placeholder{color:#626a75}.scan-icon{position:absolute;left:15px;top:18px;color:var(--gold2);font-size:22px}.scan-field button{position:absolute;right:7px;top:7px;height:50px;padding:0 14px;border:0;border-radius:9px;background:var(--gold);color:#17130a;font:900 9px inherit;text-transform:uppercase;cursor:pointer}.scan-field button:disabled{opacity:.5}.location-hero{min-height:92px;padding:12px 17px;border:1px solid rgba(217,183,90,.27);border-radius:13px;background:radial-gradient(circle at 30% 0,rgba(217,183,90,.08),transparent 62%),var(--bg0);display:flex;align-items:center;justify-content:center;gap:17px;position:relative}.location-hero>span{display:flex;flex-direction:column;text-align:center}.location-hero small{color:var(--muted);font-size:7.5px;font-weight:850;text-transform:uppercase}.location-hero b{font-size:21px;color:var(--text2)}.location-hero strong{font-size:31px;color:var(--gold2)}.location-hero>i{width:1px;height:35px;background:var(--line2)}.location-hero b.red{color:var(--red)}.location-hero b.green{color:var(--green)}.location-hero code{position:absolute;right:12px;bottom:7px;color:var(--muted);font:650 7px inherit}
.slot-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.slot-grid article{min-width:0;min-height:215px;padding:10px;border:1px solid var(--line);border-radius:12px;background:var(--bg2);display:flex;flex-direction:column}.slot-head{display:flex;align-items:center;justify-content:space-between}.slot-head>span{color:var(--muted);font-size:7.5px;font-weight:850;text-transform:uppercase}.slot-head em{padding:3px 5px;border-radius:999px;background:rgba(217,183,90,.12);color:var(--gold2);font-size:6.5px;font-style:normal;font-weight:950}.slot-grid article>strong{margin:8px 0;color:var(--text);font-size:16px;letter-spacing:.5px}.slot-meta{display:grid;grid-template-columns:1fr 1fr;gap:5px}.slot-meta span{min-width:0;padding:6px;border:1px solid var(--line);border-radius:7px;background:var(--bg0);display:flex;flex-direction:column}.slot-meta small{color:var(--muted);font-size:6px;text-transform:uppercase}.slot-meta b{overflow:hidden;text-overflow:ellipsis;color:var(--text2);font-size:8px;white-space:nowrap}.slot-meta b.ndd{color:#f08cff}.putaway-copy{margin-top:auto;padding-top:7px;color:var(--muted);font-size:6.5px}.empty-slot{margin:auto;color:#555d68;font-size:11px;font-weight:800;text-transform:uppercase}.slot-grid article.counted:not(.problem){border-color:rgba(71,213,156,.38);background:rgba(71,213,156,.055)}.slot-grid article.counted:not(.problem) .slot-head em{background:rgba(71,213,156,.14);color:var(--green)}.slot-grid article.ndd:not(.problem){border-color:var(--magenta);background:linear-gradient(145deg,rgba(228,77,255,.22),rgba(74,18,91,.2));box-shadow:0 0 22px -7px var(--magenta);animation:ndd-tray 1.05s ease-in-out infinite}.slot-grid article.ndd:not(.problem) .slot-head em{background:rgba(228,77,255,.24);color:#f4b6ff}.slot-grid article.problem{border-color:var(--red);background:linear-gradient(145deg,rgba(241,107,115,.23),rgba(80,14,21,.25));box-shadow:0 0 20px -8px var(--red);animation:problem-tray 1s ease-in-out infinite}.slot-grid article.problem .slot-head em{background:var(--red);color:#25070a}.problem-reason{margin:7px 0;padding:6px;border:1px solid rgba(241,107,115,.32);border-radius:7px;background:rgba(0,0,0,.18);color:#ffafb4;font-size:7px;line-height:1.25}.remove-button{width:100%;min-height:34px;margin-top:8px;border:1px solid #ff98a0;border-radius:8px;background:var(--red);color:#28070a;font:950 8px inherit;letter-spacing:.7px;text-transform:uppercase;cursor:pointer}@keyframes ndd-tray{50%{border-color:#f3a4ff;box-shadow:0 0 30px -4px var(--magenta)}}@keyframes problem-tray{50%{border-color:#ffb0b5;box-shadow:0 0 27px -5px var(--red)}}
.cc-root{--ndd-purple:#6d28d9}.slot-meta b.ndd{color:#c4b5fd}.slot-grid article.ndd:not(.problem){border-color:rgba(124,58,237,.46);background:linear-gradient(145deg,rgba(76,29,149,.16),rgba(49,20,78,.12));box-shadow:none;animation:none!important}.slot-grid article.ndd:not(.problem) .slot-head em{background:rgba(76,29,149,.28);color:#c4b5fd}
.tray-scan{margin-top:2px}.count-progress{display:flex;align-items:center;gap:10px}.count-progress>span{height:5px;flex:1;border-radius:99px;background:var(--bg0);overflow:hidden}.count-progress i{display:block;height:100%;border-radius:inherit;background:var(--green);transition:width .2s}.count-progress b{color:var(--muted);font-size:8px;text-transform:uppercase}.next-location{align-self:center;border:0;background:transparent;color:var(--muted);font:800 10px inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}.next-location:hover{color:var(--text)}
@media(max-width:900px){.slot-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:600px){.cc-root{min-height:calc(100vh - 3rem)}.cc-header{display:none}.cc-layout{padding:8px}.count-card{padding:12px;border-radius:15px;box-shadow:none}.card-head h1{font-size:21px}.operator-field span{display:none}.operator-field input{width:88px}.status-banner{min-height:64px}.status-banner b{font-size:13px}.scan-field input{height:68px;font-size:20px}.scan-icon{top:21px}.scan-field button{top:8px;height:52px}.location-hero{gap:10px;padding-bottom:20px}.location-hero strong{font-size:27px}.slot-grid{grid-template-columns:1fr;gap:7px}.slot-grid article{min-height:0}.slot-grid article.empty{min-height:60px}.slot-grid article>strong{font-size:20px}.slot-meta{grid-template-columns:repeat(4,1fr)}.problem-reason{font-size:9px}.putaway-copy{font-size:8px}.remove-button{min-height:45px;font-size:10px}}
@media(prefers-reduced-motion:reduce){.status-banner.problem .status-icon,.slot-grid article.ndd,.slot-grid article.problem{animation:none}}
`;
