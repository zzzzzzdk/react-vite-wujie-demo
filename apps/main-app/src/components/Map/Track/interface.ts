import AnimatedMarker from './js/Leaflet.AnimatedMarker'
import { DataItemType } from '@/pages/Search/Cross/interface'

export default interface TrackProps {
  data: DataItemType[];
  /**
   * @description 开始时间
   */
  startTime: string;
  /**
   * @description 结束时间
   */
  endTime: string;
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
  clickIndex?: number | null;
  /**
   * @description 轨迹点位点击回调
   */
  markerClickCb?: (index: number | null) => void;
  /**
   * @description 点位弹框内容回调
   */
  contentCb?: (data: any, index: number, childIndex: number) => void;
  /**
   * @description 路网/直线导航默认类型, 1 直线，2 路网
   * @default '1'
   */
  dtype?: '1' | '2';
  /**
   * @description 弹窗距离地图中心点偏移的距离（像素）
   * @default {x:0,y:0}
   */
  position?: {
    x: number,
    y: number
  }
}

export type GDataType = {
  _data: any[]; //  data 过滤后有经纬度点位
  trackData: any[]; // 当前轨迹的数据
  roadPath: L.LatLngTuple[]; // 经纬度处理后的轨迹数据
  showImage: boolean;
  curIndex: number;  // 当前是第几个点index
  infoWindow: L.Popup | null;
  markers: L.Marker[];  // 点位marker
  orderMarkers: L.Marker[];   // 序号marker
  baseLine: L.Polyline | null;  // 基础路径
  arrowLine: L.Polyline | null;  // 箭头
  moveMarker: AnimatedMarker | null; // 移动marker
  range: {
    start: number;
    end: number
  },
  timer: NodeJS.Timeout | null;
}


export interface RefTrack {
  prevAlarm: () => void;
  nextAlarm: (length: number) => void;
  pauseCar: () => void;
  closePopup: () => void;
}
