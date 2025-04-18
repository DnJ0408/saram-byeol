'use client';

import { PlanDetailType } from '@/types/contacts';
import ContactPlansCard from '@/components/contactDetail/ContactPlansCard';
import { useState } from 'react';
import SideSheet from '@/components/contacts/SideSheet';
import EditPlanForm from '@/components/contactDetail/editPlanForm/EditPlanForm';
import { EditPlanType } from '@/types/plans';
import { useMutateDeletePlan } from '@/hooks/mutations/useMutateDeletePlan';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import PlanForm from '@/components/plans/PlanForm';
import { ConfirmToast } from '../toast/ConfirmToast';

interface Props {
  plans: PlanDetailType[];
}

const ContactPlans = ({ plans }: Props) => {
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetailType | null>(null);

  const { mutate: deletePlan } = useMutateDeletePlan();

  const editPlanHandler = (plan: PlanDetailType) => {
    setSelectedPlan(plan);
    setIsEditPlanOpen(true);
  };

  const deletePlanHandler = (planId: string) => {
    ConfirmToast({
      message: '정말로 해당 약속을 삭제하시겠습니까?',
      onConfirm: () => {
        deletePlan(planId, {
          onSuccess: () => {
            toast.success('성공적으로 삭제되었습니다.');
          },
          onError: () => {
            toast.error('삭제에 실패했습니다.');
          },
        });
      },
    });
  };

  return (
    <div>
      {/* 타이틀 & 추가 버튼 라인 */}
      <div className='mb-4 flex items-center gap-12'>
        <h2 className='text-xl font-semibold'>약속 전체보기</h2>
        <Button variant='outline' size='sm' onClick={() => setIsAddPlanOpen(true)}>
          약속 추가
        </Button>
      </div>

      {/* 약속 카드 목록 */}
      {plans.length === 0 ? (
        <p>등록된 약속이 없습니다.</p>
      ) : (
        <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {plans.map((plan) => (
            <li key={plan.plan_id}>
              <ContactPlansCard
                title={plan.title}
                startDate={plan.start_date}
                color={plan.colors}
                onEdit={() => editPlanHandler(plan)}
                onDelete={() => deletePlanHandler(plan.plan_id)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* 사이드 시트 - 약속 추가 */}
      <SideSheet isOpen={isAddPlanOpen} onClose={() => setIsAddPlanOpen(false)} title='약속 추가'>
        <PlanForm />
      </SideSheet>

      {/* 사이드 시트 - 약속 수정 */}
      <SideSheet isOpen={isEditPlanOpen} onClose={() => setIsEditPlanOpen(false)} title='약속 수정'>
        {selectedPlan ? (
          <EditPlanForm plan={selectedPlan as EditPlanType} onClose={() => setIsEditPlanOpen(false)} />
        ) : (
          <p>수정할 약속을 선택해주세요.</p>
        )}
      </SideSheet>
    </div>
  );
};

export default ContactPlans;
