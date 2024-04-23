import dayjs from 'dayjs';
import { getAddress } from './tool';
import { TransportationMode } from './type/transportation';
import type { ServicesDataFormatted } from './type/services';
import { formatDateWithHour } from './date';
import { DATE_FORMAT_FULL } from '#/shared/utils/constant';

export const normalizeFuneralServiceData = (list: ServicesDataFormatted[]) =>
  list.map((data, index) => {
    const newItem = {
      address: data.place ? getAddress(data.place) : null,
      date: data.date_started
        ? formatDateWithHour(
            String(dayjs(data.date_started).tz('Europe/Paris')),
            DATE_FORMAT_FULL,
          )
        : null,
      id: data.id,
      image: data.profession_prestation?.picture ?? null,
      lat: data.place?.location
        ? Number(data.place.location.split(',')[0])
        : null,
      lng: data.place?.location
        ? Number(data.place.location.split(',')[1])
        : null,
      mode: data.mode ?? TransportationMode.Service,
      number: index + 1,
      placeId: data.place?.id ?? null,
      status: data.status_name ?? null,
      statusId: data.status ?? null,
      step: data.step ?? null,
      title: data.profession_prestation?.name ?? null,
      update: data.last_updated,
    };

    return {
      ...newItem,
      prestation: data.profession_prestation,
    };
  });
