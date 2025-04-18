import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import { UseFormSetValue } from 'react-hook-form';
import { ContactFormValues } from '@/lib/schemas/contactFormSchema';

interface EditProfileImageUploadProps {
  initialImage?: string | null; // 기존 이미지
  setValue: UseFormSetValue<ContactFormValues>;
}

const EditProfileImageUpload = ({ initialImage, setValue }: EditProfileImageUploadProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage || null);

  // 폼 초기 세팅
  useEffect(() => {
    if (initialImage) {
      setPreviewImage(initialImage);
      setValue('profileImage', initialImage);
    }
  }, [initialImage, setValue]);

  // 새 이미지 선택 시
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setValue('profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='mb-10 mt-10'>
      <div className='relative'>
        <input
          type='file'
          id='edit-profile-image'
          accept='image/*'
          className='hidden'
          onChange={handleFileSelect}
        />
        <label
          htmlFor='edit-profile-image'
          className='flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full bg-gray-200'
        >
          {previewImage ? (
            <div className='relative h-full w-full'>
              <Image src={previewImage} alt='프로필 이미지' fill className='rounded-full object-cover' />
            </div>
          ) : (
            <>
              <Camera className='mb-1 h-6 w-6 text-gray-500' />
              <span className='text-xs font-bold'>이미지 추가</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default EditProfileImageUpload;
