import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContactFormValues } from '@/lib/schemas/contactFormSchema';
import { UsersThree } from '@phosphor-icons/react';
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface RelationshipSelectorProps {
  relationshipType: string;
  setRelationshipType: (value: string) => void;
  setValue: UseFormSetValue<ContactFormValues>;
}

const RelationshipSelector = ({ relationshipType, setRelationshipType, setValue }: RelationshipSelectorProps) => {
  // 관계 유형 변경 처리
  const handleRelationshipChange = (value: string) => {
    setRelationshipType(value);
    setValue('relationshipType', value);
  };

  const relationshipOptions = [
    { value: '소울메이트', label: '소울메이트' },
    { value: '절친', label: '절친' },
    { value: '친구', label: '친구' },
    { value: '지인', label: '지인' },
    { value: '비즈니스', label: '비즈니스' },
  ];

  return (
    <div className='mb-10 mt-10'>
      <div className='flex items-start gap-4'>
        {/* 왼쪽: 아이콘 + 라벨 */}
        <div className='flex w-24 flex-col items-center'>
          <UsersThree size={24} className='mb-1 text-gray-600' />
          <div className='text-sm'>관계</div>
        </div>

        {/* 오른쪽: 드롭다운 */}
        <div className='flex-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>{relationshipType}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>관계 유형 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={relationshipType} onValueChange={handleRelationshipChange}>
                  {relationshipOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default RelationshipSelector;
