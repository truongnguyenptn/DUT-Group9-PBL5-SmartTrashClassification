import { useMemo } from 'react';
import NavBarItem from './Item';
import { sections } from '#/shared/utils/constant';
import { SectionId } from '#/shared/utils/type';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';

export default function NavBar() {


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
