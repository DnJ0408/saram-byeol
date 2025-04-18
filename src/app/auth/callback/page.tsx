'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/api/supabase/client';
import { useRouter } from 'next/navigation';

// 컴포넌트 마운트 시 현재 로그인 세션 확인
// 세션이 있으면 '/people'로
// 세션이 없으면 '/signin'으로
const AuthCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/people');
      } else {
        router.replace('/signin');
      }
    });
  }, [router]);

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <p>로그인 처리 중…</p>
    </div>
  );
};

export default AuthCallbackPage;
