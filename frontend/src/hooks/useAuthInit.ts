import { useEffect } from 'react';
import { useAuthStore } from '@/zustand';

export const useAuthInit = () => {
  const { setHydrated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && !isHydrated) {
      setHydrated();
    }
  }, [setHydrated, isHydrated]);

  return { isHydrated };
};