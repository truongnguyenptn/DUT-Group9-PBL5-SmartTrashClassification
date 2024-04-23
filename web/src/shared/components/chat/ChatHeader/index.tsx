import { Divider, Form, Typography } from 'antd';
import type { DeepPartial } from '@enouvo/react-uikit';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { isMobile } from 'react-device-detect';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ChatFilter from './ChatFilter';
import type { Message } from '#/generated/schemas';
import useGetSearchMessagesInfinityLoadLazyQuery from '#/shared/hooks/useGetSearchMessagesInfinityLoadQuery';
import type { RangeDate } from '#/shared/utils/type/date';
import {
  FILE_GROUP_SEARCH_PARAM_KEY,
  TERRA_NAME,
} from '#/shared/utils/constant';
import { ChatContext } from '#/shared/context/chat';
import { useGetSelectedMessageId } from '#/shared/hooks/useGetSelectedMessageId';

import { ReactComponent as SearchOutlineSVG } from '#/assets/svgs/search-outline.svg';
import { ReactComponent as GalleryOutlineSVG } from '#/assets/svgs/gallery-outline.svg';
import { ReactComponent as CloseOutlineSVG } from '#/assets/svgs/close-outline.svg';

interface ChatHeaderProps {
  onFindMessages?: (message: DeepPartial<Message>) => void;
  onClearFilter?: () => void;
  onChangeKeySearch: (searchValue?: string) => void;
  isShowFilterInput: boolean;
  onChangeShowFilterInput: () => void;
}

export interface GetSearchMessagesFilter {
  searchString?: string;
  searchRangeDate?: RangeDate;
  page?: number;
}

export default function ChatHeader({
  onClearFilter,
  onFindMessages,
  onChangeKeySearch,
  isShowFilterInput,
  onChangeShowFilterInput,
}: ChatHeaderProps) {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    disabledDownSearch,
    disabledUpSearch,
    onChangeSearchMessagePosition,
    searchMessageIndex,
    onClearSearchMessages,
    searchMessages,
    totalSearchMessages,
    onSearchMessages,
    getSearchMessagesLoading,
  } = useGetSearchMessagesInfinityLoadLazyQuery({
    onClear: onClearFilter,
    onFindMessages,
  });

  const { searchValue, filter, isPendingChat } = useContext(ChatContext);
  const { clear: clearSelectedMessageId } = useGetSelectedMessageId();
  const onFilter = ({
    searchString,
    searchRangeDate,
  }: GetSearchMessagesFilter) => {
    if (searchString?.trim() || searchRangeDate?.[0]) {
      onChangeKeySearch(searchString?.trim());
      onSearchMessages({
        searchRangeDate,
        searchString,
      });
      onChangeShowFilterInput();
    }
  };

  const onOpenFileGroup = () => {
    navigate(`?${FILE_GROUP_SEARCH_PARAM_KEY}=true#message`);
  };

  const onCloseChatBox = () => {
    if (searchValue.value) {
      onChangeShowFilterInput();
    }
    filter.onClose();
    onClearSearchMessages();
    form.resetFields();
    navigate({ hash: '' });
    clearSelectedMessageId();
  };

  const onCloseFilter = () => {
    onClearFilter?.();
    filter.onClose();
    form.resetFields();
  };

  return (
    <Form
      className={twMerge(
        'flex items-center justify-between gap-4 p-4',
        !filter.visible && 'shadow',
      )}
      form={form}
      onFinish={onFilter}
    >
      <Typography.Text className="mr-3 text-base font-semibold text-dark-title">
        {filter.visible
          ? t('button.filter')
          : `${t('chat.chatWith')} ${TERRA_NAME}`}
      </Typography.Text>

      <div className="flex items-center space-x-4">
        {!filter.visible && (
          <>
            <span className="cursor-pointer" onClick={filter.toggleVisible}>
              <SearchOutlineSVG
                className={twMerge(!isMobile && 'hover:text-primary')}
                height={24}
                width={24}
              />
            </span>
            <span
              className={twMerge(
                'cursor-pointer text-secondary',
                !isMobile && 'hover:text-primary',
              )}
              onClick={onOpenFileGroup}
            >
              <GalleryOutlineSVG height={24} width={24} />
            </span>
            <Divider className="border-border-light" type="vertical" />
          </>
        )}
        <span
          className={twMerge(
            `cursor-pointer text-dark-title  ${
              !isMobile && 'hover:text-primary'
            }`,
          )}
          onClick={() => {
            if (filter.visible) {
              onCloseFilter();
            } else {
              onCloseChatBox();
            }
          }}
        >
          <CloseOutlineSVG height={24} width={24} />
        </span>
      </div>

      <ChatFilter
        currentIndex={searchMessages[0] ? searchMessageIndex + 1 : 0}
        disableDownButton={
          disabledDownSearch || isPendingChat.value || getSearchMessagesLoading
        }
        disableUpButton={
          disabledUpSearch || isPendingChat.value || getSearchMessagesLoading
        }
        isShowFilterInput={isShowFilterInput}
        loading={getSearchMessagesLoading}
        onChangeFoundMessagePosition={onChangeSearchMessagePosition}
        onChangeShowFilterInput={onChangeShowFilterInput}
        totalFoundMessages={totalSearchMessages}
        visible={filter.visible}
      />
    </Form>
  );
}
