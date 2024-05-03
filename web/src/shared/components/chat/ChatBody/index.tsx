import { LoadingOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { forwardRef, useContext, useMemo } from 'react';
import type { DeepPartial } from '@enouvo/react-uikit';
import { twMerge } from 'tailwind-merge';
import ChatMessage from './ChatMessage';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import type { ReplyMessage } from '#/shared/utils/type/message';
import type { Maybe, Message, ReplyMessageType } from '#/generated/schemas';
import type { TranslationKeys } from '#/generated/translationKeys';
import { TERRA_NAME } from '#/shared/utils/constant';
import { ChatContext } from '#/shared/context/chat';
import { useInboxVar } from '#/shared/hooks/useInboxVar';
import NoMessageFound from '#/assets/images/noMessageFound.png';

interface ChatBodyProps {
  messages?: DeepPartial<Message>[];
  onChangeReplyingMessage: (message: ReplyMessage) => void;
  loadMore: (event: React.UIEvent) => void;
  isLoadingMessages?: boolean;
  searchMessageId?: string;
  isShowFilterInput?: boolean;
  emptyDescription?: TranslationKeys;
  onReplyMessageClick?: (
    replyMessageId: string,
    replyMessageType?: Maybe<ReplyMessageType>,
    fileUrl?: Maybe<string>,
  ) => void;
}

export interface ChatBodyRef {
  scrollToLastMessage?: () => void;
}

const loading = (
  <div className="my-4 flex h-full w-full items-center justify-center overflow-hidden text-lg">
    <LoadingOutlined />
  </div>
);

const ChatBody = forwardRef<HTMLDivElement, ChatBodyProps>(
  (
    {
      messages,
      loadMore,
      onChangeReplyingMessage,
      isLoadingMessages,
      isShowFilterInput,
      searchMessageId,
      emptyDescription = 'chat.startYourConversation',
      onReplyMessageClick,
    },
    ref,
  ) => {
    const { t } = useTypeSafeTranslation();
    const { inbox } = useInboxVar();

    const { searchValue, filter } = useContext(ChatContext);

    const reverseMessage = useMemo(
      () => [...(messages ?? [])].reverse(),
      [messages],
    );

    const renderChatMessages = () => {
      if (isLoadingMessages && inbox?.id) {
        return loading;
      }
      if (!messages?.[0]) {
        return (
          <Empty
            className="my-auto flex flex-col items-center"
            description={t(emptyDescription)}
            image={NoMessageFound}
          />
        );
      }
      return reverseMessage.map((message, index) => (
        <ChatMessage
          isFirstMessageInbox={message.id === inbox?.firstMessageId}
          isNextMessageFromProvider={
            reverseMessage[index + 1]?.senderName !== TERRA_NAME
          }
          isNextMessageFromTerra={
            reverseMessage[index + 1]?.senderName === TERRA_NAME
          }
          key={message.id}
          keySearch={searchValue.value}
          message={message}
          onChangeReplyingMessage={onChangeReplyingMessage}
          onReplyMessageClick={onReplyMessageClick}
          searchMessageId={searchMessageId}
        />
      ));
    };

    return (
      <div
        className={twMerge(
          'flex w-full flex-col overflow-x-hidden',
          messages?.[0] && 'scroll-py-1 overflow-y-scroll pl-5 pr-2',
          filter.visible && (isShowFilterInput ? 'mt-[9.7rem]' : 'mt-[3.5rem]'),
        )}
        id="chat-body"
        onScroll={loadMore}
        ref={ref}
      >
        {renderChatMessages()}
      </div>
    );
  },
);

export default ChatBody;
