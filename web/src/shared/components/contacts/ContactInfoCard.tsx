import { Grid, Tooltip, Typography } from 'antd';
import capitalize from 'lodash-es/capitalize';
import Image from '#/shared/components/common/Image';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { Defunct } from '#/shared/utils/type';
import DefaultAvatar from '#/assets/images/defaultAvatar.png';
import { DATE_FORMAT } from '#/shared/utils/constant';
import { formatDate } from '#/shared/utils/date';

import { ReactComponent as BirthdayOutlineSVG } from '#/assets/svgs/birthday-outline.svg';
import { ReactComponent as DiedOutlineSVG } from '#/assets/svgs/died-outline.svg';

interface ContactFamilyDetailProps {
  defunctInformation: Defunct;
}

export function ContactInfoCard({
  defunctInformation,
}: ContactFamilyDetailProps) {
  const { t } = useTypeSafeTranslation();
  const { md } = Grid.useBreakpoint();

  const defunctInfo = {
    ...defunctInformation,
    civilityName:
      defunctInformation.civility === 'mr'
        ? `${t('value.mr')}.`
        : `${t('value.mrs')}.`,
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 rounded-lg py-8 md:flex-row md:bg-white md:p-4">
      <div>
        <Image
          alt="Deceased Avatar"
          className="rounded-full"
          height={md ? 180 : 100}
          preview={false}
          src={DefaultAvatar}
          width={md ? 180 : 100}
        />
      </div>

      <div className="flex flex-col space-y-4 sm:w-fit md:items-start md:space-y-2">
        <Typography.Text
          className="px-6 text-center text-lg font-semibold sm:text-left sm:text-base md:px-0"
          data-testid="deceased-name"
        >
          {capitalize(defunctInfo.civilityName)} {defunctInformation.first_name}{' '}
          {capitalize(defunctInformation.last_name)}
        </Typography.Text>

        <div className="flex flex-col items-center space-y-2 bg-white text-base">
          <div className="space-y-2">
            <Tooltip
              className="flex items-center space-x-3 text-sm"
              placement="topLeft"
              title={t('commonFields.dateOfBirth')}
              transitionName=""
            >
              <BirthdayOutlineSVG
                className="text-grey-heavy"
                height={18}
                width={18}
              />
              <Typography.Text
                className="min-w-[5.125rem] pt-0 text-grey"
                data-testid="deceased-birth-date"
              >
                {defunctInformation.birth_date
                  ? formatDate(defunctInformation.birth_date, DATE_FORMAT)
                  : 'N/A'}
              </Typography.Text>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
