import { lazy, useLayoutEffect, type ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import { getContactData } from '#/shared/utils/localStorage';
import { useGetCurrentUser } from '#/shared/hooks/useGetCurrentUser';
import { REFETCH_GET_ME_INTERVAL_TIME } from '#/shared/utils/constant';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';

interface LayoutProps {
  children: ReactNode;
}

const LayoutDesktop = lazy(() => import('./LayoutDesktop'));
const LayoutMobile = lazy(() => import('./LayoutMobile'));

export default function Layout({ children }: LayoutProps) {
  const LayoutComponent = isMobile ? LayoutMobile : LayoutDesktop;

  // const { refetch } = useGetCurrentUser({});
  // const { update } = useContactDataVar();

  // useLayoutEffect(() => {
  //   const contactData = getContactData();
  //   if (contactData) {
  //     update(JSON.parse(contactData));
  //   }

  //   const interval = setInterval(() => refetch(), REFETCH_GET_ME_INTERVAL_TIME);

  //   return () => clearInterval(interval);
  // }, [refetch, update]);

  return <LayoutComponent>{children}</LayoutComponent>;
}
