import { signInUser } from '@/app/api/supabase/service';
import { SignInFormType } from '@/components/signin/SigninForm';
import { PEOPLE } from '@/constants/paths';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export const useSignin = () => {
  const router = useRouter();

  //로그인 기능 핸들러
  const SignInHandler = async (value: SignInFormType) => {
    const { data, error } = await signInUser(value);
    if (data.session) {
      router.push(PEOPLE);
    } else if (error) {
      toast.warning('아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return { SignInHandler };
};
