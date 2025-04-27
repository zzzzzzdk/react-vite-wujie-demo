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

  // pageNo: number;
  // pageSize: number;

  // 车牌
  licensePlate: string;

  // 品牌
  brandId?: string;
  // 型号
  modelId?: string[];
  // 年款
  yearId?: string[];
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
// 频繁过车出请求数据
export type FrePassFormData = BasicFormDataType & {
  captureCount: -1 | 1; // 标志位
  // 过车次数
  passingCount: number; //
  /* 5分钟连续抓拍10次 */
  timeLimitation: number; // 5分钟
  continuousCapture: number; // 10次数
};
// 频繁过车结果数据
export interface FrePassItem extends ResultRowType {
  groupCount?: {
    difference?: number;
    originalCount?: number;
    remainingCount?: number;
  };
}
