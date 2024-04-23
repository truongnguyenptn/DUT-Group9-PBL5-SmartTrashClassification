import dayjs from 'dayjs';
import { getAddress } from './tool';
import { DATETIME_FORMAT, FRANCE_TIMEZONE } from './constant';
import type { ObjectResponseType } from './type/transportation';

export const normalizeTransportationData = (list: ObjectResponseType[]) => {
  let number = 0;
  return list.map(data => {
    number += 1;

    return {
      arrival: {
        address: data.arrival?.place ? getAddress(data.arrival.place) : null,
        date: data.arrival?.date
          ? dayjs(data.arrival.date).tz(FRANCE_TIMEZONE).format(DATETIME_FORMAT)
          : null,
        lat: data.arrival?.place?.location
          ? Number(data.arrival.place.location.split(',')[0])
          : null,
        lng: data.arrival?.place?.location
          ? Number(data.arrival.place.location.split(',')[1])
          : null,
        number: number + 1 || null,
        placeId: data.arrival?.place?.id || null,
      },
      departure: {
        address: data.departure?.place
          ? getAddress(data.departure.place)
          : null,
        awb: data.ind_lta || null,
        date: data.departure?.date
          ? dayjs(data.departure.date)
              .tz(FRANCE_TIMEZONE)
              .format(DATETIME_FORMAT)
          : null,
        flight: data.identifier,
        lat: data.departure?.place?.location
          ? Number(data.departure.place.location.split(',')[0])
          : null,
        lng: data.departure?.place?.location
          ? Number(data.departure.place.location.split(',')[1])
          : null,
        number,
        placeId: data.departure?.place?.id ?? null,
      },
      id: data.id ?? null,
      mode: data.mode ?? null,
      number,
      status: data.status ?? null,
      statusName: data.status_name ?? null,
      title: data.type ?? null,
    };
  });
};

export const normalizeTransportationDataMaker = (
  list: ObjectResponseType[],
) => {
  let number = 0;

  return list.map(data => {
    number += 2;
    return [
      {
        address: data.departure?.place
          ? getAddress(data.departure.place)
          : null,
        date: data.departure?.date
          ? dayjs(data.departure.date)
              .tz(FRANCE_TIMEZONE)
              .format(DATETIME_FORMAT)
          : null,
        lat: data.departure?.place?.location
          ? Number(data.departure.place.location.split(',')[0])
          : null,
        lng: data.departure?.place?.location
          ? Number(data.departure.place.location.split(',')[1])
          : null,
        number: number - 1,
        placeId: data.departure?.place?.id ?? null,
      },
      {
        address: data.arrival?.place ? getAddress(data.arrival.place) : null,
        date: data.arrival?.date
          ? dayjs(data.arrival.date).tz(FRANCE_TIMEZONE).format(DATETIME_FORMAT)
          : null,
        lat: data.arrival?.place?.location
          ? Number(data.arrival.place.location.split(',')[0])
          : null,
        lng: data.arrival?.place?.location
          ? Number(data.arrival.place.location.split(',')[1])
          : null,
        number,
        placeId: data.arrival?.place?.id ?? null,
        title: data.type ?? null,
      },
    ];
  });
};
