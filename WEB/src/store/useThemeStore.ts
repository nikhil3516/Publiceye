import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    { name: 'public-eye-theme' }
  )
);

// Initialize on load
export function initTheme() {
  const stored = localStorage.getItem('public-eye-theme');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.isDark) {
        document.documentElement.classList.add('dark');
      }
    } catch {
      // Ignore parsing errors
    }
  }
}
