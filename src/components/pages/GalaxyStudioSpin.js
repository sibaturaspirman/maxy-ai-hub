'use client';

import Link from 'next/link';
import SpinWheel from '@/components/SpinWheel'
import Image from "next/image";
import ProtectedPage from '@/components/ProtectedPage';

export default function GalaxyStudioSpin() {
  return (
    <ProtectedPage>
    <main className="flex fixed h-full w-full bg-[#F4F4F4] overflow-hidden flex-col items-center pt-2 pb-5 px-5 lg:pt-12" onContextMenu={(e)=> e.preventDefault()}>
        <h3 className="font-semibold text-center text-3xl mb-3">Get your rewards!</h3>
        <SpinWheel />
    </main>
    </ProtectedPage>
  )
}
