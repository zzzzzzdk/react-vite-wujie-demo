import { TargetType, DetectionType } from "@/config/CommonType";
import { Dayjs } from "dayjs";
import { TimeRangeType } from "@/pages/Search/Target/interface";
import dayjs from "dayjs";

export type VectorType = {
  type?: string;
  color?: string;
  radius?: number;
};

export type FormDataType = {
  tab: string;
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  locationIds: string[];
  personTags: string[];
  timeSort: string;
  trackSort: string;
  attributes: any;
  group?: number[];
  timeRange?: TimeRangeType;
  areaData?: VectorType[];
};

export type TargetFormType = {
  timeRange: TimeRangeType;
  locationIds: string[];
  personTags: number[];
  attributes: any;
  areaData: VectorType[];
};

export type PeerFormType = {
  group: number[];
  timeRange: TimeRangeType;
  locationIds: string[];
};

export type TargetDetailFormType = {
  group: number[];
  timeRange: TimeRangeType;
  locationIds: string[];
  area: 1 | 0;
};

export type PeerDetailFormType = {
  cacheId: string;
  elementId: string;
  locationIds: string[];
  area: 1 | 0;
};

export type ResultDataType = {
  infoId: string;
  name: string;
  age: number;
  birthday: 0;
  idcard: string;
  group: number;
  gender: number;
  firstCaptureTime: string;
  firstLocationId: number;
  firstLocationName: string;
  lastCaptureTime: string;
  lastLocationId: number;
  lastLocationName: string;
  lastDetection: DetectionType;
  stayTime: number;
  targetImage: string;
  bigImage: string;
  peerGroup: number;
  peerIdcard: string;
  elementId: string;
  peerAge: number;
  targetName: string;
  targetAge: number;
  peerName: string;
  peerImage: string;
  count: number;
  index: number;
  personTags: { id: number, name: string, color: number }[];
};

export type DetailDataType = {
  id: number;
  infoId: string;
  name: string;
  age: number;
  idcard: string;
  targetType: TargetType;
  status: number;
  captureTime: string;
  locationName: string;
  locationId: number;
  lngLat: { lng: string; lat: string };
  longitude: number;
  latitude: number;
  bigImage: string;
  targetImage: string;
  downloadUrl: string;
  detection: DetectionType;
  feature: string;
  deviceId: number;
  index: number;
};

export type TrackParamsType = {
  data: any[];
  startTime: string;
  endTime: string;
};

export type SortFunPropsType = {
  data: any[];
  type: "ASC" | "DESC";
  field: string;
  fieldType?: "time";
};

export function sortFunc(
  data: any[],
  type: "ASC" | "DESC",
  field: string,
  fieldType?: string
) {
  if (!data.length && field) return [];
  let arr = [...data];
  arr.sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];
    if (fieldType === "time") {
      valueA = dayjs(a[field]);
      valueB = dayjs(b[field]);
    }
    if (type === "ASC") {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });
  return arr;
}
