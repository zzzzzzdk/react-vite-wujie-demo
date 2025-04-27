import { PlateTypeId } from "@/components/FormPlate/interface";
import { GroupFilterItem } from "@/config/CommonType";
import { ResultRowType, TimeRangeType } from "@/pages/Search/Target/interface";
import type { Dayjs } from "dayjs";

export type BasicFormDataType = {
  beginDate: string;
  endDate: string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  timeRange?: TimeRangeType;

  locationIds: string[];
  locationGroupIds: string[];

  // 品牌
  brandId?: string;
  // 型号
  modelId?: string[];
  // 年款
  yearId?: string[];
  // 车牌
  licensePlate: string;
  // 车牌颜色id
  plateColorTypeId: PlateTypeId;
  // 是否无牌
  noplate?: "" | "noplate" | number;
  // 抓拍角度
  objectTypeId?: number;
  // 车辆颜色
  colorTypeId?: number;
  // 车辆行驶方向
  directionId?: number;
  // 车辆类别
  vehicleTypeId?: number[];
  // 车辆使用性质
  vehicleFuncId?: number[];
  //排除车牌
  excludeLicensePlates: {
    licensePlate: string;
    plateColorTypeId: PlateTypeId;
    noplate?: "" | "noplate";
  }[];

  // 分组筛选参数
  groupFilters?: GroupFilterItem[];
};
type Span = {
  start: string | undefined | null;
  end: string | undefined | null;
};
// 昼伏夜出请求数据
export type ActiveFormData = BasicFormDataType & {
  percentage: number;
  // days作为标志位
  days: number; // 昼伏夜出天数， 同响应nocturnalTimes, (:
  // days和occurrences互斥
  daytimeOccurrences: number | string; // 白天抓拍次数
  nighttimeOccurrences: number | string; //晚上抓拍次数

  dateRange: Span; // 日期
  daytime: Span; // 白天时段
  nighttime: Span; //晚上时段
};
// 昼伏夜出结果
export interface ActiveNightItem extends ResultRowType {
  nocturnalTimes: number; // 昼伏夜出天数
  // days: any; // 昼伏夜出日期
  dateRange?: Span; // 日期
  daytime?: Span; // 白天时段
  nighttime?: Span; //晚上时段

  latestLocationNight: string; // 晚上抓拍地点
  latestLocationDaytime: string; // 白天抓拍地点
  latestCaptureTimeDay: string; // 白天抓拍时间
  latestCaptureTimeNight: string; // 晚上抓拍时间
  daytimeOccurrences?: number; // 白天抓拍次数
  nighttimeOccurrences?: number; //晚上抓拍次数
  difference: number;
}
