'use client';

import ContactList from '@/components/contacts/ContactList';
import PeopleDetailPanel from '@/components/contactDetail/PeopleDetailPanel';
import { useAuthStore } from '@/store/zustand/store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SIGNIN } from '@/constants/paths';

const People = () => {
  const [peopleSelectedId, setPeopleSelectedId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const isSignIn = useAuthStore((state) => state.isSignIn);
  const router = useRouter();

  // 마운트 이후에만 렌더링
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 마운트 전, 로그아웃 상태 감지 막기
  useEffect(() => {
    if (hasMounted && !isSignIn) {
      router.replace(SIGNIN);
    }
  }, [hasMounted, isSignIn, router]);

  if (!hasMounted) return null;
  if (!isSignIn) return null;

  return (
    <div className='flex h-screen'>
      {/* 왼쪽 연락처 리스트 영역 */}
      <div className='h-full w-[410px] overflow-y-auto rounded-[20px] border border-gray-200'>
        <ContactList onSelectedContact={setPeopleSelectedId} />
      </div>

      {/* 오른쪽 상세 정보 영역 */}
      <div className='flex-1 overflow-y-auto'>
        {peopleSelectedId ? (
          <PeopleDetailPanel contactsId={peopleSelectedId} />
        ) : (
          <div className='flex h-full items-center justify-center p-8 text-xl text-gray-500'>사람을 선택해주세요.</div>
        )}
      </div>
    </div>
  );
};

export default People;
