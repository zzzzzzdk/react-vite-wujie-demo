import type { Dayjs } from 'dayjs'
import { TargetType } from "@/config/CommonType";

export interface NumDataType {
  personInfo: number;
  contactInfo: number;
  addressInfo: number;
  photoInfo: number;
  carInfo: number;
  illegalInfo: number;
  caseInfo: number;
  travelInfo: number;
  hotelInfo: number;
  interInfo: number;
}

export interface PortraitClusterCountType {
  face: number;
  pedestrian: number;
  gait: number;
  vehicle: number;
  bicycle: number;
  tricycle: number;
}

export interface Props {
  isReal?: boolean,
  data: { idNumber: string, groupId: string[], groupPlateId: string[], feature: string, idType: string, photoUrl: string },
  handleChangeTabKey?: (key: string, data?: any) => void,
  searchData?: any
  personInfoData?: any
  handleChangePerson?: (data: any) => void
  portraitClusterCount?:PortraitClusterCountType
  onTargetTypeChange?:(targetType:string)=>void
  activeTargetType?:string

}
export interface PersonInfoData {
  name: string,
  idNumber: string,
  labels: { id: string, color: string, name: string }[],
  labelIds: string[],
  photoUrl: string
  idType: string
}
export interface LabelData {
  id: string,
  labels: { id: string, name: string, color: string }[],
  name: string,
}
export interface TimeData {
  timeType: string, beginDate: string, endDate: string, beginTime: string, endTime: string
}

// 行为轨迹
export interface TraceData {
  "locationId": string,
  "locationName": string,
  "lngLat": {
    "lng": string,
    "lat": string
  },
  "path": string[],
  "infos": [],
  "filterId": string,
  "captureTime": string,
  "title": string,
  "trackType": TraceType
  seat: string
}
// 轨迹类型
export enum TraceType {
  capture = 1,
  case,
  travel,
  hotel,
  inter
}
export interface TraceFormData {
  idNumber?: string,
  groupId?: string[],
  trackType?: string,
  beginDate?: string,
  endDate?: string
}

//关联人员
export interface RelateData {
  "infoId": string
  "name": string,
  "idNumber": string,
  "age": string,
  "sex": string,
  "nation": string,
  imageUrl: string
  photoUrl: string
  "captureTime": string,
  "locationId": string,
  "locationName": string
  "lngLat": {
    "lat": string,
    "lng": string
  },
  "matches": { targetImage: string, similarity: string, featureImage: string }[],
  "labels": {
    "name": string,
    "color": number,
    "id": number
  }[],
  personBasicInfo: {
    "name": string,
    "idcard": string,
    "age": string,
    "sex": string,
    "nation": string,
    groupId: string
  }
  "similarity": string
  "targetImage": string
}

// 关系人
export interface RelationData {
  id: string
  "name": string,
  "age": number,
  "sex": string,
  "address": string,
  "idNumber": string,
  "idType": string,
  "source": { name: string, type: string }[],
  "labels": string[],
  num: string
  householdName: string,
  relationNum: {}
  groupId?: string
  plateColor?: number
  licensePlate?: string
}
// 关系人类型
export enum RelationType {
  all,//全部
  native, //同户籍
  phone,// 同手机使用人
  violate,// 同车违章
  car,// 同车使用人
  case,// 同案件人
  travel,// 同出人体
  stay, //同住人
  inter// 同上网人
}
// 抓拍图像
export type PlateTypeId = -1 | 1 | 2 | 5 | 6 | 9 | 15 | 16
export type TimeRangeType = {
  times?: string[];
  periods?: {
    dates: string[];
    times: string[];
  }
}
export interface PortraitFormDataType {
  type: TargetType;
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  timeRange?: TimeRangeType;
  locationIds: string[];
  locationGroupIds: string[];
  offlineIds: (string | number)[];
  licensePlate: string,
  licensePlate2?: string
  noplate: string,
  plateColorTypeId: PlateTypeId,
  pageNo: number;
  pageSize: number;
  groupId?: string[]
  clusterType: string
}

// 操作日志
export interface LogFormData {
  timeType: string,
  beginDate: string,
  endDate: string,
  account: string,
  organization: string,
  operation: string,
  pageNo: number,
  pageSize: number,
}
export interface OptionLogData {
  "id": string,
  "account": string,
  "locName": string,
  "controller": string,
  "date": string,
  "operation": string,
  "searchCond": string,
  "ip": string,
  "url": string,
}
