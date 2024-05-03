import type { DeepPartial } from '@enouvo/react-uikit';
import { Button } from 'antd';
import { twMerge } from 'tailwind-merge';
import FileDisplay, { FileDisplayProps } from './FileDisplay';
import Image from './Image';
import { IMAGE_TYPE, IS_XS_SCREEN, VideoType } from '#/shared/utils/constant';
import type { FileInput } from '#/generated/schemas';
import { ReactComponent as PlayFilledSVG } from '#/assets/svgs/play-filled.svg';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

interface CommonFileProps {
  file?: DeepPartial<FileInput>;
  allowPreviewFile?: boolean;
  fileDisplayProps?: FileDisplayProps;
  fileImageProps?: {
    size?: number;
    className?: string;
  };
  fileVideoProps?: {
    className?: string;
    showContent?: boolean;
  };
  fileAudioProps?: {
    className?: string;
    showContent?: boolean;
  };
}

function CommonFile({
  file,
  allowPreviewFile,
  fileDisplayProps,
  fileImageProps = {
    size: 72,
  },
  fileVideoProps,
  fileAudioProps,
}: CommonFileProps) {
  const { t } = useTypeSafeTranslation();

  if (IMAGE_TYPE.split(',').some(type => type === file?.type)) {
    return (
      <Image
        className={twMerge('rounded-lg object-cover', fileImageProps.className)}
        height={fileImageProps.size ?? 72}
        preview={allowPreviewFile}
        src={file?.url ?? ''}
        width={fileImageProps.size ?? 72}
      />
    );
  }
  if (
    typeof file?.type === 'string' &&
    file.type.includes('video') &&
    file.url
  ) {
    const type = file.type === VideoType.quicktime ? VideoType.mp4 : file.type;
    const openVideo = () => file.url && window.open(file.url, '_blank');
    return (
      <div
        className={twMerge(
          'rounded-lg border border-scroll-bar bg-white first-letter:relative',
          fileVideoProps?.className,
        )}
      >
        {!fileVideoProps?.showContent ? (
          <div
            className={twMerge(
              'relative h-full w-full',
              IS_XS_SCREEN && 'py-1',
            )}
            {...(allowPreviewFile && { onClick: () => openVideo })}
          >
            <div className="absolute flex h-full w-full items-center justify-center">
              <Button
                className="flex h-6 w-6 items-center justify-center border-none bg-dark-title bg-opacity-40"
                disabled={!allowPreviewFile}
                icon={<PlayFilledSVG className="h-4 w-4 text-white" />}
                shape="circle"
                size="small"
              />
            </div>
            <video
              className={`${
                IS_XS_SCREEN ? 'h-full w-full' : 'h-14 w-14'
              } rounded-lg`}
              id="video"
              muted
            >
              <source src={`${file.url}#t=0.9`} type={type} />
              {t('error.browserDoesNotSupportVideoTag')}
            </video>
          </div>
        ) : (
          <video className="h-60 w-60 rounded-lg" controls id="video" muted>
            <source src={`${file.url}#t=0.9`} type={type} />
            {t('error.browserDoesNotSupportVideoTag')}
          </video>
        )}
      </div>
    );
  }

  if (
    typeof file?.type === 'string' &&
    file.type.includes('audio') &&
    file.url &&
    fileAudioProps?.showContent
  ) {
    return (
      <audio className={twMerge('w-60', fileAudioProps.className)} controls>
        <source src={file.url} type="audio/mpeg" />
        {t('error.notSupportAudio')}
        <track kind="captions" label="english_captions" src="" srcLang="en" />
      </audio>
    );
  }

  return <FileDisplay {...fileDisplayProps} file={file} />;
}

export default CommonFile;
