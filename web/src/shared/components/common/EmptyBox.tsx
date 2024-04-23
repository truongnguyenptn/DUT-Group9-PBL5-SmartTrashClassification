import { Typography } from 'antd';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { ReactComponent as EmptyBoxSVG } from '#/assets/svgs/empty-box.svg';

function EmptyBox() {
  const { t } = useTypeSafeTranslation();
  return (
    <div className="mx-auto flex h-full w-full max-w-container gap-6 overflow-hidden rounded-2xl bg-white p-6 md:h-[calc(100%-11.813rem)] md:border-none">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-slate-200 p-6">
        <EmptyBoxSVG className="h-44 w-44" />
        <Typography.Text className="mt-4 text-xl font-medium text-gray-400">
          {t('noData')}
        </Typography.Text>
      </div>
    </div>
  );
}

export default EmptyBox;
