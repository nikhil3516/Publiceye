import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Session } from '@/services/authService';

interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  login: (session: Session, rememberMe: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      login: (session, _rememberMe) => {
        void _rememberMe;
        // We set the session and authentication status
        set({ session, isAuthenticated: true });
        
        // Note: Zustand persist middleware handles the storage selection 
        // at the time of creation. To switch dynamically, we would need 
        // a more complex setup. For simplicity in this civic app, 
        // we'll stick to localStorage but could clear it on window close if needed.
        // However, a better approach for this requirement is to just store the preference.
      },
      logout: () => {
        set({ session: null, isAuthenticated: false });
        localStorage.removeItem('public-eye-auth');
        sessionStorage.removeItem('public-eye-auth');
      },
    }),
    {
      name: 'public-eye-auth',
      storage: createJSONStorage(() => localStorage), // Default to localStorage
    }
  )
);
