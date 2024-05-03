import { twMerge } from 'tailwind-merge';
import { Typography } from 'antd';
import type { DeepPartial } from '@enouvo/react-uikit';
import FileIcon from './FileIcon';
import {
  formatBytes,
  getFileTypeFromFileName,
  truncateName,
} from '#/shared/utils/tool';
import type { FileInput } from '#/generated/schemas';
import { IS_XS_SCREEN, NAME_LENGTH } from '#/shared/utils/constant';

export interface FileDisplayProps {
  file?: DeepPartial<FileInput>;
  nameLength?: number;
  className?: string;
  extra?: React.ReactNode;
  isDisplayFileSize?: boolean;
  fileIconProps?: {
    size?: number;
    className?: string;
  };
  fontSize?: string;
  textColor?: string;
}

export default function FileDisplay({
  file,
  nameLength = NAME_LENGTH,
  className,
  isDisplayFileSize = false,
  fileIconProps,
  extra,
  fontSize = 'text-sm',
  textColor = 'text-grey',
}: FileDisplayProps) {
  return (
    <div
      className={twMerge(
        `flex h-full items-center justify-between space-x-4 rounded-lg px-3 py-2`,
        className,
        IS_XS_SCREEN && 'max-w-[80vw]',
      )}
      data-testid="file-display"
    >
      <div className="flex items-center space-x-2">
        <span
          className={twMerge(
            'h-10 items-center justify-center rounded-full bg-zinc-200 p-2 text-white',
            fileIconProps?.className,
          )}
          data-testid="file-icon"
        >
          <FileIcon
            fileType={file?.name ? getFileTypeFromFileName(file.name) : ''}
            height={fileIconProps?.size || 24}
            width={fileIconProps?.size || 24}
          />
        </span>
        <div className="-ml-2 flex flex-col">
          <Typography.Text
            className={twMerge('font-normal', fontSize, textColor)}
          >
            {truncateName(file?.name ?? '', nameLength)}
          </Typography.Text>

          {isDisplayFileSize && (
            <Typography.Text className="text-grey-primary-300">
              {formatBytes(file?.size ?? 0)}
            </Typography.Text>
          )}
        </div>
      </div>
      {extra && <>{extra}</>}
    </div>
  );
}
