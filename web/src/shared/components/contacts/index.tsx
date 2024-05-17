import SectionLayout from '../layouts/SectionLayout';
import { ContactInfoCard } from './ContactInfoCard';
import ContactSmartCityAssistant from './ContactSmartCityAssistant';
import ContactFuneralProvider from './ContactFuneralProvider';
import ContactFamilyDetail from './ContactFamilyDetail';
import { useContactDataVar } from '#/shared/hooks/useContactDataVar';
import Map from '../common/Map';
import { useState } from 'react';
import {LeafletMap} from '../map';
import { GetContactResponse } from '#/shared/utils/type';

export function ContactContainer() {
  const [map, setMap] = useState<google.maps.Map>();

  // const { contactData } = useContactDataVar();
  const contactData : GetContactResponse = {
    display: {/* Mock display data */},
    meta: {/* Mock meta data */},
    objects: {
      defunct: {
        birth_date: '1990-01-01',
        civility: 'Mr.',
        dead_date: '2023-12-31',
        dead_time: '12:00 PM',
        first_name: 'John',
        last_name: 'Doe',
        photo: 'https://example.com/photo.jpg',
      },
      family: {
        civility: 'Mrs.',
        first_name: 'Jane',
        last_name: 'Doe',
      },
      funeral_assistant: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
      },
      funeral_services: {
        name: 'Funeral Services Company',
        email: 'info@funeralservices.com',
        phone: '+0987654321',
      },
      insurance: {
        name: 'Insurance Company',
        email: 'contact@insurancecompany.com',
        phone: '+1122334455',
      },
      data: {
        name: 'Smart city',
        email: 'info@datamanagement.com',
        phone: '+3344556677',
      },
    },
  };

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
          {/* <ContactFamilyDetail familyDetails={familyDetails} /> */}
          <ContactFuneralProvider funeralProvider={funeralProvider} />
          {/* <ContactSmartCityAssistant SmartCityAssistant={SmartCityAssistant} /> */}
        <LeafletMap />
        <iframe
        src="http://127.0.0.1:5050/route"
        allow="geolocation"
        title="Route Page"
        width="100%"
        height="500px"
        frameBorder="0"
        scrolling="auto"
      ></iframe>
        </div>
      </div>
    </SectionLayout>
  );
}
