import { supabase } from '@/app/api/supabase/client';
import { mutateSignOut } from '@/app/api/supabase/service';
import { User } from '@supabase/supabase-js';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthStateType {
  user: User | null;
  isSignIn: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

// 상태 초기값
export const initialState = { user: null, isSignIn: false };

export const useAuthStore = create<AuthStateType>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user, isSignIn: true }),
      signOut: async () => {
        await mutateSignOut();
        set(initialState);
        toast.success(`로그아웃되었습니다.`);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

// 로그인 시 탭 전환 등으로 인해 중복 알림이 발생하지 않도록 localStorage를 사용해 제어
export const AuthStateChangeHandler = () => {
  const { setUser } = useAuthStore.getState();

  const { data: unsubscribe } = supabase.auth.onAuthStateChange((event, session) => {
    const alreadySignIn = localStorage.getItem('alreadySignIn');

    if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session) {
      setUser(session.user);

      // 토스트는 실제 로그인 액션 때만 띄우기
      if (event === 'SIGNED_IN' && !alreadySignIn) {
        localStorage.setItem('alreadySignIn', 'true');
        toast.success(`로그인되었습니다. '내 사람' 페이지로 이동합니다.`);
      }
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('alreadySignIn');
    }
  });

  return unsubscribe;
};
