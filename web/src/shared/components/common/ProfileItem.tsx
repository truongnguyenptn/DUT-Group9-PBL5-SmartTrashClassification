import { Tooltip, Typography } from 'antd';
import { twMerge } from 'tailwind-merge';
import Icon from '@ant-design/icons';
import type { ComponentType, SVGProps } from 'react';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import type { TranslationKeys } from '#/generated/translationKeys';

interface ProfileItemProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  value?: string | null;
  title: TranslationKeys;
  className?: string;
  ellipsis?: boolean;
}

function ProfileItem({
  icon,
  value,
  title,
  className,
  ellipsis = true,
}: ProfileItemProps) {
  const { t } = useTypeSafeTranslation();
  return (
    <Tooltip placement="left" title={t(title)} transitionName="">
      <Typography className={twMerge('flex items-center gap-4', className)}>
        <Typography className="text-2xl text-grey-primary-500">
          <Icon component={icon} />
        </Typography>
        <Typography
          className={`text-base ${
            ellipsis ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''
          }`}
        >
          {value ?? t('error.notAvailable')}
        </Typography>
      </Typography>
    </Tooltip>
  );
}

export default ProfileItem;
