import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload';
import type { MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import CommonFile from '#/shared/components/common/CommonFile';
import { ReactComponent as CloseCircleFilledSVG } from '#/assets/svgs/close-circle-filled.svg';

interface Props {
  item: UploadFile;
  deleteImage?: (item: UploadFile) => void;
}

function UploadFileItem({ item, deleteImage }: Props) {
  const handleDeleteFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteImage?.(item);
  };

  const isFileDocument =
    item.type?.includes('video') ||
    item.type?.includes('audio') ||
    item.type?.includes('image');

  const isFileImage = item.type?.includes('image');

  return (
    <div
      className={twMerge(
        'relative mr-[0.438rem] mb-2 flex items-center justify-between rounded-lg bg-white',
        !isFileDocument && 'max-w-[14.5rem]',
      )}
    >
      <div className="relative flex h-full w-full border-none">
        {item.status === 'error' && (
          <ExclamationCircleOutlined className="absolute top-4 left-4 text-error" />
        )}
        {isFileImage ? (
          <div className="flex h-full items-center justify-center">
            <CommonFile
              file={item}
              fileImageProps={{
                size: 64,
              }}
            />
          </div>
        ) : (
          <a
            className="h-full"
            href={item.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex h-full items-center justify-center">
              <CommonFile
                file={item}
                fileAudioProps={{
                  showContent: false,
                }}
                fileDisplayProps={{
                  className: 'bg-grey-light-400 h-[4rem] max-w-[14.5rem]',
                  nameLength: 15,
                }}
                fileImageProps={{
                  size: 64,
                }}
                fileVideoProps={{
                  className: 'h-16 w-16 p-1',
                  showContent: false,
                }}
              />
            </div>
          </a>
        )}
      </div>
      <div>
        {deleteImage && (
          <span onClick={handleDeleteFile}>
            <CloseCircleFilledSVG className="absolute -top-px -right-[0.375rem] h-5 w-5 cursor-pointer rounded-full text-xl hover:text-error" />
          </span>
        )}
      </div>
    </div>
  );
}

export default UploadFileItem;
