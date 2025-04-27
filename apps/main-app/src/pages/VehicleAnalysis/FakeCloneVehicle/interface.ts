import { PlateTypeId } from "@/components/FormPlate/interface";
import { GroupFilterItem } from "@/config/CommonType";
import { ResultRowType, TimeRangeType } from "@/pages/Search/Target/interface";
import type { Dayjs } from "dayjs";
import { ApiResponse } from "@/services";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";

export type formDataType = {
  warningId?: number[];
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  timeRange?: TimeRangeType;
  locationIds: string[];
  locationGroupIds: string[];
  pageNo?: number;
  pageSize?: number;
  // 品牌
  brandId: string;
  // 型号
  modelId: string[];
  // 年款
  yearId: string[];
  // 车牌
  licensePlate: string;
  // 车牌颜色id
  plateColorTypeId: PlateTypeId;
  // 车辆类别
  vehicleTypeId: number[];
  // 是否无牌
  noplate: "" | "noplate" | number;
  // 时间排序
  sort?: {
    field: string;
    order: "ASC" | "DESC";
  };
  // 分组筛选参数
  filters?: GroupFilterItem[];
};

export type formDataRefType = {
  searchForm: formDataType;
  defaultResultData: {
    data: ResultDataType[];
    totalRecords: number;
    usedTime: number;
  };
};

export interface SearchProps {
  ajaxLoading: boolean;
  module: 1 | 2;
  onChange: (data: any, isFirst?: boolean) => void;
}

export interface ResultProps {
  loading?: boolean;
  resultData: ApiResponse<ResultDataType[]>;
  checkedList?: ResultDataType[];
  onCheckedChange?: ({
    cardData,
    checked,
  }: {
    cardData: ResultDataType;
    checked: boolean;
  }) => void;
}

export type ResultDataType = ResultRowType & {
  imageUrl: string;
  minCaptureTime: string;
  daysElapsed: number;
  warningId: number;
  warningStr: string;
  plateColorTypeId: PlateTypeId;
  deviceId: number;
};
