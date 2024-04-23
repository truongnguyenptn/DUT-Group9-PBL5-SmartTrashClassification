import { AxiosResponse } from 'axios';
import request from './request';
import {
  GetChangeStepStatusInput,
  GetTransportationResponse,
  ObjectResponseType,
} from '#/shared/utils/type/transportation';

export const changeStepStatus = async ({
  email,
  name,
  type,
  id,
  status,
}: GetChangeStepStatusInput & ObjectResponseType): Promise<
  AxiosResponse<GetTransportationResponse> | undefined
> => {
  const data = await request.post<GetTransportationResponse>(
    `folder/update_status/`,
    {
      ['api_key']: import.meta.env.VITE_API_KEY,
      email,
      id,
      name,
      status,
      type,
    },
    {
      headers: {
        ['Content-Type']: 'application/x-www-form-urlencoded',
      },
    },
  );

  return data;
};
