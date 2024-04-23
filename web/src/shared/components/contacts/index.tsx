import SectionLayout from '../layouts/SectionLayout';
import { ContactInfoCard } from './ContactInfoCard';
import ContactSmartCityAssistant from './ContactSmartCityAssistant';
import ContactFuneralProvider from './ContactFuneralProvider';
import ContactFamilyDetail from './ContactFamilyDetail';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';

export function ContactContainer() {
  const { contactData } = useContactDataVar();
  const funeralProvider = contactData?.objects.data || {};
  const SmartCityAssistant = contactData?.objects.funeral_assistant || {};
  const defunctInformation = contactData?.objects.defunct || {};
  const familyDetails = contactData?.objects.family || {};

  return (
    <SectionLayout
      backgroundColor="bg-gray-100"
      isEmpty={!contactData}
      loading={!contactData}
    >
      <div className="relative mx-auto flex h-full flex-nowrap gap-x-4 rounded-2xl md:mb-0 md:flex-col md:px-4 md:pb-4">
        <div className="flex h-full w-3/5 max-w-[22.5rem] justify-center rounded-lg bg-white md:w-full md:max-w-full md:justify-start">
          <div className="overflow-y-auto">
            <ContactInfoCard defunctInformation={defunctInformation} />
          </div>
        </div>
        <div className="flex h-full flex-col space-y-4 overflow-auto rounded-lg md:mr-0 md:mt-3 md:space-y-3 md:pl-0 md:pr-0">
          <ContactFamilyDetail familyDetails={familyDetails} />
          <ContactFuneralProvider funeralProvider={funeralProvider} />
          <ContactSmartCityAssistant SmartCityAssistant={SmartCityAssistant} />
        </div>
      </div>
    </SectionLayout>
  );
}
