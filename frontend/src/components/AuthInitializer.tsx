'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/zustand';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { setHydrated } = useAuthStore();

    useEffect(() => {
        setHydrated();
    }, [setHydrated]);

    return <>{children}</>;
}