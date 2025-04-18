import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { searchPlaces } from '@/app/api/planForm/search/service';
import { KakaoPlaceType } from '@/types/plans';
import { inputToPlace } from '@/lib/planFormUtils';
import { MapPin } from '@phosphor-icons/react';

interface PlaceFieldProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}
const PlaceField = ({ inputValue, setInputValue }: PlaceFieldProps) => {
  const [open, setOpen] = useState(false);
  const [placeList, setPlaceList] = useState<KakaoPlaceType[]>([]);
  const { control, setValue } = useFormContext();

  const searchHandler = async ( keyword: string) => {
    if (!keyword.trim()) return;
    try {
      const { documents } = await searchPlaces(keyword);
      setPlaceList(documents);
      setOpen(true);
    } catch (error) {
      console.error('검색 실패', error);
    }
  };
  return (
    <FormField
      control={control}
      name='location'
      render={({ field }) => {
        return (
          <FormItem className='flex items-center justify-start gap-8'>
            <FormLabel className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
              <MapPin size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />
              <p className='text-center text-sm'>장소</p>
            </FormLabel>
            {!open ? (
              <div className='flex w-full gap-4'>
                <Input
                  type='text'
                  placeholder='장소를 입력해주세요.'
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    const selected = inputToPlace(e.target.value);
                    setValue('location', selected);
                  }}
                  className='items-center self-stretch rounded-lg border-grey-200 px-4 py-2 text-sm leading-6'
                />
                <Button
                  onClick={()=>searchHandler(inputValue)}
                  type='button'
                  variant={'default'}
                  className='bg-primary-500 hover:bg-primary-600 active:bg-primary-700'
                >
                  검색
                </Button>
              </div>
            ) : (
              <Select
                open={true}
                value={inputValue}
                onValueChange={(value) => {
                  // JSON 문자열로 serialize하여 SelectItem value로 사용
                  const selected: KakaoPlaceType = JSON.parse(value);
                  setInputValue(selected?.place_name); //인풋창에 선택한 밸류의 이름 노출
                  setValue('location', selected); // form에 값 저장
                  setOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-lg'>
                  {placeList.length !== 0 ? (
                    placeList.map((place) => {
                      return (
                        <SelectItem key={place.id} value={JSON.stringify(place)} className='mb-2 rounded-lg'>
                          <div className='text-sm'>{place.place_name}</div>
                          <div className='text-xs text-grey-100'>{place.road_address_name}</div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value={field.value}>
                      <div className="inline-flex">검색결과가 없습니다.</div>
                      <Button type='button' variant={'ghost'} onClick={() => setOpen(false)} >
                        다시검색
                      </Button>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    ></FormField>
  );
};

export default PlaceField;
