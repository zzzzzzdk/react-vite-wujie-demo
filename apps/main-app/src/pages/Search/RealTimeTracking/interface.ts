import { TimeRangeType } from "../Target/interface";
import { ResultRowType as TargetResultItemType } from "../Target/interface";
import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { TargetFeatureItem } from "@/config/CommonType";
import { PlateColorTypeId } from "@/config/CommonType";
import { PlateTypeId } from "@/components/FormPlate/interface";
import { LngLatItemType } from "@/components/Map/TrackMulti/interface";

export type FormDataType = {
  featureList: (TargetFeatureItem)[];
  plateColorTypeId: PlateTypeId;
  licensePlate: string;
  similarity: number;
  qualityFilter: boolean;
  trackId: string;
  bgColor: string;
  indexColor: string;
  // 是否开启轨迹预测
  enableTrackPredict: boolean;
}
export interface ResultRowType {
  data: DataItemType[],
  faces: TargetResultItemType[]
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
  path: LngLatItemType[];
  // 目标数据
  infos?: TargetResultItemType[];
  // 过滤名单所需Id
  filterId?: string;
  indexArr: number[]
  trackColor: string;
}

// 预测路径数据
export type PredictPathItem = {
  locationId: string;
  locationName: string;
  // 概率 0 -100
  prob: number;
  // 预计多少秒
  seconds: number;
  //  经纬度对象
  lngLat: {
    lng: string;
    lat: string;
  };
  // 开始位置
  startLngLat?: {
    lng: string;
    lat: string;
  }
  trackColor?: string;
  text?: string
}

// 拓展目标数据格式
export type ExtendTargetItemType = {
  associates: TargetResultItemType[];
  cond: TargetResultItemType;
  result: TargetResultItemType;
}

export type PersonInfoDataType = {
  infoId: string
  targetImage: string
  captureTime: string
  feature: string
  similarity: string | number
  captureNum: string | number
  personBasicInfo: {
    name: string
    sex: string
    age: number
    nation: string
    idcard: string
    idType: number
    groupId: string[]
    groupPlateId: string[]
  }
  locationNames: string
  personTags: string[]
  lngLat: {
    lng: number;
    lat: number;
  }
  matches: TargetResultItemType[];
}

export type VehicleInfoDataType = {
  licensePlate: string;
  plateColorTypeId2: PlateTypeId;
  licensePlate2Url: string;
  brandId?: number | string;
  modelId?: (number | string)[];
  yearId?: (number | string)[];
  carInfo: string;
  beginTime: string;
  endTime: string;
}

export type ResultItem = {
  index?: number;
  trackId: string;
  trackData: DataItemType[];
  extendData: ExtendTargetItemType[];
  personInfoData: PersonInfoDataType;
  vehicleInfoData: VehicleInfoDataType[]
  predictPath: PredictPathItem[];
  predictMessage: string;
  // 是否打开拓展弹窗
  showExtend: boolean;
}

export interface ResultProps {
  indexColor: string;
  bgColor: string;
  cardResultVisible: boolean;
  currentTrackId: string;
  ajaxLoading: boolean;
  currentData: ResultItem;
  resultData: ResultItem[];
  selectedIndexArr: (number | null)[];
  handleCardClick: (event: React.MouseEvent, data: DataItemType, index: number) => void;
  handleOpenBigImg: (event: React.MouseEvent, item: TargetResultItemType, index?: number, indexArr?: ((number | null)[]), infos?: TargetResultItemType[]) => void;
  // FilterBtn: React.FC;
  handleAddFilterate: (data: any) => void;
}

export interface CardResultProps {
  cardResultVisible: boolean;
  beforAjax: boolean;
  ResulType: React.FC;
  // FilterBtn: React.FC;
  currentTrackId: string;
  taskId: string;
  bgColor: string;
  handleAddFilterate: (data: any) => void;
  tracking: boolean;
  ajaxLoading: boolean;
}

// 卡片结果类型
export interface CardResultData {
  personInfoData: PersonInfoDataType;
  vehicles: {
    cond: VehicleInfoDataType;
    results: TargetResultItemType[];
    fold: boolean;
    filterId?: string;
    minCaptureTime: string;
  }[];
  faces: {
    cond: TargetFeatureItem;
    results: TargetResultItemType[];
    fold: boolean;
    filterId?: string;
    minCaptureTime: string;
  }[]
}


export interface ExtendTargetModalProps {
  className?: string;
  /**
   * @description Modal组件参数控制
   * @default {}
   */
  modalProps?: ModalProps;
  onModalConfirm?: (data: any) => void;
  data: ExtendTargetItemType[];
  featureList: TargetFeatureItem[];
  onPutItAwayChange?: (puitaway: boolean) => void;
}

export type RefCardResultType = {
  filterateDel: (data: any) => void;
}