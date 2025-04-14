'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

const TitleField = () => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name='title'
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>제목</FormLabel>
            <FormControl>
              <Input type='text' placeholder='제목' {...field} maxLength={20}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TitleField;
