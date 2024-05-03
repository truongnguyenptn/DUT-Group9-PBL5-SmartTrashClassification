import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import withGuardRoute from '#/shared/hocs/withGuardRoute';
import Layout from '#/shared/components/layouts/Layout';

function Dashboard() {
  return (
    <Layout>
      <Suspense>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

export default withGuardRoute(Dashboard, true);
