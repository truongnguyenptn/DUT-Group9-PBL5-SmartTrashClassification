import { Form, Grid, Row } from 'antd';
import type { UploadFile } from 'antd/es/upload';
import xor from 'lodash-es/xor';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import UploadFileItem from './UploadFileItem';

interface PreviewFilesProps {
  fileList?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  disabled?: boolean;
}

function PreviewFiles({ fileList, onChange, disabled }: PreviewFilesProps) {
  const form = Form.useFormInstance();
  const { xs } = Grid.useBreakpoint();
  const [srcList, setSrcList] = useState<UploadFile[] | undefined>([]);

  useEffect(() => {
    if (fileList?.[0]) {
      setSrcList(fileList);
    }
  }, [fileList]);

  const deleteImage = (item: UploadFile) => {
    if (!disabled) {
      const results = xor(fileList, [item]);
      onChange?.(results);
      form.setFieldsValue({
        files: results,
      });
    }
  };

  return (
    <Row
      className={twMerge(
        'max-h-[25rem] max-w-[27.625rem] overflow-y-auto overflow-x-hidden',
        xs && 'max-h-[18rem]',
      )}
    >
      {srcList?.map(item => (
        <UploadFileItem
          item={item}
          key={item.uid}
          {...(!disabled && {
            deleteImage,
          })}
        />
      ))}
    </Row>
  );
}

export default PreviewFiles;
