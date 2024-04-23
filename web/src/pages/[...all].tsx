import { Button, Result, Typography } from 'antd';
import { Link } from 'react-router-dom';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import Layout from '#/shared/components/layouts/Layout';

function NotFoundPage() {
  const { t } = useTypeSafeTranslation();

  return (
    <Layout>
      <Result
        extra={
          <Link to="/">
            <Button type="primary">{t('button.backHome')}</Button>
          </Link>
        }
        status="404"
        subTitle={t('empty')}
        title={
          <Typography.Title className="text-[white]" level={1}>
            404
          </Typography.Title>
        }
      />
    </Layout>
  );
}

export default NotFoundPage;
