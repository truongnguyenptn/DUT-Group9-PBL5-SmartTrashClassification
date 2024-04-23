import { Image, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import styled from '@emotion/styled';
import { twMerge } from 'tailwind-merge';
import { useRef } from 'react';
import Tippy from '@tippyjs/react';
import { isIOS, isMobile } from 'react-device-detect';
import { DeepPartial } from '@enouvo/react-uikit';
import DOMPurify from 'dompurify';
import ChatMessageReply from './ChatMessageReply';
import ConditionalWrapper from './../../common/ConditionalWrapper';
import CommonFile from '#/shared/components/common/CommonFile';
import { Maybe, MessageFile, ReplyMessageType } from '#/generated/schemas';
import { getUrlsFromText, detectUrl } from '#/shared/utils/url';
import {
  DATE_OF_BEFORE_YEAR_FORMAT,
  DATE_OF_CURRENT_YEAR_FORMAT,
  IMAGE_TYPE,
  IS_XS_SCREEN,
  TERRA_NAME,
} from '#/shared/utils/constant';
import {
  downLoadFile,
  getChatMessageId,
  getFileNameFromUrl,
  normalizeText,
} from '#/shared/utils/tool';
import { ReplyMessage } from '#/shared/utils/type/message';
import { formatMessageDate } from '#/shared/utils/date';
import { useGetSelectedMessageId } from '#/shared/hooks/useGetSelectedMessageId';

import { ReactComponent as DownloadSVG } from '#/assets/svgs/download-outline.svg';
import { ReactComponent as EyeSVG } from '#/assets/svgs/eye-outline.svg';
import { ReactComponent as ReplyFilledSVG } from '#/assets/svgs/reply-filled.svg';

interface ChatMessageProps {
  isNextMessageFromProvider?: boolean;
  isNextMessageFromTerra?: boolean;
  message?: ReplyMessage;
  onChangeReplyingMessage: (message: ReplyMessage) => void;
  replyMessageType?: ReplyMessageType;
  keySearch?: string;
  searchMessageId?: string;
  classNames?: string;
  fileClassName?: string;
  onReplyMessageClick?: (
    replyMessageId: string,
    replyMessageType?: Maybe<ReplyMessageType>,
    fileUrl?: Maybe<string>,
  ) => void;
  isFirstMessageInbox?: boolean;
}

const StyledChatMessageContainer = styled.div`
  :hover {
    .reply-icon {
      display: block !important;
    }
  }
`;

const StyledContainer = styled.div`
  a {
    text-decoration: underline;
  }
`;

function MessageContainer({
  onChangeReplyingMessage,
  message,
  replyMessageType,
  keySearch,
  searchMessageId,
  classNames,
  fileClassName,
  onReplyMessageClick,
}: ChatMessageProps) {
  const chatMessageContainer = useRef<HTMLDivElement>(null);
  const messageContentContainer = useRef<HTMLDivElement>(null);
  const isSender = message?.senderName !== TERRA_NAME;
  const messageDate = formatMessageDate(message?.createdAt);
  const trimmedKeySearch = keySearch?.trim();

  const { selectedMessageId, update: updateSelectedMessageId } =
    useGetSelectedMessageId();

  const chatMessageElementId = getChatMessageId({
    fileUrl:
      message?.messageFiles?.[0]?.media ?? message?.messageFiles?.[0]?.file,
    messageId: message?.id ?? '',
    messageType: replyMessageType,
  });

  const messageDateVisible = selectedMessageId === chatMessageElementId;

  const getSizeImage = () => {
    if (message?.messageFiles?.length === 1) return 240;
    if (
      message?.messageFiles?.length === 2 ||
      message?.messageFiles?.length === 4
    )
      return IS_XS_SCREEN ? 118 : 179;
    return IS_XS_SCREEN ? 77.33 : 118;
  };

  const renderHighlightText = () => {
    const { hasUrl: isUrl, urls } = getUrlsFromText(message?.message ?? '');
    const highlightClassName =
      searchMessageId === message?.id
        ? 'bg-alert font-bold text-white inline'
        : `bg-sky-600 inline p-0 text-white`;

    if (isUrl && message?.message) {
      let formattedText = message.message;

      urls.forEach(url => {
        formattedText = formattedText.replaceAll(url, ` ${url} `);
      });

      return formattedText.split(' ').map((item, index) => {
        const { hasUrl, urls } = getUrlsFromText(item);

        if (hasUrl) {
          const href =
            urls[0].includes('https') || urls[0].includes('http')
              ? urls[0]
              : `//${urls[0]}`;

          return (
            <a
              className="inline h-full text-primary"
              href={href}
              key={`${item}-${index}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Highlighter
                autoEscape
                className="underline"
                highlightClassName={highlightClassName}
                searchWords={[trimmedKeySearch || '']}
                textToHighlight={normalizeText(item) ?? ''}
              />
            </a>
          );
        }
        return (
          <Highlighter
            highlightClassName={highlightClassName}
            key={`${item}-${index}`}
            searchWords={[trimmedKeySearch || '']}
            textToHighlight={normalizeText(`${item}`) ?? ' '}
          />
        );
      });
    }

    return (
      <Highlighter
        autoEscape
        highlightClassName={highlightClassName}
        searchWords={[trimmedKeySearch || '']}
        style={{ whiteSpace: 'pre-wrap' }}
        textToHighlight={normalizeText(message?.message ?? '') ?? ''}
      />
    );
  };

  const messageContent = (
    <StyledContainer
      className={twMerge(
        'flex max-w-[22rem] flex-col whitespace-pre-wrap break-words rounded-lg bg-white-smoke px-3 py-2',
        isSender && 'bg-grey-heavy text-white',
        IS_XS_SCREEN && 'max-w-[80vw]',
        classNames,
      )}
      {...(!trimmedKeySearch && {
        dangerouslySetInnerHTML: {
          ['__html']: detectUrl(
            DOMPurify.sanitize(String(message?.message ?? ''), {
              ['USE_PROFILES']: { html: false, svg: false },
            }),
          ),
        },
      })}
      id={chatMessageElementId}
      ref={messageContentContainer}
    >
      {trimmedKeySearch ? (
        <div id={message?.id}>{renderHighlightText()}</div>
      ) : null}
    </StyledContainer>
  );
  const downloadMessagedFile = (file: DeepPartial<MessageFile> | undefined) => {
    const fileUrl = file?.media ?? file?.file;
    const fileName = file?.fileName ?? 'FilePDF';
    fileUrl && fileName && downLoadFile(fileUrl, fileName);
  };
  return (
    <StyledChatMessageContainer
      className={twMerge(
        'relative z-0 flex flex-col gap-y-4',
        message?.id,
        messageDateVisible && 'mb-6',
      )}
      id={message?.id}
      ref={chatMessageContainer}
    >
      {message?.replyToMessageId && (
        <ChatMessageReply
          isSender={isSender}
          message={message}
          onReplyMessageClick={onReplyMessageClick}
        />
      )}
      <div
        className={twMerge(
          'z-10 flex items-center gap-2',
          isSender && 'flex-row-reverse',
        )}
        onMouseEnter={() => {
          if (isMobile) {
            const chatBody = document.getElementById('chat-body');
            if (chatBody) {
              const isScrollToBottom =
                chatBody.scrollHeight - 10 <=
                chatBody.scrollTop + chatBody.clientHeight;
              isScrollToBottom &&
                setTimeout(() => {
                  chatBody.scrollTop = chatBody.scrollHeight;
                }, 10);
            }
            updateSelectedMessageId(chatMessageElementId);
          }
        }}
      >
        <ConditionalWrapper
          condition={!isMobile}
          wrapper={children => (
            <Tippy
              arrow={false}
              className="p-1 text-xs text-white"
              content={messageDate}
              offset={() => {
                if (isSender) {
                  return [0, 40];
                }
                return [0, 10];
              }}
              placement="left"
              popperOptions={{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: document.getElementById('chat-body'),
                    },
                  },
                  {
                    enabled: true,
                    fn: ({ state }) => {
                      const boundaryThreshold =
                        (messageContentContainer.current?.clientHeight ?? 0) /
                          2 +
                        10;
                      if (
                        state.modifiersData.preventOverflow &&
                        (state.modifiersData.preventOverflow.y >=
                          boundaryThreshold ||
                          state.modifiersData.preventOverflow.y <=
                            -boundaryThreshold)
                      ) {
                        state.elements.popper.style.display = 'none';
                      } else {
                        state.elements.popper.style.display = 'block';
                      }
                    },
                    name: 'hide',
                  },
                ],
              }}
            >
              {children}
            </Tippy>
          )}
        >
          {message?.messageFiles?.[0] ? (
            <div
              className={twMerge(
                ' flex max-w-[22.625rem] flex-wrap justify-end gap-1',
                IS_XS_SCREEN &&
                  replyMessageType === ReplyMessageType.Image &&
                  'max-w-[15rem]',
                !isSender && 'justify-start',
                classNames,
              )}
              id={chatMessageElementId}
              ref={messageContentContainer}
            >
              <Image.PreviewGroup preview={{ transitionName: '' }}>
                {message.messageFiles.map(file => (
                  <CommonFile
                    file={{
                      name:
                        file?.fileName ??
                        getFileNameFromUrl(file?.media ?? file?.file ?? ''),
                      size: file?.fileSize,
                      type: file?.fileType,
                      url: file?.media ?? file?.file,
                    }}
                    fileAudioProps={{
                      showContent: true,
                    }}
                    fileDisplayProps={{
                      className: twMerge(
                        'h-14 bg-grey-light-400 w-full',
                        fileClassName,
                      ),
                      extra: (
                        <a
                          className="rounded-full bg-scroll-bar p-2.5 text-grey"
                          onClick={() => downloadMessagedFile(file)}
                          {...(isIOS && {
                            onMouseEnter: () => downloadMessagedFile(file),
                          })}
                        >
                          {typeof file?.fileType === 'string' &&
                          file.fileType.includes('pdf') &&
                          isMobile &&
                          isIOS ? (
                            <EyeSVG height={16} width={16} />
                          ) : (
                            <DownloadSVG height={12} width={12} />
                          )}
                        </a>
                      ),
                      nameLength: IS_XS_SCREEN ? 26 : 32,
                    }}
                    fileImageProps={{
                      size: getSizeImage(),
                    }}
                    fileVideoProps={{
                      showContent: true,
                    }}
                    key={file?.media ?? file?.file}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          ) : (
            messageContent
          )}
        </ConditionalWrapper>
        <span
          className="reply-icon hover:bg-grey-primary-100 hidden cursor-pointer rounded-full p-[1px] text-grey-primary-300 hover:text-grey-primary-500"
          onClick={() =>
            onChangeReplyingMessage({
              ...message,
              replyMessageType,
              replySelectedFile: [
                ...(message?.messageFiles ?? []).map(file => ({
                  name:
                    file?.fileName ??
                    getFileNameFromUrl(file?.media ?? file?.file ?? ''),
                  size: file?.fileSize,
                  type: file?.fileType,
                  url: file?.media ?? file?.file,
                })),
              ],
              replySelectedMessage: message?.message,
            })
          }
        >
          <ReplyFilledSVG height={24} width={24} />
        </span>
      </div>
      {isMobile && (
        <Typography.Text
          className={twMerge(
            'absolute text-grey-primary-300 transition-transform',
            messageDateVisible ? '-bottom-6 opacity-80' : 'bottom-0 opacity-0',
            isSender && 'right-0',
          )}
        >
          {messageDate}
        </Typography.Text>
      )}
    </StyledChatMessageContainer>
  );
}

export default function ChatMessage({
  message,
  onChangeReplyingMessage,
  keySearch,
  searchMessageId,
  isNextMessageFromProvider,
  isNextMessageFromTerra,
  onReplyMessageClick,
  isFirstMessageInbox,
}: ChatMessageProps) {
  const isSender = message?.senderName !== TERRA_NAME;

  const getSenderAndReceiverClassName = () => {
    if (isSender) {
      if (isNextMessageFromProvider) return 'mb-1';
      if (isNextMessageFromTerra) return 'mb-2';
      return 'mb-2';
    }
    if (isNextMessageFromProvider) return 'mb-2';
    if (isNextMessageFromTerra) return 'mb-1';
    return 'mb-1';
  };

  if (message) {
    const { message: messageContent, messageFiles, ...rest } = message;

    const imageFiles = messageFiles?.filter(file =>
      IMAGE_TYPE.split(',').includes(file?.fileType ?? ''),
    );

    const otherFiles = messageFiles?.filter(
      file => !imageFiles?.includes(file) && !file?.link,
    );

    return (
      <div
        className={twMerge(
          'flex flex-col gap-1',
          getSenderAndReceiverClassName(),
        )}
      >
        {(isFirstMessageInbox || message.isFirstMessageOfTheDay) && (
          <div className="my-4 flex justify-center">
            <Typography.Text className="text-grey-primary-300">
              {formatMessageDate(
                message.createdAt,
                DATE_OF_CURRENT_YEAR_FORMAT.shortMonth,
                DATE_OF_BEFORE_YEAR_FORMAT.shortMonth,
              )}
            </Typography.Text>
          </div>
        )}
        {messageContent && (
          <MessageContainer
            isNextMessageFromProvider={isNextMessageFromProvider}
            isNextMessageFromTerra={isNextMessageFromTerra}
            keySearch={keySearch}
            message={{
              message: messageContent,
              ...rest,
            }}
            onChangeReplyingMessage={onChangeReplyingMessage}
            onReplyMessageClick={onReplyMessageClick}
            replyMessageType={ReplyMessageType.Text}
            searchMessageId={searchMessageId}
          />
        )}
        {imageFiles?.[0] && (
          <MessageContainer
            isNextMessageFromProvider={isNextMessageFromProvider}
            isNextMessageFromTerra={isNextMessageFromTerra}
            message={{
              messageFiles: [...imageFiles].sort(
                (a, b) => (a?.fileIndex ?? 0) - (b?.fileIndex ?? 0),
              ),
              ...rest,
            }}
            onChangeReplyingMessage={onChangeReplyingMessage}
            onReplyMessageClick={onReplyMessageClick}
            replyMessageType={ReplyMessageType.Image}
            searchMessageId={searchMessageId}
          />
        )}
        {[...(otherFiles ?? [])]
          .sort((a, b) => (a?.fileIndex ?? 0) - (b?.fileIndex ?? 0))
          .map((file, index) => (
            <MessageContainer
              isNextMessageFromProvider={isNextMessageFromProvider}
              isNextMessageFromTerra={isNextMessageFromTerra}
              key={`${file?.media ?? file?.file}-${index}`}
              message={{ messageFiles: [file], ...rest }}
              onChangeReplyingMessage={onChangeReplyingMessage}
              onReplyMessageClick={onReplyMessageClick}
              replyMessageType={ReplyMessageType.File}
              searchMessageId={searchMessageId}
            />
          ))}
      </div>
    );
  }
  return <></>;
}
