'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, setDefaultOptions } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { ko } from 'date-fns/locale/ko';
import { CalendarBlank } from '@phosphor-icons/react';

setDefaultOptions({ locale: ko });

const DateInputField = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name='dateInput'
      render={({ field }) => {
        return (
          <FormItem className='flex items-center justify-start gap-8'>
            <FormLabel className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
              <CalendarBlank className='h-6 w-6 flex-shrink-0 flex-grow-0' />
              <p className='text-center text-sm'>약속</p>
            </FormLabel>
            <div className='flex w-full flex-col'>
              <Popover>
                <PopoverTrigger className='w-full'>
                  <FormControl>
                    <div className='flex w-full flex-col gap-2.5'>
                      <div
                        id='dateInput'
                        className={cn(
                          'flex w-full items-center justify-between self-stretch rounded-lg border border-grey-200 px-4 py-2 text-left text-sm font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value?.from ? (
                          <>{format(field.value.from, 'y.LL.dd (ccc)')}</>
                        ) : (
                          <span> 약속일을 선택하세요</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </div>
                      <div
                        id='dateInput'
                        className={cn(
                          'flex w-full items-center justify-between self-stretch rounded-lg border border-grey-200 px-4 py-2 text-left text-sm font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value.to ? (
                          <>{format(field.value.to, 'y.LL.dd (ccc)')}</>
                        ) : (
                          <>{format(field.value.from, 'y.LL.dd (ccc)')}</>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </div>
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto'>
                  <Calendar
                    mode='range'
                    defaultMonth={field.value?.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className='pl-1' />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default DateInputField;
