import { getMonthlyPlans } from '@/app/api/supabase/service';
import { QUERY_KEY } from '@/constants/queryKey';
import { CalendarEventType, PlansType } from '@/types/plans';
import { useQuery } from '@tanstack/react-query';

export const useGetCalendarPlans = (year: number, monthDate: Date) => {
  const month = monthDate.getMonth() + 1; // Date 객체 -> 숫자 전환

  return useQuery<CalendarEventType[]>({
    queryKey: [QUERY_KEY.PLANS, year, month], //달마다 캐싱
    queryFn: async () => {
      const plans: PlansType[] = await getMonthlyPlans(year, month); // supabase에서 plans 데이터 가져오기

      // 캘린더에 적용되도록 데이터 가공하기
      const events: CalendarEventType[] = plans.map((plan) => ({
        id: plan.plan_id,
        title: plan.title,
        start: new Date(plan.start_date),
        end: new Date(plan.end_date),
        colors: plan.colors,
      }));
      return events;
    },
    staleTime: 24 * 60 * 60 * 1000, // 1일
  });
};
