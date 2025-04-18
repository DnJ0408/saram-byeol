import { useQuery } from '@tanstack/react-query';
import { getContactsWithPlans } from '@/app/api/supabase/service';
import ContactProfile from '@/components/contactDetail/ContactProfile';
import ContactPlans from '@/components/contactDetail/ContactPlans';
import Tabs from '@/components/ui/Tabs';
import { useAuthStore } from '@/store/zustand/store';

interface Props {
  contactsId: string;
}

const PeopleDetailPanel = ({ contactsId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const { data, isPending, error } = useQuery({
    queryKey: ['contactWithPlans', contactsId],
    queryFn: () => getContactsWithPlans(userId!, contactsId),
    enabled: !!userId && !!contactsId,
  });

  if (isPending) return <div className='flex h-full items-center justify-center p-8 text-xl text-gray-500'>로딩 중...</div>;
  if (error) return <div className='flex h-full items-center justify-center p-8 text-xl text-gray-500'>내 사람 데이터를 불러오던 중 오류가 발생했습니다</div>;

  const { contact, plans } = data;

  return (
    <div className='container mx-auto px-4 pt-8'>
      <Tabs tabs={['내사람정보', '약속']}>
        {[<ContactProfile key='profile' contact={contact} plans={plans} />, <ContactPlans key='plans' plans={plans} />]}
      </Tabs>
    </div>
  );
};

export default PeopleDetailPanel;
