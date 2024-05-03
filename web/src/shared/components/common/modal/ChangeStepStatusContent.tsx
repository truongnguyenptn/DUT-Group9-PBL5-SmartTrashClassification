import { Button, Form, Radio, notification } from 'antd';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { showError } from '@enouvo/react-uikit';
import { useLocation } from 'react-router-dom';
import { STATUS } from '#/shared/utils/constant';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import {
  GetTransportationResponse,
  ChangeStatusDataFormatted,
} from '#/shared/utils/type/transportation';
import { getCaseName, getEmail } from '#/shared/utils/localStorage';
import { getNameByStatus, getFileNameFromUrl } from '#/shared/utils/tool';
import { changeStepStatus } from '#/api/shared';

interface ChangedStatusProps {
  onClose: () => void;
  item: ChangeStatusDataFormatted | undefined;
}

export function ChangeStepStatusContent({ onClose, item }: ChangedStatusProps) {
  const { t } = useTypeSafeTranslation();
  const [curStatus, setCurStatus] = useState<number>(Number(item?.status));

  const { i18n: i18nState } = useTranslation();
  const email = getEmail();
  const caseName = getCaseName();

  const { pathname } = useLocation();

  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const { mutate: changeStatus, isLoading } = useMutation({
    mutationFn: changeStepStatus,
    onError: showError,
    onMutate: async newObject => {
      await queryClient.cancelQueries({
        queryKey: [
          getFileNameFromUrl(pathname),
          i18nState.language,
          email,
          caseName,
        ],
      });

      const newDataStatusUpdate = (
        oldData: AxiosResponse<GetTransportationResponse> | undefined,
      ) =>
        oldData && {
          ...oldData,
          data: {
            ...oldData.data,
            objects: oldData.data.objects.map(item =>
              item.id === newObject.id
                ? { ...item, status: newObject.status }
                : item,
            ),
          },
        };
      return { newDataStatusUpdate };
    },
    onSuccess: (_result, variables, context) => {
      notification.success({
        description: t('transportation.statusFromTo', {
          curStatus: `"${item?.status ? getNameByStatus(curStatus) : 'N/A'}"`,
          preStatus: `"${item?.status ? getNameByStatus(item.status) : 'N/A'}"`,
        }),
        message: t('transportation.successMessage'),
      });

      queryClient.setQueryData(
        [getFileNameFromUrl(pathname), i18nState.language, email, caseName],
        context?.newDataStatusUpdate,
      );
    },
  });

  return (
    <Form
      disabled={isLoading}
      form={form}
      initialValues={{ curStatus }}
      name="modal"
      onFinish={({ status }) => {
        setCurStatus(status);
        onClose();
        if (email && caseName && item?.mode && item.id && status) {
          changeStatus({
            email,
            id: item.id,
            name: caseName,
            status,
            type: item.mode,
          });
        }
      }}
    >
      <p
        dangerouslySetInnerHTML={{
          ['__html']: t('transportation.showCurrentStatus', {
            status: `"${item?.status ? getNameByStatus(item.status) : 'N/A'}"`,
          }),
        }}
      />
      <Form.Item name="status" noStyle>
        <Radio.Group
          className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-1"
          onChange={({ target }) => setCurStatus(target.value)}
        >
          {STATUS.map(status => (
            <Radio
              className={twMerge(
                'rounded-lg bg-gray-100 px-[1.125rem] py-3.5 text-base font-medium text-grey-secondary-400',
                item?.status === status.status && 'text-grey-300',
              )}
              disabled={item?.status === status.status}
              key={status.value}
              value={status.status}
            >
              {t(status.title)}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <div className="flex justify-end gap-2 pr-1 pt-6">
        <Button
          className="rounded-full border-primary px-6 py-2 text-primary"
          onClick={() => {
            onClose();
            form.resetFields();
          }}
        >
          {t('button.cancel')}
        </Button>
        <Button
          className="rounded-full px-6 py-2"
          disabled={curStatus === item?.status || isLoading}
          htmlType="submit"
          type="primary"
        >
          {t('button.change')}
        </Button>
      </div>
    </Form>
  );
}
