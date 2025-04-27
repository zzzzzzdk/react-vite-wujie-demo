import { PlateTypeId } from '@/components/FormPlate/interface'
import { GroupFilterItem } from '@/config/CommonType'
import { ResultRowType, resultShowType, TimeRangeType } from '@/pages/Search/Target/interface'
import type { Dayjs } from 'dayjs'
import { ApiResponse } from "@/services";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";

export type BasicFormDataType = {
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  timeRange?: TimeRangeType;

  locationIds: string[];
  locationGroupIds: string[];
  locationChildIdLength?: number;

  pageNo: number;
  pageSize: number;

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
  noplate?: '' | 'noplate' | number;
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
  excludeLicensePlates: { licensePlate: string, plateColorTypeId: PlateTypeId; noplate?: '' | 'noplate' }[]

  // // 时间排序
  // sort: {
  //   field: string;
  //   order: 'asc' | 'desc';
  // };

  // 分组筛选参数
  groupFilters?: GroupFilterItem[];
}

//初次入城
export type InitialFormDataType = BasicFormDataType & { backtrackTime: number }

export interface ResultProps {
  /**
   * @description 是否loading
   * @default false
   */
  loading?: boolean;
  /**
   * @description 结果数据
   * @default []
   */
  resultData: ApiResponse<ResultRowType[]>;
  /**
   * @description 卡片选中回调
   */
  onCheckedChange?: ({ cardData, checked }: { cardData: ResultRowType, checked: boolean }) => void;
  /**
   * @description 表格选中回调
   */
  onTableCheckedChange?: (selectedRows: ResultRowType[]) => void;
  /**
   * @description 已选中的数据
   * @default []
   */
  checkedList?: ResultRowType[];
  /**
   * @description 结果页展示形式
   * @default image
   */
  resultShowType?: resultShowType;
  /**
   * @description 结果页请求参数
   */
  ajaxFormData?: BasicFormDataType;
  /**
   * @description 每页条数
   */
  pageSize?: number;
  /**
   * @description 监听分组筛选改变
   */
  onGroupFilterChange?: ({ filterTags }: GroupFilterCallBackType) => void;
}
