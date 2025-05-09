import { useMutateDeleteSelectPlan } from '@/hooks/mutations/useMutateDeleteSelectPlan';
import { SelectPlanType } from '@/types/plans';
import { CalendarBlank, MapPin, Star, TextAa, TextAlignLeft, User } from '@phosphor-icons/react';
import React from 'react';
import { ConfirmToast } from '../toast/ConfirmToast';
import { toast } from 'react-toastify';
import { useDemoStore } from '@/store/zustand/useDemoStore';
import { Button } from '@/components/ui/button';

interface SelectPlanProps {
  plans: SelectPlanType[];
  onEdit: () => void;
  onDeleteSuccess: () => void;
}

const SelectPlan = ({ plans, onEdit, onDeleteSuccess }: SelectPlanProps) => {
  const { mutate } = useMutateDeleteSelectPlan();
  const { isDemoUser } = useDemoStore();

  const deletePlanHandler = (planId: string) => {
    if (isDemoUser) {
      toast.info('데모체험중에는 제한된 기능입니다.');
      return;
    }
    ConfirmToast({
      message: '정말로 해당 약속을 삭제하시겠습니까?',
      onConfirm: () => {
        mutate(planId, {
          onSuccess: () => {
            toast.success('성공적으로 삭제되었습니다.');
            onDeleteSuccess();
          },
          onError: () => {
            toast.error('삭제에 실패했습니다.');
          },
        });
      },
    });
  };

  // 'YYYY-MM-DD' 형식으로 반환
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // 중요도 변환
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '중간';
      case 'low':
        return '낮음';
      default:
        return '없음';
    }
  };

  return (
    <div>
      <div className='max-h-[calc(100vh-2rem)] space-y-4 overflow-auto'>
        <div className='space-y-3'>
          {plans.map((plan) => (
            <div key={plan.plan_id} className='space-y-9'>
              <section className='flex items-center gap-8'>
                <div className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
                  <TextAa size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />
                  <p className='text-center text-sm'>제목</p>
                </div>
                <p>{plan.title}</p>
              </section>
              <section className='flex items-center gap-8'>
                <div className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
                  <User size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />{' '}
                  <p className='text-center text-sm'>내 사람</p>
                </div>
                <p>{plan.contacts?.name ?? '없음'}</p>
              </section>
              <section className='flex items-center gap-8'>
                <div className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
                  <CalendarBlank className='h-6 w-6 flex-shrink-0 flex-grow-0' />
                  <p className='text-center text-sm'>약속</p>
                </div>
                <p>
                  {formatDate(plan.start_date)} ~ {formatDate(plan.end_date)}
                </p>
              </section>
              <section className='flex items-center gap-8'>
                <div className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
                  <MapPin size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />
                  <p className='text-center text-sm'>장소</p>
                </div>
                <p>{plan.location?.place_name ?? '없음'}</p>
              </section>
              <section className='flex items-center gap-8'>
                <div className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
                  <Star size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />
                  <p className='text-center text-sm'>중요도</p>
                </div>
                <p>{getPriorityLabel(plan.priority)}</p>
              </section>
              <section className='flex gap-8'>
                <div className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center gap-1'>
                  <TextAlignLeft size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />
                  <p className='text-center text-sm'>내용</p>
                </div>
                <p className='w-[200px]'>{plan.detail}</p>
              </section>
              <section className='mt-12 flex gap-4'>
                <Button
                  type='button'
                  variant={'outline'}
                  onClick={() => deletePlanHandler(plan.plan_id)}
                  className='min-h-12 flex-1 border border-grey-500 px-6 py-4 font-bold hover:bg-grey-50 active:bg-grey-100'
                >
                  삭제
                </Button>
                <Button
                  type='button'
                  variant={'outline'}
                  onClick={onEdit}
                  className='min-h-12 flex-1 bg-primary-500 px-6 py-4 font-bold text-white hover:bg-primary-600 hover:text-white active:bg-primary-700'
                >
                  수정
                </Button>
              </section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
