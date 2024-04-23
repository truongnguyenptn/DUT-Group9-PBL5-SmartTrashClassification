import type { Dictionary } from '@enouvo/react-uikit';
import type { FormInstance } from 'antd';
import { Button, Form, Modal } from 'antd';
import type { Ref } from 'react';
import React, { cloneElement, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface FormModalProps<UpsertDto, Values = Dictionary<unknown>> {
  onSubmit: (values: UpsertDto) => void;
  onClose: () => void;
  children: React.ReactElement;
  selectedItem?: Values;
  initialValues?: Values;
  name: string;
  loading: boolean;
  width?: string | number;
  disabled?: boolean;
}

export type FormModalRef = FormInstance<Dictionary<unknown>>;

export const FormModal = forwardRef(
  <UpsertDto,>(
    {
      onSubmit,
      onClose,
      loading,
      children,
      selectedItem,
      name,
      initialValues,
      width = '560',
      disabled = false,
    }: FormModalProps<UpsertDto>,
    ref: Ref<FormModalRef>,
  ) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    const afterClose = () => {
      form.resetFields();
    };

    return (
      <Modal
        afterClose={afterClose}
        destroyOnClose
        footer={false}
        onCancel={onClose}
        open={!!selectedItem}
        title={selectedItem?.id ? t(`${name}.update`) : t(`${name}.create`)}
        width={width}
      >
        <Form
          className="py-4"
          form={form}
          initialValues={initialValues}
          layout="vertical"
          onFinish={value => onSubmit({ id: initialValues?.id, ...value })}
          ref={ref}
        >
          {cloneElement(children, {
            initialValues,
          })}
          <div className="flex items-center justify-end gap-4 py-4">
            <Button onClick={onClose}>{t('button.cancel')}</Button>
            <Button
              disabled={disabled}
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              {initialValues?.id ? t('button.save') : t('button.create')}
            </Button>
          </div>
        </Form>
      </Modal>
    );
  },
) as <UpsertDto extends Record<string, unknown>>(
  props: FormModalProps<UpsertDto> & { ref?: Ref<FormModalRef> },
) => JSX.Element;
