import type { DeepPartial } from '@enouvo/react-uikit';
import { twMerge } from 'tailwind-merge';
import { isMobile } from 'react-device-detect';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { IMAGE_TYPE, IS_XS_SCREEN, TERRA_NAME } from '#/shared/utils/constant';
import type { Maybe, Message } from '#/generated/schemas';
import { ReplyMessageType } from '#/generated/schemas';
import { ReactComponent as ReplyFilledSVG } from '#/assets/svgs/reply-filled.svg';
import FileDisplay from '#/shared/components/common/FileDisplay';
import { normalizeText, truncateText } from '#/shared/utils/tool';
import { useInboxVar } from '#/shared/hooks/useInboxVar';

interface ChatMessageReplyProps {
  message?: DeepPartial<Message> | null;
  isSender: boolean;
  onReplyMessageClick?: (
    replyMessageId: string,
    replyMessageType?: Maybe<ReplyMessageType>,
    fileUrl?: Maybe<string>,
  ) => void;
}

export default function ChatMessageReply({
  isSender,
  message,
  onReplyMessageClick,
}: ChatMessageReplyProps) {
  const { t } = useTypeSafeTranslation();

  const { inbox } = useInboxVar();

  const imageFiles = message?.replySelectedFile?.filter(file =>
    IMAGE_TYPE.split(',').includes(file?.type ?? ''),
  );

  const otherFiles = message?.replySelectedFile?.filter(
    file => !imageFiles?.some(item => item?.url === file?.url),
  );

  const getReplyText = (senderName: string, replySenderName: string) => {
    const firstName =
      !senderName || senderName === inbox?.inboxName
        ? t('chat.you')
        : senderName;

    const secondName = (() => {
      if (!replySenderName || replySenderName === inbox?.inboxName) {
        return isSender ? t('chat.yourself') : t('chat.you');
      }
      return TERRA_NAME;
    })();

    return `${firstName} ${t('chat.replyTo')} ${secondName}`;
  };
  return (
    <div
      className={twMerge(
        'z-0 flex cursor-pointer',
        isSender && 'flex-row-reverse',
      )}
    >
      <div
        className={twMerge(
          '-mb-5 flex cursor-pointer flex-col items-start',
          isSender && 'items-end',
        )}
        onClick={() => {
          isMobile && document.getElementById('message-text')?.blur();
          setTimeout(() => {
            message?.replyToMessageId &&
              onReplyMessageClick?.(
                message.replyToMessageId,
                message.replySelectedMessageType,
                message.replySelectedFile?.[0]?.url,
              );
          }, 100);
        }}
        onMouseEnter={() => {
          isMobile && document.getElementById('message-text')?.blur();
          isMobile &&
            setTimeout(() => {
              message?.replyToMessageId &&
                onReplyMessageClick?.(
                  message.replyToMessageId,
                  message.replySelectedMessageType,
                  message.replySelectedFile?.[0]?.url,
                );
            }, 100);
        }}
      >
        <div className="flex items-center gap-2 text-grey-primary-300">
          {<ReplyFilledSVG height={24} width={24} />}{' '}
          {getReplyText(
            message?.senderName ?? '',
            message?.replyToMessage?.senderName ?? '',
          )}
        </div>
        {message?.replySelectedMessageType === ReplyMessageType.Image && (
          <img
            className="h-[7.5rem] w-[7.5rem] rounded-lg object-cover opacity-70"
            src={imageFiles?.[0]?.url ?? ''}
          />
        )}
        {message?.replySelectedMessageType === ReplyMessageType.File && (
          <FileDisplay
            className="h-13 bg-grey-secondary-100"
            file={otherFiles?.[0]}
            fileIconProps={{
              className: 'h-9',
              size: 20,
            }}
            fontSize="text-xs"
            nameLength={16}
            textColor="text-gray-500"
          />
        )}
        {message?.replySelectedMessageType === ReplyMessageType.Text && (
          <div
            className={twMerge(
              'flex w-fit max-w-[20rem] flex-col whitespace-pre-wrap break-words rounded-lg bg-border-light px-3 py-2 text-xs text-grey-primary-500',
              IS_XS_SCREEN && 'max-w-[16rem]',
            )}
          >
            {truncateText(
              normalizeText(String(message.replySelectedMessage)) ?? '',
              390,
            )}
          </div>
        )}
      </div>
    </div>
  );
}
