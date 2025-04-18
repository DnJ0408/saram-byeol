import { mutateUpdatePlan } from '@/app/api/supabase/service';
import { InsertNewPlansType } from '@/types/plans';
import { QUERY_KEY } from '@/constants/queryKey';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  planId: string;
  updatedData: InsertNewPlansType;
}

export const useMutateUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, updatedData }: Props) => mutateUpdatePlan(planId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONTACT_WITH_PLANS] });
    },
    onError: (error) => {
      console.error('약속 수정 중 오류 발생:', error);
    },
  });
};
