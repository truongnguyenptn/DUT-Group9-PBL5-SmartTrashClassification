import { Typography } from 'antd';
import { ContactItem } from '#/shared/components/common/ContactItem';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import type { Family } from '#/shared/utils/type/contact';

interface ContactFamilyDetailProps {
  familyDetails: Family;
}

export default function ContactFamilyDetail({
  familyDetails,
}: ContactFamilyDetailProps) {
  const { t } = useTypeSafeTranslation();

  return (
    <div className="rounded-lg bg-white px-6 py-5 sm:border-none md:p-4">
      <Typography.Title className="mb-3 text-primary md:text-lg" level={4}>
        {t('contact.familyDetail')}
      </Typography.Title>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1 lg:gap-y-3">
        <ContactItem
          label={t('contact.nameFirstName')}
          value={familyDetails.first_name || 'N/A'}
        />
        <ContactItem label={t('commonFields.address')} value="N/A" />
        <ContactItem label={t('commonFields.phone')} value="N/A" />
        <ContactItem label={t('commonFields.email')} value="N/A" />
        <ContactItem label={t('commonFields.whatsapp')} value="N/A" />
      </div>
    </div>
  );
}
