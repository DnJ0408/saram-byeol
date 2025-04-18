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
    <div className='flex items-center justify-center gap-[78px]'>
      <button type='button' onClick={googleSignin}>
        <Image src='/google_login_img.png' alt='google login img' width={300} height={45} />
      </button>
      <button type='button' onClick={kakaoSignin}>
        <Image src='/kakao_login_img.png' alt='kakao login img' width={300} height={45} />
      </button>
    </div>
  );
};

export default SigninSocial;
