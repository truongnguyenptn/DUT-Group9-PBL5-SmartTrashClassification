import { Button, ConfigProvider } from 'antd';
import { showError, showSuccess } from '@enouvo/react-uikit';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ViewDetailsButton } from './ViewDetailsButton';
import { getCaseName, getEmail } from '#/shared/utils/localStorage';
import {
  GenerateTrackingLinkInputDto,
  useGenerateTrackingLinkMutation,
} from '#/generated/schemas';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { GenerateLinkModal } from '#/shared/components/common/modal/GenerateLinkModal';
import { convertStringToUTC, getDriverId, logger } from '#/shared/utils/tool';
import type { Transport } from '#/shared/utils/type/transportation';
import { SHARE_LINK_HASH_VALUE } from '#/shared/utils/constant';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';

type GenerateButtonProps = Omit<
  GenerateTrackingLinkInputDto,
  'email' | 'username' | 'providerEmail' | 'caseName'
>;

interface TransportProps {
  transport: Transport;
  allowGenerateTrackingLink?: boolean;
}

export function GenerateButton({
  transport,
  placeOfArrival,
  placeOfDeparture,
  transportId,
  arrivalName,
  departureName,
  allowGenerateTrackingLink,
}: GenerateButtonProps & TransportProps) {
  const navigate = useNavigate();
  const { t } = useTypeSafeTranslation();
  const [trackingLink, setTrackingLink] = useState<string>();
  const [trackingDriverId, setTrackingDriverId] = useState<string | undefined>(
    transport.trackingDriver?.id,
  );
  const { hash } = useLocation();
  const isGeneratedTrackingLink = useRef(false);

  const email = getEmail();
  const caseName = getCaseName();
  const { contactData } = useContactDataVar();
  const [generateTrackingLink, { loading: generateTrackingLinkLoading }] =
    useGenerateTrackingLinkMutation({
      onCompleted({ generateTrackingLink }) {
        setTrackingDriverId(getDriverId(generateTrackingLink));
        setTrackingLink(generateTrackingLink);
        !trackingDriverId &&
          showSuccess(t('transportation.successGenerateLinkMessage'));
      },
      onError(error) {
        showError(error);
        logger(error);
      },
    });

  const dateOfDeath = contactData?.objects.defunct.dead_date;
  const dateOfBirth = contactData?.objects.defunct.birth_date;
  const firstName = contactData?.objects.defunct.first_name;
  const lastName = contactData?.objects.defunct.last_name;
  const timeDeparture = transport.departure?.date
    ? convertStringToUTC(transport.departure.date)
    : null;
  const timeArrival = transport.arrival?.date
    ? convertStringToUTC(transport.arrival.date)
    : null;
  const civility = contactData?.objects.defunct.civility;
  const shareLinkHashValue = `${SHARE_LINK_HASH_VALUE}/${transport.id}`;
  const modalVisible = hash === shareLinkHashValue && allowGenerateTrackingLink;

  const generate = useCallback(() => {
    if (email && civility && caseName) {
      const payload = {
        arrivalName,
        caseName,
        dateOfBirth,
        dateOfDeath,
        departureName,
        firstName,
        lastName,
        placeOfArrival,
        placeOfDeparture,
        providerEmail: email,
        timeArrival,
        timeDeparture,
        transportId,
      };

      generateTrackingLink({
        variables: {
          input: {
            civilityName: civility,
            ...payload,
          },
        },
      });
      navigate({
        hash: shareLinkHashValue,
      });
    }
  }, [
    arrivalName,
    caseName,
    civility,
    dateOfBirth,
    dateOfDeath,
    departureName,
    email,
    firstName,
    generateTrackingLink,
    lastName,
    navigate,
    placeOfArrival,
    placeOfDeparture,
    shareLinkHashValue,
    timeArrival,
    timeDeparture,
    transportId,
  ]);

  useEffect(() => {
    if (modalVisible && !isGeneratedTrackingLink.current) {
      isGeneratedTrackingLink.current = true;
      generate();
    }
  }, [generate, modalVisible]);

  return (
    <div>
      {allowGenerateTrackingLink && (
        <>
          <ConfigProvider
            theme={{
              components: {
                ['Button']: {
                  borderRadius: 24,
                  colorBorder: '#3765DE',
                  colorText: '#3765DE',
                  controlHeight: 40,
                },
              },
              token: {
                colorPrimary: '#3765DE',
              },
            }}
          >
            <Button
              className="mb-2 mr-2"
              onClick={() => {
                navigate({
                  hash: shareLinkHashValue,
                });
              }}
            >
              {trackingDriverId
                ? t('transportation.shareLink')
                : t('button.generateLink')}
            </Button>
          </ConfigProvider>
          <GenerateLinkModal
            centered
            loading={generateTrackingLinkLoading}
            onCancel={() => {
              navigate({ hash: '' });
            }}
            open={modalVisible}
            trackingLink={trackingLink}
          />
        </>
      )}
      {!!trackingDriverId && (
        <ViewDetailsButton
          trackingDriverId={trackingDriverId}
          transport={transport}
        />
      )}
    </div>
  );
}
