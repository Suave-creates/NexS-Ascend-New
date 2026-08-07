import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { prismaDispatch } from '@/utils/prismaDispatch';
import { randomUUID } from 'node:crypto';

export type QcRunStatus = {
  runId: string | null;
  credentialsVerified: boolean;
  running: boolean; total: number; completed: number; failed: number;
  current: string | null; message: string; startedAt: string | null; finishedAt: string | null;
};

const runs = new Map<string, QcRunStatus>();
const activePackages = new Set<string>();

type ReusableSession = {
  username: string; password: string; browser: Browser; context: BrowserContext; page: Page;
};
const qcGlobal = globalThis as typeof globalThis & {
  clClsQcSession?: ReusableSession | null;
  clClsQcSessionBusy?: boolean;
};

export function getQcSessionStatus() {
  const session = qcGlobal.clClsQcSession;
  const sessionReady = !!session && !session.page.isClosed() && session.browser.isConnected();
  return { sessionReady, sessionUsername: sessionReady ? session!.username : null };
}

function emptyStatus(): QcRunStatus {
  return { runId: null, credentialsVerified: false, running: false, total: 0, completed: 0, failed: 0, current: null,
    message: 'Ready', startedAt: null, finishedAt: null };
}

export function getQcRunStatus(runId?: string | null) {
  return { ...(runId ? runs.get(runId) : undefined) || emptyStatus() };
}

export function startQcRun(username: string, password: string, shippingPackageIds: string[]) {
  const cached = qcGlobal.clClsQcSession;
  const resolvedUsername = username || cached?.username || '';
  const resolvedPassword = password || (cached?.username === resolvedUsername ? cached.password : '');
  if (!resolvedUsername || !resolvedPassword) throw new Error('Employee code and password are required for the first run');
  if (qcGlobal.clClsQcSessionBusy) throw new Error('The reusable QC browser session is already running another batch');
  const overlaps = shippingPackageIds.filter(id => activePackages.has(id));
  if (overlaps.length) throw new Error(`${overlaps.length} selected package(s) are already running in another session`);
  shippingPackageIds.forEach(id => activePackages.add(id));
  const runId = randomUUID();
  let status = emptyStatus();
  status = { ...emptyStatus(), running: true, message: 'Starting Chrome…', startedAt: new Date().toISOString() };
  status.runId = runId;
  runs.set(runId, status);
  qcGlobal.clClsQcSessionBusy = true;
  void run(status, resolvedUsername, resolvedPassword, shippingPackageIds).finally(() => {
    qcGlobal.clClsQcSessionBusy = false;
    shippingPackageIds.forEach(id => activePackages.delete(id));
    setTimeout(() => runs.delete(runId), 6 * 60 * 60_000);
  });
  return { ...status };
}

async function run(status: QcRunStatus, username: string, password: string, shippingPackageIds: string[]) {
  try {
    const jobs = await prismaDispatch.clClsQcQueueEntry.findMany({
      // RUNNING rows are safe to retry after a server/process restart. Active
      // package ownership prevents overlap between live runs in this process.
      where: {
        shippingPackageId: { in: shippingPackageIds },
        state: { in: ['PENDING', 'FAILED', 'RUNNING'] },
      },
      orderBy: [{ shippingPackageId: 'asc' }, { id: 'asc' }],
    });
    status.total = jobs.length;
    if (!jobs.length) { status.message = `No pending barcodes for the ${shippingPackageIds.length} selected package(s)`; return; }
    await prismaDispatch.clClsQcQueueEntry.updateMany({
      where: { id: { in: jobs.map(job => job.id) } },
      data: { state: 'RUNNING' },
    });

    const { page } = await reusableSession(username, password);
    status.credentialsVerified = true;
    status.message = 'Credentials verified · preparing QC';
    await selectWorkstation(page);
    await selectFacility(page, process.env.NEXS_FACILITY || 'NXS1');
    await selectWorkstation(page); // facility changes can request workstation again

    for (const job of jobs) {
      status.current = job.barcode;
      status.message = `QC ${status.completed + status.failed + 1}/${status.total}`;
      await prismaDispatch.clClsQcQueueEntry.update({ where: { id: job.id }, data: { state: 'RUNNING', attempts: { increment: 1 }, lastError: null } });
      try {
        await completeQc(page, job.barcode);
        await prismaDispatch.clClsQcQueueEntry.update({ where: { id: job.id }, data: { state: 'COMPLETED', completedAt: new Date() } });
        status.completed++;
      } catch (error) {
        const base = error instanceof Error ? error.message : String(error);
        const shot = `./out/cl-cls-qc-failure-${status.runId}.png`;
        await page.screenshot({ path: shot, fullPage: true }).catch(() => undefined);
        const title = await page.title().catch(() => '');
        const message = `${base}\nURL: ${page.url()}\nTitle: ${title}\nScreenshot: ${shot}`;
        await prismaDispatch.clClsQcQueueEntry.update({ where: { id: job.id }, data: { state: 'FAILED', lastError: message.slice(0, 4000) } });
        status.failed++;
      }
    }
    status.message = `Finished: ${status.completed} completed, ${status.failed} failed`;
  } catch (error) {
    status.message = error instanceof Error ? error.message : String(error);
  } finally {
    status.running = false; status.current = null; status.finishedAt = new Date().toISOString();
  }
}

async function reusableSession(username: string, password: string): Promise<ReusableSession> {
  let session = qcGlobal.clClsQcSession;
  if (session && (session.username !== username || session.page.isClosed() || !session.browser.isConnected())) {
    await session.context.close().catch(() => undefined);
    await session.browser.close().catch(() => undefined);
    qcGlobal.clClsQcSession = null;
    session = null;
  }
  if (!session) {
    const executablePath = process.env.CL_CLS_QC_EXECUTABLE_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
    const channel = process.env.CL_CLS_QC_BROWSER_CHANNEL;
    const browser = await chromium.launch({
      headless: process.env.CL_CLS_QC_HEADLESS !== 'false',
      ...(executablePath ? { executablePath } : {}),
      ...(channel ? { channel } : {}),
    });
    const context = await browser.newContext({ viewport: { width: 1500, height: 850 } });
    session = { username, password, browser, context, page: await context.newPage() };
    qcGlobal.clClsQcSession = session;
  } else {
    session.password = password;
  }
  try {
    await session.page.goto(process.env.CL_CLS_QC_URL || 'https://app.nexs.lenskart.com/qc', { waitUntil: 'domcontentloaded' });
    await session.page.waitForURL(/\/login(?:$|[?#])/, { timeout: 2_000 }).catch(() => undefined);
    await loginIfNeeded(session.page, session.username, session.password);
    return session;
  } catch (error) {
    await session.context.close().catch(() => undefined);
    await session.browser.close().catch(() => undefined);
    qcGlobal.clClsQcSession = null;
    throw error;
  }
}

async function loginIfNeeded(page: Page, username: string, password: string) {
  if (!/\/login(?:$|[?#])/.test(page.url())) return;
  const user = page.locator('input[name="email"]').first();
  const outcome = await Promise.race([
    user.waitFor({ state: 'visible', timeout: 15_000 }).then(() => 'form'),
    page.waitForURL((url: URL) => !/\/login(?:$|[?#])/.test(url.toString()), { timeout: 15_000 }).then(() => 'session'),
  ]).catch(() => 'timeout');
  if (outcome === 'session') {
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);
    await page.goto(process.env.CL_CLS_QC_URL || 'https://app.nexs.lenskart.com/qc', { waitUntil: 'domcontentloaded' });
    return;
  }
  if (outcome !== 'form') throw new Error('NexS login form did not become available');
  await user.fill(username);
  await page.locator('input[name="Password"], input[type="password"]').first().fill(password);
  await page.getByRole('button', { name: /^login$/i }).first().click();
  // NexS is an SPA and can persist the session without a document navigation.
  // Waiting for waitForURL's default `load` event therefore burns the whole
  // timeout even when login succeeded. Continue as soon as either the route
  // changes or the login form disappears, then verify via the QC route.
  const loginSucceeded = await Promise.race([
    page.waitForURL((url: URL) => !/\/login(?:$|[?#])/.test(url.toString()), {
      timeout: 8_000,
      waitUntil: 'commit',
    }).then(() => true),
    user.waitFor({ state: 'hidden', timeout: 8_000 }).then(() => true),
  ]).catch(() => false);
  if (!loginSucceeded) throw new Error('Login did not complete within 8 seconds; check the credentials or NexS availability');
  await page.waitForTimeout(250); // allow the SPA to finish persisting its token
  await page.goto(process.env.CL_CLS_QC_URL || 'https://app.nexs.lenskart.com/qc', { waitUntil: 'domcontentloaded' });
  if (/\/login(?:$|[?#])/.test(page.url())) throw new Error('NexS rejected the login credentials');
}

async function scan(page: Page, locator: ReturnType<Page['locator']>, code: string) {
  await locator.click(); await locator.fill(''); await locator.fill(code); await locator.press('Enter');
}

async function selectWorkstation(page: Page) {
  const field = page.getByPlaceholder(/Scan work station barcode/i).first();
  const appeared = await field.waitFor({ state: 'visible', timeout: 10_000 }).then(() => true).catch(() => false);
  if (!appeared) return;
  await scan(page, field, process.env.NEXS_WORKSTATION || 'QC01');
  await field.waitFor({ state: 'hidden', timeout: 15_000 });
}

async function selectFacility(page: Page, facility: string) {
  const select = page.getByRole('combobox').first();
  if (!await select.isVisible().catch(() => false)) return;
  const current = await select.textContent().catch(() => '');
  if (current?.includes(facility)) return;
  await select.click();
  await page.getByRole('option', { name: new RegExp(`^${facility}$`, 'i') }).click();
  await page.waitForTimeout(1_000);
}

async function completeQc(page: Page, barcode: string) {
  const next = page.getByPlaceholder(/Scan Next Product Barcode/i).first();
  const initial = page.getByPlaceholder(/Scan Product Barcode|Scan Frame\/Lens/i).first();
  const load = await next.isVisible().catch(() => false) ? next : initial;
  await load.waitFor({ state: 'visible', timeout: 20_000 });
  await scan(page, load, barcode);
  const complete = page.getByPlaceholder(/Scan to Complete QC/i).first();
  await complete.waitFor({ state: 'visible', timeout: 15_000 });
  await scan(page, complete, barcode);
  const ok = page.getByText(/Barcode Scanned Successfully/i).first();
  const err = page.getByText(/System Error|Invalid Session|UNAUTHORIZED|Expired|Invalid Barcode/i).first();
  const result = await Promise.race([
    ok.waitFor({ state: 'visible', timeout: 15_000 }).then(() => 'ok'),
    err.waitFor({ state: 'visible', timeout: 15_000 }).then(() => 'error'),
  ]).catch(() => 'timeout');
  if (result !== 'ok') throw new Error(result === 'error' ? await err.innerText().catch(() => 'QC error') : 'QC success confirmation timed out');
  await page.waitForTimeout(900);
}
