'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProtectedPage({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = Cookies.get('tokenDataGSE'); // sesuaikan nama cookie

    if (!token) {
      const pathParts = pathname.split('/');
      const mallId = pathParts[1];
      router.replace(`/${mallId}`); // redirect ke login mall
    } else {
      setIsAllowed(true);
    }
  }, [pathname, router]);

  if (!isAllowed) return null;

  return <>{children}</>;
}
