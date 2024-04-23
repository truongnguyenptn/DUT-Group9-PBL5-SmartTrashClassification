import styled from '@emotion/styled';
import { Button, ConfigProvider, Form, Grid, Input, Typography } from 'antd';
import { formatDate } from '@enouvo/react-uikit';
import { useContext, useEffect, useState } from 'react';
import type { RangeValue } from 'rc-picker/lib/interface';
import type { Dayjs } from 'dayjs';
import type { DayRange } from '@amir04lm26/react-modern-calendar-date-picker';
import { utils } from '@amir04lm26/react-modern-calendar-date-picker';
import { twMerge } from 'tailwind-merge';
import { LoadingOutlined } from '@ant-design/icons';
import RangePicker from './RangePicker';
import { ReactComponent as ArrowDownOutlineSVG } from '#/assets/svgs/arrow-down-outline.svg';
import { ReactComponent as ArrowUpOutlineSVG } from '#/assets/svgs/arrow-up-outline.svg';
import { ReactComponent as SearchOutlineSVG } from '#/assets/svgs/search-outline.svg';
import { ReactComponent as ToOutlineSVG } from '#/assets/svgs/to-outline.svg';
import { ReactComponent as CloseCircleFilledSVG } from '#/assets/svgs/close-circle-filled.svg';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { ChatContext } from '#/shared/context/chat';
import { truncateText } from '#/shared/utils/tool';

const StyledInput = styled(Input)`
  background: #f6f3f4 !important;

  input {
    background-color: var(--grey-filter) !important;
    padding: 0 !important;
    color: var(--dark-title) !important;
    font-size: 0.875rem !important;
    font-weight: 400 !important;
    &::placeholder {
      color: var(--grey-primary-300) !important;
      font-weight: 400;
    }
  }
`;

const RangePickerWrapper = styled.div`
  .ant-input {
    color: var(--dark-title) !important;
    font-size: 0.875rem !important;
    font-weight: 400 !important;
  }
  .-right {
    .Calendar__monthArrow {
      background-image: url('/src/assets/images/arrow.png') !important;
      rotate: 90deg;
    }
  }
  .-left {
    .Calendar__monthArrow {
      background-image: url('/src/assets/images/arrow.png') !important;
      rotate: 90deg;
    }
  }
  .-selectedBetween {
    color: var(--grey-secondary-400) !important;
  }
  .-ltr {
    .-selectedStart {
      color: white !important;
    }
    .-selectedEnd {
      color: white !important;
    }
    .-today {
      color: var(--grey-secondary-400) !important;
    }
    color: var(--grey-secondary-400);
  }
`;

interface ChatFilterProps {
  visible?: boolean;
  onChangeFoundMessagePosition?: (isUp: boolean) => void;
  disableUpButton?: boolean;
  disableDownButton?: boolean;
  currentIndex?: number;
  totalFoundMessages?: number;
  isShowFilterInput: boolean;
  onChangeShowFilterInput: () => void;
  loading?: boolean;
}

export default function ChatFilter({
  currentIndex,
  disableDownButton,
  disableUpButton,
  onChangeFoundMessagePosition,
  totalFoundMessages,
  visible,
  isShowFilterInput,
  loading,
  onChangeShowFilterInput,
}: ChatFilterProps) {
  const [searchKey, setSearchKey] = useState('');
  const [timeFrame, setTimeFrame] = useState<RangeValue<Dayjs> | undefined>(
    undefined,
  );
  const { t } = useTypeSafeTranslation();
  const { md } = Grid.useBreakpoint();

  const { isPendingChat, searchValue, rangeDate } = useContext(ChatContext);

  useEffect(() => {
    if (!visible) {
      setSearchKey('');
      setTimeFrame(undefined);
    }
  }, [visible]);

  const isDisabledFilterBtn = !searchKey.trim() && !timeFrame;

  const form = Form.useFormInstance();

  return (
    <div
      className={`absolute right-0 top-[3.6rem] z-50 flex w-full flex-col gap-2 bg-[white] px-4 pb-4 shadow-filter transition-all duration-500 ${
        visible ? '' : 'translate-x-full'
      }`}
    >
      {isShowFilterInput && (
        <>
          <Form.Item name="searchString" noStyle>
            <StyledInput
              autoComplete="off"
              className="h-10 rounded-lg border-none"
              onChange={e => setSearchKey(e.target.value)}
              placeholder={t('placeholder.searchMessage')}
              suffix={
                searchKey ? (
                  <CloseCircleFilledSVG
                    className="cursor-pointer rounded text-grey-primary-300 hover:text-grey-light-500"
                    height={24}
                    onClick={() => {
                      form.setFieldsValue({ searchString: '' });
                      setSearchKey('');
                    }}
                    width={24}
                  />
                ) : (
                  <SearchOutlineSVG
                    className="text-dark-title"
                    height={24}
                    width={24}
                  />
                )
              }
              tabIndex={-1}
            />
          </Form.Item>
          <RangePickerWrapper>
            <Form.Item name="searchRangeDate" noStyle>
              <RangePicker<DayRange>
                maximumDate={utils('en').getToday()}
                onChange={timeFrame => setTimeFrame(timeFrame)}
              />
            </Form.Item>
          </RangePickerWrapper>
        </>
      )}

      <div className="relative flex justify-between gap-2">
        <div className="flex items-center gap-3">
          {searchValue.value && (
            <>
              <Typography.Text className="w-max text-grey-primary-300">
                {currentIndex}/{totalFoundMessages}
              </Typography.Text>
              <span
                onClick={() =>
                  !disableDownButton && onChangeFoundMessagePosition?.(false)
                }
              >
                <ArrowDownOutlineSVG
                  className={`${
                    disableDownButton
                      ? 'pointer-events-none cursor-not-allowed text-grey-primary-200'
                      : 'cursor-pointer'
                  }`}
                  height={24}
                  width={24}
                />
              </span>
              <span
                onClick={() =>
                  !disableUpButton && onChangeFoundMessagePosition?.(true)
                }
              >
                <ArrowUpOutlineSVG
                  className={`${
                    disableUpButton
                      ? 'pointer-events-none cursor-not-allowed text-grey-primary-200'
                      : 'cursor-pointer'
                  }`}
                  height={24}
                  width={24}
                />
              </span>
              {loading && <LoadingOutlined />}
            </>
          )}
        </div>
        {(searchValue.value || rangeDate.value) && (
          <Button
            className="absolute top-10 h-8 w-8 border-none bg-grey-collapse text-center"
            icon={
              <ArrowDownOutlineSVG
                className={`ml-[0.25rem] mt-[0.125rem] text-gray-800 ${
                  isShowFilterInput ? 'rotate-180' : ''
                }`}
                height={24}
                width={24}
              />
            }
            onClick={onChangeShowFilterInput}
            shape="circle"
            size="small"
          />
        )}

        {isShowFilterInput ? (
          <div className="flex gap-2">
            <ConfigProvider
              theme={{
                components: {
                  ['Button']: {
                    controlHeight: 40,
                  },
                },
              }}
            >
              <Button
                className={twMerge(
                  'rounded-lg text-sm font-semibold',
                  isPendingChat.value && 'cursor-not-allowed opacity-30',
                )}
                disabled={isPendingChat.value || isDisabledFilterBtn}
                onClick={() => {
                  form.resetFields();
                  searchValue.setValue(undefined);
                  rangeDate.setValue(undefined);
                  setSearchKey('');
                  setTimeFrame(undefined);
                }}
                type="ghost"
              >
                {t('button.clear')}
              </Button>
              <Button
                className={`rounded-lg border-none text-sm font-semibold ${
                  isDisabledFilterBtn
                    ? 'bg-grey-collapse text-white'
                    : 'bg-primary-color'
                }`}
                disabled={isDisabledFilterBtn}
                htmlType="submit"
                type="primary"
              >
                {t('button.filter')}
              </Button>
            </ConfigProvider>
          </div>
        ) : (
          <>
            {(searchValue.value || rangeDate.value) && (
              <div>
                <span className="text-sm font-normal text-grey-primary-300">
                  {t('chat.searchingFor')}
                </span>
                {searchValue.value && (
                  <strong className="whitespace-pre-wrap">{` "${truncateText(
                    searchValue.value.trim(),
                    !md ? 10 : 20,
                  )}"`}</strong>
                )}
                {rangeDate.value ? (
                  <div className="flex">
                    <div className="text-sm font-normal text-grey-primary-300">
                      {formatDate(rangeDate.value[0])}
                    </div>
                    <ToOutlineSVG className="ml-1 mr-1 mt-2 h-2 w-4 text-grey-primary-300" />
                    <div className="text-sm font-normal text-grey-primary-300">
                      {formatDate(rangeDate.value[1])}
                    </div>
                  </div>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
