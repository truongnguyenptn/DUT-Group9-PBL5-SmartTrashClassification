import { AxiosResponse } from 'axios';
import request from './request';
import type { GetContactInput, GetContactResponse } from '#/shared/utils/type';

export const getContactApi = async ({
  email,
  name,
}: GetContactInput): Promise<AxiosResponse<GetContactResponse>> => {
  const params = new URLSearchParams({ email, name });

  return await request.get<GetContactResponse>(`/folder/contact/?${params}`);
};
