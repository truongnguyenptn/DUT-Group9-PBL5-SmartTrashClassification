import type { SelectProps } from 'antd';
import { Select } from 'antd';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

function StatusSelector({ ...rest }: SelectProps) {
  const { t } = useTypeSafeTranslation();

  return (
    <Select
      options={[
        { label: t('value.active'), value: 'true' },
        { label: t('value.inactive'), value: 'false' },
      ]}
      showSearch
      {...rest}
    />
  );
}

export default StatusSelector;
