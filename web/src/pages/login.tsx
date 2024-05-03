import { Button, Checkbox, Form, Input, Typography } from 'antd';
import withGuardRoute from '#/shared/hocs/withGuardRoute';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import Image from '#/shared/components/common/Image';
import { getLoginInformation } from '#/shared/utils/localStorage';
import Logo from '#/assets/images/logo.png';
import { useAuth } from '#/shared/hooks/useAuth';
import Layout from '#/shared/components/layouts/Layout';

export interface LoginFormValues {
  email: string;
  name: string;
  rememberMe?: boolean;
}

function Login() {
  const { t } = useTypeSafeTranslation();
  const { login, isLoading } = useAuth();
  const informationLogin = getLoginInformation();

  return (
    <Layout>
      <div className="flex items-center justify-center sm:w-full sm:items-end portrait:h-full landscape:my-6 landscape:h-fit">
        <Form<LoginFormValues>
          className="z-10 w-[30.5rem] rounded-2xl bg-white px-8 py-10 sm:fixed sm:bottom-0 sm:h-[29rem] sm:w-full sm:rounded-b-none sm:rounded-t-2xl sm:px-6 sm:py-8"
          initialValues={{
            email: informationLogin?.email || '',
            name: informationLogin?.name || '',
            rememberMe: informationLogin?.rememberMe,
          }}
          layout="vertical"
          onFinish={({ email, name, rememberMe = false }) => {
            login(email, name, rememberMe);
          }}
          scrollToFirstError
        >
          <div className="mb-6 flex flex-col gap-y-2">
            <Image className="h-12 w-36" preview={false} src={Logo} />
            <Typography.Text className="text-grey-primary-500">
              {t('login.description')}
            </Typography.Text>
          </div>

          <Form.Item
            label={t('commonFields.email')}
            name="email"
            rules={[
              {
                message: t('validateMessage.required', {
                  name: t('commonFields.email'),
                }),
                required: true,
              },
              {
                message: t('validateMessage.whiteSpace', {
                  name: t('commonFields.email'),
                }),
                whitespace: true,
              },
              {
                message: t('validateMessage.invalid', {
                  name: t('commonFields.email'),
                }),
                type: 'email',
              },
            ]}
            validateFirst
          >
            <Input placeholder={t('placeholder.enterEmail')} />
          </Form.Item>

          <Form.Item
            className="mb-6"
            label={t('commonFields.name')}
            name="name"
            rules={[
              {
                message: t('validateMessage.required', {
                  name: t('commonFields.name'),
                }),
                required: true,
              },
              {
                message: t('validateMessage.whiteSpace', {
                  name: t('commonFields.name'),
                }),
                whitespace: true,
              },
            ]}
          >
            <Input placeholder={t('placeholder.enterLastNameDecreased')} />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox>{t('login.rememberMe')}</Checkbox>
          </Form.Item>

          <Button
            block
            className="mt-4 text-sm sm:mt-2"
            htmlType="submit"
            loading={isLoading}
            type="primary"
          >
            {t('button.login')}
          </Button>
        </Form>
      </div>
    </Layout>
  );
}

export default withGuardRoute(Login);
