import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (token, email) => {
        set({ user: { token, email }, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage'); // Explicitly clear if needed
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
