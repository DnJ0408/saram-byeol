import { PlanFormType } from './schemas/plansSchema';

export const getTimeToString = (date: Date) => {
  const yyyy = date.getFullYear().toString();
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);

  return { yyyy, mm, dd };
};
//시작일과 종료일 시간 추가 처리
export const getStartAndEndDate = (from: Date, to?: Date) => {
  const { yyyy: fromY, mm: fromM, dd: fromD } = getTimeToString(from);
  const { yyyy: toY, mm: toM, dd: toD } = to ? getTimeToString(to) : getTimeToString(from);
  const start_date = `${fromY}-${fromM}-${fromD} 00:00:00`;
  const end_date = `${toY}-${toM}-${toD} 23:59:59`;

  return { start_date, end_date };
};

//입력 데이터 구조분해 할당
export const mappingFormData = (data: PlanFormType) => {
  const { title, detail, contacts, dateInput, location, priority } = data;
  const { start_date, end_date } = getStartAndEndDate(dateInput.from, dateInput.to);
  return { title, detail, contacts_id: contacts, start_date, end_date, location, priority };
};

//검색없이 인풋값만 있을 때 데이터 처리
export const inputToPlace = (input: string) => {
  const place = {
    place_name: input,
    road_address_name: '',
    place_url: '',
    id: '',
    phone: '',
    x: '',
    y: '',
  };
  return place;
};
