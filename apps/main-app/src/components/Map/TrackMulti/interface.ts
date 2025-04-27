import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { PredictPathItem } from "@/pages/Search/RealTimeTracking/interface";

export interface TrackMultiMapProps {
  selectedIndexArr?: (number | null)[];
  onSelectedChange?: (indexArr: (number | null)[]) => void;
  trackData?: any[];
  /**
   * @description popover内容回调
   */
  trackContentCb?: (data: any, indexArr: (number | null)[], childIndex: number) => void;
  predictPath?: PredictPathItem[];
  adapt?: boolean;
  showTracking?: boolean;
}

// 变量存储
export type GDataType = {
  _data: any[]; //  data 过滤后有经纬度点位
  trackData: TrackDataItem[][]; // 当前轨迹的数据
  roadPath: L.LatLngTuple[]; // 经纬度处理后的轨迹数据
  showImage: boolean;
  curIndex: number;  // 当前是第几个点index
  infoWindow: L.Popup | null;
  markers: L.Marker[][];  // 点位marker
  trackingMarker: L.Marker[];
  // orderMarkers: L.Marker[];   // 序号marker
  baseLine: L.Polyline[];  // 基础路径
  timer: NodeJS.Timeout | null;
}

// 单个经纬度数据
export type LngLatItemType = {
  lng: number | string;
  lat: number | string;
  time: number;
  info?: any;
  grandparentIndex?: number;
  parentIndex?: number;
}

export interface TrackDataItem {
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
    lng: number | string;
    lat: number | string;
  }
  // 轨迹经纬度
  path: LngLatItemType[];
  // 目标数据
  infos?: TargetResultItemType[];
  // 轨迹颜色
  trackColor?: string;
  // 索引数组(必须有)
  indexArr: number[];
}

export interface TrackMultiProps {
  data?: TrackDataItem[][];
  /**
   * @description 轨迹底色
   * @default #bfc8d6
   */
  baseColor?: string;
  /**
   * @description 轨迹播放经过颜色
   * @default #28b7d9
   */
  passColor?: string;
  /**
   * @description 外部传入点击点位的index，控制点位事件
   */
  clickIndexArr?: (number | null)[];
  /**
   * @description 轨迹点位点击回调
   */
  markerClickCb?: (indexArr: (number | null)[]) => void;
  /**
   * @description 点位弹框内容回调
   */
  contentCb?: (data: any, indexArr: (number | null)[], childIndex: number) => void;
  /**
   * @description 路网/直线导航默认类型, 1 直线，2 路网
   * @default '1'
   */
  dtype?: '1' | '2';
  /**
   * @description 画完轨迹是否自适应展示
   * @default true
   */
  adapt?: boolean;
  /**
   * @description 显示正在追踪的点
   * @default false
   */
  showTracking?: boolean;
}
export interface RefTrackMulti {
  prevAlarm: () => void;
  nextAlarm: (length: number) => void;
}

export interface RefTrackMultiMap {
  trackRef: RefTrackMulti | null
}
