import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import Header from './Header';
import { PATH_URL } from '#/shared/utils/constant';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

import WavePNG from '#/assets/images/wave.png';
import backgroundDesktop from '#/assets/images/background-desktop.jpeg';

interface LayoutDesktopProps {
  children?: React.ReactNode;
}

export default function LayoutDesktop({ children }: LayoutDesktopProps) {
  const { t } = useTypeSafeTranslation();
  const { pathname } = useLocation();
  const hasBackground =
    pathname === PATH_URL.home || pathname === PATH_URL.login;

  return (
    <section
      className={twMerge(
        'height-small-screen relative flex flex-col',
        !hasBackground && 'md:bg-white',
      )}
    >
      <img
        alt="wave-img"
        className="absolute bottom-0 z-10 h-48 w-full sm:h-24"
        src={WavePNG}
      />

      <img
        alt="background-desktop"
        className="absolute h-full w-full object-cover"
        src={backgroundDesktop}
      />

      {!pathname.includes(PATH_URL.login) && (
        <span className="absolute right-1/2 top-[40%] max-w-lg translate-x-full text-[2.5rem] font-semibold text-white opacity-80 md:right-full md:top-[80%] md:w-60 md:pl-5 md:text-lg">
          {t('quotes')}
        </span>
      )}

      <Header />

      <main
        className={twMerge(
          'z-10 h-full overflow-hidden p-6 md:overflow-y-scroll md:p-0 landscape:overflow-y-scroll',
          pathname.includes(PATH_URL.login) && 'grid items-center',
        )}
      >
        {children}
      </main>
    </section>
  );
}
