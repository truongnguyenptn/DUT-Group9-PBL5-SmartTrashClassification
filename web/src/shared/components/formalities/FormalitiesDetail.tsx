import { Steps } from '#/shared/components/common/Steps';
import type { ServiceType } from '#/shared/utils/type/services';
import { Coordinates } from '#/shared/utils/type/transportation';

interface FormalitiesDetailsProps {
  formalitiesData: ServiceType[];
  onPressStep: (index: number) => void;
  onAddressClick: (coordinates: Coordinates) => void;
}

export function FormalitiesDetail({
  formalitiesData,
  onPressStep,
  onAddressClick,
}: FormalitiesDetailsProps) {
  return (
    <div className="h-full rounded-xl">
      {formalitiesData.map((item, index) => (
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
