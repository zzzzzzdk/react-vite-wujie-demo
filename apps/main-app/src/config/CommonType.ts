import { PlateTypeId } from "@/components/FormPlate/interface";

/**
 * @description 目标类型
 */
export type TargetType = 'face' | 'pedestrian' | 'bicycle' | 'tricycle' | 'vehicle' | 'gait';

/**
 * @description 坐标类型
 */
export type DetectionType = {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * @description 特征项
 */
export interface TargetFeatureItem extends DetectionType {
  feature: string;
  targetType: TargetType;
  targetImage: string;
  detection?: DetectionType
  //步态相关
  gaitFeature?: string
  gaitNumber?: number; //数量
  isChecked?: boolean; //本地使用，步态目标是否勾选
  identify?: boolean; // 本地使用，是否是识别结果
  infoId?: string;
  licensePlate2?: string;
  plateColorTypeId2?: PlateTypeId;
  isFeature?: boolean;
}


// 分组筛选项
export interface GroupFilterItem {
  text?: string;
  value: string;
  tableName?: string;
  /**
   * @description 分组/筛选类型
   */
  type: 'group' | 'filter' | 'id';
}
//升降序
export type SortOrder = "desc" | "asc"
//排序类型
export type SortField = "captureTime" | "similarity"

// 点位类型
/**
 * @description 点位类型
    "1": "车辆卡口",
  "2": "视频监控",
  "3": "人像卡口",
  "4": "全局相机",
  "5": "执机人",
  "6": "手机围栏",
  "7": "网络围栏",
 */
export type LocationType = 1 | 2 | 3 | 4 | 5 | 6 | 7
// 点位状态，1开启，0关闭
export type LocationStatus = 0 | 1

// 点位项
export type LocationItemType = {
  abnormal?: number;
  disabled?: boolean;
  id: string;
  lat: string;
  lng: string;
  locationType: LocationType;
  status: LocationStatus;
  text: string;
}

export type PlateColorTypeId = -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7
