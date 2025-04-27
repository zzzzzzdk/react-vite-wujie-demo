import { TargetType, DetectionType } from "@/config/CommonType";
import type { Dayjs } from 'dayjs'
import { PlateValueProps, PlateTypeId } from '@/components/FormPlate/interface'
import { ApiResponse } from "@/services";
import { LinkType } from "@/components/Card/FooterLinks/interface";
import { GroupFilterItem } from "@/config/CommonType";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";

export type TimeRangeType = {
  times?: string[];
  periods?: {
    dates: string[];
    times: string[];
  }
}

export type FormDataType = {
  targetType: TargetType;
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  timeRange?: TimeRangeType;

  locationIds: string[];
  locationGroupIds: string[];
  offlineIds: (string | number)[];

  pageNo: number;
  pageSize: number;

  // 品牌
  brandId?: string;
  // 型号
  modelId?: string[];
  // 年款
  yearId?: string[];
  // 车牌
  licensePlate?: string;
  // 车牌上传成功数量
  successNum?: number;
  // 车牌颜色id
  plateColorTypeId?: PlateTypeId;
  // 是否无牌
  noplate?: '' | 'noplate' | number;
  // 上传成功的文件链接
  licensePlateFile?: string;
  // 抓拍角度
  objectTypeId?: number;
  // 行驶方向
  directionId?: number;
  // 车辆颜色
  colorTypeId?: number;
  // 车辆类别
  vehicleTypeId?: number[];
  // 车辆用途
  vehicleFuncId?: number[];
  //步态
  isGait?:number

  // 时间排序
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };

  // 分组筛选参数
  groupfilters?: GroupFilterItem[];
}


export type matchesType = {
  targetImage: string //检索条件图
  similarity: number
}

export type ResultRowType = {

  //所有在地图需要上绘制双点位显示的，目前仅有落脚点与双胞胎车
  footholdarr?: {
    data: {
      lat: string,
      lng: string,
      locationName: string
    }[],
    type: 'foothold' | 'doublecar'
  }
  details: any
  //是否是黑名单
  isBlack: boolean
  // 抓拍数量
  captureCount: number
  // 目标图
  targetImage: string;
  // 大图
  bigImage: string;
  // 抓拍时间
  captureTime: string;
  // 小图坐标
  detection: DetectionType;
  // 特征值
  feature: string;
  //车窗特征
  windowFeature?:string
  // 黑名单id
  blackId: string
  // infoId
  infoId: string;
  // 点位名称
  locationName: string;
  // 点位id
  locationId: string;
  // 目标类型
  targetType: TargetType;
  // 用于获取抓拍时视频，时离线视频还是实时视频
  videoFrom: 'realtime' | 'offline';
  // 经纬度对象
  lngLat: {
    lng: string;
    lat: string;
  }
  // 下载链接
  downloadUrl: string;
  // 人体
  // 步态特征值
  gaitFeature: string;
  // 步态序列图数量
  gaitObjectNumber: number;
  // 步态序列图
  gaitMaskUrl: string[];
  // 步态目标图
  gaitObjectUrl: string[];
  // 步态视频地址
  gaitVideoUrl: string;
  // 步态视频持续时间
  gaitVideoDuration: number
  //步态视频开始时间
  gaitVideoStartTime: number
  //步态关联的目标图
  gaitTargetImage: ResultRowType[]
  //二三轮车
  licensePlate: string
  // 二三轮车链接
  licensePlateUrl: string;
  // 汽车
  // 一次识别车牌
  licensePlate1: string;
  // 二次识别车牌
  licensePlate2: string;
  // 一次识别车牌链接
  licensePlate1Url: string;
  // 二次识别车牌链接
  licensePlate2Url: string;
  // 一次识别车牌颜色
  plateColorTypeId1: PlateTypeId;
  // 二次识别车牌颜色
  plateColorTypeId2: PlateTypeId;
  // 车牌颜色
  plateColorTypeId?: PlateTypeId;
  // 品牌
  brandId: string;
  // 型号
  modelId: string[];
  // 年款
  yearId: string[];
  // 品牌-型号-年款
  carInfo: string;
  //车辆类型
  carType: string,
  // 移动方向
  direction: string;
  // 车辆类别iD
  vehicleTypeId: number;
  // 检索条件
  conditionData?: any;
  // 相似度
  similarity?: number;
  //列表模式车牌图
  plateImage?: string

  // 拍摄时间
  shootTime?: string;
  // 视频时间
  videoDuration?: number;
  // 跳转链接数组
  links?: LinkType[];
  //#region
  //以图身份信息
  personBasicInfo: {
    name: string
    sex: string
    age: string | number
    nation: string
    idcard: string
    idType: string
    groupId: string
    idcardUrl: string
    groupPlateId: string
  }
  //人员标签
  personTags: { id: number, name: string, color: number }[]
  //人脸聚类分组ID
  group: string
  //以图相似度 ,传递比中多少个结果的数据，用于比中大图展示 （similarity:也需要传递，相似度最高的那个）
  matches: ResultRowType[]
  //身份信息检索结果图片
  featureImage?: string
  isChecked?: boolean //是否选中
  htmlIndex?: number //卡片的展示索引
  //研判
  minCount?: number // 同行点位
  peerSpot?: string // 同行次数
  clusterType?: string  //聚类类型
  isGait?: boolean //是否是步态


  //#endregion

  /**
   * @description 是否被关联到检索条件
   * @default false
   */
  retrieval?: boolean;
  /**
   * @description 过滤名单所需Id
   */
  filterId?: string;
  /**
   * @description 刻画轨迹路径
   */
  path?: string[]
  /**
   * 驾乘人脸位置
   * 人脸 (只有驾乘人脸存在有效值)
   * 0 未识别
   * 1 右侧位置(中国大陆为主驾驶)
   * 2 左侧位置(中国大陆为副驾驶)
   */
  drivingPositionId?: 1 | 2 | 0;

  // 是否局部
  isFeature?: boolean;
}

export type resultShowType = 'image' | 'list' | 'group';

// 结果页props
export interface TargetResultProps {
  /**
   * @description 页面初次渲染
   * @default default
   */
  firstLoading?: boolean;
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
  onCheckedChange?: ({ cardData, checked }: { cardData: any, checked: boolean }) => void;
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
  ajaxFormData?: FormDataType;
  /**
   * @description 每页条数
   */
  pageSize?: number;
  /**
   * @description 监听分组筛选改变
   */
  onGroupFilterChange?: ({ filterTags }: GroupFilterCallBackType) => void;
}
