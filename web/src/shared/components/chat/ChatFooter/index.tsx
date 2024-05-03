import { useToggle } from '@enouvo/react-hooks';
import type { DeepPartial } from '@enouvo/react-uikit';
import { showError } from '@enouvo/react-uikit';
import type { UploadFile } from 'antd';
import { Form } from 'antd';
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Attachments from './Attachments';
import ChatInput from './ChatInput';
import FooterMessageReply from './FooterMessageReply';
import { isMedia, sanitizeText } from '#/shared/utils/tool';
import type { ReplyMessage } from '#/shared/utils/type/message';
import {
  getCaseName,
  getEmail,
  getName,
  getProviderCompanyName,
} from '#/shared/utils/localStorage';
import { MAX_IMAGE_FILE } from '#/shared/utils/constant';
import { InboxType, useSendMessageMutation } from '#/generated/schemas';
import type { Message, MessageInputDto } from '#/generated/schemas';
import { getUrlsFromText } from '#/shared/utils/url';
import { ChatContext } from '#/shared/context/chat';
import { useInboxVar } from '#/shared/hooks/useInboxVar';

interface ChatFooterProps {
  replyingMessage?: ReplyMessage;
  onRemoveReplyingMessage: () => void;
  onSendMessageCompleted?: (messages: DeepPartial<Message>) => void;
}

export interface ChatFooterRef {
  focus?: () => void;
  blur?: () => void;
  isFocusing?: boolean;
}

const ChatFooter = forwardRef<ChatFooterRef, ChatFooterProps>(
  (
    { replyingMessage, onSendMessageCompleted, onRemoveReplyingMessage },
    ref,
  ) => {
    const [form] = Form.useForm();
    const [showAttachments, _onOpen, _onClose] = useToggle(false);
    const providerCompanyName = getProviderCompanyName();
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    const chatInputRef = useRef<HTMLInputElement>(null);
    const { isPendingChat } = useContext(ChatContext);
    useImperativeHandle(ref, () => ({
      blur: chatInputRef.current?.blur,
      focus: chatInputRef.current?.focus,
      isFocusing:
        document.getElementById('message-text')?.id ===
        document.activeElement?.id,
    }));

    const inputMessage = Form.useWatch<string | undefined>('message', form);
    const inputFiles = Form.useWatch<UploadFile[] | undefined>('files', form);
    const isImageFileLimitExceeded =
      inputFiles && inputFiles.length > MAX_IMAGE_FILE;

    const canSendMessage =
      !isSendingMessage &&
      !isPendingChat.value &&
      (!!inputMessage?.trim() || !!inputFiles?.[0]) &&
      !isImageFileLimitExceeded;

    const { inbox } = useInboxVar();

    const [sendMessage, { loading }] = useSendMessageMutation({
      onCompleted(data) {
        onSendMessageCompleted?.({
          ...data.sendMessage,
        });
        setIsSendingMessage(false);
        onRemoveReplyingMessage();
        form.resetFields();
        form.setFieldValue('files', undefined);
      },
      onError: e => {
        setIsSendingMessage(false);
        showError(e);
      },
    });

    const onSendMessage = ({
      message,
      files: uploadFiles,
    }: DeepPartial<MessageInputDto>) => {
      let index = 0;
      chatInputRef.current?.focus();
      setIsSendingMessage(true);
      const [civility, firstName, lastName] = getName()?.split(' ') ?? '';
      const media: UploadFile[] | undefined = uploadFiles?.filter(
        (file: UploadFile) => isMedia(file),
      );

      const files: UploadFile[] | undefined = uploadFiles?.filter(
        (file: UploadFile) => !media?.includes(file),
      );
      const links = getUrlsFromText(message ?? '').urls.map(link => ({
        url: link,
      }));

      const newMessage: MessageInputDto = {
        civilityFamilyMember: inbox?.civilityFamilyMember || civility,
        firstNameFamilyMember: inbox?.firstNameFamilyMember || firstName,
        inboxName: providerCompanyName || inbox?.inboxName || '',
        inboxType: InboxType.Provider,
        lastNameFamilyMember: inbox?.lastNameFamilyMember || lastName,
        message: sanitizeText(message?.trim()) ?? '',
        replySelectedFile: replyingMessage?.replySelectedFile,
        replySelectedMessage: replyingMessage?.replySelectedMessage,
        replySelectedMessageType: replyingMessage?.replyMessageType,
        replyToMessageId: replyingMessage?.id,
        senderEmail: inbox?.email || getEmail() || '',
        senderName: providerCompanyName || inbox?.inboxName || inbox?.username,
        username: inbox?.username || getCaseName() || '',
        ...(inbox?.id && { inboxId: inbox.id }),
        ...(media?.[0] && {
          media: media.map((file: UploadFile) => ({
            fileIndex: index++,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })),
        }),
        ...(files?.[0] && {
          file: files.map((file: UploadFile) => ({
            fileIndex: index++,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
          })),
        }),
        ...(links[0] && {
          link: links,
        }),
      };

      sendMessage({
        variables: {
          input: newMessage,
        },
      });
    };

    return (
      <div className="flex w-full flex-col gap-1 p-4 pt-3 shadow">
        {replyingMessage && (
          <FooterMessageReply
            onRemoveReplyingMessage={onRemoveReplyingMessage}
            replyingMessage={replyingMessage}
          />
        )}
        {showAttachments && <Attachments />}
        <Form
          className="flex w-full justify-between gap-4"
          form={form}
          onFinish={onSendMessage}
        >
          <ChatInput
            canSendMessage={canSendMessage}
            disabled={isSendingMessage}
            loading={loading}
            ref={chatInputRef}
          />
        </Form>
      </div>
    );
  },
);

export default ChatFooter;
