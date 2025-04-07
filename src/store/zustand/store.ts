import { mutateSignOut } from '@/app/api/supabase/service';
import { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthStateType {
  user: User | null;
  isSignIn: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

export const initialState = { user: null, isSignIn: false };

export const useAuthStore = create<AuthStateType>()(
  persist(
    (set) => ({
      user: null,
      isSignIn: false,
      setUser: (user) => set({ user, isSignIn: true }),
      signOut: async () => {
        await mutateSignOut();

        set(initialState);
        localStorage.removeItem('user-state');
      },
    }),
    {
      name: 'user-state',
    }
  )
);
