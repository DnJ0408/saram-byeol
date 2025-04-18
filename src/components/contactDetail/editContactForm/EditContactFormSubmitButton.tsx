import { Button } from '@/components/ui/button';
import React from 'react';

interface EditContactFormSubmitButtonProps {
  isSubmitting: boolean;
}

const EditContactFormSubmitButton = ({ isSubmitting }: EditContactFormSubmitButtonProps) => {
  return (
    <div className='flex justify-end pt-10'>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? '수정 중...' : '수정'}
      </Button>
    </div>
  );
};

export default EditContactFormSubmitButton;
