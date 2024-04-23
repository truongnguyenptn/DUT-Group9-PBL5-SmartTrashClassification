import { useMemo } from 'react';
import NavBarItem from './Item';
import { sections } from '#/shared/utils/constant';
import { SectionId } from '#/shared/utils/type';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';

export default function NavBar() {
  const { contactData } = useContactDataVar();

  const displaySection = useMemo(() => {
    const display = contactData?.display;

    return sections.filter(section => {
      if (section.id === SectionId.Documents) {
        return true;
      }

      return display?.[section.id] === 1;
    });
  }, [contactData?.display]);

  if (!contactData) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-container items-center justify-between lg:w-full">
        <div className="flex items-center md:shadow-nav lg:w-full">
          {displaySection.map(section => (
            <NavBarItem key={section.title} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
