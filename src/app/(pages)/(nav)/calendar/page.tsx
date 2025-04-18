'use client';
import MainCalendar from '@/components/calendar/MainCalendar';
import SelectPlan from '@/components/calendar/SelectPlan';
import PlanForm from '@/components/plans/PlanForm';
import EditPlanForm from '@/components/contactDetail/editPlanForm/EditPlanForm';
import UpcomingPlans from '@/components/schedule/UpcomingPlans';
import { SIGNIN } from '@/constants/paths';
import { useAuthStore } from '@/store/zustand/store';
import { SelectPlanType } from '@/types/plans';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { usePlanFormStore } from '@/store/zustand/usePlanFormStore';
import { planFormDefaultValues } from '@/lib/schemas/plansSchema';

export default function Calendar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isSignIn = useAuthStore((state) => state.isSignIn);

  const [hasMounted, setHasMounted] = useState(false);
  const [selectPlan, setSelectPlan] = useState<SelectPlanType[] | null>(null);
  const [showUpcoming, setShowUpcoming] = useState(true);

  const [editPlan, setEditPlan] = useState<SelectPlanType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  //옵션 더보기
  const { initialFormData, setInitialFormData } = usePlanFormStore();
  // showPlanForm 상태와 setShowPlanForm 함수 가져오기
  const { showPlanForm, setShowPlanForm } = usePlanFormStore();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isSignIn) {
      router.replace(SIGNIN);
    }
  }, [hasMounted, isSignIn, router]);

  if (!hasMounted || !isSignIn) return null;

  return (
    <div className='flex flex-col gap-4 p-4 md:flex-row'>
      <div className='md:flex-grow'>
        <MainCalendar
          setSelectPlan={(plan) => {
            setSelectPlan(plan);
            setShowUpcoming(false);
            setShowPlanForm(false);
            setIsEditMode(false);
            setEditPlan(null);
          }}
          CustomToolbarProps={{
            onShowUpcomingPlans: () => {
              setSelectPlan(null);
              setShowUpcoming(true);
              setShowPlanForm(false);
              setIsEditMode(false);
              setEditPlan(null);
            },
            onAddPlan: () => {
              setSelectPlan(null);
              setShowUpcoming(false);
              setShowPlanForm(true);
              setIsEditMode(false);
              setEditPlan(null);
              setInitialFormData(planFormDefaultValues);
            },
          }}
        />
      </div>

      <div className='flex-shrink-0 md:w-auto'>
        {showPlanForm ? (
          <>
            <h2 className='mb-4 text-xl font-bold'>약속 추가</h2>
            <div className='m-5'>
              <PlanForm initialValues={initialFormData ?? undefined} handleCancel={setShowPlanForm}/>
            </div>
          </>
        ) : isEditMode && editPlan ? (
          <>
            <h2 className='mb-4 text-xl font-bold'>약속 수정</h2>
            <div className='m-5'>
              <EditPlanForm
                plan={editPlan}
                onClose={() => {
                  setIsEditMode(false);
                  setEditPlan(null);
                  setSelectPlan(null);
                }}
              />
            </div>
          </>
        ) : selectPlan ? (
          <>
            <h2 className='mb-4 text-xl font-bold'>약속 디테일</h2>
            <div className='p-12'>
              <SelectPlan
                plans={selectPlan}
                onEdit={() => {
                  setIsEditMode(true);
                  setEditPlan(selectPlan[0]);
                }}
              />
            </div>
          </>
        ) : (
          showUpcoming && user?.id && <UpcomingPlans userId={user.id} onSelectPlan={(plan) => setSelectPlan([plan])} />
        )}
      </div>
    </div>
  );
}
