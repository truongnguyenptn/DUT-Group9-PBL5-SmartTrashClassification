import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Grid } from 'antd';
import { useEffect } from 'react';
import Header from './Header';
import { PATH_URL } from '#/shared/utils/constant';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

import backgroundMobile from '#/assets/images/background-mobile.jpeg';
import WavePNG from '#/assets/images/wave.png';

interface LayoutMobileProps {
  children?: React.ReactNode;
}

export default function LayoutMobile({ children }: LayoutMobileProps) {
  const { t } = useTypeSafeTranslation();
  const { pathname } = useLocation();
  const { md } = Grid.useBreakpoint();
  const hasBackground =
    pathname === PATH_URL.home || pathname === PATH_URL.login;

  useEffect(() => {
    const topElement = document.getElementById('top');
    topElement?.scrollIntoView();
  }, [pathname]);

  return (
    <section
      className={twMerge(
        'height-small-screen relative flex flex-col',
        !hasBackground && 'md:bg-white',
      )}
    >
      {(!pathname.includes(PATH_URL.section) || md) && (
        <>
          <img
            alt="wave-img"
            className="absolute bottom-0 z-10 h-24 w-full object-cover"
            src={WavePNG}
          />

          <img
            alt="background-mobile"
            className="absolute h-full w-full object-cover"
            src={backgroundMobile}
          />

          {!pathname.includes(PATH_URL.login) && (
            <span className="absolute right-full top-[80%] w-60 max-w-xl translate-x-full pl-5 text-lg font-semibold text-white opacity-80">
              {t('quotes')}
            </span>
          )}
        </>
      )}

      <Header />
      <main className="z-10 h-full overflow-hidden p-6 md:p-0 lg:overflow-auto landscape:overflow-auto">
        <div id="top" />
        {children}
      </main>
    </section>
  );
}
