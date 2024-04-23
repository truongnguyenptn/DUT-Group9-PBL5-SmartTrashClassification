import { useMemo } from 'react';
import { Steps } from './Steps';
import type { Transport } from '#/shared/utils/type/transportation';
import {
  TransportationMode,
  Coordinates,
} from '#/shared/utils/type/transportation';

import { TrackingDriverStatus } from '#/generated/schemas';

interface TransportationDetailProps {
  transports: Transport[];
  onPressStep: (index: number) => void;
  onAddressClick: (coordinates: Coordinates) => void;
}

export function TransportationDetail({
  onPressStep,
  onAddressClick,
  transports,
}: TransportationDetailProps) {
  const transportList = useMemo(() => {
    let allowGenerateTrackingLink = true;
    let hasGenerateLink = false;
    const returnedTransportList: JSX.Element[] = [];

    transports.forEach((transport, index) => {
      if (
        transport.mode === TransportationMode.Flight ||
        hasGenerateLink ||
        transport.trackingDriver?.status === TrackingDriverStatus.Finished
      ) {
        allowGenerateTrackingLink = false;
      } else {
        hasGenerateLink = true;
        allowGenerateTrackingLink = true;
      }
      returnedTransportList.push(
        <Steps
          allowGenerateTrackingLink={allowGenerateTrackingLink}
          index={index}
          key={transport.id}
          onAddressClick={onAddressClick}
          onPressStep={onPressStep}
          transport={transport}
        />,
      );
    });

    return returnedTransportList;
  }, [onAddressClick, onPressStep, transports]);

  return <div className="h-full rounded-xl">{transportList}</div>;
}
