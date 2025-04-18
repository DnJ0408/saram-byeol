import { getUserPlans } from '@/app/api/supabase/service';
import { useAuthStore } from '@/store/zustand/store';
import React, { useEffect, useState } from 'react';

const UpcomingPlanButton = ({ onClick }: { onClick: () => void }) => {
  const user = useAuthStore((state) => state.user);
  const [upcomingCount, setUpcomingCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      if (user?.id) {
        const upcomingPlans = await getUserPlans(user.id);
        setUpcomingCount(upcomingPlans.length); // 데이터 도착한 후에만 업데이트
      }
    };
    fetchPlans();
  }, [user?.id]);

  return (
    <div>
      <button onClick={onClick} className='mr-[24px] rounded-md border-[1px] px-[20px] py-[12px] text-[14px] font-bold'>
        다가오는 약속
        <span className='m-1 rounded-full bg-black px-1 text-white'>
          {upcomingCount !== null ? upcomingCount : '-'}
        </span>
      </button>
    </div>
  );
};

export default UpcomingPlanButton;
