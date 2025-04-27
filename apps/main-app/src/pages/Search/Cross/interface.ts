import { TimeRangeType } from "../Target/interface";
import { ResultRowType as TargetResultItemType } from "../Target/interface";
import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { TargetFeatureItem } from "@/config/CommonType";

export type FormDataType = {
  similarity: number | number[];
  timeType?: string;
  beginDate?: string;
  endDate?: string;
  beginTime?: string;
  endTime?: string;
  locationIds?: string[];
  locationGroupIds?: string[];
  fileId?: (string | number)[];
  targetType: string;
  featureList?: TargetFeatureItem[];
  timeRange?: {
    // 当前请求的时间数组
    times: string[];
    // 分割的时间数组（二维）
    timesArr?: string[][];
  };
  // 时间排序
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
  /**
   * @description 是否开启实时追踪
   * @default false
   */
  realTimeTracking?: boolean;
}

export interface DataItemType {
  index: number;
  // 最小抓拍时间
  minCaptureTime: string;
  // 最大抓拍时间
  maxCaptureTime: string;
  // 轨迹滑动显示时间
  captureTime?: string;
  //  点位id
  locationId: string;
  //  点位名称
  locationName: string;
  //  经纬度对象
  lngLat: {
    lng: string;
    lat: string;
  }
  // 轨迹经纬度
  path: string[];
  // 目标数据
  infos?: TargetResultItemType[];
  // 过滤名单所需Id
  filterId?: string;
}

export interface ResultRowType {
  data: DataItemType[],
  faces: TargetResultItemType[]
}

// export interface IdentifyFaceType extends TargetResultItemType {
//   // 根据匹配人脸，即检索条件
//   matches: Pick<TargetResultItemType, 'detection' | 'feature' | 'similarity' | 'targetImage' | 'targetType'>
// }

export interface FilterateModalProps {
  className?: string;
  /**
 * @description Modal组件参数控制
 * @default {}
 */
  modalProps?: ModalProps;
  taskId?: string;
  onDelChange?: (data: any[]) => void;
  trackId?: string;
}

export interface CrossMapProps {
  selectedIndex?: number | null;
  onSelectedChange?: (index: number | null) => void;
  trackData?: DataItemType[];
  /**
   * @description 添加过滤名单回调
   */
  onAddFilterate?: (data: any) => void;
  /**
   * @description 点位popover打开大图回调
   */
  onOpenBigImg?: (event: React.MouseEvent, item: TargetResultItemType, index?: number, parentIndex?: number, infos?: TargetResultItemType[]) => void;
}