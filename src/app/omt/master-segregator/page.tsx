'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type SegregatorResult = {
  scannedTrayId: string;
  fittingId: string;
  shipmentId: string;
  priority: string;
  orderDate: string;
  orderAge: string;
  orderAgeDays: number | null;
  orderMode: 'JIT' | 'REGULAR';
  rawOrderType: string;
  maxQcfCount: number;
  masterTrayId: string;
  masterInOmt: boolean;
  positionBarcode: string | null;
  rackNumber: number | null;
  positionNumber: number | null;
  stackLevel: number | null;
  storedTrayForFitting: string | null;
  decision: 'OMT_READY' | 'RESORTER_REQUIRED';
  decisionMessage: string;
  lookupMs: number;
};

type RecentScan = {
  id: number;
  trayId: string;
  masterTrayId: string;
  result: 'OMT_READY' | 'RESORTER_REQUIRED';
  time: string;
};

type Phase = 'IDLE' | 'LOADING' | 'READY' | 'RESORTER' | 'ERROR';

export default function MasterSegregatorPage() {
  const [operatorId, setOperatorId] = useState('');
  const [trayValue, setTrayValue] = useState('');
  const [phase, setPhase] = useState<Phase>('IDLE');
  const [message, setMessage] = useState('Scan any tray to locate its master.');
  const [result, setResult] = useState<SegregatorResult | null>(null);
  const [recent, setRecent] = useState<RecentScan[]>([]);
  const operatorRef = useRef<HTMLInputElement>(null);
  const trayRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  const focusScanner = useCallback(() => {
    window.setTimeout(() => {
      if (!operatorId.trim()) operatorRef.current?.focus();
      else if (document.activeElement !== operatorRef.current) trayRef.current?.focus();
    }, 25);
  }, [operatorId]);

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

  const scanTray = useCallback(async () => {
    const trayId = trayValue.trim().toUpperCase();
    if (busyRef.current || !trayId) return;
    if (!operatorId.trim()) {
      setPhase('ERROR');
      setMessage('Enter your Operator ID before scanning.');
      operatorRef.current?.focus();
      return;
    }

    busyRef.current = true;
    setTrayValue('');
    setResult(null);
    setPhase('LOADING');
    setMessage(`Checking ${trayId} across NexS WMS, order header and OMT racks…`);

    try {
      const response = await fetch('/api/omt/master-segregator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trayId, operatorId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to segregate tray');

      const data = body.data as SegregatorResult;
      setResult(data);
      setPhase(data.masterInOmt ? 'READY' : 'RESORTER');
      setMessage(data.decisionMessage);
      setRecent((current) => [{
        id: Date.now(),
        trayId: data.scannedTrayId,
        masterTrayId: data.masterTrayId,
        result: data.decision,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }, ...current].slice(0, 8));
    } catch (error) {
      setPhase('ERROR');
      setMessage((error as Error).message);
    } finally {
      busyRef.current = false;
      focusScanner();
    }
  }, [focusScanner, operatorId, trayValue]);

  const reset = () => {
    setResult(null);
    setPhase('IDLE');
    setMessage('Scan any tray to locate its master.');
    setTrayValue('');
    focusScanner();
  };

  const statusTitle = phase === 'LOADING'
    ? 'Tracing fitting'
    : phase === 'READY'
      ? 'Master available in OMT'
      : phase === 'RESORTER'
        ? 'Send to Resorter'
        : phase === 'ERROR'
          ? 'Scan rejected'
          : 'Ready to scan';

  return (
    <div className="msg-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="msg-header">
        <div className="msg-brand"><span className="brand-mark"><i /><i /><i /></span><span><b>OMT</b><small>Master Segregator</small></span></div>
        <span className="spacer" />
        <span className="source-pill"><i /> NexS WMS Live</span>
        <span className="flow-pill">Tray → Fitting → Master → Location</span>
      </header>

      <main className="msg-layout">
        <section className={`seg-card ${phase.toLowerCase()}`}>
          <div className="card-head">
            <div><span className="eyebrow">HHD workflow</span><h1>Master Segregator</h1></div>
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
                    trayRef.current?.focus();
                  }
                }}
              />
            </label>
          </div>

          <div className={`status-banner ${phase.toLowerCase()}`} role="status" aria-live="polite">
            <span className="status-icon">{phase === 'READY' ? '✓' : phase === 'RESORTER' || phase === 'ERROR' ? '!' : phase === 'LOADING' ? '↻' : '→'}</span>
            <span><b>{statusTitle}</b><small>{message}</small></span>
          </div>

          <label className="scan-field">
            <span>Scan tray barcode</span>
            <div>
              <span className="scan-icon" aria-hidden="true">▥</span>
              <input
                ref={trayRef}
                value={trayValue}
                autoFocus
                autoComplete="off"
                maxLength={7}
                pattern="[A-Za-z]{2}[0-9]{5}"
                placeholder="CT11042"
                onChange={(event) => setTrayValue(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    scanTray();
                  }
                }}
                onBlur={focusScanner}
                aria-label="Scan tray barcode"
              />
              <button type="button" onClick={scanTray} disabled={phase === 'LOADING'}>{phase === 'LOADING' ? 'Wait' : 'Find'}</button>
            </div>
          </label>

          {!result ? (
            <div className="idle-panel">
              <span className="master-glyph"><i /><i /><i /></span>
              <b>{phase === 'LOADING' ? 'Finding the master tray…' : 'Scan any tray'}</b>
              <small>Priority, age, QCF, order type and master location appear in one scan</small>
            </div>
          ) : (
            <div className="result-panel">
              <div className={`decision ${result.masterInOmt ? 'good' : 'resorter'}`}>
                <span>{result.masterInOmt ? 'OMT rack match' : 'Do not putaway'}</span>
                <strong>{result.masterInOmt ? result.masterTrayId : 'RESORTER'}</strong>
                {result.masterInOmt ? (
                  <div className="location-row">
                    <span><small>Rack</small><b>{String(result.rackNumber).padStart(2, '0')}</b></span>
                    <i />
                    <span><small>Position</small><b>P{String(result.positionNumber).padStart(3, '0')}</b></span>
                    <i />
                    <span><small>Tray level</small><b>{result.stackLevel}</b></span>
                  </div>
                ) : (
                  <small className="resorter-copy">Master {result.masterTrayId} is not in OMT. Resorter 1/2 will be added when its database is connected.</small>
                )}
              </div>

              <div className="metrics-grid">
                <article className={result.priority.toUpperCase().includes('NEXT') ? 'priority next' : 'priority'}><small>Priority</small><b>{result.priority}</b></article>
                <article><small>Order age</small><b>{result.orderAge}</b><em>{result.orderDate} IST</em></article>
                <article className={result.orderMode === 'JIT' ? 'jit' : ''}><small>Order type</small><b>{result.orderMode}</b><em>{result.rawOrderType}</em></article>
                <article className={result.maxQcfCount > 2 ? 'danger' : ''}><small>Max QCF count</small><b>{result.maxQcfCount}</b><em>Across fitting shipments</em></article>
              </div>

              <div className="identity-grid">
                <span><small>Scanned tray</small><b>{result.scannedTrayId}</b></span>
                <span><small>Fitting ID</small><b>{result.fittingId}</b></span>
                <span><small>Shipment ID</small><b>{result.shipmentId}</b></span>
                <span><small>Lookup</small><b>{result.lookupMs} ms</b></span>
              </div>
            </div>
          )}

          {(result || phase === 'ERROR') && phase !== 'LOADING' && (
            <button type="button" className="next-button" onClick={reset}>Clear & scan next tray</button>
          )}

          <div className="workflow-strip"><span><b>1</b> Scan tray</span><i /><span><b>2</b> Find fitting master</span><i /><span><b>3</b> OMT or Resorter</span></div>
        </section>

        <aside className="recent-panel">
          <div className="recent-head"><span><small>This device</small><b>Recent segregation</b></span><em>{recent.length} scans</em></div>
          {recent.length ? recent.map((item) => (
            <div className={`recent-row ${item.result === 'OMT_READY' ? 'good' : 'resorter'}`} key={item.id}>
              <i />
              <span><b>{item.trayId} → {item.masterTrayId}</b><small>{item.result === 'OMT_READY' ? 'OMT rack' : 'Resorter'} · {item.time}</small></span>
            </div>
          )) : <div className="recent-empty">Completed scans appear here</div>}
        </aside>
      </main>
    </div>
  );
}

const CSS = `
.msg-root{--bg0:#090b0e;--bg1:#101318;--bg2:#151920;--bg3:#1c2129;--line:rgba(255,255,255,.075);--line2:rgba(255,255,255,.14);--text:#f5f6f8;--text2:#bbc1cb;--muted:#747c88;--gold:#d9b75a;--gold2:#efd98f;--green:#47d59c;--red:#f16b73;--blue:#66a7ff;--purple:#a78bfa;min-height:calc(100vh - 3rem);margin:-1.5rem;color:var(--text);background:radial-gradient(850px 440px at 83% -10%,rgba(217,183,90,.07),transparent 64%),linear-gradient(180deg,#0d0f13,var(--bg0));font-family:var(--font-inter,"Inter",ui-sans-serif,system-ui,sans-serif);font-size:14px;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}.msg-root *{box-sizing:border-box}
.msg-header{min-height:66px;padding:14px 25px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:11px}.msg-brand{display:flex;align-items:center;gap:10px}.msg-brand>span:last-child{display:flex;align-items:baseline;gap:9px}.msg-brand b{font-size:20px;letter-spacing:2.4px}.msg-brand small{color:var(--muted);font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase}.brand-mark{width:31px;height:31px;border:1px solid rgba(217,183,90,.35);border-radius:9px;display:flex;flex-direction:column-reverse;align-items:center;justify-content:center;gap:2px;background:rgba(217,183,90,.06)}.brand-mark i{display:block;height:3px;border-radius:3px;background:var(--gold)}.brand-mark i:nth-child(1){width:17px}.brand-mark i:nth-child(2){width:12px}.brand-mark i:nth-child(3){width:7px}.spacer{flex:1}.source-pill,.flow-pill{padding:6px 10px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:8.5px;font-weight:800;letter-spacing:.65px;text-transform:uppercase}.source-pill{display:flex;align-items:center;gap:6px;color:var(--green);border-color:rgba(71,213,156,.25);background:rgba(71,213,156,.08)}.source-pill i{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
.msg-layout{flex:1;padding:22px;display:grid;grid-template-columns:minmax(420px,820px) 260px;gap:16px;align-items:start;justify-content:center}.seg-card,.recent-panel{border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.018),transparent),var(--bg1);box-shadow:0 20px 55px -25px rgba(0,0,0,.8)}.seg-card{padding:20px;display:flex;flex-direction:column;gap:14px}.seg-card.ready{border-color:rgba(71,213,156,.28)}.seg-card.resorter,.seg-card.error{border-color:rgba(241,107,115,.25)}.card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.eyebrow{display:block;color:var(--muted);font-size:8.5px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase}.card-head h1{margin:1px 0 0;font-size:21px;line-height:1.15}.operator-field{display:flex;align-items:center;gap:7px;padding:5px 6px 5px 9px;border:1px solid var(--line);border-radius:10px;background:var(--bg0)}.operator-field span{color:var(--muted);font-size:7.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;white-space:nowrap}.operator-field input{width:96px;height:28px;padding:0 8px;border:1px solid var(--line2);border-radius:7px;background:var(--bg2);color:var(--text);font:800 11px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;outline:none}.operator-field input:focus{border-color:var(--gold)}
.status-banner{min-height:58px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--bg2);display:flex;align-items:center;gap:10px}.status-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:none;background:rgba(102,167,255,.1);color:var(--blue);font-size:16px;font-weight:900}.status-banner>span:last-child{display:flex;flex-direction:column}.status-banner b{font-size:12.5px}.status-banner small{color:var(--muted);font-size:10.5px}.status-banner.ready .status-icon{color:var(--green);background:rgba(71,213,156,.11)}.status-banner.resorter .status-icon,.status-banner.error .status-icon{color:var(--red);background:rgba(241,107,115,.1)}.status-banner.loading .status-icon{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.scan-field{display:flex;flex-direction:column;gap:6px}.scan-field>span{color:var(--gold2);font-size:9px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase}.scan-field>div{position:relative}.scan-field input{width:100%;height:63px;padding:0 76px 0 44px;border:1px solid var(--gold);border-radius:13px;background:var(--bg3);color:var(--text);font:750 21px var(--font-inter,"Inter",sans-serif);letter-spacing:.6px;outline:none;box-shadow:0 0 0 4px rgba(217,183,90,.1)}.scan-field input::placeholder{color:#666e7a;font-weight:500}.scan-icon{position:absolute;left:15px;top:19px;color:var(--gold2);font-size:20px}.scan-field button{position:absolute;right:7px;top:7px;height:49px;padding:0 15px;border:0;border-radius:9px;background:var(--gold);color:#17130a;font:850 9px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;letter-spacing:.7px;cursor:pointer}.scan-field button:disabled{opacity:.5;cursor:wait}
.idle-panel{min-height:285px;border:1px dashed var(--line2);border-radius:15px;background:var(--bg0);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.master-glyph{width:64px;height:64px;margin-bottom:13px;border:1px solid rgba(217,183,90,.28);border-radius:18px;background:rgba(217,183,90,.06);display:flex;flex-direction:column-reverse;align-items:center;justify-content:center;gap:3px}.master-glyph i{height:5px;border-radius:4px;background:var(--gold)}.master-glyph i:nth-child(1){width:36px}.master-glyph i:nth-child(2){width:27px}.master-glyph i:nth-child(3){width:18px}.idle-panel>b{font-size:18px;color:var(--text2)}.idle-panel>small{max-width:360px;margin-top:4px;color:var(--muted);font-size:10px}
.result-panel{display:flex;flex-direction:column;gap:10px}.decision{min-height:190px;padding:18px;border:1px solid;border-radius:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.decision.good{border-color:rgba(71,213,156,.35);background:radial-gradient(circle at 50% 0,rgba(71,213,156,.13),transparent 62%),var(--bg0)}.decision.resorter{border-color:rgba(241,107,115,.38);background:radial-gradient(circle at 50% 0,rgba(241,107,115,.13),transparent 62%),var(--bg0)}.decision>span{color:var(--muted);font-size:8px;font-weight:850;letter-spacing:1.5px;text-transform:uppercase}.decision>strong{margin:4px 0 13px;color:var(--green);font-size:38px;line-height:1;letter-spacing:1px}.decision.resorter>strong{color:var(--red);font-size:34px}.location-row{display:flex;align-items:center;gap:15px}.location-row span{display:flex;flex-direction:column}.location-row small{color:var(--muted);font-size:7px;font-weight:800;text-transform:uppercase}.location-row b{font-size:17px;color:var(--text2)}.location-row i{width:1px;height:26px;background:var(--line2)}.resorter-copy{max-width:460px;color:#f6a2a7;font-size:11px;line-height:1.5}
.metrics-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.metrics-grid article{min-width:0;min-height:82px;padding:11px;border:1px solid var(--line);border-radius:11px;background:var(--bg2);display:flex;flex-direction:column}.metrics-grid small,.identity-grid small{color:var(--muted);font-size:7.5px;font-weight:800;letter-spacing:.7px;text-transform:uppercase}.metrics-grid b{margin-top:4px;color:var(--text2);font-size:14px;line-height:1.2;overflow-wrap:anywhere}.metrics-grid em{margin-top:auto;color:var(--muted);font-size:7.5px;font-style:normal}.metrics-grid .next{border-color:rgba(167,139,250,.35)}.metrics-grid .next b,.metrics-grid .jit b{color:var(--purple)}.metrics-grid .danger{border-color:rgba(241,107,115,.32)}.metrics-grid .danger b{color:var(--red)}.identity-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;padding:11px;border:1px solid var(--line);border-radius:11px;background:var(--bg0)}.identity-grid span{min-width:0;display:flex;flex-direction:column}.identity-grid b{margin-top:2px;color:var(--text2);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.next-button{align-self:center;border:0;background:transparent;color:var(--muted);font:750 10px var(--font-inter,"Inter",sans-serif);text-decoration:underline;text-underline-offset:3px;cursor:pointer}.workflow-strip{display:flex;align-items:center;justify-content:center;gap:7px;color:var(--muted);font-size:7.5px;font-weight:750;text-transform:uppercase}.workflow-strip span{display:flex;align-items:center;gap:4px;white-space:nowrap}.workflow-strip b{width:16px;height:16px;border:1px solid var(--line2);border-radius:50%;display:grid;place-items:center;color:var(--text2);font-size:7px}.workflow-strip>i{width:15px;height:1px;background:var(--line2)}
.recent-panel{padding:15px}.recent-head{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:11px;border-bottom:1px solid var(--line)}.recent-head>span{display:flex;flex-direction:column}.recent-head small{color:var(--muted);font-size:7px;text-transform:uppercase}.recent-head b{font-size:13px}.recent-head em{color:var(--muted);font-size:8px;font-style:normal}.recent-row{display:flex;align-items:center;gap:8px;padding:10px 2px;border-bottom:1px solid var(--line)}.recent-row>i{width:7px;height:7px;border-radius:50%;background:var(--green)}.recent-row.resorter>i{background:var(--red)}.recent-row>span{min-width:0;display:flex;flex-direction:column}.recent-row b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px;color:var(--text2)}.recent-row small{color:var(--muted);font-size:7.5px}.recent-empty{padding:45px 8px;text-align:center;color:var(--muted);font-size:9px}
@media(max-width:900px){.msg-header,.recent-panel{display:none}.msg-layout{display:block;padding:13px}.seg-card{width:min(620px,100%);margin:0 auto}}
@media(max-width:560px){.msg-layout{padding:8px}.seg-card{padding:13px;border-radius:16px;box-shadow:none;gap:12px}.card-head h1{font-size:20px}.operator-field span{display:none}.operator-field input{width:88px}.status-banner{min-height:62px}.scan-field input{height:67px;font-size:21px}.scan-icon{top:21px}.scan-field button{top:8px;height:51px}.decision{min-height:185px;padding:13px}.decision>strong{font-size:32px}.metrics-grid{grid-template-columns:1fr 1fr}.identity-grid{grid-template-columns:1fr 1fr}.workflow-strip{gap:4px;font-size:6.6px}.workflow-strip>i{width:6px}.workflow-strip b{display:none}}
@media(max-width:370px){.msg-layout{padding:5px}.seg-card{padding:10px}.location-row{gap:9px}.metrics-grid{gap:5px}.identity-grid{gap:5px}}
`;
