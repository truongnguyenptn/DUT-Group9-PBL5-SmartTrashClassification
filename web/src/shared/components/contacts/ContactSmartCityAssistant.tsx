import { Typography } from 'antd';
import capitalize from 'lodash-es/capitalize';
import { ContactItem } from '#/shared/components/common/ContactItem';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { getAddress } from '#/shared/utils/tool';

import type { ContactData } from '#/shared/utils/type/contact';

interface ContactSmartCityAssistantProps {
  SmartCityAssistant: ContactData;
}

export default function ContactSmartCityAssistant({
  SmartCityAssistant,
}: ContactSmartCityAssistantProps) {
  const { t } = useTypeSafeTranslation();

  return (
    <div className="rounded-lg bg-white px-6 py-5 sm:border-none md:p-4">
      <Typography.Title className="mb-3 text-primary md:text-lg" level={4}>
        {t('contact.SmartCityAssistant')}
      </Typography.Title>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1 lg:gap-y-3">
        <ContactItem
          label={t('contact.assistantName')}
          value={
            SmartCityAssistant.name ? capitalize(SmartCityAssistant.name) : 'N/A'
          }
        />

        {getAddress(SmartCityAssistant) ? (
          <ContactItem
            className="font-semibold text-primary"
            href={`https://www.google.com/maps/search/?api=1&query=${getAddress(
              SmartCityAssistant,
            )}`}
            label={t('commonFields.address')}
            value={getAddress(SmartCityAssistant)}
          />
        ) : (
          <ContactItem label={t('commonFields.address')} value="N/A" />
        )}

        {SmartCityAssistant.phone_1 ? (
          <ContactItem
            className="font-semibold text-primary"
            href={`tel:${SmartCityAssistant.phone_1}`}
            label={t('commonFields.phone')}
            value={SmartCityAssistant.phone_1}
          />
        ) : (
          <ContactItem label={t('commonFields.phone')} value="N/A" />
        )}

        {SmartCityAssistant.email_1 ? (
          <ContactItem
            className="font-semibold text-primary"
            href={`mailto:${SmartCityAssistant.email_1}`}
            label={t('commonFields.email')}
            value={SmartCityAssistant.email_1}
          />
        ) : (
          <ContactItem label={t('commonFields.email')} value="N/A" />
        )}
      </div>
      <div className="flex flex-row items-center">
        {SmartCityAssistant.documents?.map((doc, index) => (
          <>
            <span
              className={
                index !== 0
                  ? `ml-4 mr-2 h-3 border-l border-solid border-scroll-bar`
                  : ''
              }
            ></span>
            <ContactItem
              className="text-default-info"
              href={doc.url}
              key={index}
              value={doc.name}
            />
          </>
        ))}
      </div>
    </div>
  );
}
