import { useMutateEditContact } from '@/hooks/mutations/useMutateEditContact';
import { ContactDetailType } from '@/types/contacts';
import ContactForm from '@/components/contactDetail/editContactForm/ContactForm';

interface EditContactFormProps {
  contactData: ContactDetailType;
  onClose: () => void;
}

const EditContactForm = ({ contactData, onClose }: EditContactFormProps) => {
  const { form, onSubmit, imageSource, setImageSource, relationshipType, setRelationshipType, isSubmitting } =
    useMutateEditContact(contactData, onClose);

  return (
    <ContactForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      imageSource={imageSource}
      setImageSource={setImageSource}
      relationshipType={relationshipType}
      setRelationshipType={setRelationshipType}
      onClose={onClose}
    />
  );
};

export default EditContactForm;
