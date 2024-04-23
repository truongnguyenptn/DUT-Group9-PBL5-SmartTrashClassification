import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
};

export type CreateDriverChatBoxDto = {
  email: Scalars['String'];
  username: Scalars['String'];
};

export type CreateDriverMessageDto = {
  file?: InputMaybe<Array<FileInputDto>>;
  inboxId: Scalars['String'];
  isDriver?: InputMaybe<Scalars['Boolean']>;
  isProvider?: InputMaybe<Scalars['Boolean']>;
  link?: InputMaybe<Array<FileInputDto>>;
  media?: InputMaybe<Array<FileInputDto>>;
  message: Scalars['String'];
};

export type CreateTrackingHistoryInputDto = {
  address?: InputMaybe<Scalars['String']>;
  location: Scalars['String'];
  status?: InputMaybe<TrackingDriverStatus>;
  trackingDriverId: Scalars['String'];
};

export type CreateTrackingLocationInputDto = {
  latitude: Scalars['String'];
  longitude: Scalars['String'];
  trackingDriverId: Scalars['String'];
};

export type Defunct = {
  avatar?: Maybe<Scalars['String']>;
  civilityName?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['DateTime']>;
  dateOfDeath?: Maybe<Scalars['DateTime']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type DeleteFileDto = {
  url: Scalars['String'];
};

export type DriverPhotoInputDto = {
  arrivePhotoKey?: InputMaybe<Array<Scalars['String']>>;
  departurePhotoKey?: InputMaybe<Array<Scalars['String']>>;
  trackingDriverId: Scalars['ID'];
};

export type DriverPhotoResponseDto = {
  success: Scalars['Boolean'];
  trackingDriver?: Maybe<ITrackingDriver>;
};

export type FileInput = {
  fileIndex?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type FileInputDto = {
  fileIndex?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Float']>;
  type?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type FilterDto = {
  data?: InputMaybe<Scalars['String']>;
  field: Scalars['String'];
  operator: QueryOperator;
};

export type FindMessageInputDto = {
  inboxId: Scalars['String'];
  messageId: Scalars['String'];
};

export type GenerateTrackingLinkInputDto = {
  arrivalName?: InputMaybe<Scalars['String']>;
  arrivePhotoKey?: InputMaybe<Array<Scalars['String']>>;
  caseName: Scalars['String'];
  civilityName?: InputMaybe<Scalars['String']>;
  currentLocaltion?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']>;
  dateOfDeath?: InputMaybe<Scalars['DateTime']>;
  deceasedAvatar?: InputMaybe<Scalars['String']>;
  departureName?: InputMaybe<Scalars['String']>;
  departurePhotoKey?: InputMaybe<Array<Scalars['String']>>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  placeOfArrival: Scalars['String'];
  placeOfDeparture: Scalars['String'];
  providerEmail: Scalars['String'];
  status?: InputMaybe<TrackingDriverStatus>;
  timeArrival?: InputMaybe<Scalars['DateTime']>;
  timeDeparture?: InputMaybe<Scalars['DateTime']>;
  transportId: Scalars['Float'];
};

export type GetTrackingMessageDto = {
  caseName: Scalars['String'];
  /**
   *
   * - Filter equal: filters:[{field: "User.name", operator: eq, data: "Enouvo"}]
   * - Filter not equal: filters:[{field: "User.name", operator: neq, data: "Enouvo"}]
   * - Filter less than: filters:[{field: "User.age", operator: lt, data: 40}]
   * - Filter greater than: filters:[{field: "User.age", operator: gt, data: 40}]
   * - Filter less than and equal: filters:[{field: "User.age", operator: lte, data: 40}]
   * - Filter greater than and equal: filters:[{field: "User.age", operator: gte, data: 40}]
   * - Filter field in many choice: filters:[{field: "User.name", operator: in, data: "EnouvoSpace,Enosta"}]
   * - Filter field not in many choice: filters:[{field: "User.name", operator: nin, data: "EnouvoSpace,Enosta"}]
   * - Filter field by text: filters:[{field: "User.name", operator: like, data: "Enouvo"}]
   */
  filters?: InputMaybe<Array<FilterDto>>;
  /**
   *
   * - Paginate with limit and offset. Ex: limit:10, page:1
   *
   */
  limit?: InputMaybe<Scalars['Float']>;
  /**
   *
   * - Order by fields and order reverse use prefix "ASC or DESC". Ex: orderBy: "User.createdAt:DESC"
   * - Use NULLS_FIRST OR NULLS_LAST to determine where null value should be, Ex: orderBy: "User.createdAt:DESC:NULLS_FIRST"
   *
   */
  orderBy?: InputMaybe<Scalars['String']>;
  /**
   *
   * - Paginate with limit and offset. Ex: limit:10, page:1
   *
   */
  page?: InputMaybe<Scalars['Float']>;
  providerEmail: Scalars['String'];
  /**
   *
   * - Query by text. Ex: q:"abcxyz"
   *
   */
  q?: InputMaybe<Scalars['String']>;
};

export enum HashtagType {
  Formalities = 'Formalities',
  Funeralservice = 'Funeralservice',
  Transportation = 'Transportation',
}

export type IInbox = {
  adminHasNewMessage?: Maybe<Scalars['Boolean']>;
  civilityFamilyMember?: Maybe<Scalars['String']>;
  clientHasNewMessage?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  firstMessage?: Maybe<Message>;
  firstMessageId?: Maybe<Scalars['String']>;
  firstNameFamilyMember?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inboxName?: Maybe<Scalars['String']>;
  inboxType?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastMessage?: Maybe<Message>;
  lastMessageId?: Maybe<Scalars['String']>;
  lastNameFamilyMember?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Message>>;
  providerCompanyName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username?: Maybe<Scalars['String']>;
};

export type IMessage = {
  createdAt?: Maybe<Scalars['DateTime']>;
  files?: Maybe<Array<FileInput>>;
  hashtag?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inboxId?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  isDriver?: Maybe<Scalars['Boolean']>;
  isFirstMessageOfTheDay?: Maybe<Scalars['Boolean']>;
  isProvider?: Maybe<Scalars['Boolean']>;
  isRead?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
  messageFiles?: Maybe<Array<MessageFile>>;
  receiverEmail?: Maybe<Scalars['String']>;
  receiverName?: Maybe<Scalars['String']>;
  replySelectedFile?: Maybe<Array<FileInput>>;
  replySelectedMessage?: Maybe<Scalars['String']>;
  replySelectedMessageType?: Maybe<ReplyMessageType>;
  replyToMessage?: Maybe<Message>;
  replyToMessageId?: Maybe<Scalars['String']>;
  senderEmail?: Maybe<Scalars['String']>;
  senderName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type IMessageFiles = {
  items: Array<MessageFile>;
  meta: MetaPaginationInterface;
};

export type IMessages = {
  items: Array<Message>;
  meta: MetaPaginationInterface;
};

export enum InboxType {
  Family = 'Family',
  Provider = 'Provider',
}

export type IPreSignUrl = {
  fileType: Scalars['String'];
  pathFile: Scalars['String'];
  uploadUrl: Scalars['String'];
};

export type ITrackingDriver = {
  arrivalName?: Maybe<Scalars['String']>;
  arrivePhotoKey?: Maybe<Array<Scalars['String']>>;
  caseName?: Maybe<Scalars['String']>;
  civilityName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  currentLocaltion?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['DateTime']>;
  dateOfDeath?: Maybe<Scalars['DateTime']>;
  deceasedAvatar?: Maybe<Scalars['String']>;
  defunct?: Maybe<Defunct>;
  departureName?: Maybe<Scalars['String']>;
  departurePhotoKey?: Maybe<Array<Scalars['String']>>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  placeOfArrival?: Maybe<Scalars['String']>;
  placeOfDeparture?: Maybe<Scalars['String']>;
  providerEmail?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  timeArrival?: Maybe<Scalars['DateTime']>;
  timeDeparture?: Maybe<Scalars['DateTime']>;
  trackingHistories?: Maybe<Array<TrackingHistory>>;
  trackingLocations?: Maybe<Array<TrackingLocation>>;
  transportId?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ITrackingDrivers = {
  items: Array<TrackingDriver>;
  meta: MetaPaginationInterface;
};

export type ITrackingHistory = {
  address?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  status?: Maybe<TrackingDriverStatus>;
  trackingDriver?: Maybe<TrackingDriver>;
  trackingDriverId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ITrackingHistorys = {
  items: Array<TrackingHistory>;
  meta: MetaPaginationInterface;
};

export type ITrackingLocation = {
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  trackingDriver?: Maybe<TrackingDriver>;
  trackingDriverId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type ITrackingLocations = {
  items: Array<TrackingLocation>;
  meta: MetaPaginationInterface;
};

export type Inbox = {
  adminHasNewMessage?: Maybe<Scalars['Boolean']>;
  civilityFamilyMember?: Maybe<Scalars['String']>;
  clientHasNewMessage?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  deletedAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  firstMessage?: Maybe<Message>;
  firstMessageId?: Maybe<Scalars['String']>;
  firstNameFamilyMember?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inboxName?: Maybe<Scalars['String']>;
  inboxType?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  lastMessage?: Maybe<Message>;
  lastMessageId?: Maybe<Scalars['String']>;
  lastNameFamilyMember?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Message>>;
  providerCompanyName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username?: Maybe<Scalars['String']>;
};

export type Message = {
  createdAt?: Maybe<Scalars['DateTime']>;
  files?: Maybe<Array<FileInput>>;
  hashtag?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  inboxId?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  isDriver?: Maybe<Scalars['Boolean']>;
  isFirstMessageOfTheDay?: Maybe<Scalars['Boolean']>;
  isProvider?: Maybe<Scalars['Boolean']>;
  isRead?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
  messageFiles?: Maybe<Array<MessageFile>>;
  receiverEmail?: Maybe<Scalars['String']>;
  receiverName?: Maybe<Scalars['String']>;
  replySelectedFile?: Maybe<Array<FileInput>>;
  replySelectedMessage?: Maybe<Scalars['String']>;
  replySelectedMessageType?: Maybe<ReplyMessageType>;
  replyToMessage?: Maybe<Message>;
  replyToMessageId?: Maybe<Scalars['String']>;
  senderEmail?: Maybe<Scalars['String']>;
  senderName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type MessageFile = {
  createdAt?: Maybe<Scalars['DateTime']>;
  file?: Maybe<Scalars['String']>;
  fileIndex?: Maybe<Scalars['Float']>;
  fileName?: Maybe<Scalars['String']>;
  fileSize?: Maybe<Scalars['Float']>;
  fileType?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  link?: Maybe<Scalars['String']>;
  media?: Maybe<Scalars['String']>;
  messageId?: Maybe<Scalars['String']>;
  senderName?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type MessageInputDto = {
  civilityFamilyMember?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Array<FileInputDto>>;
  files?: InputMaybe<Scalars['JSON']>;
  firstNameFamilyMember?: InputMaybe<Scalars['String']>;
  hashtag?: InputMaybe<HashtagType>;
  inboxId?: InputMaybe<Scalars['String']>;
  inboxName?: InputMaybe<Scalars['String']>;
  inboxType?: InputMaybe<InboxType>;
  isRead?: InputMaybe<Scalars['Boolean']>;
  lastNameFamilyMember?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Array<FileInputDto>>;
  media?: InputMaybe<Array<FileInputDto>>;
  message: Scalars['String'];
  providerCompanyName?: InputMaybe<Scalars['String']>;
  receiverEmail?: InputMaybe<Scalars['String']>;
  receiverName?: InputMaybe<Scalars['String']>;
  replySelectedFile?: InputMaybe<Scalars['JSON']>;
  replySelectedMessage?: InputMaybe<Scalars['String']>;
  replySelectedMessageType?: InputMaybe<ReplyMessageType>;
  replyToMessageId?: InputMaybe<Scalars['String']>;
  senderEmail: Scalars['String'];
  senderName?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type MessageQueryFilter = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  /**
   *
   * - Filter equal: filters:[{field: "User.name", operator: eq, data: "Enouvo"}]
   * - Filter not equal: filters:[{field: "User.name", operator: neq, data: "Enouvo"}]
   * - Filter less than: filters:[{field: "User.age", operator: lt, data: 40}]
   * - Filter greater than: filters:[{field: "User.age", operator: gt, data: 40}]
   * - Filter less than and equal: filters:[{field: "User.age", operator: lte, data: 40}]
   * - Filter greater than and equal: filters:[{field: "User.age", operator: gte, data: 40}]
   * - Filter field in many choice: filters:[{field: "User.name", operator: in, data: "EnouvoSpace,Enosta"}]
   * - Filter field not in many choice: filters:[{field: "User.name", operator: nin, data: "EnouvoSpace,Enosta"}]
   * - Filter field by text: filters:[{field: "User.name", operator: like, data: "Enouvo"}]
   */
  filters?: InputMaybe<Array<FilterDto>>;
  /**
   *
   * - Paginate with limit and offset. Ex: limit:10, page:1
   *
   */
  limit?: InputMaybe<Scalars['Float']>;
  /**
   *
   * - Order by fields and order reverse use prefix "ASC or DESC". Ex: orderBy: "User.createdAt:DESC"
   * - Use NULLS_FIRST OR NULLS_LAST to determine where null value should be, Ex: orderBy: "User.createdAt:DESC:NULLS_FIRST"
   *
   */
  orderBy?: InputMaybe<Scalars['String']>;
  /**
   *
   * - Paginate with limit and offset. Ex: limit:10, page:1
   *
   */
  page?: InputMaybe<Scalars['Float']>;
  /**
   *
   * - Query by text. Ex: q:"abcxyz"
   *
   */
  q?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type MetaPaginationInterface = {
  currentPage: Scalars['Float'];
  itemCount: Scalars['Float'];
  itemsPerPage: Scalars['Float'];
  totalItems: Scalars['Float'];
  totalPages: Scalars['Float'];
};

export type Mutation = {
  createDriverChatBox: Inbox;
  createTrackingHistory: ITrackingHistory;
  createTrackingLocation: ITrackingLocation;
  deleteFileS3: Scalars['String'];
  generateTrackingLink: Scalars['String'];
  presignedUrlS3: IPreSignUrl;
  readMessage: IInbox;
  sendDriverMessage: IMessage;
  sendMessage: IMessage;
  upsertDriverPhoto: DriverPhotoResponseDto;
  upsertTrackingDriver: ITrackingDriver;
};

export type MutationCreateDriverChatBoxArgs = {
  input: CreateDriverChatBoxDto;
};

export type MutationCreateTrackingHistoryArgs = {
  input: CreateTrackingHistoryInputDto;
};

export type MutationCreateTrackingLocationArgs = {
  input: CreateTrackingLocationInputDto;
};

export type MutationDeleteFileS3Args = {
  deleteFileDto: DeleteFileDto;
};

export type MutationGenerateTrackingLinkArgs = {
  input: GenerateTrackingLinkInputDto;
};

export type MutationPresignedUrlS3Args = {
  presignedUrlDto: PresignedUrlDto;
};

export type MutationReadMessageArgs = {
  input: ReadMessageInputDto;
};

export type MutationSendDriverMessageArgs = {
  input: CreateDriverMessageDto;
};

export type MutationSendMessageArgs = {
  input: MessageInputDto;
};

export type MutationUpsertDriverPhotoArgs = {
  input: DriverPhotoInputDto;
};

export type MutationUpsertTrackingDriverArgs = {
  input: TrackingDriverCreateInputDto;
};

export type PresignedUrlDto = {
  fileName: Scalars['String'];
  fileType: Scalars['String'];
  pathType: S3UploadType;
};

export enum QueryOperator {
  Eq = 'eq',
  Gt = 'gt',
  Gte = 'gte',
  In = 'in',
  IsNotNull = 'isNotNull',
  IsNull = 'isNull',
  Like = 'like',
  Lt = 'lt',
  Lte = 'lte',
  Neq = 'neq',
  Nin = 'nin',
  UnaccentLike = 'unaccentLike',
}

export type Query = {
  findMessages: IMessages;
  getMessageFiles: IMessageFiles;
  getMessages: IMessages;
  getTrackingDriver: ITrackingDriver;
  getTrackingDrivers: ITrackingDrivers;
  getTrackingHistorys: ITrackingHistorys;
  getTrackingLocations: ITrackingLocations;
  getTrackingMessages: IMessages;
  me: IInbox;
  testQuery: Scalars['String'];
};

export type QueryFindMessagesArgs = {
  input: FindMessageInputDto;
  queryParams: QueryFilterDto;
};

export type QueryGetMessageFilesArgs = {
  queryParams: QueryFilterDto;
};

export type QueryGetMessagesArgs = {
  queryParams: MessageQueryFilter;
};

export type QueryGetTrackingDriverArgs = {
  allowExpiredLink?: InputMaybe<Scalars['Boolean']>;
  trackingDriverId: Scalars['String'];
};

export type QueryGetTrackingDriversArgs = {
  providerEmail: Scalars['String'];
  queryParams: QueryFilterDto;
};

export type QueryGetTrackingHistorysArgs = {
  queryParams: QueryFilterDto;
};

export type QueryGetTrackingLocationsArgs = {
  queryParams?: InputMaybe<TrackingLocationQueryFilterDto>;
  trackingDriverId: Scalars['String'];
};

export type QueryGetTrackingMessagesArgs = {
  queryParams: GetTrackingMessageDto;
};

export type QueryMeArgs = {
  email: Scalars['String'];
  username: Scalars['String'];
};

export type QueryFilterDto = {
  /**
   *
   * - Filter equal: filters:[{field: "User.name", operator: eq, data: "Enouvo"}]
   * - Filter not equal: filters:[{field: "User.name", operator: neq, data: "Enouvo"}]
   * - Filter less than: filters:[{field: "User.age", operator: lt, data: 40}]
   * - Filter greater than: filters:[{field: "User.age", operator: gt, data: 40}]
   * - Filter less than and equal: filters:[{field: "User.age", operator: lte, data: 40}]
   * - Filter greater than and equal: filters:[{field: "User.age", operator: gte, data: 40}]
   * - Filter field in many choice: filters:[{field: "User.name", operator: in, data: "EnouvoSpace,Enosta"}]
   * - Filter field not in many choice: filters:[{field: "User.name", operator: nin, data: "EnouvoSpace,Enosta"}]
   * - Filter field by text: filters:[{field: "User.name", operator: like, data: "Enouvo"}]
   */
  filters?: InputMaybe<Array<FilterDto>>;
  /**
   *
   * - Paginate with limit and offset. Ex: limit:10, page:1
   *
   */
  limit?: InputMaybe<Scalars['Float']>;
  /**
   *
   * - Order by fields and order reverse use prefix "ASC or DESC". Ex: orderBy: "User.createdAt:DESC"
   * - Use NULLS_FIRST OR NULLS_LAST to determine where null value should be, Ex: orderBy: "User.createdAt:DESC:NULLS_FIRST"
   *
   */
  orderBy?: InputMaybe<Scalars['String']>;
  /**
   *
   * - Paginate with limit and offset. Ex: limit:10, page:1
   *
   */
  page?: InputMaybe<Scalars['Float']>;
  /**
   *
   * - Query by text. Ex: q:"abcxyz"
   *
   */
  q?: InputMaybe<Scalars['String']>;
};

export enum ReplyMessageType {
  File = 'FILE',
  Image = 'IMAGE',
  Text = 'TEXT',
}

export type ReadMessageInputDto = {
  email: Scalars['String'];
  id: Scalars['String'];
};

export enum S3UploadType {
  Profile = 'Profile',
  Public = 'Public',
}

export enum TrackingDriverStatus {
  Canceled = 'Canceled',
  Changed = 'Changed',
  Confirmed = 'Confirmed',
  Finished = 'Finished',
  Inprogress = 'Inprogress',
  Planned = 'Planned',
  Postponed = 'Postponed',
}

export type TrackingDriver = {
  arrivalName?: Maybe<Scalars['String']>;
  arrivePhotoKey?: Maybe<Array<Scalars['String']>>;
  caseName?: Maybe<Scalars['String']>;
  civilityName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  currentLocaltion?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['DateTime']>;
  dateOfDeath?: Maybe<Scalars['DateTime']>;
  deceasedAvatar?: Maybe<Scalars['String']>;
  defunct?: Maybe<Defunct>;
  departureName?: Maybe<Scalars['String']>;
  departurePhotoKey?: Maybe<Array<Scalars['String']>>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  placeOfArrival?: Maybe<Scalars['String']>;
  placeOfDeparture?: Maybe<Scalars['String']>;
  providerEmail?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  timeArrival?: Maybe<Scalars['DateTime']>;
  timeDeparture?: Maybe<Scalars['DateTime']>;
  trackingHistories?: Maybe<Array<TrackingHistory>>;
  trackingLocations?: Maybe<Array<TrackingLocation>>;
  transportId?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type TrackingDriverCreateInputDto = {
  arrivalName?: InputMaybe<Scalars['String']>;
  arrivePhotoKey?: InputMaybe<Array<Scalars['String']>>;
  caseName?: InputMaybe<Scalars['String']>;
  currentLocaltion?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']>;
  dateOfDeath?: InputMaybe<Scalars['DateTime']>;
  deceasedAvatar?: InputMaybe<Scalars['String']>;
  departureName?: InputMaybe<Scalars['String']>;
  departurePhotoKey?: InputMaybe<Array<Scalars['String']>>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: InputMaybe<Scalars['String']>;
  placeOfArrival?: InputMaybe<Scalars['String']>;
  placeOfDeparture?: InputMaybe<Scalars['String']>;
  providerEmail?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<TrackingDriverStatus>;
  timeArrival?: InputMaybe<Scalars['DateTime']>;
  timeDeparture?: InputMaybe<Scalars['DateTime']>;
  transportId: Scalars['Float'];
};

export type TrackingHistory = {
  address?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  status?: Maybe<TrackingDriverStatus>;
  trackingDriver?: Maybe<TrackingDriver>;
  trackingDriverId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type TrackingLocation = {
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  trackingDriver?: Maybe<TrackingDriver>;
  trackingDriverId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type TrackingLocationQueryFilterDto = {
  limit?: InputMaybe<Scalars['Float']>;
  orderBy?: InputMaybe<Scalars['String']>;
  page?: InputMaybe<Scalars['Float']>;
};

export const FileInputFragmentFragmentDoc = gql`
  fragment FileInputFragment on FileInput {
    name
    size
    url
    type
  }
`;
export const MetaFragmentFragmentDoc = gql`
  fragment MetaFragment on MetaPaginationInterface {
    totalItems
    itemCount
    itemsPerPage
    totalPages
    currentPage
  }
`;
export const GenerateTrackingLinkDocument = gql`
  mutation generateTrackingLink($input: GenerateTrackingLinkInputDto!) {
    generateTrackingLink(input: $input)
  }
`;
export type GenerateTrackingLinkMutationFn = Apollo.MutationFunction<
  GenerateTrackingLinkMutation,
  GenerateTrackingLinkMutationVariables
>;

/**
 * __useGenerateTrackingLinkMutation__
 *
 * To run a mutation, you first call `useGenerateTrackingLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateTrackingLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateTrackingLinkMutation, { data, loading, error }] = useGenerateTrackingLinkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGenerateTrackingLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GenerateTrackingLinkMutation,
    GenerateTrackingLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GenerateTrackingLinkMutation,
    GenerateTrackingLinkMutationVariables
  >(GenerateTrackingLinkDocument, options);
}
export type GenerateTrackingLinkMutationHookResult = ReturnType<
  typeof useGenerateTrackingLinkMutation
>;
export type GenerateTrackingLinkMutationResult =
  Apollo.MutationResult<GenerateTrackingLinkMutation>;
export type GenerateTrackingLinkMutationOptions = Apollo.BaseMutationOptions<
  GenerateTrackingLinkMutation,
  GenerateTrackingLinkMutationVariables
>;
export const PresignedUrlS3Document = gql`
  mutation presignedUrlS3($presignedUrlDto: PresignedUrlDto!) {
    presignedUrlS3(presignedUrlDto: $presignedUrlDto) {
      pathFile
      fileType
      uploadUrl
    }
  }
`;
export type PresignedUrlS3MutationFn = Apollo.MutationFunction<
  PresignedUrlS3Mutation,
  PresignedUrlS3MutationVariables
>;

/**
 * __usePresignedUrlS3Mutation__
 *
 * To run a mutation, you first call `usePresignedUrlS3Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePresignedUrlS3Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [presignedUrlS3Mutation, { data, loading, error }] = usePresignedUrlS3Mutation({
 *   variables: {
 *      presignedUrlDto: // value for 'presignedUrlDto'
 *   },
 * });
 */
export function usePresignedUrlS3Mutation(
  baseOptions?: Apollo.MutationHookOptions<
    PresignedUrlS3Mutation,
    PresignedUrlS3MutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PresignedUrlS3Mutation,
    PresignedUrlS3MutationVariables
  >(PresignedUrlS3Document, options);
}
export type PresignedUrlS3MutationHookResult = ReturnType<
  typeof usePresignedUrlS3Mutation
>;
export type PresignedUrlS3MutationResult =
  Apollo.MutationResult<PresignedUrlS3Mutation>;
export type PresignedUrlS3MutationOptions = Apollo.BaseMutationOptions<
  PresignedUrlS3Mutation,
  PresignedUrlS3MutationVariables
>;
export const ReadMessageDocument = gql`
  mutation readMessage($input: ReadMessageInputDto!) {
    readMessage(input: $input) {
      id
      email
      username
      clientHasNewMessage
      adminHasNewMessage
    }
  }
`;
export type ReadMessageMutationFn = Apollo.MutationFunction<
  ReadMessageMutation,
  ReadMessageMutationVariables
>;

/**
 * __useReadMessageMutation__
 *
 * To run a mutation, you first call `useReadMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readMessageMutation, { data, loading, error }] = useReadMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReadMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReadMessageMutation,
    ReadMessageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ReadMessageMutation, ReadMessageMutationVariables>(
    ReadMessageDocument,
    options,
  );
}
export type ReadMessageMutationHookResult = ReturnType<
  typeof useReadMessageMutation
>;
export type ReadMessageMutationResult =
  Apollo.MutationResult<ReadMessageMutation>;
export type ReadMessageMutationOptions = Apollo.BaseMutationOptions<
  ReadMessageMutation,
  ReadMessageMutationVariables
>;
export const SendMessageDocument = gql`
  mutation sendMessage($input: MessageInputDto!) {
    sendMessage(input: $input) {
      id
      message
      inboxId
      senderEmail
      receiverEmail
      senderName
      receiverName
      isRead
      replyToMessageId
      replySelectedMessageType
      replySelectedMessage
      isFirstMessageOfTheDay
      replyToMessage {
        id
        senderEmail
        senderName
      }
      replySelectedFile {
        ...FileInputFragment
      }
      createdAt
      messageFiles {
        id
        media
        link
        type
        file
        messageId
        fileSize
        fileName
        fileType
        fileIndex
      }
    }
  }
  ${FileInputFragmentFragmentDoc}
`;
export type SendMessageMutationFn = Apollo.MutationFunction<
  SendMessageMutation,
  SendMessageMutationVariables
>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendMessageMutation,
    SendMessageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(
    SendMessageDocument,
    options,
  );
}
export type SendMessageMutationHookResult = ReturnType<
  typeof useSendMessageMutation
>;
export type SendMessageMutationResult =
  Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<
  SendMessageMutation,
  SendMessageMutationVariables
>;
export const UpsertTrackingDriverDocument = gql`
  mutation upsertTrackingDriver($input: TrackingDriverCreateInputDto!) {
    upsertTrackingDriver(input: $input) {
      id
      status
    }
  }
`;
export type UpsertTrackingDriverMutationFn = Apollo.MutationFunction<
  UpsertTrackingDriverMutation,
  UpsertTrackingDriverMutationVariables
>;

/**
 * __useUpsertTrackingDriverMutation__
 *
 * To run a mutation, you first call `useUpsertTrackingDriverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertTrackingDriverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertTrackingDriverMutation, { data, loading, error }] = useUpsertTrackingDriverMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpsertTrackingDriverMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpsertTrackingDriverMutation,
    UpsertTrackingDriverMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpsertTrackingDriverMutation,
    UpsertTrackingDriverMutationVariables
  >(UpsertTrackingDriverDocument, options);
}
export type UpsertTrackingDriverMutationHookResult = ReturnType<
  typeof useUpsertTrackingDriverMutation
>;
export type UpsertTrackingDriverMutationResult =
  Apollo.MutationResult<UpsertTrackingDriverMutation>;
export type UpsertTrackingDriverMutationOptions = Apollo.BaseMutationOptions<
  UpsertTrackingDriverMutation,
  UpsertTrackingDriverMutationVariables
>;
export const FindMessagesDocument = gql`
  query findMessages(
    $input: FindMessageInputDto!
    $queryParams: QueryFilterDto!
  ) {
    findMessages(input: $input, queryParams: $queryParams) {
      meta {
        ...MetaFragment
      }
      items {
        id
        message
        inboxId
        senderEmail
        receiverEmail
        senderName
        receiverName
        isRead
        isFirstMessageOfTheDay
        replyToMessageId
        replySelectedMessageType
        replySelectedMessage
        replyToMessage {
          id
          senderEmail
          senderName
        }
        replySelectedFile {
          ...FileInputFragment
        }
        createdAt
        messageFiles {
          id
          file
          media
          link
          type
          messageId
          fileSize
          fileName
          fileType
          fileIndex
        }
      }
    }
  }
  ${MetaFragmentFragmentDoc}
  ${FileInputFragmentFragmentDoc}
`;

/**
 * __useFindMessagesQuery__
 *
 * To run a query within a React component, call `useFindMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMessagesQuery({
 *   variables: {
 *      input: // value for 'input'
 *      queryParams: // value for 'queryParams'
 *   },
 * });
 */
export function useFindMessagesQuery(
  baseOptions: Apollo.QueryHookOptions<
    FindMessagesQuery,
    FindMessagesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FindMessagesQuery, FindMessagesQueryVariables>(
    FindMessagesDocument,
    options,
  );
}
export function useFindMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FindMessagesQuery,
    FindMessagesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FindMessagesQuery, FindMessagesQueryVariables>(
    FindMessagesDocument,
    options,
  );
}
export type FindMessagesQueryHookResult = ReturnType<
  typeof useFindMessagesQuery
>;
export type FindMessagesLazyQueryHookResult = ReturnType<
  typeof useFindMessagesLazyQuery
>;
export type FindMessagesQueryResult = Apollo.QueryResult<
  FindMessagesQuery,
  FindMessagesQueryVariables
>;
export function refetchFindMessagesQuery(
  variables: FindMessagesQueryVariables,
) {
  return { query: FindMessagesDocument, variables: variables };
}
export const GetMessageFilesDocument = gql`
  query getMessageFiles($queryParams: QueryFilterDto!) {
    getMessageFiles(queryParams: $queryParams) {
      meta {
        ...MetaFragment
      }
      items {
        id
        file
        media
        link
        type
        messageId
        createdAt
        updatedAt
        fileType
        fileName
        fileSize
        senderName
      }
    }
  }
  ${MetaFragmentFragmentDoc}
`;

/**
 * __useGetMessageFilesQuery__
 *
 * To run a query within a React component, call `useGetMessageFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessageFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessageFilesQuery({
 *   variables: {
 *      queryParams: // value for 'queryParams'
 *   },
 * });
 */
export function useGetMessageFilesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMessageFilesQuery,
    GetMessageFilesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMessageFilesQuery, GetMessageFilesQueryVariables>(
    GetMessageFilesDocument,
    options,
  );
}
export function useGetMessageFilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMessageFilesQuery,
    GetMessageFilesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetMessageFilesQuery,
    GetMessageFilesQueryVariables
  >(GetMessageFilesDocument, options);
}
export type GetMessageFilesQueryHookResult = ReturnType<
  typeof useGetMessageFilesQuery
>;
export type GetMessageFilesLazyQueryHookResult = ReturnType<
  typeof useGetMessageFilesLazyQuery
>;
export type GetMessageFilesQueryResult = Apollo.QueryResult<
  GetMessageFilesQuery,
  GetMessageFilesQueryVariables
>;
export function refetchGetMessageFilesQuery(
  variables: GetMessageFilesQueryVariables,
) {
  return { query: GetMessageFilesDocument, variables: variables };
}
export const GetMessagesDocument = gql`
  query getMessages($queryParams: MessageQueryFilter!) {
    getMessages(queryParams: $queryParams) {
      meta {
        ...MetaFragment
      }
      items {
        id
        message
        inboxId
        senderEmail
        receiverEmail
        senderName
        receiverName
        isRead
        replyToMessageId
        replySelectedMessageType
        replySelectedMessage
        replyToMessage {
          id
          senderEmail
          senderName
        }
        replySelectedFile {
          ...FileInputFragment
        }
        createdAt
        messageFiles {
          id
          file
          media
          link
          type
          messageId
          fileSize
          fileName
          fileType
          fileIndex
        }
      }
    }
  }
  ${MetaFragmentFragmentDoc}
  ${FileInputFragmentFragmentDoc}
`;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      queryParams: // value for 'queryParams'
 *   },
 * });
 */
export function useGetMessagesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(
    GetMessagesDocument,
    options,
  );
}
export function useGetMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMessagesQuery,
    GetMessagesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(
    GetMessagesDocument,
    options,
  );
}
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<
  typeof useGetMessagesLazyQuery
>;
export type GetMessagesQueryResult = Apollo.QueryResult<
  GetMessagesQuery,
  GetMessagesQueryVariables
>;
export function refetchGetMessagesQuery(variables: GetMessagesQueryVariables) {
  return { query: GetMessagesDocument, variables: variables };
}
export const GetTrackingDriverDocument = gql`
  query getTrackingDriver(
    $trackingDriverId: String!
    $allowExpiredLink: Boolean
  ) {
    getTrackingDriver(
      trackingDriverId: $trackingDriverId
      allowExpiredLink: $allowExpiredLink
    ) {
      id
      caseName
      placeOfDeparture
      placeOfArrival
      providerEmail
      departureName
      arrivalName
      arrivePhotoKey
      departurePhotoKey
      status
      transportId
    }
  }
`;

/**
 * __useGetTrackingDriverQuery__
 *
 * To run a query within a React component, call `useGetTrackingDriverQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrackingDriverQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrackingDriverQuery({
 *   variables: {
 *      trackingDriverId: // value for 'trackingDriverId'
 *      allowExpiredLink: // value for 'allowExpiredLink'
 *   },
 * });
 */
export function useGetTrackingDriverQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTrackingDriverQuery,
    GetTrackingDriverQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTrackingDriverQuery,
    GetTrackingDriverQueryVariables
  >(GetTrackingDriverDocument, options);
}
export function useGetTrackingDriverLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTrackingDriverQuery,
    GetTrackingDriverQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTrackingDriverQuery,
    GetTrackingDriverQueryVariables
  >(GetTrackingDriverDocument, options);
}
export type GetTrackingDriverQueryHookResult = ReturnType<
  typeof useGetTrackingDriverQuery
>;
export type GetTrackingDriverLazyQueryHookResult = ReturnType<
  typeof useGetTrackingDriverLazyQuery
>;
export type GetTrackingDriverQueryResult = Apollo.QueryResult<
  GetTrackingDriverQuery,
  GetTrackingDriverQueryVariables
>;
export function refetchGetTrackingDriverQuery(
  variables: GetTrackingDriverQueryVariables,
) {
  return { query: GetTrackingDriverDocument, variables: variables };
}
export const GetTrackingDriversDocument = gql`
  query getTrackingDrivers(
    $queryParams: QueryFilterDto!
    $providerEmail: String!
  ) {
    getTrackingDrivers(
      queryParams: $queryParams
      providerEmail: $providerEmail
    ) {
      meta {
        ...MetaFragment
      }
      items {
        id
        placeOfDeparture
        placeOfArrival
        providerEmail
        caseName
        departureName
        arrivalName
        status
        transportId
        departurePhotoKey
        arrivePhotoKey
      }
    }
  }
  ${MetaFragmentFragmentDoc}
`;

/**
 * __useGetTrackingDriversQuery__
 *
 * To run a query within a React component, call `useGetTrackingDriversQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrackingDriversQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrackingDriversQuery({
 *   variables: {
 *      queryParams: // value for 'queryParams'
 *      providerEmail: // value for 'providerEmail'
 *   },
 * });
 */
export function useGetTrackingDriversQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTrackingDriversQuery,
    GetTrackingDriversQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTrackingDriversQuery,
    GetTrackingDriversQueryVariables
  >(GetTrackingDriversDocument, options);
}
export function useGetTrackingDriversLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTrackingDriversQuery,
    GetTrackingDriversQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTrackingDriversQuery,
    GetTrackingDriversQueryVariables
  >(GetTrackingDriversDocument, options);
}
export type GetTrackingDriversQueryHookResult = ReturnType<
  typeof useGetTrackingDriversQuery
>;
export type GetTrackingDriversLazyQueryHookResult = ReturnType<
  typeof useGetTrackingDriversLazyQuery
>;
export type GetTrackingDriversQueryResult = Apollo.QueryResult<
  GetTrackingDriversQuery,
  GetTrackingDriversQueryVariables
>;
export function refetchGetTrackingDriversQuery(
  variables: GetTrackingDriversQueryVariables,
) {
  return { query: GetTrackingDriversDocument, variables: variables };
}
export const GetTrackingLocationsDocument = gql`
  query getTrackingLocations(
    $queryParams: TrackingLocationQueryFilterDto!
    $trackingDriverId: String!
  ) {
    getTrackingLocations(
      queryParams: $queryParams
      trackingDriverId: $trackingDriverId
    ) {
      items {
        id
        longitude
        latitude
      }
    }
  }
`;

/**
 * __useGetTrackingLocationsQuery__
 *
 * To run a query within a React component, call `useGetTrackingLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrackingLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrackingLocationsQuery({
 *   variables: {
 *      queryParams: // value for 'queryParams'
 *      trackingDriverId: // value for 'trackingDriverId'
 *   },
 * });
 */
export function useGetTrackingLocationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTrackingLocationsQuery,
    GetTrackingLocationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTrackingLocationsQuery,
    GetTrackingLocationsQueryVariables
  >(GetTrackingLocationsDocument, options);
}
export function useGetTrackingLocationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTrackingLocationsQuery,
    GetTrackingLocationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTrackingLocationsQuery,
    GetTrackingLocationsQueryVariables
  >(GetTrackingLocationsDocument, options);
}
export type GetTrackingLocationsQueryHookResult = ReturnType<
  typeof useGetTrackingLocationsQuery
>;
export type GetTrackingLocationsLazyQueryHookResult = ReturnType<
  typeof useGetTrackingLocationsLazyQuery
>;
export type GetTrackingLocationsQueryResult = Apollo.QueryResult<
  GetTrackingLocationsQuery,
  GetTrackingLocationsQueryVariables
>;
export function refetchGetTrackingLocationsQuery(
  variables: GetTrackingLocationsQueryVariables,
) {
  return { query: GetTrackingLocationsDocument, variables: variables };
}
export const MeDocument = gql`
  query me($email: String!, $username: String!) {
    me(email: $email, username: $username) {
      id
      email
      username
      clientHasNewMessage
      lastMessageId
      lastNameFamilyMember
      firstNameFamilyMember
      civilityFamilyMember
      createdAt
      firstMessageId
      inboxName
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *      email: // value for 'email'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useMeQuery(
  baseOptions: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export function refetchMeQuery(variables: MeQueryVariables) {
  return { query: MeDocument, variables: variables };
}
export type FileInputFragmentFragment = {
  name?: string | null;
  size?: number | null;
  url?: string | null;
  type?: string | null;
};

export type MetaFragmentFragment = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type GenerateTrackingLinkMutationVariables = Exact<{
  input: GenerateTrackingLinkInputDto;
}>;

export type GenerateTrackingLinkMutation = { generateTrackingLink: string };

export type PresignedUrlS3MutationVariables = Exact<{
  presignedUrlDto: PresignedUrlDto;
}>;

export type PresignedUrlS3Mutation = {
  presignedUrlS3: { pathFile: string; fileType: string; uploadUrl: string };
};

export type ReadMessageMutationVariables = Exact<{
  input: ReadMessageInputDto;
}>;

export type ReadMessageMutation = {
  readMessage: {
    id: string;
    email?: string | null;
    username?: string | null;
    clientHasNewMessage?: boolean | null;
    adminHasNewMessage?: boolean | null;
  };
};

export type SendMessageMutationVariables = Exact<{
  input: MessageInputDto;
}>;

export type SendMessageMutation = {
  sendMessage: {
    id: string;
    message?: string | null;
    inboxId?: string | null;
    senderEmail?: string | null;
    receiverEmail?: string | null;
    senderName?: string | null;
    receiverName?: string | null;
    isRead?: boolean | null;
    replyToMessageId?: string | null;
    replySelectedMessageType?: ReplyMessageType | null;
    replySelectedMessage?: string | null;
    isFirstMessageOfTheDay?: boolean | null;
    createdAt?: any | null;
    replyToMessage?: {
      id: string;
      senderEmail?: string | null;
      senderName?: string | null;
    } | null;
    replySelectedFile?: Array<{
      name?: string | null;
      size?: number | null;
      url?: string | null;
      type?: string | null;
    }> | null;
    messageFiles?: Array<{
      id: string;
      media?: string | null;
      link?: string | null;
      type?: string | null;
      file?: string | null;
      messageId?: string | null;
      fileSize?: number | null;
      fileName?: string | null;
      fileType?: string | null;
      fileIndex?: number | null;
    }> | null;
  };
};

export type UpsertTrackingDriverMutationVariables = Exact<{
  input: TrackingDriverCreateInputDto;
}>;

export type UpsertTrackingDriverMutation = {
  upsertTrackingDriver: { id: string; status?: string | null };
};

export type FindMessagesQueryVariables = Exact<{
  input: FindMessageInputDto;
  queryParams: QueryFilterDto;
}>;

export type FindMessagesQuery = {
  findMessages: {
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
    items: Array<{
      id: string;
      message?: string | null;
      inboxId?: string | null;
      senderEmail?: string | null;
      receiverEmail?: string | null;
      senderName?: string | null;
      receiverName?: string | null;
      isRead?: boolean | null;
      isFirstMessageOfTheDay?: boolean | null;
      replyToMessageId?: string | null;
      replySelectedMessageType?: ReplyMessageType | null;
      replySelectedMessage?: string | null;
      createdAt?: any | null;
      replyToMessage?: {
        id: string;
        senderEmail?: string | null;
        senderName?: string | null;
      } | null;
      replySelectedFile?: Array<{
        name?: string | null;
        size?: number | null;
        url?: string | null;
        type?: string | null;
      }> | null;
      messageFiles?: Array<{
        id: string;
        file?: string | null;
        media?: string | null;
        link?: string | null;
        type?: string | null;
        messageId?: string | null;
        fileSize?: number | null;
        fileName?: string | null;
        fileType?: string | null;
        fileIndex?: number | null;
      }> | null;
    }>;
  };
};

export type GetMessageFilesQueryVariables = Exact<{
  queryParams: QueryFilterDto;
}>;

export type GetMessageFilesQuery = {
  getMessageFiles: {
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
    items: Array<{
      id: string;
      file?: string | null;
      media?: string | null;
      link?: string | null;
      type?: string | null;
      messageId?: string | null;
      createdAt?: any | null;
      updatedAt?: any | null;
      fileType?: string | null;
      fileName?: string | null;
      fileSize?: number | null;
      senderName?: string | null;
    }>;
  };
};

export type GetMessagesQueryVariables = Exact<{
  queryParams: MessageQueryFilter;
}>;

export type GetMessagesQuery = {
  getMessages: {
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
    items: Array<{
      id: string;
      message?: string | null;
      inboxId?: string | null;
      senderEmail?: string | null;
      receiverEmail?: string | null;
      senderName?: string | null;
      receiverName?: string | null;
      isRead?: boolean | null;
      replyToMessageId?: string | null;
      replySelectedMessageType?: ReplyMessageType | null;
      replySelectedMessage?: string | null;
      createdAt?: any | null;
      replyToMessage?: {
        id: string;
        senderEmail?: string | null;
        senderName?: string | null;
      } | null;
      replySelectedFile?: Array<{
        name?: string | null;
        size?: number | null;
        url?: string | null;
        type?: string | null;
      }> | null;
      messageFiles?: Array<{
        id: string;
        file?: string | null;
        media?: string | null;
        link?: string | null;
        type?: string | null;
        messageId?: string | null;
        fileSize?: number | null;
        fileName?: string | null;
        fileType?: string | null;
        fileIndex?: number | null;
      }> | null;
    }>;
  };
};

export type GetTrackingDriverQueryVariables = Exact<{
  trackingDriverId: Scalars['String'];
  allowExpiredLink?: InputMaybe<Scalars['Boolean']>;
}>;

export type GetTrackingDriverQuery = {
  getTrackingDriver: {
    id: string;
    caseName?: string | null;
    placeOfDeparture?: string | null;
    placeOfArrival?: string | null;
    providerEmail?: string | null;
    departureName?: string | null;
    arrivalName?: string | null;
    arrivePhotoKey?: Array<string> | null;
    departurePhotoKey?: Array<string> | null;
    status?: string | null;
    transportId?: number | null;
  };
};

export type GetTrackingDriversQueryVariables = Exact<{
  queryParams: QueryFilterDto;
  providerEmail: Scalars['String'];
}>;

export type GetTrackingDriversQuery = {
  getTrackingDrivers: {
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
    items: Array<{
      id: string;
      placeOfDeparture?: string | null;
      placeOfArrival?: string | null;
      providerEmail?: string | null;
      caseName?: string | null;
      departureName?: string | null;
      arrivalName?: string | null;
      status?: string | null;
      transportId?: number | null;
      departurePhotoKey?: Array<string> | null;
      arrivePhotoKey?: Array<string> | null;
    }>;
  };
};

export type GetTrackingLocationsQueryVariables = Exact<{
  queryParams: TrackingLocationQueryFilterDto;
  trackingDriverId: Scalars['String'];
}>;

export type GetTrackingLocationsQuery = {
  getTrackingLocations: {
    items: Array<{
      id: string;
      longitude?: string | null;
      latitude?: string | null;
    }>;
  };
};

export type MeQueryVariables = Exact<{
  email: Scalars['String'];
  username: Scalars['String'];
}>;

export type MeQuery = {
  me: {
    id: string;
    email?: string | null;
    username?: string | null;
    clientHasNewMessage?: boolean | null;
    lastMessageId?: string | null;
    lastNameFamilyMember?: string | null;
    firstNameFamilyMember?: string | null;
    civilityFamilyMember?: string | null;
    createdAt?: any | null;
    firstMessageId?: string | null;
    inboxName?: string | null;
  };
};
