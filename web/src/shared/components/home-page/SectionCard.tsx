import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { cloneElement } from 'react';
import type { TranslationKeys } from '#/generated/translationKeys';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

interface SectionCardProps {
  to?: string;
  icon?: React.ReactElement;
  title?: TranslationKeys;
  description?: TranslationKeys;
}

export default function SectionCard({
  description,
  icon,
  title,
  to,
}: SectionCardProps) {
  const navigate = useNavigate();
  const { t } = useTypeSafeTranslation();

  return (
    <div
      className="grid min-h-[6rem] cursor-pointer grid-cols-12 items-center gap-4 rounded-lg bg-[white] bg-opacity-90 py-4 px-8 hover:bg-opacity-100"
      onClick={() => to && navigate(to)}
    >
      <div className="text-primary-color col-span-2">
        {icon && cloneElement(icon, { height: 48, width: 48 })}
      </div>
      <div className="col-span-10 flex flex-col gap-2">
        <Typography className="text-base font-semibold">
          {title && t(title)}
        </Typography>
        <Typography>{description && t(description)}</Typography>
      </div>
    </div>
  );
}
