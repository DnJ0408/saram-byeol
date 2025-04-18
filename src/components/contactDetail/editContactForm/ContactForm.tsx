import { Form } from '@/components/ui/form';
import { ContactFormValues } from '@/lib/schemas/contactFormSchema';
import { UseFormReturn } from 'react-hook-form';
import RelationshipSelector from '@/components/contacts/addContactForm/RelationshipSelector';
import ContactTextField from '@/components/contacts/addContactForm/ContactTextField';
import EditProfileImageUpload from '@/components/contactDetail/editContactForm/EditProfileImageUpload';

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  onSubmit: (data: ContactFormValues) => Promise<void>;
  isSubmitting: boolean;
  imageSource: string | null;
  setImageSource: (val: string | null) => void;
  relationshipType: string;
  setRelationshipType: (val: string) => void;
  SubmitButtonComponent: (props: { isSubmitting: boolean }) => React.ReactNode;
}

const ContactForm = ({
  form,
  onSubmit,
  isSubmitting,
  imageSource,
  relationshipType,
  setRelationshipType,
  SubmitButtonComponent,
}: ContactFormProps) => {
  return (
    <div className='space-y-8 pl-12 pr-12'>
      <EditProfileImageUpload initialImage={imageSource} setValue={form.setValue} />
      <RelationshipSelector
        relationshipType={relationshipType}
        setRelationshipType={setRelationshipType}
        setValue={form.setValue}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
          <ContactTextField control={form.control} name='name' label='이름' placeholder='이름을 입력해주세요.' />
          <ContactTextField
            control={form.control}
            name='bio'
            label='한줄소개'
            placeholder='이 사람을 한 마디로 표현한다면?'
          />
          <ContactTextField
            control={form.control}
            name='phone'
            label='전화번호'
            placeholder='전화번호 입력'
            type='tel'
          />
          <ContactTextField control={form.control} name='email' label='이메일' placeholder='이메일 입력' type='email' />
          <ContactTextField control={form.control} name='birthday' label='생일' placeholder='' type='date' />
          <SubmitButtonComponent isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
