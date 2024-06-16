import { useMemo } from 'react';
import NavBarItem from './Item';
import { PATH_URL, sections } from '#/shared/utils/constant';
import { SectionId } from '#/shared/utils/type';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';
import { ReactComponent as Support } from '#/assets/svgs/customer-support-filled.svg';
import { ReactComponent as Location } from '#/assets/svgs/arrival-filled.svg';
import { ReactComponent as Fold } from '#/assets/svgs/folder-filled.svg';
export default function NavBar() {
  const sections = [
    {
      to: PATH_URL.home,
      icon: <Support />,
      title: 'Home',
      description: 'Home',
      id: SectionId.Contacts,
    },
    {
      to: PATH_URL.bins,
      icon: <Location />,
      title: 'Path Finding',
      description: 'Path finding',
      id: SectionId.Contacts,
    },
    {
      to: PATH_URL.statistics,
      icon: <Fold />,
      title: 'Statistics',
      description: 'Statistics',
      id: SectionId.Contacts,
    },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-container items-center justify-between lg:w-full">
        <div className="flex items-center md:shadow-nav lg:w-full">
          {sections.map(section => (
            <NavBarItem key={section.title} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
