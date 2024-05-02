import { AxiosResponse } from 'axios';
import request from './request';
import {
  GetChangeStepStatusInput,
  GetTransportationResponse,
} from '#/shared/utils/type/transportation';

export const getTransportation = async ({
  email,
  name,
}: GetChangeStepStatusInput): Promise<
  AxiosResponse<GetTransportationResponse> | undefined
> => {
  if (email && name) {
    const params = new URLSearchParams({ email, name });

    // const data = await request.get<GetTransportationResponse>(
    //   `/folder/transport/?${params}`,
    // );

    const data : GetTransportationResponse = {
      display: {/* Mock display data */},
      meta: {/* Mock meta data */},
      objects: [
        {
          arrival: GoalType.Pickup,
          departure: GoalType.Dropoff,
          id: 1,
          identifier: 'ABC123',
          ind_lta: null,
          mode: TransportationMode.Car,
          status: 200,
          status_name: TrackingDriverStatus.Completed,
          type: 'Transportation',
        },
        {
          arrival: GoalType.Dropoff,
          departure: GoalType.Pickup,
          id: 2,
          identifier: 'XYZ789',
          ind_lta: null,
          mode: TransportationMode.Train,
          status: 404,
          status_name: TrackingDriverStatus.Pending,
          type: 'Transportation',
        },
        // Add more mock objects as needed
      ],
    };

    return data;
  }
};
