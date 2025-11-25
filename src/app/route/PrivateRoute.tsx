'use client';

import { useAuth } from '@/utils/providers/AuthSessionProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1890FF] mx-auto"></div>
      <p className="mt-4 text-[#2D3748]">Loading...</p>
    </div>
  </div>
);

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Current path

  useEffect(() => {
    if (!loading && user === null) {
      // Redirect to login page with redirect query
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || user === undefined) return <LoadingSpinner />;

  return <>{user ? children : null}</>;
}