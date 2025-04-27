import type { Dayjs } from 'dayjs'
import { TimeRangeType } from '@/pages/Search/Target/interface'
import { ResultRowType } from "@/pages/Search/Target/interface";

export type PersonMultipointType = {
  type?: string // 条件类型   添加、排除
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  timeRange?: TimeRangeType;

  sort: string //排序方式
  timeSort?: string //详情排序
  locationIds: string[];
  locationGroupIds: string[];
  locationChildIdLength: number;
  newLocationIds: string[];
  newLocationGroupIds: string[];
}

export type VectorData = {
  type?: string,
  innerHtml?: string,
  color?: string,
}

export type ConditionCard = {
  data?: any,
  dataIndex?: string | number,
  editCondition?: () => void,
  deleteCondition?: () => void,
  isActive: boolean,
  onCardClick?: () => void,
}

export type VehicleInfoType = {
  elementId?: string;
  imageUrl?: string;
  conditionCounts?: number;
  count?: number;
  flags?: number[];
  age?: number;
  gender?: string; // 性别
  ageIdType?: string; // 年龄标签
  labels?: []; // 标签
}[]

export type DetailResultType = { target: ResultRowType, data: ResultRowType }[]

export type ResOptionsType = {
  data: {
    name: string,
    id: number
  }
}[]

export type OptionsType = { label: string, value: number }[]
