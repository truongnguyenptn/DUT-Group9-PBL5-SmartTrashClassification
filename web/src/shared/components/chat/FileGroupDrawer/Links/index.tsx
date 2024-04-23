import { Empty, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import FileItem from '../Files/FileItem';
import EmptyFileBox from '#/assets/images/group-file-empty-outlined.png';
import useGetFileGroupItems from '#/shared/hooks/useGetFileGroupItems';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import {
  DEFAULT_PAGE,
  FILE_GROUP_SEARCH_PARAM_KEY,
  KEY_GROUP_FILE,
} from '#/shared/utils/constant';
import { FileGroupType } from '#/shared/utils/type/file-group';
import { useInboxVar } from '#/shared/hooks/useInboxVar';

interface LinksProps {
  currentTab?: string;
}

export default function Links({ currentTab }: LinksProps) {
  const { t } = useTypeSafeTranslation();
  const { inbox } = useInboxVar();
  const { search } = useLocation();
  const openFileGroup =
    new URLSearchParams(search).get(FILE_GROUP_SEARCH_PARAM_KEY) === 'true';

  const {
    getMessageFileLoading,
    listItems: links,
    loadMoreMessageFiles,
    pagination,
  } = useGetFileGroupItems({
    filterKey: KEY_GROUP_FILE.link,
    id: inbox?.id,
    skip: currentTab !== FileGroupType.Links || !openFileGroup,
  });

  if (getMessageFileLoading && pagination.pageNumber === DEFAULT_PAGE)
    return (
      <div className="flex h-full items-center justify-center">
        <Spin spinning={getMessageFileLoading} />
      </div>
    );
  if (links.length <= 0)
    return (
      <div className="flex justify-center">
        <Empty
          className="mt-[6.25rem] h-44 w-44"
          description={t('fileGroup.noLinkData')}
          image={EmptyFileBox}
          imageStyle={{ height: '11rem', width: '11rem' }}
        />
      </div>
    );
  return (
    <div className="h-full overflow-x-hidden overflow-y-scroll pb-2 pl-4 pr-2 pt-3">
      {links.map(item => (
        <div className="mb-5" key={item.id}>
          <FileItem
            file={{
              createdAt: item.createdAt,
              fileName: item.link || '',
              fileSize: item.fileSize || null,
              getMessageFileLoading,
              isFileLink: true,
              senderName: item.senderName || '',
              url: item.link || '',
            }}
          />
        </div>
      ))}
      {getMessageFileLoading ? (
        <div className="flex h-[3.125rem] items-center justify-center">
          <Spin spinning={getMessageFileLoading} />
        </div>
      ) : (
        links.length < pagination.totalItem && (
          <p
            className="cursor-pointer pb-4 text-sm font-semibold"
            onClick={loadMoreMessageFiles}
          >{`${t('commonFields.seeMore')} ...`}</p>
        )
      )}
    </div>
  );
}
