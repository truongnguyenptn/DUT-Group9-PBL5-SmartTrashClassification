import { Empty, Image, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MediaItem from './MediaItem';

import type { MessageFile } from '#/generated/schemas';
import useGetFileGroupItems from '#/shared/hooks/useGetFileGroupItems';
import {
  DEFAULT_PAGE,
  FILE_GROUP_SEARCH_PARAM_KEY,
  KEY_GROUP_FILE,
  MAX_MEDIA_FILE,
} from '#/shared/utils/constant';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { FileGroupType } from '#/shared/utils/type/file-group';
import EmptyFileBox from '#/assets/images/group-file-empty-outlined.png';
import { useInboxVar } from '#/shared/hooks/useInboxVar';

interface MediaProps {
  currentTab?: string;
}

export default function Media({ currentTab }: MediaProps) {
  const { inbox } = useInboxVar();
  const { t } = useTypeSafeTranslation();
  const { search } = useLocation();
  const [height, setHeight] = useState(0);
  const openFileGroup =
    new URLSearchParams(search).get(FILE_GROUP_SEARCH_PARAM_KEY) === 'true';

  const containerRef = useRef<HTMLDivElement>(null);
  const {
    getMessageFileLoading,
    listItems: listMedias,
    loadMoreMessageFiles,
    pagination,
  } = useGetFileGroupItems({
    filterKey: KEY_GROUP_FILE.media,
    id: inbox?.id,
    limitSize: MAX_MEDIA_FILE,
    skip: currentTab !== FileGroupType.Media || !openFileGroup,
  });

  useEffect(() => {
    const topElement = document.getElementById('top');
    if (topElement && height) {
      topElement.scrollTo({
        behavior: 'smooth',
        top: height - 160,
      });
    }
  }, [listMedias, height, containerRef]);

  const handleLoadMoreMessageFiles = async () => {
    const clientHeight = containerRef.current?.clientHeight;
    clientHeight && setHeight(clientHeight);
    loadMoreMessageFiles();
  };

  if (getMessageFileLoading && pagination.pageNumber === DEFAULT_PAGE)
    return (
      <div className="flex h-full items-center justify-center">
        <Spin spinning={getMessageFileLoading} />
      </div>
    );
  if (listMedias.length <= 0)
    return (
      <div className="flex justify-center">
        <Empty
          className="mt-[6.25rem] h-44 w-44"
          description={t('fileGroup.noMediaData')}
          image={EmptyFileBox}
          imageStyle={{ height: '11rem', width: '11rem' }}
        />
      </div>
    );
  return (
    <div className="h-full overflow-y-auto pt-3" id="top">
      <div
        className="grid grid-cols-3 py-2 pl-4 pr-1 ss:pl-4 ss:pr-3 xs:grid-cols-2"
        ref={containerRef}
      >
        <Image.PreviewGroup preview={{ transitionName: '' }}>
          {listMedias.map((item: MessageFile) => (
            <div
              className="col-span-1 aspect-square rounded-lg pr-1"
              key={`${item.id}`}
            >
              <MediaItem mediaItem={item} />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
      {getMessageFileLoading ? (
        <div className="flex items-center justify-center pb-4 pt-2">
          <Spin spinning={getMessageFileLoading} />
        </div>
      ) : (
        listMedias.length < pagination.totalItem && (
          <p
            className="cursor-pointer pb-4 pl-4 pt-2 text-sm font-semibold"
            onClick={handleLoadMoreMessageFiles}
          >{`${t('commonFields.seeMore')} ...`}</p>
        )
      )}
    </div>
  );
}
