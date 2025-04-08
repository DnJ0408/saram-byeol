'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/zustand/store';
import { emailDuplicateTest, mutateSignUp, NicknameDuplicateTest } from '@/app/api/supabase/service';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_NICKNAME,
  PLACEHOLDER_PASSWORD,
  PLACEHOLDER_PASSWORD_CHECK,
} from '@/constants/placeholders';
import { PEOPLE } from '@/constants/paths';
import { useState } from 'react';

export interface SignUpFormType {
  email: string;
  password: string;
  nickname: string;
  passwordCheck: string;
}

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '올바른 이메일 형식을 입력해주세요.' }),

    password: z
      .string()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .regex(/[!@#$%^&*]/, {
        message: '하나 이상의 특수문자가 포함되어야 합니다.',
      })
      .min(8, { message: '8자 이상으로 입력해주세요.' }),

    passwordCheck: z.string().min(1, { message: '비밀번호를 다시 입력해주세요.' }),

    nickname: z
      .string()
      .min(1, { message: '닉네임을 입력해주세요.' })
      .min(2, { message: '2자 이상으로 입력해주세요.' })
      .regex(/^[A-Za-z0-9가-힣\s]+$/, {
        message: '띄어쓰기를 제외한 특수문자를 사용할 수 없습니다.',
      }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    path: ['passwordCheck'],
    message: '비밀번호가 일치하지 않습니다.',
  });

const SignUp = () => {
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);
  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);

  const { register, handleSubmit, getValues, formState } = useForm<SignUpFormType>({
    mode: 'onChange',
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const onSignUpHandler = async (value: SignUpFormType) => {
    if (!isEmailChecked || !isNicknameChecked) {
      alert('이메일과 닉네임 중복 검사를 완료해주세요.');
      return;
    }

    const { data, error } = await mutateSignUp(value);
    if (data.user) {
      setUser(data.user);
      alert(`회원가입이 완료되었습니다. 자동으로 로그인되어 '내 사람' 페이지로 이동합니다.`);
      router.push(PEOPLE);
    } else if (error) {
      alert('입력한 정보를 다시 한 번 확인해주세요.');
    }
  };

  const NicknameDuplicateTestHandler = async () => {
    const nickname = getValues('nickname');
    const data = await NicknameDuplicateTest(nickname);

    if (data) {
      alert('중복된 닉네임이 존재합니다.');
      setIsNicknameChecked(false);
    } else if (formState.errors.nickname) {
      alert('닉네임 형식을 확인해주세요.');
      setIsNicknameChecked(false);
    } else {
      alert('사용가능한 닉네임입니다.');
      setIsNicknameChecked(true);
    }
  };

  const EmailDuplicateTestHandler = async () => {
    const email = getValues('email');
    const data = await emailDuplicateTest(email);

    if (data) {
      alert('중복된 이메일이 존재합니다.');
      setIsEmailChecked(false);
    } else if (formState.errors.email) {
      alert('이메일 형식을 확인해주세요.');
      setIsEmailChecked(false);
    } else {
      alert('사용가능한 이메일입니다.');
      setIsEmailChecked(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSignUpHandler)}>
      <div className='flex flex-col'>
        <section>
          <label htmlFor='nickname'>닉네임</label>
          <input type='text' id='nickname' maxLength={8} placeholder={PLACEHOLDER_NICKNAME} {...register('nickname')} />
          <button type='button' onClick={NicknameDuplicateTestHandler}>
            중복 검사
          </button>
        </section>
        {formState.errors.nickname ? (
          <span>{formState.errors.nickname.message}</span>
        ) : (
          <span>2자 이상 8자 이하로 입력해주세요.</span>
        )}
      </div>

      <div className='flex flex-col'>
        <section>
          <label htmlFor='email'>이메일</label>
          <input type='email' id='email' placeholder={PLACEHOLDER_EMAIL} {...register('email')} />
          <button type='button' onClick={EmailDuplicateTestHandler}>
            중복 검사
          </button>
        </section>
        {formState.errors.email && <span>{formState.errors.email.message}</span>}
      </div>

      <div className='flex flex-col'>
        <section>
          <label htmlFor='password'>비밀번호</label>
          <input type='password' id='password' placeholder={PLACEHOLDER_PASSWORD} {...register('password')} />
        </section>
        {formState.errors.password ? (
          <span>{formState.errors.password.message}</span>
        ) : (
          <span>특수문자(!@#$%^&*)를 1개 이상 포함하여 입력해주세요.</span>
        )}
      </div>

      <div className='flex flex-col'>
        <section>
          <label htmlFor='passwordCheck'>비밀번호 확인</label>
          <input
            type='password'
            id='passwordCheck'
            placeholder={PLACEHOLDER_PASSWORD_CHECK}
            {...register('passwordCheck')}
          />
        </section>
        {formState.errors.passwordCheck && <span>{formState.errors.passwordCheck.message}</span>}
      </div>

      <button type='submit'>회원가입</button>
    </form>
  );
};

export default SignUp;
