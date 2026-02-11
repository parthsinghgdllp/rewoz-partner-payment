'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F6]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-[#fc6957] rounded-2xl animate-bounce flex items-center justify-center text-white font-bold text-3xl shadow-xl">
          R
        </div>
        <p className="text-[#333333] font-medium animate-pulse">Redirecting to login...</p>
      </div>
    </div>
  );
}
