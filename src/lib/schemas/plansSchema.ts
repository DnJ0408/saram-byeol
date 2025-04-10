import { z } from 'zod';

export const PlaceSchema = z.object({
  place_name: z.string(),
  road_address_name: z.string(),
  place_url: z.string(),
  id: z.string(),
  phone: z.string(),
  x: z.string(), // longitude
  y: z.string(), // latitude
});

export const PlansSchema = z.object({
  title: z.string().min(1, {
    message: '제목을 입력해주세요.',
  }),
  location: PlaceSchema.optional(),
  dateInput: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  contacts: z.string().min(1, {
    message: '내사람을 선택해주세요',
  }),
  detail: z.string().optional(),
});

//타입정의의 선언방식은 interface로 컨벤션되어있지만, interface는 조드가 지원해주는 자동 타입추론을 사용할 수 없습니다.
//조드의 타입추론을 쓰면 스키마와 타입이 항상 동기화되는 장점이 있어서, 예외적으로 type을 사용한 타입선언을 했습니다.
export type PlanFormType = z.infer<typeof PlansSchema>;

export const planFormDefaultValues = {
  title: '',
  location: {
    place_name: '',
    road_address_name: '',
    place_url: '',
    id: '',
    phone: '',
    x: '',
    y: '',
  },
  dateInput: {
    from: new Date(),
    to: undefined,
  },
  contacts: '',
  detail: '',
};
