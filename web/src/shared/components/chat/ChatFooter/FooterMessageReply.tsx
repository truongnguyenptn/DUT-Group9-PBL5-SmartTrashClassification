import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import CommonFile from '#/shared/components/common/CommonFile';
import { ReplyMessage } from '#/shared/utils/type/message';
import { TERRA_NAME } from '#/shared/utils/constant';

import { ReactComponent as CloseOutlineSVG } from '#/assets/svgs/close-outline.svg';
import { normalizeText, sliceText } from '#/shared/utils/tool';
import { useInboxVar } from '#/shared/hooks/useInboxVar';

interface FooterMessageReplyProps {
  replyingMessage?: ReplyMessage;
  onRemoveReplyingMessage: () => void;
}

export default function FooterMessageReply({
  onRemoveReplyingMessage,
  replyingMessage,
}: FooterMessageReplyProps) {
  const { t } = useTypeSafeTranslation();
  const { inbox } = useInboxVar();

  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex flex-col gap-2">
        <div className="text-xs">
          {`${t('chat.replyingTo')} `}

          <span className="text-grey-primary-400 font-bold">
            {!replyingMessage?.senderName ||
            replyingMessage.senderEmail === inbox?.email
              ? t('chat.yourself')
              : TERRA_NAME}
          </span>
        </div>
        <div className="whitespace-pre-wrap text-grey-primary-300">
          {replyingMessage?.replySelectedFile?.[0] ? (
            <CommonFile
              allowPreviewFile={false}
              file={replyingMessage.replySelectedFile[0]}
              fileAudioProps={{
                className: 'opacity-70',
              }}
              fileDisplayProps={{
                className: 'opacity-70 bg-grey-light-400',
                fileIconProps: {
                  className: 'h-9',
                  size: 20,
                },
                fontSize: 'text-xs',
                nameLength: 18,
              }}
              fileImageProps={{
                className: 'opacity-70',
                size: 64,
              }}
              fileVideoProps={{
                className: 'opacity-70 h-14 w-14',
              }}
            />
          ) : (
            sliceText(normalizeText(String(replyingMessage?.message)) ?? '')
          )}
        </div>
      </div>
      <span className="cursor-pointer" onClick={onRemoveReplyingMessage}>
        <CloseOutlineSVG height={24} width={24} />
      </span>
    </div>
  );
}
