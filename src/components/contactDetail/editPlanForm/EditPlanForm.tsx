import ColorOptions from '@/components/calendar/popOver/ColorOptions';
import ContactsField from '@/components/plans/ContactsField';
import DateInputField from '@/components/plans/DateInputField';
import DetailField from '@/components/plans/DetailField';
import PlaceField from '@/components/plans/PlaceField';
import PriorityField from '@/components/plans/PriorityField';
import TitleField from '@/components/plans/TitleField';
import { Button } from '@/components/ui/button';
import { useMutateUpdatePlan } from '@/hooks/mutations/useMutateUpdatePlan';
import { mappingFormData } from '@/lib/planFormUtils';
import { PlanFormType, PlansSchema } from '@/lib/schemas/plansSchema';
import { useAuthStore } from '@/store/zustand/store';
import { useDemoStore } from '@/store/zustand/useDemoStore';
import { EditPlanType } from '@/types/plans';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
  plan: EditPlanType;
  onClose: (updatedPlan: EditPlanType | null) => void;
}

const convertToFormValues = (plan: EditPlanType): PlanFormType => ({
  title: plan.title || '',
  detail: plan.detail || '',
  contacts: plan.contacts_id || '',
  priority: plan.priority || '',
  dateInput: {
    from: new Date(plan.start_date),
    to: new Date(plan.end_date),
  },
  location: {
    place_name: plan.location?.place_name || '',
    road_address_name: plan.location?.road_address_name || '',
    place_url: plan.location?.place_url || '',
    id: plan.location?.id || '',
    phone: plan.location?.phone || '',
    x: plan.location?.x || '',
    y: plan.location?.y || '',
  },
  colors: plan.colors ?? '',
});

const EditPlanForm = ({ plan, onClose }: Props) => {
  const user = useAuthStore((state) => state.user);
  const [inputValue, setInputValue] = useState(plan.location?.place_name || '');
  const [selectedColor, setSelectedColor] = useState(plan.colors || '#2F80ED');
  const { isDemoUser, demoUser } = useDemoStore();
  const userId = user?.id || demoUser.id;
  const form = useForm<PlanFormType>({
    resolver: zodResolver(PlansSchema),
    mode: 'onChange',
    defaultValues: convertToFormValues(plan),
  });

  useEffect(() => {
    if (plan) {
      form.reset(convertToFormValues(plan));
    }
  }, [plan, form]);

  const handleCancel = () => {
    onClose(null);
  };

  const { mutate: updatePlan } = useMutateUpdatePlan();

  const editPlanHandler = (data: PlanFormType) => {
    if (!!isDemoUser) {
      toast.info('데모체험중에는 제한된 기능입니다.');
      handleCancel();
      return;
    }
    const formData = mappingFormData(data);
    const updatedForm = { ...formData, colors: selectedColor };

    const { start_date, end_date, ...restFormData } = updatedForm;

    updatePlan(
      { planId: plan.plan_id, updatedData: { ...restFormData, user_id: plan.user_id, start_date, end_date } },
      {
        onSuccess: () => {
          toast.success('약속이 수정되었습니다.');

          const updatedPlan = {
            ...plan,
            ...restFormData,
            detail: restFormData.detail ?? '',
            priority: restFormData.priority ?? '',
            start_date,
            end_date,
          };

          onClose(updatedPlan);
        },
        onError: () => toast.error('약속 수정에 실패했습니다.'),
      }
    );
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(editPlanHandler)} className='flex flex-col justify-start gap-9'>
        <ColorOptions selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        <TitleField />
        <ContactsField userId={userId} enabled={true} />
        <DateInputField />
        <PlaceField inputValue={inputValue} setInputValue={setInputValue} />
        <PriorityField />
        <DetailField />
        <div className='flex w-full flex-row items-center justify-center gap-4'>
          <Button type='button' variant='outline' onClick={handleCancel} className='flex-1'>
            취소
          </Button>
          <Button type='submit' disabled={form.formState.isSubmitting} className='flex-1'>
            수정
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditPlanForm;
