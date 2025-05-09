import React, { useCallback, useEffect } from 'react';
import DateInputField from '@/components/plans/DateInputField';
import { Input } from '@/components/ui/input';
import { Form, FormField } from '@/components/ui/form';
import ContactsField from '@/components//plans/ContactsField';
import useMutateInsertNewPlan from '@/hooks/mutations/useMutateInsertNewPlan';
import { PlanFormType } from '@/lib/schemas/plansSchema';
import { mappingFormData } from '@/lib/planFormUtils';
import { toast } from 'react-toastify';
import { TextAa } from '@phosphor-icons/react';
import { useFormContext } from 'react-hook-form';
import { useAuthStore } from '@/store/zustand/store';
import { usePlanFormStore } from '@/store/zustand/usePlanFormStore';
import { useDemoStore } from '@/store/zustand/useDemoStore';

interface Props {
  selectedColor: string;
  onOpenFullForm: () => void; // PlanForm을 여는 함수
  onClosePopOver: () => void; // 팝오버를 닫는 함수
}

const PopOverForm = ({ selectedColor, onOpenFullForm, onClosePopOver }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { isDemoUser, demoUser } = useDemoStore();
  const form = useFormContext<PlanFormType>();
  const { mutate: insertNewPlan, isPending } = useMutateInsertNewPlan();
  const userId = user?.id || demoUser.id;

  // 팝오버에 작성된 내용
  const { setInitialFormData, clearFormData } = usePlanFormStore();

  // "옵션 더보기" 클릭 시 실행되는 함수
  const handleShowFullForm = () => {
    const currentData = form.getValues();
    setInitialFormData(currentData);
    // 팝오버 닫고 PlanForm 열기
    onClosePopOver(); // 팝오버 닫기
    onOpenFullForm(); // PlanForm 열기
  };

  const planSubmitHandler = useCallback(
    (data: PlanFormType) => {
      if (isDemoUser) {
        toast.info('데모체험중에는 제한된 기능입니다.');
        return;
      }
      if (!user) return null;
      const inputData = mappingFormData(data);
      insertNewPlan(
        { user_id: user.id, ...inputData, colors: selectedColor }, //새로운 일정 추가 시 색상 포함
        {
          onSuccess: () => {
            form.reset();
            toast.success('약속이 추가되었습니다.');
            clearFormData();
          },
          onError: () => {
            toast.error('약속 저장에 실패했습니다.');
          },
        }
      );
    },
    [insertNewPlan, form, selectedColor, user, clearFormData, isDemoUser]
  );

  useEffect(() => {
    form.setValue('colors', selectedColor); // 색상 업데이트
  }, [selectedColor, form]);

  return (
    <div>
      <form onSubmit={form.handleSubmit(planSubmitHandler)}>
        <fieldset disabled={isPending} className='grid gap-8'>
          <Form {...form}>
            <section className='flex items-center gap-8'>
              <div className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
                <TextAa size={24} />
                <p className='min-w-max text-[14px]'>제목</p>
              </div>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => <Input type='text' placeholder='제목' {...field} />}
              />
            </section>
            <DateInputField />
            <ContactsField userId={userId} enabled={!!userId} />
            <div className='flex justify-between'>
              <button
                type='button'
                onClick={handleShowFullForm}
                className='items-center justify-center rounded-[6px] border-[1px] border-primary-500 bg-primary-50 px-5 py-3 font-bold text-primary-500'
              >
                옵션 더보기
              </button>
              <button
                type='submit'
                disabled={isPending}
                className='w-[121px] items-center justify-center rounded-[6px] border-[1px] bg-primary-500 px-5 py-3 text-[14px] font-bold text-grey-0'
              >
                {isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </Form>
        </fieldset>
      </form>
    </div>
  );
};

export default PopOverForm;
