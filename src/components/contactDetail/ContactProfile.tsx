import { ContactDetailType, PlanDetailType } from '@/types/contacts';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import SideSheet from '@/components/contacts/SideSheet';
import EditContactForm from '@/components/contactDetail/editContactForm/EditContactForm';
import { Button } from '@/components/ui/button';
import { useMutateDeleteContact } from '@/hooks/mutations/useMutateDeleteContact';
import { toast } from 'react-toastify';
import ContactPlansCard from '@/components/contactDetail/ContactPlansCard';
import { ConfirmToast } from '@/components/toast/ConfirmToast';

interface Props {
  contact: ContactDetailType;
  plans: PlanDetailType[];
}

const ContactProfile = ({ contact, plans }: Props) => {
  const [isEditContactOpen, setIsEditContactOpen] = useState(false); // 사이드시트 상태

  const { mutate: deleteContact } = useMutateDeleteContact();

  const deleteContactHandler = () => {
    ConfirmToast({
      message: '정말로 해당 사람을 삭제하시겠습니까?',
      onConfirm: () => {
        deleteContact(contact.contacts_id, {
          onSuccess: () => {
            toast.success('성공적으로 삭제되었습니다.');
          },
          onError: (error) => {
            console.error(error);
            toast.error('삭제에 실패했습니다.');
          },
        });
      },
    });
  };

  return (
    <div className='space-y-8'>
      {/* 상단 프로필 + 기본 정보 */}
      <div className='flex items-start justify-between'>
        {/* 좌측 - 프로필 이미지 */}
        <div className='relative flex items-center space-x-[-10px]'>
          <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-200'>
            {contact.contacts_profile_img ? (
              <Image
                src={contact.contacts_profile_img}
                alt={contact.name}
                width={96}
                height={96}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-lg font-bold text-white'>
                <Plus className='absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2' />
              </div>
            )}
          </div>
        </div>

        {/* 중앙 - 이름 및 이메일 */}
        <div className='flex flex-1 flex-col ml-2'>
          <h1 className='text-xl font-bold leading-tight'>{contact.name}</h1>
          <div className='mt-1 flex h-6 w-16 items-center justify-center rounded-2xl bg-yellow-300'>
            <span className='text-xs font-bold text-gray-800'>{contact.relationship_level}</span>
          </div>
          <p className='text-sm text-gray-600 mt-1'>{contact.email}</p>
        </div>

        {/* 우측 버튼 */}
        <div className='space-x-2'>
          <Button variant='outline' size='sm' onClick={() => setIsEditContactOpen(true)}>
            수정
          </Button>
          <Button variant='destructive' size='sm' onClick={deleteContactHandler}>
            삭제
          </Button>
        </div>
      </div>

      <div className='flex flex-wrap gap-8'>
        {/* 연락처 정보 */}
        <div className='min-w-[280px] space-y-2'>
          <h2 className='mb-2 text-lg font-bold'>연락처</h2>
          <p>
            <strong className='inline-block w-20 text-gray-600'>전화번호</strong> {contact.phone}
          </p>
          <p>
            <strong className='inline-block w-20 text-gray-600'>이메일</strong> {contact.email}
          </p>
          <p>
            <strong className='inline-block w-20 text-gray-600'>생년월일</strong> {contact.birth}
          </p>
          <p>
            <strong className='inline-block w-20 text-gray-600'>메모</strong> {contact.notes}
          </p>
        </div>

        {/* 다가오는 약속 */}
        {plans.length > 0 && (
          <div className='flex-1'>
            <h2 className='mb-2 text-lg font-bold'>다가오는 약속</h2>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {plans.map((plan) => (
                <ContactPlansCard key={plan.plan_id} title={plan.title} startDate={plan.start_date} color={plan.colors} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 사이드 시트 - 연락처 수정 */}
      <SideSheet isOpen={isEditContactOpen} onClose={() => setIsEditContactOpen(false)} title='내 사람 수정'>
        <EditContactForm contactData={contact} onClose={() => setIsEditContactOpen(false)} />
      </SideSheet>
    </div>
  );
};

export default ContactProfile;
