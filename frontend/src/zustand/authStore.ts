import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthUser } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  setAuth: (authData: AuthUser) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      
      setAuth: (authData: AuthUser) => {
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-manual', JSON.stringify({
            user: authData.user,
            token: authData.token,
            isAuthenticated: true
          }));
        }
      },
      
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setHydrated: () => {
        if (typeof window !== 'undefined') {
          const manualAuth = localStorage.getItem('auth-manual');
          if (manualAuth) {
            try {
              const authData = JSON.parse(manualAuth);
              set({
                user: authData.user,
                token: authData.token,
                isAuthenticated: authData.isAuthenticated,
                isHydrated: true,
              });
              return;
            } catch (error) {
            }
          }
        }
        
        set({ isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);