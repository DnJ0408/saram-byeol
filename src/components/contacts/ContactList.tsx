import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import ContactItem from '@/components/contacts/ContactItem';
import { Check, PencilSimple, UserPlus } from '@phosphor-icons/react';
import AddContactForm from '@/components/contacts/addContactForm/AddContactForm';
import SideSheet from '@/components/contacts/SideSheet';
import { useAuthStore } from '@/store/zustand/store';
import { useDemoStore } from '@/store/zustand/useDemoStore';
import Loading from '@/components/Loading';
import { useMutateInfiniteContact } from '@/hooks/mutations/useMutateInfiniteContact';
import { usePinnedContacts, useRegularContactsInfinite } from '@/hooks/queries/useGetContactsForInfinite';
import { useMutateDeleteContacts } from '@/hooks/mutations/useMutateDeleteContacts';
import { ConfirmToast } from '@/components/toast/ConfirmToast';
import { toast } from 'react-toastify';

interface ContactListProps {
  peopleSelectedId: string | null;
  onSelectedContact: (id: string) => void;
}

export default function ContactList({ peopleSelectedId, onSelectedContact }: ContactListProps) {
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleClose = () => setIsAddContactOpen(false);

  // 사용자 정보
  const { user } = useAuthStore();
  const { isDemoUser, demoContacts, demoUser, toggleContactPin } = useDemoStore();
  const userId = isDemoUser ? demoUser.id : user?.id;
  const isAuthenticated = Boolean(userId);

  // 데모 모드에서는 demoContacts만 사용
  const demoPinned = useMemo(() => demoContacts.filter((c) => c.is_pinned), [demoContacts]);
  const demoRegular = useMemo(() => demoContacts.filter((c) => !c.is_pinned), [demoContacts]);

  // 실제 모드: 고정된 연락처
  const {
    data: pinnedContacts = [],
    isLoading: isPinnedLoading,
    error: pinnedError,
  } = usePinnedContacts(userId as string);

  // 실제 모드: 일반 연락처 무한 스크롤
  const {
    data: regularPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRegularLoading,
    error: regularError,
  } = useRegularContactsInfinite(userId as string);

  // 페이징된 일반 연락처 배열 합치기
  const regularContacts = useMemo(() => regularPages?.pages.flatMap((page) => page.contacts) || [], [regularPages]);

  // 핀 토글 뮤테이션
  const pinMutation = useMutateInfiniteContact(userId as string);
  // 삭제 뮤테이션
  const deleteMutation = useMutateDeleteContacts(userId as string);

  const handleTogglePin = (contactId: string, isPinned: boolean) => {
    if (isDemoUser) {
      toggleContactPin(contactId);
      return;
    }
    pinMutation.mutate({ contactId, isPinned });
  };

  // 연락처 삭제 핸들러
  const handleDeleteContact = (contactId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDemoUser) {
      toast.info('데모 체험 중에는 이 기능을 사용할 수 없습니다.');
      return;
    }

    // ConfirmToast를 그대로 호출
    ConfirmToast({
      message: '이 연락처를 삭제하시겠습니까?',
      onConfirm: () => {
        // 삭제 뮤테이션 실행
        deleteMutation.mutate(
          { userId: userId as string, contactsId: contactId },
          {
            onSuccess: () => {
              toast.success('연락처가 삭제되었습니다.');
              if (peopleSelectedId === contactId) {
                onSelectedContact('');
              }
            },
            onError: () => {
              toast.error('연락처 삭제에 실패했습니다.');
            },
          }
        );
      },
      // 기본값으로 confirmText='삭제', cancelText='취소'를 쓰니까 생략 가능
    });
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // 무한 스크롤 옵저버 세팅 (MDN: IntersectionObserver API)
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (isDemoUser) return; // 데모 모드에서는 옵저버 비활성
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 200px 0px',
      threshold: 0.1,
    });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver, isDemoUser]);

  // 인증·로딩·에러 처리
  if (!isAuthenticated) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <p className='text-lg text-gray-600'>로그인이 필요한 서비스입니다.</p>
      </div>
    );
  }
  const isLoading = isDemoUser ? false : isPinnedLoading || isRegularLoading;
  if (pinnedError || regularError) {
    console.error('연락처 로딩 실패', { pinnedError, regularError });
  }

  return (
    <div className='flex h-full flex-col overflow-x-hidden'>
      {/* 헤더 */}
      <div className='flex items-center justify-between pl-6 pr-6 pt-6'>
        <h1 className='text-2xl font-bold'>내 사람 목록</h1>
        <button className='flex items-center text-gray-600 hover:text-primary-500' onClick={toggleEditMode}>
          {isEditMode ? (
            <>
              <Check size={20} className='mr-1' />
              <span>편집 완료</span>
            </>
          ) : (
            <>
              <PencilSimple size={20} className='mr-1' />
              <span>편집</span>
            </>
          )}
        </button>
      </div>

      {/* 추가 버튼 */}
      <div className='mt-12 flex justify-center px-6'>
        <button
          className='flex h-12 w-full max-w-sm items-center justify-center rounded-lg border border-grey-50 bg-primary-500 font-medium text-grey-50 transition-colors hover:bg-primary-600'
          onClick={() => setIsAddContactOpen(true)}
        >
          <UserPlus size={20} className='mr-2' />
          <span>내 사람 추가</span>
        </button>
      </div>

      {/* 연락처 리스트 */}
      <div className='mt-12 flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='py-8 text-center'>
            <Loading />
          </div>
        ) : (
          <>
            {/* 핀된 연락처 */}
            {(isDemoUser ? demoPinned : pinnedContacts).length > 0 && (
              <section className='mb-6'>
                <div className='flex items-center px-6 py-3'>
                  <h2 className='text-sm font-semibold text-grey-700'>고정됨</h2>
                </div>
                <ul className='flex flex-col'>
                  {(isDemoUser ? demoPinned : pinnedContacts).map((c) => (
                    <li key={`pinned-${c.contacts_id}`}>
                      <div onClick={() => onSelectedContact(c.contacts_id)}>
                        <ContactItem
                          contact={c}
                          onTogglePin={handleTogglePin}
                          isSelected={peopleSelectedId === c.contacts_id}
                          isEditMode={isEditMode}
                          onDeleteContact={(e) => handleDeleteContact(c.contacts_id, e)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 일반 연락처 */}
            <section>
              {(isDemoUser ? demoRegular : regularContacts).length > 0 && (
                <div className='flex items-center px-6 py-3'>
                  <h2 className='text-sm font-semibold text-grey-700'>리스트</h2>
                </div>
              )}
              <ul className='flex flex-col'>
                {(isDemoUser ? demoRegular : regularContacts).map((c) => (
                  <li key={c.contacts_id}>
                    <div onClick={() => onSelectedContact(c.contacts_id)} className='w-full'>
                      <ContactItem
                        contact={c}
                        onTogglePin={handleTogglePin}
                        isSelected={peopleSelectedId === c.contacts_id}
                        isEditMode={isEditMode}
                        onDeleteContact={(e) => handleDeleteContact(c.contacts_id, e)}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              {/* 무한 스크롤 트리거 */}
              {!isDemoUser && (
                <div ref={loadMoreRef} className='flex justify-center py-4'>
                  {isFetchingNextPage && <div className='text-sm text-grey-500'>연락처를 더 불러오는 중...</div>}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* 사이드 시트 */}
      <SideSheet isOpen={isAddContactOpen} onClose={handleClose}>
        <AddContactForm onClose={handleClose} />
      </SideSheet>
    </div>
  );
}
