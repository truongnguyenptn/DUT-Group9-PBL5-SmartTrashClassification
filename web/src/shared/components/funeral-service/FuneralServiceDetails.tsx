import { Steps } from '#/shared/components/common/Steps';
import type { ServiceType } from '#/shared/utils/type/services';
import { Coordinates } from '#/shared/utils/type/transportation';

interface FuneralServiceDetailsProps {
  funeralServicesData: ServiceType[];
  onPressStep: (index: number) => void;
  onAddressClick: (coordinates: Coordinates) => void;
}

export function FuneralServiceDetails({
  funeralServicesData,
  onPressStep,
  onAddressClick,
}: FuneralServiceDetailsProps) {
  return (
    <div className="h-full rounded-xl">
      {funeralServicesData.map((item, index) => (
        <Steps
          index={index}
          item={item}
          key={index}
          onAddressClick={onAddressClick}
          onPressStep={onPressStep}
        />
      ))}
    </div>
  );
}
