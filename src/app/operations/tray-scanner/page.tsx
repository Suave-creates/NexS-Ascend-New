'use client';

import { useState, useEffect } from 'react';
import { Card, PageHeader, Input } from '@/components/ui';

export default function TrayScannerPage() {
  const [trayId, setTrayId] = useState<string>('');
  const [lastScans, setLastScans] = useState<string[]>([]);
  const [fastTrack, setFastTrack] = useState<{ id: string; city: string }[]>([]);
  const [isMatch, setIsMatch] = useState<boolean>(false);
  const [matchedTray, setMatchedTray] = useState<string>('');

  const handleScan = async (id: string) => {
    setLastScans(prev => [id, ...prev.filter(item => item !== id)].slice(0, 10));
    setTrayId('');

    // Format check CT00000
    if (!/^CT\d{5}$/i.test(id)) {
      setIsMatch(false);
      return;
    }

    try {
      const res = await fetch(`/api/operations/metadata?locationId=${id}`);
      const data = await res.json();

      if (data.found) {
        setIsMatch(true);
        setMatchedTray(id);
        setFastTrack(prev => [{ id, city: data.cityOdd }, ...prev]);
      } else {
        setIsMatch(false);
      }
    } catch (err) {
      setIsMatch(false);
    }
  };

  useEffect(() => {
    if (isMatch) {
      const timer = setTimeout(() => {
        setIsMatch(false);
        setMatchedTray('');
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isMatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Auto-clear if more than 8 characters
    if (value.length > 8) {
      setTrayId('');
      return;
    }

    setTrayId(value);
    if (/^[A-Za-z]{2}\d{5}$/.test(value)) {
      void handleScan(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <PageHeader title="TRAY SCANNER" className="justify-center text-center" />

      <div className="max-w-xl mx-auto">
        <Input
          type="text"
          placeholder="Enter Tray ID..."
          value={trayId}
          onChange={handleChange}
        />
      </div>

      {isMatch && (
        <div className="fixed inset-0 bg-gold-500 text-[#3a2800] flex flex-col items-center justify-center z-50">
          <h2 className="text-5xl font-extrabold mb-4">Pick it up</h2>
          <p className="text-4xl tracking-wide">{matchedTray}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-brand-700">Last Ten Scans</h2>
          <ul className="list-disc list-inside text-gray-700">
            {lastScans.length > 0 ? (
              lastScans.map((id, idx) => <li key={idx}>{id}</li>)
            ) : (
              <li>No scans yet</li>
            )}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-brand-700">NDD Fast-Track</h2>
          {fastTrack.length > 0 ? (
            fastTrack.map((item, idx) => (
              <p key={idx} className="text-gray-700">
                {item.id} – {item.city}
              </p>
            ))
          ) : (
            <p className="text-gray-700">— Fast-track details will appear here —</p>
          )}
        </Card>
      </div>
    </div>
  );
}
