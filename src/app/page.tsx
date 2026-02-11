'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F6]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 animate-bounce">
          <Image
            src="/images/rewoz_partner_transparent.png"
            alt="RewOz Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-[#333333] font-medium animate-pulse">Redirecting to login...</p>
      </div>
    </div>
  );
}
