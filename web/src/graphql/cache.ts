import { InMemoryCache, makeVar } from '@apollo/client';
import type { DeepPartial } from '@enouvo/react-uikit';
import type { IInbox } from '#/generated/schemas';
import type { GetContactResponse } from '#/shared/utils/type';

export const inboxVar = makeVar<DeepPartial<IInbox> | undefined>({});
export const contactDataVar = makeVar<GetContactResponse | null>(null);
export const sectionLayoutGoogleMapVisible = makeVar<boolean | null>(true);
export const selectedMessageIdVar = makeVar<string | null>(null);

export const directionResponseCacheData = makeVar<Record<
  string,
  google.maps.DirectionsResult
> | null>(null);

export const cache: InMemoryCache = new InMemoryCache();
