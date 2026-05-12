import { create } from 'zustand';
import Cookies from 'js-cookie';

// ============================================
// Auth Store — Zustand (auth state ONLY)
// Never store server state (models, logs, keys) here.
// ============================================

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

// Hydrate from localStorage on creation
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('email') : null;

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  email: storedEmail,
  isAuthenticated: !!storedToken,

  login: (token: string, email: string) => {
    // Set state
    set({ token, email, isAuthenticated: true });
    // Persist to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    // Set js-cookie for middleware (server-side) route protection
    Cookies.set('token', token, { path: '/' });
  },

  logout: () => {
    // Clear state
    set({ token: null, email: null, isAuthenticated: false });
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    // Clear cookie
    Cookies.remove('token', { path: '/' });
  },
}));
