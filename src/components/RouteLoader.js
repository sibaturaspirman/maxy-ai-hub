'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    setLoading(true);

    // Delay to simulate loading while route is changing
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600); // Adjust delay as needed

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center transition-opacity duration-300">

      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-5" />
      {/* <img
        src="/images/samsung-logo.png"
        alt="Loading..."
        className="w-[100px] animate-pulse mb-5"
      /> */}
      Memuat konten...
    </div>
  );
}
