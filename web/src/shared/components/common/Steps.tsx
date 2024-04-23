import { Typography } from 'antd';
import { twMerge } from 'tailwind-merge';
import { isMobile } from 'react-device-detect';
import { ChangeStatusButton } from './modal/ChangeStatusButton';
import { ContactItem } from '#/shared/components/common/ContactItem';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import type { ServiceType } from '#/shared/utils/type/services';
import { getColorByStatus, scrollToMap } from '#/shared/utils/tool';
import { Coordinates } from '#/shared/utils/type/transportation';

interface StepsProps {
  item: ServiceType;
  onPressStep?: (index: number) => void;
  index: number;
  onAddressClick: (coordinates: Coordinates) => void;
}

export function Steps({
  index,
  item,
  onPressStep,
  onAddressClick,
}: StepsProps) {
  const { t } = useTypeSafeTranslation();

  const formattedItem = {
    id: item.id,
    mode: item.mode,
    status: item.statusId,
  };

  return (
    <div data-testid="step" key={index}>
      <div
        className={twMerge(
          `flex w-fit cursor-pointer items-center rounded-full pr-1`,
          item.statusId !== null &&
            item.statusId !== undefined &&
            getColorByStatus(item.statusId).bg,
        )}
        data-testid="step-container"
        onClick={() => {
          onPressStep?.(index);
          isMobile && scrollToMap();
        }}
      >
        <Typography.Text
          className={twMerge(
            `mb-0 flex h-10 w-10 items-center justify-center rounded-full text-base text-white ring-1 ring-white`,
            item.statusId !== null &&
              item.statusId !== undefined &&
              getColorByStatus(item.statusId).indexBg,
          )}
          data-testid="step-number"
        >
          {item.number}
        </Typography.Text>
        <Typography.Text
          className={twMerge(
            `py-2 pl-3 pr-4`,
            item.statusId !== null &&
              item.statusId !== undefined &&
              getColorByStatus(item.statusId).text,
          )}
          data-testid="step-title"
          strong
        >
          {item.title}
        </Typography.Text>
        <ChangeStatusButton item={formattedItem} />
      </div>
      <div className="my-3 ml-4 space-y-3 border-l border-dashed border-grey-primary-200 pl-8">
        <div className="space-y-1">
          <ContactItem
            label={t('commonFields.dateAndTime')}
            value={item.date || 'N/A'}
          />
          {item.address ? (
            <div
              className="cursor-pointer"
              {...(item.lat &&
                item.lng && {
                  onClick: () => {
                    onAddressClick({
                      lat: item.lat || 0,
                      lng: item.lng || 0,
                    });
                    isMobile && scrollToMap();
                  },
                })}
              data-testid="step-address"
            >
              <ContactItem
                className="font-semibold text-primary"
                label={t('commonFields.address')}
                value={item.address}
              />
            </div>
          ) : (
            <ContactItem
              label={t('commonFields.address')}
              value={item.address || 'N/A'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
