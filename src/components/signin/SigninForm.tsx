'use client';

import { FORGOT_PASSWORD } from '@/constants/paths';
import { PLACEHOLDER_EMAIL, PLACEHOLDER_PASSWORD } from '@/constants/placeholders';
import { useSignin } from '@/hooks/useSignin';
import { signInSchema } from '@/lib/schemas/signinSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export interface SignInFormType {
  email: string;
  password: string;
}

const SigninForm = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { register, handleSubmit, formState, setValue, getValues } = useForm<SignInFormType>({
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    const saved = localStorage.getItem('saved-email');
    setIsChecked(!!saved);
  }, []);

  // 컴포넌트가 마운트될 때 로컬스토리지에서 저장된 이메일을 불러와 이메일 필드에 초기값으로 설정
  useEffect(() => {
    const savedEmail = localStorage.getItem('saved-email') || '';
    setValue('email', savedEmail);
  }, [setValue]);

  //로그인 커스텀 훅
  const { SignInHandler } = useSignin(getValues, isChecked);

  return (
    <form onSubmit={handleSubmit(SignInHandler)} className='md: flex flex-col items-center justify-center md:gap-8'>
      <div className='mx-auto w-full max-w-[375px] px-5 md:max-w-full md:px-0'>
        <div className='mb-8 flex flex-col'>
          <div className='flex flex-col justify-start gap-1'>
            <label
              className={`self-stretch text-sm font-bold leading-[150%] ${formState.errors.email && getValues('email').length > 0 ? `text-status-error` : `text-grey-900`}`}
              htmlFor='email'
            >
              아이디(이메일)
            </label>
            <input
              className={`w-full flex-1 items-center gap-2 self-stretch rounded-lg border p-4 placeholder-grey-100 ${formState.errors.email && getValues('email').length > 0 ? `border-status-error focus:outline-none` : `border-grey-200`}`}
              type='email'
              id='email'
              placeholder={PLACEHOLDER_EMAIL}
              {...register('email')}
            />
          </div>
          {formState.errors.email && getValues('email').length > 0 && (
            <span className='self-stretch text-sm leading-[150%] text-status-error'>
              {formState.errors.email.message}
            </span>
          )}
        </div>
        <div className='flex flex-col'>
          <div className='flex flex-col justify-start gap-1'>
            <label
              className={`self-stretch text-sm font-bold leading-[150%] ${formState.errors.password && getValues('password').length > 0 ? `text-status-error` : `text-grey-900`}`}
              htmlFor='password'
            >
              비밀번호
            </label>
            <input
              className={`w-full flex-1 items-center gap-2 self-stretch rounded-lg border p-4 placeholder-grey-100 ${formState.errors.password && getValues('password').length > 0 ? `border-status-error focus:outline-none` : `border-grey-200`}`}
              type='password'
              id='password'
              placeholder={PLACEHOLDER_PASSWORD}
              {...register('password')}
            />
          </div>
          {formState.errors.password && getValues('password').length > 0 && (
            <span className='self-stretch text-sm leading-[150%] text-status-error'>
              {formState.errors.password.message}
            </span>
          )}
        </div>
      </div>
      <div className='mb-[22px] mt-9 flex w-full items-center justify-between px-5 md:mb-0 md:mt-0 md:flex md:justify-between md:px-0'>
        <label htmlFor='saveId' className='flex items-center justify-center text-sm md:text-base'>
          <input
            type='checkbox'
            id='saveId'
            checked={isChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsChecked(checked);
              if (checked) {
                toast.success('앞으로 로그인 정보가 저장됩니다.'); //체크박스를 체크하면 나오는 toast
              } else {
                toast.warning('앞으로 로그인 정보가 저장되지않습니다.'); //체크박스를 해제하면 나오는 toast
              }
            }}
            className='mr-2 h-5 w-5'
          />
          로그인 정보 저장
        </label>
        <Link href={FORGOT_PASSWORD} className='hidden md:block'>
          비밀번호를 잊어버리셨습니까?
        </Link>
        <Link href={FORGOT_PASSWORD} className='block text-sm md:hidden'>
          비밀번호 재설정
        </Link>
      </div>
      <div className='w-full px-[10px] md:px-0'>
        <button
          type='submit'
          className='duration-600 mx-auto w-full rounded-lg bg-primary-500 px-6 py-4 font-bold leading-[135%] text-white transition hover:bg-primary-600 active:bg-primary-700 md:w-[456px]'
        >
          로그인
        </button>
      </div>
    </form>
  );
};

export default SigninForm;
