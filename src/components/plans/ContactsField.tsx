'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import useGetContactsByUserID from '@/hooks/queries/useGetContactsByUserID';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useState } from 'react';
import { UserType } from '@/types/contacts';
import { User } from '@phosphor-icons/react';

interface Props {
  userId: UserType['user_id'];
  enabled: boolean;
}

const ContactsField = ({ userId, enabled }: Props) => {
  const [open, setOpen] = useState(false);
  const { control, setValue } = useFormContext();
  const { data: contacts = [] } = useGetContactsByUserID(userId, enabled);

  return (
    <FormField
      control={control}
      name='contacts'
      render={({ field }) => {
        return (
          <FormItem className='flex items-center justify-start gap-8'>
            <FormLabel className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
              <User size={24} className='h-6 w-6 flex-shrink-0 flex-grow-0' />{' '}
              <p className='text-center text-sm'>내 사람</p>
            </FormLabel>
            <div className='flex w-full flex-col'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className={cn(
                        'w-full items-center justify-between self-stretch rounded-lg border-grey-200 px-4 py-2 text-sm leading-6',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? contacts.find((person) => person.contacts_id === field.value)?.name
                        : '내 사람을 검색해주세요.'}
                      <ChevronsUpDown className='opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Command className='rounded-lg'>
                    <CommandInput placeholder='검색' className='h-9' />
                    <CommandList>
                      <CommandEmpty>일치하는 이름이 없습니다.</CommandEmpty>
                      <CommandGroup>
                        {contacts.map((person, i) => (
                          <CommandItem
                            value={person.contacts_id}
                            key={i}
                            onSelect={() => {
                              setValue('contacts', person.contacts_id);
                              setOpen(false);
                            }}
                          >
                            {person.name}
                            <Check
                              className={cn(
                                'ml-auto',
                                person.contacts_id === field.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
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

export default ContactsField;
