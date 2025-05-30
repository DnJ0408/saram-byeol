'use client';

import { signInWithGoogle, signInWithKakao } from '@/app/api/supabase/service';
import Image from 'next/image';
import React from 'react';
import { toast } from 'react-toastify';

const SigninSocial = () => {
  //구글 로그인 기능 핸들러
  const googleSignin = async () => {
    const error = await signInWithGoogle();

    if (error) toast.warning('구글 로그인에 실패했습니다. 새로고침 후 다시 시도해주세요.');
  };

  //카카오 로그인 기능 핸들러
  const kakaoSignin = async () => {
    const error = await signInWithKakao();

    if (error) toast.warning('카카오 로그인에 실패했습니다. 새로고침 후 다시 시도해주세요.');
  };

  return (
    <div className='flex flex-col gap-4 md:flex md:flex-row md:items-center md:justify-center md:gap-[78px]'>
      <button type='button' onClick={googleSignin} className='h-full w-full md:w-[300px]'>
        <Image src='/google_login_img.png' alt='google login img' width={300} height={45} className='h-[45px]' />
      </button>
      <button type='button' onClick={kakaoSignin} className='h-full w-full md:w-[300px]'>
        <Image src='/kakao_login_img.png' alt='kakao login img' width={300} height={45} />
      </button>
    </div>
  );
};

export default SigninSocial;
