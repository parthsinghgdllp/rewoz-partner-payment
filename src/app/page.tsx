'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function Home() {
  return (
    <AuthGuard requireAuth={false}>
      <HomeContent />
    </AuthGuard>
  );
}

function HomeContent() {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/subscription');
      } else {
        router.replace('/login');
      }
    }
  }, [router, isAuthenticated, loading]);

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
        <p className="text-[#333333] font-medium animate-pulse">Redirecting, please wait...</p>
      </div>
    </div>
  );
}
