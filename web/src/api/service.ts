import type { AxiosResponse } from 'axios';
import request from './request';
import type {
  GetServiceInput,
  ServiceResponse,
} from '#/shared/utils/type/services';

export const getServices = async ({
  email,
  name,
}: GetServiceInput): Promise<AxiosResponse<ServiceResponse> | undefined> => {
  if (email && name) {
    const params = new URLSearchParams({ email, name });
    const data = await request.get<ServiceResponse>(
      `/folder/service/?${params}`,
    );

    return data;
  }
};
