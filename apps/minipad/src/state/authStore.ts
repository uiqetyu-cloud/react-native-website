import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userName: null,
  login: (name: string) => set({ isAuthenticated: true, userName: name }),
  logout: () => set({ isAuthenticated: false, userName: null }),
}));
