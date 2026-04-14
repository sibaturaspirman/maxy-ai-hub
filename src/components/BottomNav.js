'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  {
    href: 'home',
    label: 'Home',
    icon: '/images/m-nav-home.png',
    activeIcon: '/images/m-nav-home-active.png',
  },
  {
    href: 'product',
    label: 'Product',
    icon: '/images/m-nav-product.png',
    activeIcon: '/images/m-nav-product-active.png',
  },
  {
    href: 'experience',
    label: 'Experience',
    icon: '/images/m-nav-experience.png',
    activeIcon: '/images/m-nav-experience-active.png',
  },
];

export default function BottomNav() {
  const pathname = usePathname(); // contoh: /KotaKasablanka/experience/stamp

  const mallId = pathname.split('/')[1]; // ambil "KotaKasablanka"

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname.includes(`/${item.href}`);
        const fullPath = `/${mallId}/${item.href}`;

        return (
          <Link
            key={item.href}
            href={fullPath}
            className="flex flex-col items-center w-full"
          >
            <Image
              src={isActive ? item.activeIcon : item.icon}
              alt={item.label}
              width={77}
              height={60}
              className="h-[40px] w-auto"
            />
            <p className='text-center text-xs'>{item.label}</p>
          </Link>
        );
      })}
    </nav>
  );
}
