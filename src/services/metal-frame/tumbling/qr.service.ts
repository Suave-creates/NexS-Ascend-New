import QRCode from 'qrcode';
import { ensureContainersInitialized } from './container.service';

export interface StationQrCode {
  stationNumber: number;
  targetUrl: string;
  qrDataUrl: string;
}

/** Builds one QR code per station (1..22), deep-linking into the dashboard which opens that station's modal on load. */
export async function buildStationQrCodes(origin: string): Promise<StationQrCode[]> {
  await ensureContainersInitialized();

  return Promise.all(
    Array.from({ length: 22 }, (_, i) => i + 1).map(async (stationNumber) => {
      const targetUrl = `${origin}/metal-frame/tumbling?station=${stationNumber}`;
      const qrDataUrl = await QRCode.toDataURL(targetUrl, { margin: 1, width: 320 });
      return { stationNumber, targetUrl, qrDataUrl };
    }),
  );
}
