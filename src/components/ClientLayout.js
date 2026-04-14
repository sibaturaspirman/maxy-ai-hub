'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const section = segments[1]; // home, product, etc.

  const showNav = ['home', 'product', 'experience', 'spin'].includes(section);

  return (
    <>
    <main className={`max-w-md mx-auto  ${showNav ? 'pb-24' : ''} `}>
      <div className="px-4 pt-4 pb-7 text-center z-50 relative">
        <Image
          src="/images/samsung-logo.png"
          alt="Samsung Logo"
          width={102}
          height={16}
          priority
        />
      </div>{children}</main>
      {showNav && <BottomNav />}
    </>
  );
}
