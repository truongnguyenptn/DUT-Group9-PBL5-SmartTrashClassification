import type { DeepPartial } from '@enouvo/react-uikit';
import type { RangeDate } from './date';
import type { Message, ReplyMessageType } from '#/generated/schemas';

export type ReplyMessage = DeepPartial<
  Message & { replyMessageType?: ReplyMessageType }
>;

export interface GetSearchMessagesFilter {
  searchString?: string;
  searchRangeDate?: RangeDate;
  page?: number;
}
