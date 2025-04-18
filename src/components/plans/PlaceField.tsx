import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { searchPlaces } from '@/app/api/planForm/search/service';
import { KakaoPlaceType } from '@/types/plans';
import { inputToPlace } from '@/lib/planFormUtils';
import { MapPin } from '@phosphor-icons/react';

interface PlaceFieldProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}
const PlaceField = ({ inputValue, setInputValue }: PlaceFieldProps) => {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [placeList, setPlaceList] = useState<KakaoPlaceType[]>([]);

  const searchHandler = async () => {
    if (!inputValue.trim()) return;
    setOpen(true);
    try {
      const { documents } = await searchPlaces(inputValue);
      setPlaceList(documents);
      setOpen(true);
    } catch (error) {
      console.error('검색 실패', error);
    }
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchHandler();
    }
  };

  const selectHandler = (selected: KakaoPlaceType['place_name']) => {
    setInputValue(selected);
    setOpen(false);
  };

  return (
    <FormField
      control={control}
      name='location'
      render={() => {
        return (
          <FormItem className='flex items-center justify-start gap-8'>
            <FormLabel className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
              <MapPin size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />
              <p className='text-center text-sm'>장소</p>
            </FormLabel>

            <div className='relative w-full'>
              <Input
                type='text'
                placeholder='장소를 검색해보세요.'
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  const selected = inputToPlace(e.target.value);
                  setValue('location', selected);
                }}
                onKeyDown={keyDownHandler}
                className='items-center self-stretch rounded-lg border-grey-200 px-4 py-2 text-sm leading-6'
              />
              {open && placeList.length > 0 && (
                <div className='absolute z-10 mt-2 w-full rounded-md border bg-white shadow-md max-h-60 overflow-y-scroll'>
                  {placeList.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => {
                        setValue('location', place);
                        selectHandler(place.place_name);
                      }}
                      className='mb-2 flex cursor-pointer flex-col gap-1 p-2 hover:bg-grey-50 active:bg-grey-100'
                    >
                      <div className='text-sm'>{place.place_name}</div>
                      <div className='text-xs text-grey-100'>{place.road_address_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    ></FormField>
  );
};

export default PlaceField;
