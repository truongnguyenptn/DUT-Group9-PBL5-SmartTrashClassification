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

    const data = await request.get<GetTransportationResponse>(
      `/folder/transport/?${params}`,
    );

    return data;
  }
};
