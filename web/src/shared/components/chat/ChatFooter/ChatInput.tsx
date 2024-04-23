import { Button, ConfigProvider, Form, Input } from 'antd';
import { forwardRef, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';
import PreviewFiles from './PreviewFiles';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import UploadFiles from '#/shared/components/common/UploadFiles';
import { MAX_IMAGE_FILE } from '#/shared/utils/constant';
import { displayValidateMessage } from '#/shared/utils/form-rules';
import { ReactComponent as SendFilledSVG } from '#/assets/svgs/send-filled.svg';

interface ChatInputProps {
  canSendMessage?: boolean;
  loading: boolean;
  disabled?: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ canSendMessage, loading, disabled }, ref) => {
    const { t } = useTypeSafeTranslation();
    const form = Form.useFormInstance();
    const [isUploading, setIsUploading] = useState(false);
    const [isDisconnected, setIsDisconnected] = useState(false);

    useEffect(() => {
      const handleOnlineStatus = () => {
        if (window.navigator.onLine) {
          setIsUploading(false);
        }
        setIsDisconnected(false);
      };

      window.addEventListener('online', handleOnlineStatus);
      window.addEventListener('offline', handleOnlineStatus);

      return () => {
        window.removeEventListener('online', handleOnlineStatus);
        window.removeEventListener('offline', handleOnlineStatus);
      };
    }, []);

    const fileList = Form.useWatch('files', form);

    return (
      <div className="flex h-auto w-full flex-col rounded-lg bg-transparent hover:border-primary focus:border-primary">
        {fileList?.length > 0 && (
          <Form.Item
            className="flex-wrap items-center gap-2"
            dependencies={['files']}
          >
            {({ getFieldValue }) => (
              <>
                <PreviewFiles
                  disabled={disabled || isDisconnected}
                  fileList={getFieldValue('files')}
                />
                {fileList?.length > MAX_IMAGE_FILE &&
                  displayValidateMessage(t('validateMessage.uploadImage'))}
              </>
            )}
          </Form.Item>
        )}

        {isUploading && window.navigator.onLine && (
          <div className="relative mb-2 mr-1 h-[4.5rem] w-[4.5rem]">
            <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-lg bg-grey-secondary p-2">
              <LoadingOutlined />
            </div>
          </div>
        )}

        <div className="flex h-full w-full">
          <div className="flex w-full items-center rounded-lg bg-gray-100">
            <ConfigProvider
              theme={{
                components: {
                  ['Input']: {
                    colorBgContainer: 'transparent',
                  },
                },
              }}
            >
              <Form.Item name="message" noStyle>
                <Input.TextArea
                  autoFocus
                  autoSize={{ maxRows: 6, minRows: 1 }}
                  bordered={false}
                  disabled={disabled}
                  id="message-text"
                  onPressEnter={e => {
                    e.preventDefault();
                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey &&
                      canSendMessage &&
                      !isUploading
                    ) {
                      form.submit();
                    }
                  }}
                  placeholder={t('placeholder.typeMessage')}
                  ref={ref}
                />
              </Form.Item>
            </ConfigProvider>

            <Form.Item name="files" noStyle valuePropName="srcList">
              <UploadFiles
                disabled={disabled || isDisconnected}
                multiple
                onUploadFailed={() => {
                  setIsUploading(false);
                  setIsDisconnected(false);
                }}
                onUploadSuccess={() => {
                  setIsUploading(false);
                  setIsDisconnected(false);
                  if (ref != null && typeof ref !== 'function') {
                    ref.current?.focus();
                  }
                }}
                onUploading={() => {
                  setIsUploading(true);
                  setIsDisconnected(true);
                }}
              />
            </Form.Item>
          </div>

          <Form.Item noStyle>
            <Button
              className={twMerge(
                'ml-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-400 bg-opacity-20 p-3 text-gray-400 hover:opacity-90',
                canSendMessage &&
                  !disabled &&
                  !isDisconnected &&
                  'bg-primary text-white',
              )}
              disabled={!canSendMessage || disabled || isDisconnected}
              htmlType="submit"
              type="text"
            >
              {loading ? (
                <LoadingOutlined />
              ) : (
                <SendFilledSVG height={24} width={24} />
              )}
            </Button>
          </Form.Item>
        </div>
      </div>
    );
  },
);

export default ChatInput;
