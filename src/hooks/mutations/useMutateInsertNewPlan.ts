import { mutateInsertNewPlan } from '@/app/api/supabase/service';
import { QUERY_KEY } from '@/constants/queryKey';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useMutateInsertNewPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutateInsertNewPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PLANS],
        predicate: (query) => query.queryKey[0] === QUERY_KEY.PLANS,
      });
    },
  });
};

export default useMutateInsertNewPlan;
