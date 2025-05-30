import {
  ContactDetailType,
  ContactItemType,
  ContactWithPlansDetailType,
  fetchRegularInfiniteContacts,
} from '@/types/contacts';
import { supabase } from '@/app/api/supabase/client';
import { InsertNewPlansType, PlansType } from '@/types/plans';
import { CONTACTS, PLANS, USERS } from '@/constants/supabaseTable';
import { User } from '@supabase/supabase-js';
import { REDIRECT_TO, REDIRECT_TO_CHANGE_PASSWORD, REDIRECT_TO_FINISH_SIGNUP } from '@/constants/redirecturl';

export const getContacts = async (userId: string): Promise<ContactItemType[]> => {
  try {
    const { data, error } = await supabase
      .from(CONTACTS)
      .select('contacts_id, name, relationship_level, contacts_profile_img, is_pinned')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase에서 Contact 테이블 데이터를 가져오는 중 오류가 발생했습니다:', error);
      throw new Error('Supabase에서 Contact 테이블 데이터를 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }

    // 한국어 로케일을 사용한 정렬
    const sortedData = [...(data || [])].sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

    return sortedData;
  } catch (error) {
    console.error('연락처를 불러오는 중 오류가 발생했습니다:', error);
    throw new Error('연락처를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

export const getContactsWithPlans = async (userId: string, contactsId: string): Promise<ContactWithPlansDetailType> => {
  const { data, error } = await supabase
    .from(CONTACTS)
    .select(
      `
      contacts_id, user_id, name, email, relationship_level, notes, phone, birth, contacts_profile_img,
      plans:plans(plan_id, created_at, user_id, start_date, end_date, title, detail, priority, location, colors, contacts(name))
    `
    )
    .eq('contacts_id', contactsId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('연락처 정보를 가져오는 중 오류가 발생했습니다:', error);
    throw new Error('연락처 정보를 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }

  return { contact: data, plans: data.plans || [] };
};

// 회원가입
export const signUpUser = async (value: { email: string; password: string; nickname: string }) => {
  const { email, password, nickname } = value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname }, emailRedirectTo: REDIRECT_TO_FINISH_SIGNUP },
  });

  return { data, error };
};

// 로그인
export const signInUser = async (value: { email: string; password: string }) => {
  const { email, password } = value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

// 로그아웃
export const SignOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('로그아웃에 실패했습니다.', error);
    throw new Error('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// 입력한 닉네임과 일치하는 사용자 조회
export const NicknameDuplicateTest = async (nickname: string) => {
  const { data } = await supabase.from(USERS).select('nickname').eq('nickname', nickname).single();
  return data;
};

// 입력한 이메일과 일치하는 사용자 조회
export const emailDuplicateTest = async (email: string) => {
  const { data } = await supabase.from(USERS).select('email').eq('email', email).single();
  return data;
};

// 매 달의 plans 데이터 가져오기
export const getMonthlyPlans = async (user: User | null, year: number, month: number): Promise<PlansType[]> => {
  if (!user) {
    throw new Error('로그인된 사용자가 없습니다. 다시 시도해주세요.');
  }

  const startOfMonth = new Date(year, month - 1, 1); //첫 날
  const endOfMonth = new Date(year, month, 0); //마지막 날 (4/30 00:00:00)
  // 현재 start_date가 4/30 01:00 이기 때문에 연속 일정의 첫 날도 함께 포함시키기 위함
  endOfMonth.setHours(23, 59, 59, 999);

  const { data: plans, error } = await supabase
    .from(PLANS)
    .select('plan_id, user_id, contacts_id, title, detail, priority, start_date, end_date, colors')
    .eq('user_id', user.id)
    //해당 달의 데이터만 가져오기(넘어가는 연속 일정 포함)
    .lte('start_date', endOfMonth.toISOString()) // 일정이 달의 마지막 날과 같거나 이전에 시작
    .gte('end_date', startOfMonth.toISOString()); // 일정이 달의 첫 날보다 같거나 이후에 끝

  if (error) {
    console.error('캘린더 데이터를 불러오는 중 문제가 발생했습니다.', error);
    throw new Error('캘린더 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
  return plans;
};

// plans 데이터 업데이트 (캘린더 DnD)
export const updateEventInSupabase = async (id: string, { start, end }: { start: string; end: string }) => {
  const { error } = await supabase
    .from(PLANS)
    .update({
      start_date: start,
      end_date: end,
    })
    .eq('plan_id', id);

  if (error) {
    console.error('약속 업데이트에 실패했습니다.', error);
    throw new Error('약속 업데이트 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// plans - 약속추가
export const mutateInsertNewPlan = async (newPlan: InsertNewPlansType): Promise<PlansType> => {
  try {
    const { data: plan, error } = await supabase.from(PLANS).insert([newPlan]).select().single<PlansType>();
    if (error || !plan) throw new Error(`약속 추가 중 오류가 발생했습니다 : ${error.message}`);

    return plan;
  } catch (err) {
    console.error('약속 추가 중 문제가 발생했습니다.', err);
    throw new Error('약속 추가 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// contacts 데이터 저장하기
export const mutateInsertContacts = async (
  contactData: Omit<ContactDetailType, 'contacts_id'>
): Promise<ContactDetailType> => {
  try {
    const { data, error } = await supabase.from(CONTACTS).insert(contactData).select();

    if (error) {
      console.error('연락처 저장 중 오류가 발생했습니다:', error);
      throw new Error('연락처 저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    }

    return data[0];
  } catch (error) {
    console.error('연락처 저장 중 오류가 발생했습니다:', error);
    throw new Error('연락처 저장 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// contacts 데이터 수정
export const mutateUpdateContacts = async (
  contactsId: string,
  contactData: Omit<ContactDetailType, 'contacts_id'>
): Promise<void> => {
  try {
    const cleanedContactData = Object.fromEntries(
      Object.entries(contactData).map(([key, value]) => {
        return [key, value === '' ? null : value];
      })
    );

    const { error } = await supabase.from(CONTACTS).update(cleanedContactData).eq('contacts_id', contactsId);

    if (error) {
      console.error('연락처 수정 중 오류가 발생했습니다:', error);
      throw new Error('연락처 수정 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('연락처 수정 중 오류가 발생했습니다:', error);
    throw new Error('연락처 수정 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// 핀 업데이트 함수
export const mutateUpdateContactPin = async (contactId: string, isPinned: boolean) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update({ is_pinned: isPinned })
      .eq('contacts_id', contactId)
      .select();

    if (error) {
      console.error('연락처 핀 업데이트 실패:', error);
      throw new Error('내 사람 고정 중 문제가 발생했습니다. 다시 시도해주세요.');
    }

    return data;
  } catch (error) {
    console.error('연락처 핀 업데이트 실패:', error);
    throw new Error('내 사람 고정 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

//구글 로그인
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: REDIRECT_TO,
      // 매번 로그인 시 계정 선택 및 인증 정보 재입력 유도
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return error;
};

//카카오 로그인
export const signInWithKakao = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: REDIRECT_TO,
      // 매번 로그인 인증 정보 재입력 유도
      queryParams: {
        auth_type: 'reauthenticate',
      },
    },
  });

  return error;
};

// plans 데이터 불러오기
export const getPlans = async (planId: string): Promise<PlansType> => {
  const { data, error } = await supabase.from(PLANS).select('*').eq('plan_id', planId).single();

  if (error) {
    console.error('약속을 불러오는 중 오류가 발생했습니다:', error);
    throw new Error('약속을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }

  return data;
};

// plans 데이터 수정
export const mutateUpdatePlan = async (planId: string, updatedData: InsertNewPlansType) => {
  const { data, error } = await supabase.from(PLANS).update(updatedData).eq('plan_id', planId).select();

  if (error) {
    console.error('약속 수정 중 오류가 발생했습니다:', error);
    throw new Error('약속 수정 중 문제가 발생했습니다. 다시 시도해주세요.');
  }

  return data;
};

// 특정 사용자의 계획을 가져오는 함수 (30일 이내)
export const getUserPlans = async (userId: string): Promise<PlansType[]> => {
  // 현재 날짜의 시간을 00:00:00으로 설정
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // 오늘의 시작점으로 설정

  // 30일 후 날짜 계산
  const thirtyDayslater = new Date();
  thirtyDayslater.setDate(currentDate.getDate() + 30);
  thirtyDayslater.setHours(23, 59, 59, 999); // 30일 후의 끝점으로 설정

  //ISO 형식으로 변환
  const currentDateISO = currentDate.toISOString();
  const thirtyDaysLaterISO = thirtyDayslater.toISOString();

  try {
    const { data, error } = await supabase
      .from(PLANS)
      .select('*, contacts(name)')
      .eq('user_id', userId)
      .gte('start_date', currentDateISO)
      .lte('start_date', thirtyDaysLaterISO)
      .order('start_date', { ascending: true });

    if (error) {
      console.log('계획 데이터를 가져오는 중 오류가 발생했습니다.', error);
      throw new Error('계획 데이터를 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }

    return data || [];
  } catch (error) {
    console.error('Supabase 쿼리 중 예외가 발생했습니다:', error);
    throw new Error('약속을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// 캘린더에서 클릭한 약속 데이터 가져오기
export const getSelectPlan = async (plan_id: string) => {
  const { data, error } = await supabase
    .from(PLANS)
    .select(
      'plan_id, user_id, contacts_id, title, detail, priority, start_date, end_date, location, colors, contacts(name)'
    )
    .eq('plan_id', plan_id);

  if (error) {
    console.error('약속 정보 가져오기 실패:', error);
    throw new Error('약속을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  } else {
    return { data, error: null };
  }
};

// contacts 데이터 삭제
export const mutateDeleteContacts = async (userId: string, contactsId: string): Promise<void> => {
  try {
    const { error } = await supabase.from(CONTACTS).delete().eq('contacts_id', contactsId).eq('user_id', userId); // userId 조건 추가

    if (error) {
      console.error('연락처 삭제 중 오류가 발생했습니다:', error);
      throw new Error('연락처 삭제 중 문제가 발생했습니다.');
    }
  } catch (error) {
    console.error('연락처 삭제 요청 실패:', error);
    throw new Error('연락처 삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// plans 데이터 삭제
export const mutateDeletePlan = async (planId: string): Promise<void> => {
  try {
    const { error } = await supabase.from(PLANS).delete().eq('plan_id', planId);

    if (error) {
      console.error('약속 삭제 중 오류가 발생했습니다:', error);
      throw new Error('약속 삭제 중 문제가 발생했습니다.');
    }
  } catch (error) {
    console.error('약속 삭제 요청 실패:', error);
    throw new Error('약속 삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// pin으로 고정된 연락처만 조회
export const fetchPinnedContacts = async (userId: string): Promise<ContactItemType[]> => {
  const { data, error } = await supabase
    .from(CONTACTS)
    .select('contacts_id, name, relationship_level, contacts_profile_img, is_pinned')
    .eq('user_id', userId)
    .eq('is_pinned', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('고정된 사람을 불러오는 중 문제가 발생했습니다.', error);
    throw new Error('고정된 사람을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
  return data || [];
};

export const fetchRegularContactsInfinite = async (
  userId: string,
  pageParam = 0,
  limit = 10
): Promise<fetchRegularInfiniteContacts> => {
  const from = pageParam * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from(CONTACTS)
    .select('contacts_id, name, relationship_level, contacts_profile_img, is_pinned')
    .eq('user_id', userId)
    .eq('is_pinned', false)
    .order('name', { ascending: true })
    .range(from, to);

  if (error) {
    console.error('연락처를 불러오는 중 문제가 발생했습니다.', error);
    throw new Error('연락처를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }

  const nextPage = data.length === limit ? pageParam + 1 : undefined;
  return { contacts: data, nextPage };
};

export const changePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    console.error('비밀번호 재설정 중 문제가 발생했습니다.', error);
    throw new Error('비밀번호 재설정 중 문제가 발생했습니다. 다시 시도해주세요.');
  }

  return data;
};

export const sendPasswordResetEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: REDIRECT_TO_CHANGE_PASSWORD,
  });
  if (error) {
    console.error('비밀번호 재설정 이메일 전송 중 문제가 발생했습니다.', error);
    throw new Error('비밀번호 재설정 이메일 전송 중 문제가 발생했습니다. 다시 시도해주세요.');
  }

  return data;
};
