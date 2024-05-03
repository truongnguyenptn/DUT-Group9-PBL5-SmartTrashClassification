import styled from '@emotion/styled';
import { Button, Typography } from 'antd';
import Image from '#/shared/components/common/Image';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { IMAGE_TYPE, TERRA_NAME, VideoType } from '#/shared/utils/constant';
import type { MessageFile } from '#/generated/schemas';
import { ReactComponent as PlayFilledSVG } from '#/assets/svgs/play-filled.svg';

const StyledMediaFile = styled.div`
  :hover {
    .hover-content {
      display: flex !important;
    }
  }
`;

interface MediaItemProps {
  mediaItem: MessageFile;
}
function MediaItem({ mediaItem }: MediaItemProps) {
  const { t } = useTypeSafeTranslation();

  const openVideo = () =>
    mediaItem.media && window.open(mediaItem.media, '_blank');
  const videoType =
    mediaItem.fileType === VideoType.quicktime
      ? VideoType.mp4
      : mediaItem.fileType;

  return (
    <StyledMediaFile className="relative -mt-0.5 w-full rounded-lg">
      {IMAGE_TYPE.split(',').some(type => type === mediaItem.fileType) ? (
        <Image
          className="aspect-square h-full w-full cursor-pointer rounded-lg object-cover"
          preview={{
            getContainer: `${t('fileGroup.uploaded')}`,
            mask: (
              <Typography.Text className="absolute bottom-2 left-2 text-xs font-medium text-white ">
                {`${mediaItem.senderName || TERRA_NAME} ${t(
                  'fileGroup.uploaded',
                )}`}
              </Typography.Text>
            ),
          }}
          src={mediaItem.media || ''}
        />
      ) : (
        <div className="relative h-full w-full rounded-lg border border-scroll-bar">
          <div className="hover-content absolute top-0 hidden h-full w-full cursor-pointer rounded-lg bg-dark-title bg-opacity-40 ">
            <Typography.Text className="absolute bottom-2 left-2 text-xs font-medium text-white ">
              {`${mediaItem.senderName || TERRA_NAME} ${t(
                'fileGroup.uploaded',
              )}`}
            </Typography.Text>
          </div>
          <div className="absolute flex aspect-square h-full w-full items-center justify-center ">
            <Button
              className="flex h-6 w-6 items-center justify-center border-none bg-dark-title bg-opacity-40"
              icon={<PlayFilledSVG className="h-4 w-4 text-white" />}
              onClick={openVideo}
              shape="circle"
              size="small"
            />
          </div>
          {mediaItem.media && (
            <a
              className="flex w-full items-center justify-center"
              href={mediaItem.media}
              rel="noreferrer"
              target="_blank"
            >
              <video
                className="aspect-square h-full w-full rounded-lg"
                id="video"
                muted
              >
                <source
                  src={`${mediaItem.media}#t=0.9`}
                  type={videoType || ''}
                />
                {t('error.browserDoesNotSupportVideoTag')}
              </video>
            </a>
          )}
        </div>
      )}
    </StyledMediaFile>
  );
}
export default MediaItem;
