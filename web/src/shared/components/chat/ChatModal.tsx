import styled from '@emotion/styled';
import type { DrawerProps } from 'antd';
import { Drawer, Grid } from 'antd';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeepPartial } from '@enouvo/react-uikit';
import { LoadingOutlined } from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';
import uniqBy from 'lodash-es/uniqBy';
import { isAndroid, isMobile } from 'react-device-detect';
import ChatBody from './ChatBody';
import type { ChatFooterRef } from './ChatFooter';
import ChatFooter from './ChatFooter';
import ChatHeader from './ChatHeader';
import FileGroupDrawer from './FileGroupDrawer';
import { useMeLazyQuery } from '#/generated/schemas';
import type { ReplyMessage } from '#/shared/utils/type/message';
import { scrollToMessageId } from '#/shared/utils/tool';
import {
  FILE_GROUP_SEARCH_PARAM_KEY,
  HASH_VALUE,
} from '#/shared/utils/constant';
import useInboxMessages, {
  DisplayMessage,
} from '#/shared/hooks/useInboxMessages';
import { getCaseName, getEmail } from '#/shared/utils/localStorage';
import { ChatContext } from '#/shared/context/chat';
import { useInboxVar } from '#/shared/hooks/useInboxVar';

const StyledDrawer = styled(Drawer)<{
  isOpenFilterPopup?: boolean;
  isShowFilterInput: boolean;
}>`
  .ant-drawer {
    &-header {
      padding: 0 !important;
      border-bottom: none !important;
    }

    &-footer {
      border-top: none !important;
      padding: 0 !important;
    }

    &-body {
      padding: ${props =>
        props.isOpenFilterPopup
          ? [
              !props.isShowFilterInput
                ? '4rem 0 0.5rem 0 !important'
                : '10rem 0 0.5rem 0 !important',
            ]
          : ' 0 !important'};
      position: relative;
      overflow: hidden;
      display: flex;
    }
  }
`;

const loading = (
  <div className="my-4 flex h-full w-full items-center justify-center overflow-hidden text-lg">
    <LoadingOutlined />
  </div>
);

export default function ChatModal({ ...rest }: DrawerProps) {
  const { hash, search } = useLocation();
  const email = getEmail();
  const caseName = getCaseName();
  const navigate = useNavigate();
  const { md, lg, xl, xxl } = Grid.useBreakpoint();
  const [replyingMessage, setReplyingMessage] = useState<
    ReplyMessage | undefined
  >();
  const { searchValue, isPendingChat, filter, rangeDate } =
    useContext(ChatContext);
  const [isShowFilterInput, setIsShowFilterInput] = useState(true);
  const [allowScrollToLastMessage, setAllowScrollToLastMessage] =
    useState(true);
  const [allowScrollToSearchMessage, setAllowScrollToSearchMessage] =
    useState(false);
  const { inbox, update } = useInboxVar();
  const [getMe] = useMeLazyQuery({
    fetchPolicy: 'network-only',
  });
  const openFileGroup =
    new URLSearchParams(search).get(FILE_GROUP_SEARCH_PARAM_KEY) === 'true';

  const onChangeShowFilterInput = () =>
    setIsShowFilterInput(!isShowFilterInput);

  const [getDisplayMessagesLoading, setGetDisplayMessagesLoading] =
    useState(false);

  const chatFooterRef = useRef<ChatFooterRef>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const previousInboxLastMessageId = useRef<string | null>(null);
  const firstFetchDisplayMessage = useRef(false);

  const {
    displayMessages,
    loadMoreDisplayMessages,
    onFindMessages,
    isLoadingMessages,
    loadSelectedMessageIntoView,
    searchMessage,
    isLoadingDown,
    isLoadingUp,
    getUpOrDownMessages,
    onClearFindMessages,
    setDisplayMessages,
    error,
  } = useInboxMessages({
    inbox,
    onFindMessageCompleted: () => setAllowScrollToSearchMessage(true),
  });

  const onInboxLastMessageIdChange = useCallback(async () => {
    if (
      chatBodyRef.current &&
      !isPendingChat.value &&
      chatBodyRef.current.scrollTop + chatBodyRef.current.offsetHeight + 50 >=
        chatBodyRef.current.scrollHeight
    ) {
      const oldMessages = displayMessages?.filter(msg => !msg.isAddedManually);
      const firstMessageId = oldMessages?.[0]?.id;

      if (firstMessageId) {
        await getUpOrDownMessages({
          isUp: false,
          messageId: firstMessageId,
          onCompleted() {
            if (
              chatBodyRef.current &&
              chatBodyRef.current.scrollTop +
                chatBodyRef.current.offsetHeight +
                50 >=
                chatBodyRef.current.scrollHeight
            ) {
              setAllowScrollToLastMessage(true);
            }
          },
        });
      }
    }
  }, [displayMessages, getUpOrDownMessages, isPendingChat.value]);

  useEffect(() => {
    if (inbox?.lastMessageId && hash === HASH_VALUE) {
      if (!previousInboxLastMessageId.current) {
        previousInboxLastMessageId.current = inbox.lastMessageId;
        return;
      }
      if (previousInboxLastMessageId.current !== inbox.lastMessageId) {
        previousInboxLastMessageId.current = inbox.lastMessageId;
        onInboxLastMessageIdChange();
      }
    }
  }, [hash, inbox?.lastMessageId, onInboxLastMessageIdChange]);

  useEffect(() => {
    /*
     * Have to use setTimeout to scroll down to latest message due to the behavior of
     * the autofocus TextArea that prevents scrolling
     */
    let timer: NodeJS.Timeout;
    if (displayMessages?.[0]?.id) {
      if (allowScrollToLastMessage) {
        const isInputFocused = chatFooterRef.current?.isFocusing;
        setAllowScrollToLastMessage(false);
        isInputFocused && isAndroid && chatFooterRef.current.blur?.();
        scrollToMessageId({
          messageId: displayMessages[0].id,
          scrollOption: {
            behavior: 'auto',
            block: 'end',
            inline: 'nearest',
          },
          takeLatest: true,
        });
        isInputFocused && isAndroid && chatFooterRef.current.focus?.();
      }
      if (searchMessage?.id && allowScrollToSearchMessage) {
        setAllowScrollToSearchMessage(false);
        scrollToMessageId({
          messageId: searchMessage.id,
          scrollOption: {
            behavior: 'auto',
            block: !searchValue.value ? 'end' : 'start',
            inline: 'nearest',
          },
          takeLatest: !searchValue.value,
        });
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [
    searchMessage?.id,
    allowScrollToLastMessage,
    displayMessages,
    searchValue.value,
    allowScrollToSearchMessage,
  ]);

  const refetchNewMessage = useCallback(async () => {
    isPendingChat.setValue(true);
    setDisplayMessages(undefined);
    const { data } = await getMe({
      variables: {
        email: String(email),
        username: String(caseName),
      },
    });
    update(data?.me);
    const lastMessageId = data?.me.lastMessageId;
    if (lastMessageId) {
      const latestMessages = await getUpOrDownMessages({
        allowSetState: false,
        isUp: true,
        messageId: lastMessageId,
      });
      setDisplayMessages(latestMessages);
      setAllowScrollToLastMessage(true);
    }
    isPendingChat.setValue(false);
  }, [
    isPendingChat,
    setDisplayMessages,
    getMe,
    email,
    caseName,
    getUpOrDownMessages,
    update,
  ]);

  const onClearFilter = async () => {
    searchValue.setValue(undefined);
    rangeDate.setValue(undefined);
    setIsShowFilterInput(true);
    onClearFindMessages();
    setGetDisplayMessagesLoading(true);
    await refetchNewMessage();
    setGetDisplayMessagesLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (
        inbox?.lastMessageId &&
        !firstFetchDisplayMessage.current &&
        hash === HASH_VALUE
      ) {
        setGetDisplayMessagesLoading(true);
        await refetchNewMessage();
        setGetDisplayMessagesLoading(false);
        firstFetchDisplayMessage.current = true;
      }
    })();
  }, [hash, inbox?.lastMessageId, refetchNewMessage]);

  const onCloseChat = () => {
    onClearFilter();
    searchValue.setValue(undefined);
    setIsShowFilterInput(true);
    onClearFindMessages();
    navigate({ hash: '' });
    filter.onClose();
  };

  const onSendMessageCompleted = (newMessage: DeepPartial<DisplayMessage>) => {
    setReplyingMessage(undefined);
    /*
     * When displayMessages contains lastMessageId and we're not filtering message
     * append current displayMessages array with new message
     * else fetch new messages
     */
    if (displayMessages?.some(msg => msg.id === inbox?.lastMessageId)) {
      setDisplayMessages(prev =>
        uniqBy(
          [{ ...newMessage, isAddedManually: true }, ...(prev ?? [])],
          'id',
        ),
      );
      setAllowScrollToLastMessage(true);
    } else {
      refetchNewMessage();
      setTimeout(() => {
        chatFooterRef.current?.focus?.();
      }, 100);
    }
  };
  const chatVisible = hash === HASH_VALUE;

  const onCloseFileGroup = () => {
    navigate('#message');
  };

  return (
    <>
      <FileGroupDrawer
        destroyOnClose
        motion={{
          motionAppear: isMobile,
          motionEnter: isMobile,
        }}
        onClose={onCloseFileGroup}
        open={openFileGroup}
        width={!md && !lg && !xl && !xxl ? '100%' : 472}
        zIndex={100}
      />
      <StyledDrawer
        afterOpenChange={() => setAllowScrollToLastMessage(true)}
        closable={false}
        footer={
          <ChatFooter
            onRemoveReplyingMessage={() => setReplyingMessage(undefined)}
            onSendMessageCompleted={onSendMessageCompleted}
            ref={chatFooterRef}
            replyingMessage={replyingMessage}
          />
        }
        isShowFilterInput={isShowFilterInput}
        maskClosable
        onClose={onCloseChat}
        open={chatVisible}
        title={
          <ChatHeader
            isShowFilterInput={isShowFilterInput}
            key={hash}
            onChangeKeySearch={searchValue.setValue}
            onChangeShowFilterInput={onChangeShowFilterInput}
            onClearFilter={onClearFilter}
            onFindMessages={onFindMessages}
          />
        }
        width={!md && !lg && !xl && !xxl ? '100%' : 472}
        zIndex={99}
        {...rest}
      >
        <>
          {isLoadingUp && (
            <div
              className={twMerge(
                'absolute left-0 top-0 z-10 w-full',
                filter.visible && (isShowFilterInput ? 'mt-[9.4rem]' : 'mt-12'),
              )}
            >
              {loading}
            </div>
          )}
          <ChatBody
            emptyDescription={
              searchMessage
                ? 'chat.noMessageFound'
                : 'chat.startYourConversation'
            }
            isLoadingMessages={
              (searchMessage && !displayMessages) ||
              isLoadingMessages ||
              (!displayMessages && !error) ||
              getDisplayMessagesLoading
            }
            isShowFilterInput={isShowFilterInput}
            loadMore={loadMoreDisplayMessages}
            messages={displayMessages}
            onChangeReplyingMessage={replyMessage => {
              setReplyingMessage(replyMessage);
              chatFooterRef.current?.focus?.();
            }}
            onReplyMessageClick={(replyMessageId, replyMessageType, fileUrl) =>
              loadSelectedMessageIntoView({
                fileUrl,
                messageId: replyMessageId,
                messageType: replyMessageType,
              })
            }
            ref={chatBodyRef}
            searchMessageId={searchMessage?.id}
          />
          {isLoadingDown && (
            <div className="absolute bottom-0 left-0 w-full">{loading}</div>
          )}
        </>
      </StyledDrawer>
    </>
  );
}
