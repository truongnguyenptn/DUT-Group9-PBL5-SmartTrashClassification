import { Tooltip, Typography } from 'antd';
import { round } from 'lodash-es';
import { formatDate } from '@enouvo/react-uikit';
import FileIcon from '#/shared/components/common/FileIcon';
import { DATE_FORMAT, TERRA_NAME } from '#/shared/utils/constant';
import { FileType } from '#/shared/utils/type/file-group';
import { ReactComponent as AttachOutlineSVG } from '#/assets/svgs/attach-outline.svg';
import { getFileTypeFromFileName } from '#/shared/utils/tool';

interface FileItemLinkProps {
  file: FileType;
}
const { Title, Text } = Typography;

function FileItem({ file }: FileItemLinkProps) {
  const fileSize = file.fileSize
    ? [
        round(file.fileSize / 1000, 2) > 1000
          ? `${round(file.fileSize / 1000000, 2)}MB -`
          : `${round(file.fileSize / 1000, 2)}KB -`,
      ]
    : '';
  const dateFormat = formatDate(file.createdAt, DATE_FORMAT) || 'N/A';
  const fileType = file.fileName ? getFileTypeFromFileName(file.fileName) : '';

  return (
    <div className="flex w-full">
      <div className="mr-4 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-lg bg-grey-5">
        {file.isFileLink ? (
          <AttachOutlineSVG className="h-8 w-8 text-black" />
        ) : (
          <FileIcon fileType={String(fileType)} height={32} width={32} />
        )}
      </div>
      <div className="flex w-[calc(100%-5.75rem)] flex-col">
        <Tooltip
          destroyTooltipOnHide
          placement="topLeft"
          title={file.fileName}
          transitionName=""
        >
          <a
            href={
              file.url.includes('https') || file.url.includes('http')
                ? file.url
                : `//${file.url}`
            }
            rel="noreferrer"
            target="_blank"
          >
            <Title className="-mt-1.5 mb-0 w-full overflow-hidden text-ellipsis whitespace-nowrap text-base	font-semibold text-dark-title">
              {file.fileName || 'N/A'}
            </Title>
          </a>
        </Tooltip>
        <div className="mt-1 flex flex-col">
          <Text className="mr-2 w-full overflow-hidden text-ellipsis whitespace-nowrap pr-2 text-sm font-normal text-grey-primary-300">
            {file.senderName || TERRA_NAME}
          </Text>
          <Text className="mt-1 text-sm font-normal text-grey-primary-300">
            {`${fileSize} ${dateFormat}`}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default FileItem;
