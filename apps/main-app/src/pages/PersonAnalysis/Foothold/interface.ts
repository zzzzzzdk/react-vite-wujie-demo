import { ResultRowType, TimeRangeType } from "@/pages/Search/Target/interface";
import type { Dayjs } from 'dayjs'

export type ChartData={
    type:"days"|"short"|"night",
    value:string[]
}

export type ChartDataArr={
  time:string,
  data:ChartData[]
}

//右侧数据
export type FootholdResultType={
  id:string
  locationName:string,
  parkingFrequency: number,
  parkingActions:string[]
  locationId: string,
  parkingCount: number,
  stayTime:ChartDataArr[],
  index?:number,
  parkingLocations?: string[]
}
//右侧数据缓存
export type DataList={
  down:FootholdResultType[],
  up:FootholdResultType[]
}
//时间格式
export type TimeDataType={
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  timeRange?: TimeRangeType;
}
// export type FootholdFormDataType = TimeDataType&{
//   parkingHour:string|number//落脚时长
//   parkingCount:string|number//落脚次数
//   // sort: string,//排序方式,
//   displaySort:string,
//   displayTimeSort:string,
//   clusterData:ResultRowType|null,
// }
//左侧详情数据
export type DetailResultType = {
  parkingDuration:number//落脚时长，
  parkingTime:string//落脚时间段
  personInfo:ResultRowType[],
  index?:number|0,
  duration?:string
}
//左侧数据缓存
export type DetailList={
  down:DetailResultType[],
  up:DetailResultType[],
  total:number
}
//大图数据
export type totalImg={
  down:ResultRowType[],
  up:ResultRowType[],
}