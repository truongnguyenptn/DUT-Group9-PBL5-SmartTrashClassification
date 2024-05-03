import { Typography } from 'antd';
import capitalize from 'lodash-es/capitalize';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { ContactItem } from '#/shared/components/common/ContactItem';
import { getAddress } from '#/shared/utils/tool';
import type { ContactData } from '#/shared/utils/type/contact';

interface ContactFuneralProviderProps {
  funeralProvider: ContactData;
}

export default function ContactFuneralProvider({
  funeralProvider,
}: ContactFuneralProviderProps) {
  const { t } = useTypeSafeTranslation();

  return (
    <div className="rounded-lg bg-white px-6 py-5 sm:border-none md:p-4">
      <Typography.Title className="mb-3 text-primary md:text-lg" level={4}>
        {t('Smart Trash Bin')}
      </Typography.Title>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1 lg:gap-y-3">
        <ContactItem
          label={t('contact.companyName')}
          value={
            funeralProvider.name ? capitalize(funeralProvider.name) : 'N/A'
          }
        />

        <ContactItem
          className="font-semibold text-primary"
          href={`https://www.google.com/maps/search/?api=1&query=${getAddress(
            funeralProvider,
          )}`}
          label={t('commonFields.address')}
          value={getAddress(funeralProvider) || 'N/A'}
        />

        <ContactItem
          label={t('contact.website')}
          value={funeralProvider.website || 'N/A'}
        />

        <ContactItem
          label={t('contact.empowermentNumber')}
          value={funeralProvider.empowermentNumber || 'N/A'}
        />

        {funeralProvider.phone_1 ? (
          <ContactItem
            className="font-semibold text-primary"
            href={`tel:${funeralProvider.phone_1}`}
            label={t('commonFields.phone')}
            value={funeralProvider.phone_1}
          />
        ) : (
          <ContactItem label={t('commonFields.phone')} value="N/A" />
        )}

        <ContactItem
          label={t('contact.civilLiabilityInsurance')}
          value={funeralProvider.civilLiabilityInsurance || 'N/A'}
        />

        {funeralProvider.email_1 ? (
          <ContactItem
            className="font-semibold text-primary"
            href={`mailto:${funeralProvider.email_1}`}
            label={t('commonFields.email')}
            value={funeralProvider.email_1}
          />
        ) : (
          <ContactItem label={t('commonFields.email')} value="N/A" />
        )}

        <ContactItem
          label={t('commonFields.whatsapp')}
          value={funeralProvider.whatsapp || 'N/A'}
        />
      </div>
    </div>
  );
}
