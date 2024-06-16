import { twMerge } from 'tailwind-merge';
import { ReactNode, useEffect } from 'react';
import LoadingScreen from '../common/LoadingScreen';
import EmptyBox from '../common/EmptyBox';
import Sidebar from './Sidebar';
import { scrollToTop } from '#/shared/utils/tool';

interface SectionLayoutProps {
  children?: ReactNode | React.ReactElement[];
  loading?: boolean;
  backgroundColor?: string;
  isEmpty?: boolean;
}

export default function SectionLayout({
  children,
  loading,
  backgroundColor = 'bg-white',
  isEmpty = true,
}: SectionLayoutProps) {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <div className="hidden md:block">
        <LoadingScreen delay={0} visible={loading} />
      </div>

      <div
        className={twMerge(
          'relative mx-auto w-full max-w-container rounded-2xl p-6 md:h-max md:rounded-none md:p-0',
          backgroundColor,
        )}
      >
        <div className="md:hidden">
          <LoadingScreen delay={0} visible={loading} />
        </div>

        <Sidebar isEmpty={isEmpty} />

        {isEmpty && !loading ? <EmptyBox /> : <>{children}</>}
      </div>
    </>
  );
}
