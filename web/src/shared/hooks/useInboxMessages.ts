import { DeepPartial } from '@enouvo/react-uikit';
import { useState, useCallback, useContext } from 'react';
import uniqBy from 'lodash-es/uniqBy';
import last from 'lodash-es/last';
import { DEFAULT_PAGE_SIZE } from '../utils/constant';
import { scrollToMessage, ScrollToMessageOption, logger } from '../utils/tool';
import { ChatContext } from '../context/chat';
import {
  Inbox,
  Message,
  QueryOperator,
  useFindMessagesLazyQuery,
} from '#/generated/schemas';

interface UseInboxMessagesProps {
  inbox?: DeepPartial<Inbox>;
  onFindMessageCompleted?: () => void;
}

export type DisplayMessage = Message & { isAddedManually?: boolean };

const useInboxMessages = ({
  inbox,
  onFindMessageCompleted,
}: UseInboxMessagesProps) => {
  const [searchMessage, setSearchMessage] = useState<
    DeepPartial<DisplayMessage> | undefined
  >();
  const [displayMessages, setDisplayMessages] = useState<
    DeepPartial<DisplayMessage>[] | undefined
  >(undefined);

  const { isPendingChat } = useContext(ChatContext);

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingUp, setIsLoadingUp] = useState(false);
  const [isLoadingDown, setIsLoadingDown] = useState(false);

  const [findMessages, { error }] = useFindMessagesLazyQuery({
    fetchPolicy: 'network-only',
  });

  /*
   * This function is to get the 20 up or down messages
   * isUp is used for specifying whether it's up or down messages
   * allowSetState is a flag to decide to mutate the current displayMessages, set to false if we only
   * want to get the result of the API
   * onCompleted is trigger after onLoadMore finished
   */
  const getUpOrDownMessages = useCallback(
    async ({
      messageId,
      isUp,
      allowSetState = true,
      onCompleted,
    }: {
      messageId: string;
      isUp?: boolean;
      allowSetState?: boolean;
      onCompleted?: () => void;
    }) => {
      if (inbox?.id) {
        try {
          const responseData = await findMessages({
            variables: {
              input: {
                inboxId: inbox.id,
                messageId,
              },
              queryParams: {
                filters: [
                  {
                    data: 'true',
                    field: isUp ? 'Message.isUp' : 'Message.isDown',
                    operator: QueryOperator.Eq,
                  },
                ],
                limit: DEFAULT_PAGE_SIZE,
                orderBy: 'Message.createdAt:DESC',
              },
            },
          });
          if (allowSetState) {
            const messages = responseData.data?.findMessages.items ?? [];
            // Mutate the current displayMessages
            setDisplayMessages(oldData =>
              isUp
                ? uniqBy([...(oldData ?? []), ...messages], 'id')
                : uniqBy([...messages, ...(oldData ?? [])], 'id'),
            );
          } else {
            return responseData.data?.findMessages.items ?? [];
          }
        } catch (error) {
          logger(error);
        } finally {
          setIsLoadingMessages(false);
          onCompleted?.();
        }
      }
    },
    [findMessages, inbox?.id],
  );

  /*
   * This function is to load more messages when scroll up or down
   * oldMessages is the current data we get from API because current displayMessages
   * might contain some additional messages we add while send new message
   * We'll stop scroll up if the current oldMessages contains firstMessageId
   * We'll stop scroll down if the current oldMessages contains lastMessageId
   */
  const loadMoreDisplayMessages = async (event: React.UIEvent) => {
    const target = event.target as HTMLDivElement;
    const oldMessages = displayMessages?.filter(msg => !msg.isAddedManually);

    if (target.scrollTop === 0) {
      const lastMessageId = last(oldMessages)?.id;
      if (
        oldMessages?.some(message => message.id === inbox?.firstMessageId) ||
        isLoadingUp ||
        isLoadingMessages ||
        !lastMessageId
      )
        return;
      setIsLoadingUp(true);
      await getUpOrDownMessages({ isUp: true, messageId: lastMessageId });
      target.scrollTo({ top: 200 });
      setIsLoadingUp(false);
    }

    if (target.scrollTop + target.offsetHeight + 10 >= target.scrollHeight) {
      const firstMessageId = oldMessages?.[0]?.id;

      if (
        oldMessages?.some(message => message.id === inbox?.lastMessageId) ||
        isLoadingDown ||
        isLoadingMessages ||
        !firstMessageId
      )
        return;

      setIsLoadingDown(true);
      await getUpOrDownMessages({ isUp: false, messageId: firstMessageId });
      setIsLoadingDown(false);
    }
  };

  const loadSelectedMessageIntoView = async (
    options: Omit<ScrollToMessageOption, 'behavior'>,
  ) => {
    const { messageId } = options;
    if (
      [...(displayMessages ?? [])]
        .slice(1, -1)
        .some(message => message.id === messageId)
    ) {
      scrollToMessage({ ...options, behavior: 'smooth' });
    } else {
      isPendingChat.setValue(true);
      setIsLoadingMessages(true);
      setDisplayMessages(undefined);
      const [aboveMessages, belowMessages] = await Promise.all([
        await getUpOrDownMessages({
          allowSetState: false,
          isUp: true,
          messageId,
        }),
        await getUpOrDownMessages({
          allowSetState: false,
          isUp: false,
          messageId,
        }),
      ]);
      setDisplayMessages(() =>
        uniqBy([...(belowMessages ?? []), ...(aboveMessages ?? [])], 'id'),
      );
      setIsLoadingMessages(false);
      isPendingChat.setValue(false);
      setTimeout(() => {
        scrollToMessage({ ...options, behavior: 'smooth' });
      }, 500);
    }
  };

  // This function is to find messages when filter message with message's content or message's date
  const onFindMessages = async (findMessage?: DeepPartial<Message>) => {
    if (inbox?.id && findMessage?.id) {
      setSearchMessage(findMessage);
      setIsLoadingMessages(true);
      if (
        ![...(displayMessages ?? [])]
          .slice(1, -1)
          .find(message => message.id === findMessage.id)
      ) {
        setDisplayMessages(undefined);

        isPendingChat.setValue(true);
        const [aboveMessages, belowMessages] = await Promise.all([
          await getUpOrDownMessages({
            allowSetState: false,
            isUp: true,
            messageId: findMessage.id,
          }),
          await getUpOrDownMessages({
            allowSetState: false,
            isUp: false,
            messageId: findMessage.id,
          }),
        ]);
        setDisplayMessages(() =>
          uniqBy([...(belowMessages ?? []), ...(aboveMessages ?? [])], 'id'),
        );
      }
      setIsLoadingMessages(false);
    } else {
      setSearchMessage({});
      setDisplayMessages([]);
    }
    isPendingChat.setValue(false);
    onFindMessageCompleted?.();
  };

  const onClearFindMessages = () => {
    setSearchMessage(undefined);
  };

  return {
    displayMessages,
    error,
    getUpOrDownMessages,
    isLoadingDown,
    isLoadingMessages,
    isLoadingUp,
    loadMoreDisplayMessages,
    loadSelectedMessageIntoView,
    onClearFindMessages,
    onFindMessages,
    searchMessage,
    setDisplayMessages,
  };
};

export default useInboxMessages;
