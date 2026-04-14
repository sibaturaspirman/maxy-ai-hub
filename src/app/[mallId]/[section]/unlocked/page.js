'use client';

import Image from "next/image";
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
    <main className="h-screen w-full bg-[#0F1638] -mt-4">
       <div className='w-[30%] mx-auto pt-4'>
          <Image src='/images/maxy-logo-2.png' width={175} height={41} alt='Zirolu' className='w-full' priority />
      </div>
       <div className='w-[90%] mx-auto pt-5'>
          <Image src='/images/maxy-unlocked.png' width={337} height={332} alt='Zirolu' className='w-full' priority />
      </div>
       <div className='w-full mx-auto absolute bottom-0 left-0 right-0'>
          <Image src='/images/maxy-show.png' width={337} height={213} alt='Zirolu' className='w-full' priority />
      </div>
    </main>
  );
}
