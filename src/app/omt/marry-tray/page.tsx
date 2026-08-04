'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const TRAY_ID_PATTERN = /^[A-Z]{2}\d{5}$/;
const STACK_CAPACITY = 5;

type StackTray = {
  trayId: string;
  stackLevel: number;
};

type MarriageLookup = {
  childTrayId: string;
  parentTrayId: string;
  fittingId: string;
  shipmentId: string;
  orderMode: 'JIT' | 'REGULAR';
  rawOrderType: string;
  qcfCount: number;
  available: boolean;
  positionBarcode: string | null;
  rackNumber: number | null;
  positionNumber: number | null;
  parentStackLevel: number | null;
  stack: StackTray[];
  lookupToken: string | null;
  lookupMs: number;
};

type Phase = 'IDLE' | 'LOOKING' | 'READY' | 'MARRYING' | 'MARRIED' | 'ERROR';

export default function MarryTrayPage() {
  const [operatorId, setOperatorId] = useState('');
  const [scanValue, setScanValue] = useState('');
  const [phase, setPhase] = useState<Phase>('IDLE');
  const [lookup, setLookup] = useState<MarriageLookup | null>(null);
  const [message, setMessage] = useState('Scan the child tray to find its parent and rack position.');
  const inputRef = useRef<HTMLInputElement>(null);
  const operatorRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  const focusScanner = useCallback(() => {
    window.setTimeout(() => {
      if (!operatorId.trim()) operatorRef.current?.focus();
      else if (document.activeElement !== operatorRef.current) inputRef.current?.focus();
    }, 30);
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

  const findParent = useCallback(async (rawValue?: string) => {
    const childTrayId = (rawValue ?? scanValue).trim().toUpperCase();
    if (busyRef.current) return;
    if (!operatorId.trim()) {
      setPhase('ERROR');
      setMessage('Enter your Operator ID before scanning.');
      operatorRef.current?.focus();
      return;
    }
    if (!TRAY_ID_PATTERN.test(childTrayId)) {
      setPhase('ERROR');
      setMessage('Invalid child tray ID · use 2 letters followed by 5 digits, for example CT00003.');
      setScanValue('');
      void fetch('/api/omt/marry-tray', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOG_REJECTION', operatorId, childTrayId, reason: 'INVALID_CHILD_ID' }),
      });
      focusScanner();
      return;
    }

    busyRef.current = true;
    setPhase('LOOKING');
    setLookup(null);
    setMessage(`Tracing ${childTrayId} and checking OMT rack stock…`);
    setScanValue('');
    try {
      const response = await fetch('/api/omt/marry-tray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOOKUP', childTrayId, operatorId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to find parent tray');

      const data = body.data as MarriageLookup;
      setLookup(data);
      if (data.available) {
        setPhase('READY');
        setMessage(`Parent found in ${data.positionBarcode} · pick it and confirm marriage.`);
      } else {
        setPhase('ERROR');
        setMessage(`Parent ${data.parentTrayId} is not stored in any OMT rack position.`);
      }
    } catch (error) {
      setPhase('ERROR');
      setMessage((error as Error).message);
    } finally {
      busyRef.current = false;
      focusScanner();
    }
  }, [focusScanner, operatorId, scanValue]);

  useEffect(() => {
    if (TRAY_ID_PATTERN.test(scanValue) && !busyRef.current) findParent(scanValue);
  }, [findParent, scanValue]);

  const confirmMarriage = useCallback(async () => {
    if (!lookup?.available || !lookup.lookupToken || busyRef.current) return;
    busyRef.current = true;
    setPhase('MARRYING');
    setMessage(`Marrying ${lookup.childTrayId} with ${lookup.parentTrayId}…`);
    try {
      const response = await fetch('/api/omt/marry-tray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MARRY',
          childTrayId: lookup.childTrayId,
          parentTrayId: lookup.parentTrayId,
          lookupToken: lookup.lookupToken,
          operatorId,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to marry trays');

      setLookup((current) => current ? {
        ...current,
        available: false,
        parentStackLevel: null,
        lookupToken: null,
        stack: body.remainingTrays ?? [],
      } : current);
      setPhase('MARRIED');
      setMessage(`${lookup.parentTrayId} removed from ${body.positionBarcode}. Only the remaining trays stay in the rack.`);
    } catch (error) {
      setPhase('ERROR');
      setMessage((error as Error).message);
    } finally {
      busyRef.current = false;
      focusScanner();
    }
  }, [focusScanner, lookup, operatorId]);

  const reset = () => {
    setLookup(null);
    setPhase('IDLE');
    setMessage('Scan the child tray to find its parent and rack position.');
    setScanValue('');
    focusScanner();
  };

  const statusIcon = phase === 'MARRIED' ? '✓' : phase === 'ERROR' ? '!' : phase === 'LOOKING' || phase === 'MARRYING' ? '↻' : '→';

  return (
    <div className="mry-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="mry-header">
        <div className="mry-brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span><b>OMT</b><small>Marry Tray</small></span>
        </div>
        <span className="spacer" />
        <span className="speed-pill"><i /> One-query tracer</span>
        <span className="flow-pill">Child → Parent → Rack out</span>
      </header>

      <main className="mry-layout">
        <section className={`marry-card ${phase.toLowerCase()}`}>
          <div className="card-head">
            <div><span className="eyebrow">HHD workflow</span><h1>Marry Tray</h1></div>
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
                    inputRef.current?.focus();
                  }
                }}
              />
            </label>
          </div>

          <div className={`status-banner ${phase.toLowerCase()}`} role="status" aria-live="polite">
            <span className="status-icon">{statusIcon}</span>
            <span><b>{phase === 'READY' ? 'Parent ready to pick' : phase === 'MARRIED' ? 'Marriage complete' : phase === 'LOOKING' ? 'Finding parent' : phase === 'MARRYING' ? 'Confirming marriage' : phase === 'ERROR' ? 'Action needed' : 'Ready to scan'}</b><small>{message}</small></span>
          </div>

          <label className="scan-field">
            <span>Scan child tray</span>
            <div>
              <span className="scan-icon" aria-hidden="true">▥</span>
              <input
                ref={inputRef}
                value={scanValue}
                autoFocus
                autoComplete="off"
                maxLength={7}
                pattern="[A-Za-z]{2}[0-9]{5}"
                placeholder="CT00003"
                onChange={(event) => setScanValue(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    findParent();
                  }
                }}
                onBlur={focusScanner}
                aria-label="Scan child tray"
              />
              <button type="button" onClick={() => findParent()} disabled={phase === 'LOOKING' || phase === 'MARRYING'}>Find</button>
            </div>
          </label>

          {!lookup ? (
            <div className="idle-panel">
              <div className="marry-glyph" aria-hidden="true"><span>子</span><i>+</i><span>親</span></div>
              <b>Scan child tray</b>
              <small>Parent, order type, QCF count and rack position appear together</small>
            </div>
          ) : (
            <div className="result-grid">
              <section className="child-panel">
                <div className="section-title"><span>Child visibility</span>{lookup.lookupMs > 0 && <small>{lookup.lookupMs} ms</small>}</div>
                <div className="child-id"><small>Child tray</small><b>{lookup.childTrayId}</b></div>
                <div className="visibility-metrics">
                  <div><small>Order</small><b className={lookup.orderMode === 'JIT' ? 'jit' : 'regular'}>{lookup.orderMode}</b></div>
                  <div><small>QCF count</small><b className={lookup.qcfCount > 2 ? 'danger' : ''}>{lookup.qcfCount}</b></div>
                </div>
              </section>

              <section className={`pick-panel ${phase === 'MARRIED' ? 'done' : ''}`}>
                <span className="pick-kicker">{phase === 'MARRIED' ? 'Removed from rack' : lookup.available ? 'Pick this parent' : 'Parent not in rack'}</span>
                <strong>{lookup.parentTrayId}</strong>
                {lookup.positionBarcode ? (
                  <div className="location">
                    <span><small>Rack</small><b>{String(lookup.rackNumber).padStart(2, '0')}</b></span>
                    <i />
                    <span><small>Position</small><b>P{String(lookup.positionNumber).padStart(3, '0')}</b></span>
                    {lookup.parentStackLevel && <><i /><span><small>Tray level</small><b>{lookup.parentStackLevel}</b></span></>}
                  </div>
                ) : <small className="not-stored">No OMT position found</small>}
              </section>

              <section className="stack-panel">
                <div className="section-title"><span>Position tray stack</span><small>{lookup.stack.length}/{STACK_CAPACITY}</small></div>
                <div className="stack-list">
                  {Array.from({ length: STACK_CAPACITY }, (_, index) => {
                    const level = index + 1;
                    const tray = lookup.stack.find((item) => item.stackLevel === level);
                    const isParent = tray?.trayId === lookup.parentTrayId && phase !== 'MARRIED';
                    return (
                      <div key={level} className={`${tray ? 'occupied' : 'empty'} ${isParent ? 'parent' : ''}`}>
                        <span>Tray {level}</span>
                        <b title={tray?.trayId}>{tray?.trayId ?? 'Empty'}</b>
                        {isParent && <em>Pick</em>}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {lookup?.available && phase !== 'MARRIED' && (
            <button type="button" className="marry-button" onClick={confirmMarriage} disabled={phase === 'MARRYING'}>
              <span>{phase === 'MARRYING' ? 'Marrying trays…' : 'Confirm marriage'}</span>
              <small>{lookup.childTrayId} + {lookup.parentTrayId} · remove parent from rack</small>
            </button>
          )}

          {(lookup || phase === 'ERROR') && phase !== 'LOOKING' && phase !== 'MARRYING' && (
            <button type="button" className="next-button" onClick={reset}>{phase === 'MARRIED' ? 'Scan next child tray' : 'Clear & rescan'}</button>
          )}

          <div className="workflow-strip">
            <span><b>1</b> Scan child</span><i /><span><b>2</b> Pick suggested parent</span><i /><span><b>3</b> Confirm marriage</span>
          </div>
        </section>
      </main>
    </div>
  );
}

const CSS = `
.mry-root{--bg0:#090b0e;--bg1:#101318;--bg2:#151920;--bg3:#1c2129;--line:rgba(255,255,255,.075);--line2:rgba(255,255,255,.14);--text:#f5f6f8;--text2:#bac0ca;--muted:#737b88;--gold:#d9b75a;--gold2:#efd98f;--green:#47d59c;--red:#f16b73;--blue:#66a7ff;--purple:#a78bfa;min-height:calc(100vh - 3rem);margin:-1.5rem;color:var(--text);background:radial-gradient(850px 440px at 83% -10%,rgba(217,183,90,.07),transparent 64%),linear-gradient(180deg,#0d0f13,var(--bg0));font-family:var(--font-inter,"Inter",ui-sans-serif,system-ui,sans-serif);font-size:14px;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}.mry-root *{box-sizing:border-box}
.mry-header{min-height:66px;padding:14px 25px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:11px;background:linear-gradient(180deg,rgba(255,255,255,.025),transparent)}.mry-brand{display:flex;align-items:center;gap:10px}.mry-brand>span:last-child{display:flex;align-items:baseline;gap:9px}.mry-brand b{font-size:20px;letter-spacing:2.4px}.mry-brand small{color:var(--muted);font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase}.brand-mark{width:31px;height:31px;border:1px solid rgba(217,183,90,.35);border-radius:9px;display:flex;align-items:center;justify-content:center;gap:3px;background:rgba(217,183,90,.06)}.brand-mark i{width:8px;height:16px;border:2px solid var(--gold);border-radius:3px}.brand-mark i:last-child{border-color:var(--green)}.spacer{flex:1}.speed-pill,.flow-pill{padding:6px 10px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:8.5px;font-weight:800;letter-spacing:.65px;text-transform:uppercase}.speed-pill{display:flex;align-items:center;gap:6px;color:var(--green);border-color:rgba(71,213,156,.25);background:rgba(71,213,156,.08)}.speed-pill i{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
.mry-layout{flex:1;padding:22px;display:flex;align-items:flex-start;justify-content:center}.marry-card{width:min(920px,100%);padding:20px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,.018),transparent),var(--bg1);box-shadow:0 20px 55px -25px rgba(0,0,0,.8);display:flex;flex-direction:column;gap:14px}.marry-card.ready{border-color:rgba(217,183,90,.27)}.marry-card.married{border-color:rgba(71,213,156,.3)}.card-head{display:flex;align-items:flex-start;justify-content:space-between}.eyebrow{display:block;color:var(--muted);font-size:8.5px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase}.card-head h1{margin:1px 0 0;font-size:21px;line-height:1.15}.format-badge{padding:5px 8px;border:1px solid rgba(217,183,90,.25);border-radius:999px;background:rgba(217,183,90,.07);color:var(--gold2);font-size:8px;font-weight:800;letter-spacing:.7px;text-transform:uppercase}
.operator-field{display:flex;align-items:center;gap:7px;padding:5px 6px 5px 9px;border:1px solid var(--line);border-radius:10px;background:var(--bg0)}.operator-field span{color:var(--muted);font-size:7.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;white-space:nowrap}.operator-field input{width:96px;height:28px;padding:0 8px;border:1px solid var(--line2);border-radius:7px;background:var(--bg2);color:var(--text);font:800 11px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;outline:none}.operator-field input:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(217,183,90,.1)}
.status-banner{min-height:58px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--bg2);display:flex;align-items:center;gap:10px}.status-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:none;background:rgba(102,167,255,.1);color:var(--blue);font-size:16px;font-weight:900}.status-banner>span:last-child{display:flex;flex-direction:column}.status-banner b{font-size:12.5px}.status-banner small{color:var(--muted);font-size:10.5px}.status-banner.ready .status-icon{color:var(--gold2);background:rgba(217,183,90,.11)}.status-banner.married .status-icon{color:var(--green);background:rgba(71,213,156,.11)}.status-banner.error .status-icon{color:var(--red);background:rgba(241,107,115,.1)}.status-banner.looking .status-icon,.status-banner.marrying .status-icon{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.scan-field{display:flex;flex-direction:column;gap:6px}.scan-field>span{color:var(--gold2);font-size:9px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase}.scan-field>div{position:relative}.scan-field input{width:100%;height:61px;padding:0 74px 0 44px;border:1px solid var(--gold);border-radius:13px;background:var(--bg3);color:var(--text);font:700 20px var(--font-inter,"Inter",sans-serif);letter-spacing:.5px;outline:none;box-shadow:0 0 0 4px rgba(217,183,90,.1)}.scan-field input::placeholder{color:#666e7a;font-weight:500}.scan-icon{position:absolute;left:15px;top:18px;color:var(--gold2);font-size:20px}.scan-field button{position:absolute;right:7px;top:7px;height:47px;padding:0 14px;border:0;border-radius:9px;background:var(--gold);color:#17130a;font:850 9px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;letter-spacing:.7px;cursor:pointer}.scan-field button:disabled{opacity:.5;cursor:wait}
.idle-panel{min-height:240px;border:1px dashed var(--line2);border-radius:15px;background:var(--bg0);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.marry-glyph{display:flex;align-items:center;gap:10px;margin-bottom:12px}.marry-glyph span{width:47px;height:47px;border:1px solid rgba(217,183,90,.3);border-radius:13px;display:grid;place-items:center;color:var(--gold2);font-size:18px;font-weight:800;background:rgba(217,183,90,.06)}.marry-glyph span:last-child{color:var(--green);border-color:rgba(71,213,156,.3);background:rgba(71,213,156,.06)}.marry-glyph i{color:var(--muted);font-style:normal;font-size:20px}.idle-panel>b{font-size:17px;color:var(--text2)}.idle-panel>small{margin-top:3px;color:var(--muted);font-size:10px}
.result-grid{display:grid;grid-template-columns:240px 1fr;grid-template-areas:"child pick" "stack stack";gap:11px}.child-panel,.pick-panel,.stack-panel{border:1px solid var(--line);border-radius:14px;background:var(--bg0)}.child-panel{grid-area:child;padding:14px}.section-title{display:flex;align-items:center;justify-content:space-between;color:var(--muted);font-size:8px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase}.section-title small{font-size:8px;color:var(--muted)}.child-id{display:flex;flex-direction:column;margin:12px 0}.child-id small{color:var(--muted);font-size:8px;text-transform:uppercase}.child-id b{color:var(--text);font-size:22px;letter-spacing:.7px}.visibility-metrics{display:grid;grid-template-columns:1fr 1fr;gap:7px}.visibility-metrics>div{padding:9px;border:1px solid var(--line);border-radius:9px;background:var(--bg2);display:flex;flex-direction:column}.visibility-metrics small{color:var(--muted);font-size:7.5px;font-weight:800;text-transform:uppercase}.visibility-metrics b{font-size:14px}.visibility-metrics b.jit{color:var(--purple)}.visibility-metrics b.regular{color:var(--blue)}.visibility-metrics b.danger{color:var(--red)}
.pick-panel{grid-area:pick;min-height:160px;padding:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 50% 15%,rgba(217,183,90,.08),transparent 58%),var(--bg0);border-color:rgba(217,183,90,.25)}.pick-panel.done{border-color:rgba(71,213,156,.28);background:radial-gradient(circle at 50% 15%,rgba(71,213,156,.09),transparent 58%),var(--bg0)}.pick-kicker{color:var(--muted);font-size:8px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase}.pick-panel>strong{margin:2px 0 9px;color:var(--gold2);font-size:38px;line-height:1;letter-spacing:1px}.pick-panel.done>strong{color:var(--green)}.location{display:flex;align-items:center;gap:12px}.location>span{display:flex;flex-direction:column}.location small{color:var(--muted);font-size:7px;font-weight:800;text-transform:uppercase}.location b{font-size:16px;color:var(--text2)}.location i{width:1px;height:24px;background:var(--line2)}.not-stored{color:var(--red);font-size:10px}
.stack-panel{grid-area:stack;padding:13px}.stack-list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin-top:9px}.stack-list>div{min-width:0;height:57px;padding:7px;border:1px solid var(--line);border-radius:9px;background:var(--bg2);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}.stack-list span{color:var(--muted);font-size:7px;font-weight:800;text-transform:uppercase}.stack-list b{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;color:var(--text2);font-size:9px;white-space:nowrap}.stack-list .empty b{color:#555d68}.stack-list .parent{border-color:var(--gold);background:rgba(217,183,90,.1);box-shadow:0 0 18px -8px var(--gold)}.stack-list .parent b{color:var(--gold2)}.stack-list em{position:absolute;right:4px;top:4px;padding:2px 4px;border-radius:999px;background:var(--gold);color:#17130a;font-size:6px;font-style:normal;font-weight:900;text-transform:uppercase}
.marry-button{width:100%;min-height:62px;padding:10px;border:1px solid var(--green);border-radius:13px;background:linear-gradient(180deg,#55dba7,#3fc58f);color:#082117;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 25px -15px var(--green)}.marry-button span{font:900 14px var(--font-inter,"Inter",sans-serif);text-transform:uppercase;letter-spacing:.8px}.marry-button small{font:700 8.5px var(--font-inter,"Inter",sans-serif);opacity:.7}.marry-button:disabled{opacity:.55;cursor:wait}.next-button{align-self:center;border:0;background:transparent;color:var(--muted);font:750 10px var(--font-inter,"Inter",sans-serif);text-decoration:underline;text-underline-offset:3px;cursor:pointer}.next-button:hover{color:var(--text)}.workflow-strip{display:flex;align-items:center;justify-content:center;gap:7px;color:var(--muted);font-size:7.5px;font-weight:750;text-transform:uppercase}.workflow-strip span{display:flex;align-items:center;gap:4px;white-space:nowrap}.workflow-strip b{width:16px;height:16px;border:1px solid var(--line2);border-radius:50%;display:grid;place-items:center;color:var(--text2);font-size:7px}.workflow-strip>i{width:15px;height:1px;background:var(--line2)}
@media(max-width:700px){.result-grid{grid-template-columns:1fr;grid-template-areas:"child" "pick" "stack"}.child-panel{display:grid;grid-template-columns:1fr 1fr;gap:10px}.child-panel .section-title{grid-column:1/-1}.child-id{margin:0}.pick-panel{min-height:150px}}
@media(max-width:560px){.mry-root{min-height:calc(100vh - 3rem)}.mry-header{display:none}.mry-layout{display:block;padding:9px}.marry-card{padding:14px;border-radius:16px;box-shadow:none;gap:12px}.card-head h1{font-size:21px}.status-banner{min-height:61px}.status-banner b{font-size:13px}.status-banner small{font-size:10px}.scan-field input{height:66px;font-size:21px}.scan-icon{top:21px}.scan-field button{top:8px;height:50px}.idle-panel{min-height:250px}.result-grid{gap:9px}.child-panel{padding:12px}.pick-panel>strong{font-size:34px}.stack-panel{padding:11px}.stack-list{gap:4px}.stack-list>div{height:55px;padding:5px 3px}.stack-list b{font-size:7.5px}.marry-button{min-height:68px}.workflow-strip{gap:4px;font-size:6.6px}.workflow-strip>i{width:6px}.workflow-strip b{display:none}}
@media(max-width:380px){.mry-layout{padding:6px}.marry-card{padding:11px}.format-badge{max-width:95px;text-align:center}.visibility-metrics{gap:4px}.location{gap:8px}.stack-list span{font-size:6px}.stack-list b{font-size:7px}}
`;
