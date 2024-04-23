import { showError, uploadFile } from '@enouvo/react-uikit';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { uniqBy } from 'lodash-es';
import imageCompression from 'browser-image-compression';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ReactComponent as AttachOutlineSVG } from '#/assets/svgs/attach-outline.svg';
import { S3UploadType } from '#/generated/schemas';
import useAsyncQuery from '#/shared/hooks/useAsyncQuery';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { DEFAULT_UPLOAD_TYPE } from '#/shared/utils/constant';
import { getFileName, isFile, logger } from '#/shared/utils/tool';

export interface DocumentFileType {
  url: string;
  type: string;
  name: string;
  size?: number;
  uid?: string;
}

interface Props {
  onChange?: (srcList: DocumentFileType[]) => void;
  disabled?: boolean;
  srcList?: DocumentFileType[];
  onUploadSuccess?: (
    newFiles: DocumentFileType[],
    newFile?: DocumentFileType,
  ) => void;
  onUploading?: () => void;
  onUploadFailed?: () => void;
  onSettled?: (newFiles: DocumentFileType[]) => void;
}

function UploadFiles({
  onChange,
  disabled,
  srcList,
  onUploadSuccess,
  accept,
  multiple,
  onUploading,
  onUploadFailed,
  ...rest
}: Props & UploadProps) {
  const { getPresignedUrl } = useAsyncQuery();
  const [documentList, setDocumentList] = useState<DocumentFileType[]>([]);
  const { t } = useTypeSafeTranslation();
  const filesRef = useRef<DocumentFileType[]>([]);
  const totalUploadFiles = useRef(0);

  useEffect(() => {
    filesRef.current = srcList ?? [];
    setDocumentList(srcList ?? []);
  }, [srcList]);

  const handleUpload = async ({
    file,
  }: {
    file: string | Blob | RcFile | File;
  }) => {
    onUploading?.();
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const { data } = await getPresignedUrl({
        fileName: (file as File).name,
        fileType: (file as File).type,
        pathType: S3UploadType.Profile,
      });

      const uploadUrl = data?.presignedUrlS3.uploadUrl;
      const url = `${import.meta.env.VITE_IMAGE_URL}/${
        data?.presignedUrlS3.pathFile
      }`;

      if (isFile(file)) {
        const fileUpload = file.type.includes('image')
          ? await imageCompression(file, options)
          : file;

        if (uploadUrl) {
          await uploadFile({
            file: fileUpload,
            signedRequest: uploadUrl,
          });

          const newFile: DocumentFileType = {
            name: getFileName(url) ?? url,
            size: (file as File).size,
            type: (file as File).type,
            url,
          };

          if (multiple) {
            filesRef.current = uniqBy(
              [...filesRef.current, newFile, ...documentList],
              'url',
            );
            totalUploadFiles.current -= 1;

            if (totalUploadFiles.current === 0) {
              onUploadSuccess?.(filesRef.current, undefined);
              onChange?.(filesRef.current);
            }
          } else {
            onChange?.([newFile, ...documentList]);
            onUploadSuccess?.([newFile, ...documentList], newFile);
          }
        }
      }
    } catch (error) {
      showError(t('error.uploadFileError'));
      logger(error);
      if (multiple) {
        totalUploadFiles.current -= 1;

        if (totalUploadFiles.current === 0) {
          onUploadFailed?.();
        }
      }
    }
  };

  const handleBeforeUpload = (file: RcFile, fileList: RcFile[]) => {
    const validFileSize = 50 * 1024 * 1024;
    const isValidSizeFile = (file as File).size <= validFileSize;

    const isValidFileType = (accept ?? DEFAULT_UPLOAD_TYPE)
      .split(',')
      .includes((file as File).type);

    if (!isValidSizeFile) {
      onUploadFailed?.();
      showError(t('error.validFileSize'));
      return Upload.LIST_IGNORE;
    }

    if (!isValidFileType) {
      onUploadFailed?.();
      showError(t('error.fileTypeIsNotAllowed'));
      return Upload.LIST_IGNORE;
    }

    totalUploadFiles.current = fileList.filter(
      file =>
        (file as File).size <= validFileSize &&
        (accept ?? DEFAULT_UPLOAD_TYPE)
          .split(',')
          .includes((file as File).type),
    ).length;

    return true;
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Upload
        accept={accept ?? DEFAULT_UPLOAD_TYPE}
        beforeUpload={handleBeforeUpload}
        customRequest={handleUpload}
        disabled={disabled}
        maxCount={1}
        multiple
        progress={{
          showInfo: false,
          strokeWidth: 4,
        }}
        showUploadList={false}
        {...rest}
      >
        <AttachOutlineSVG
          className={twMerge(
            'mx-2 mt-1',
            disabled ? 'text-gray-400' : 'text-grey-heavy',
          )}
          height={24}
          width={24}
        />
      </Upload>
    </div>
  );
}

export default UploadFiles;
