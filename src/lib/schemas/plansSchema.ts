import { z } from 'zod';

export const PlaceSchema = z.object({
  place_name: z.string(),
  road_address_name: z.string().optional(),
  place_url: z.string().optional(),
  id: z.string().optional(),
  phone: z.string().optional(),
  x: z.string().optional(), // longitude
  y: z.string().optional(), // latitude
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
    message: '약속을 함께할 사람을 추가해주세요',
  }),
  priority: z.string().optional(),
  detail: z.string().optional(),
  colors: z.string().optional(),
});

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
    to: new Date(),
  },
  contacts: '',
  priority: 'medium',
  detail: '',
  colors: '#2F80ED',
};
