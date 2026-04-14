'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GalaxyStudioSpin() {
  const pathname = usePathname(); // e.g. /KotaKasablanka/experience/spin
  const [iframeSrc, setIframeSrc] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const mallId = pathname.split('/')[1]; // ambil "KotaKasablanka"
    const token = localStorage.getItem('tokenDataGSE');

    if (mallId && token) {
      setIframeSrc(`/spinwheel/v2.html?mallId=${encodeURIComponent(mallId)}&token=${encodeURIComponent(token)}`);
    }
  }, [pathname]);

  return (
    <main className="h-screen w-full">
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          className="w-full h-full border-none"
          allow="camera; microphone"
        />
      ) : (
        <div className="text-center pt-20 text-gray-600">Loading...</div>
      )}
    </main>
  );
}
