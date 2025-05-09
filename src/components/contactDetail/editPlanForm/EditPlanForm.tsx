'use client';

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
import { getContacts } from '@/app/api/supabase/service';
import { ContactItemType } from '@/types/contacts';

interface Props {
  plan: EditPlanType;
  onClose: (updatedPlan: EditPlanType | null) => void;
}

const EditPlanForm = ({ plan, onClose }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { isDemoUser, demoUser } = useDemoStore();
  const userId = user?.id || demoUser.id;

  const [inputValue, setInputValue] = useState(plan.location?.place_name || '');
  const [selectedColor, setSelectedColor] = useState(plan.colors || '#2F80ED');
  const [contactsId, setContactsId] = useState<string>(''); // 실제 선택된 contacts_id

  useEffect(() => {
    const fetchContactsId = async () => {
      if (plan.contacts?.name && !plan.contacts.contacts_id) {
        try {
          const allContacts: ContactItemType[] = await getContacts(userId);
          const matched = allContacts.find((c) => c.name === plan.contacts?.name);
          if (matched) {
            setContactsId(matched.contacts_id);
          }
        } catch (e) {
          console.error('연락처 불러오기 실패', e);
        }
      } else if (plan.contacts?.contacts_id) {
        setContactsId(plan.contacts.contacts_id);
      }
    };
    fetchContactsId();
  }, [plan.contacts, userId]);

  const form = useForm<PlanFormType>({
    resolver: zodResolver(PlansSchema),
    mode: 'onChange',
    defaultValues: {
      title: plan.title || '',
      detail: plan.detail || '',
      contacts: '',
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
    },
  });

  useEffect(() => {
    if (contactsId) {
      form.setValue('contacts', contactsId);
    }
  }, [contactsId, form]);

  useEffect(() => {
    if (plan && contactsId) {
      form.reset({
        title: plan.title || '',
        detail: plan.detail || '',
        contacts: contactsId,
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
      setInputValue(plan.location?.place_name || '');
      setSelectedColor(plan.colors || '#2F80ED');
    }
  }, [plan, contactsId, form]);
  
  
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
      {
        planId: plan.plan_id,
        updatedData: {
          ...restFormData,
          user_id: plan.user_id,
          start_date,
          end_date,
        },
      },
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
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            className='min-h-12 flex-1 border border-grey-500 px-6 py-4 font-bold hover:bg-grey-50 active:bg-grey-100'
          >
            취소
          </Button>
          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='min-h-12 flex-1 bg-primary-500 px-6 py-4 font-bold text-white hover:bg-primary-600 hover:text-white active:bg-primary-700'
          >
            수정
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditPlanForm;
