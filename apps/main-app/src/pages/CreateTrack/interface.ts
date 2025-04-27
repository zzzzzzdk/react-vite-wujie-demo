import { ResultRowType as TargetResultItemType } from "../Search/Target/interface";
import { LngLatItemType } from "@/components/Map/TrackMulti/interface";

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
    lng: string;
    lat: string;
  }
  // 轨迹经纬度
  path: string[];
  // 目标数据
  infos?: TargetResultItemType[];
}