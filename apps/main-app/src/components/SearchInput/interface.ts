import { SortOrder } from '@/config/CommonType'

export type PlateTypeId = -1 | 1 | 2 | 5 | 6 | 9 | 15 | 16
export type SortField = "captureTime" | "captureNum"
export interface RecordNUmType {
  carNum: number,
  carLabel: number,
  personNum: number,
  personLabel: number,
  noPersonInfo: number,
  noCaptureInfo: number,
  activePerson: number,
  activeLabel: number,
  personInfo: number,
}
export type PageTypes = {
  pageNo: number,
  pageSize: number
}
export interface PlateTypes {
  plateNumber: string, plateTypeId: number, noplate: String
}
export interface CaptureData {
  timeType: "time" | "range";
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  /* 数据源 */
  locationIds: string[];
  locationGroupIds: string[];
  offlineIds: (string | number)[];
}
export interface FormDataProps extends CaptureData {
  /**
   * @description 人员姓名
   */
  personName?: string
  /**
 * @description 证件类型 1 身份证 2 护照 3 警官证
 */
  idType?: string
  /**
  * @description 证件号
  */
  idNumber?: string
  /**
  * @description 联系方式
  */
  phone?: string
  /**
  * @description 车牌号码
  */
  licensePlate?: string
  /**
  * @description 车牌颜色id
  */
  plateColorTypeId?: PlateTypeId
  plateColor?: PlateTypeId
  age?: string[],
  captureCount?: string[],
  /**
  * @description 是否无车牌
  */
  noplate?: string
  /**
  * @description 人员标签
  */
  label?: string[]
  /**
  * @description 详细地址
  */
  householdAddress?: string
  residentialAddress?: string
  noLocal?: boolean
  minor?: boolean
  /**
  * @description 籍贯
  */
  city?: (string | string[])[]
  /**
  * @description 最小年龄
  */
  minAge?: string
  /**
  * @description 最大年龄
  */
  maxAge?: string
  /**
  * @description 抓拍类型
  */
  profileType?: string
  /**
  * @description 最小抓拍次数
  */
  minCaptureTimes?: string
  /**
  * @description 最大抓拍次数
  */
  maxCaptureTimes?: string
  /**
  * @description 是否实名  0 全部 1 实名 2 未实名
  */
  realName?: number
  /**
  * @description 档案类型 0 全部 1 抓拍人脸 2 驾乘人脸
  */
  cluster?: number
  /**
  * @description 检索类型  person 聚类组/身份检索  group 抓拍图像检索 / vehicle 车辆检索
  */
  searcgMethod?: string
  /**
 * @description 页码
 */
  pageNo?: number,
  /**
 * @description 每页数量
 */
  pageSize?: number,
  /**
 * @description 排序
 */
  sort?: {
    field: SortField,
    order: SortOrder
  }
  /**
   * 
   */
  vehicleLabels?: string[]
}
export interface LabelData {
  id: string,
  labels: { id: string, name: string }[],
  name: string,
}
export interface SearchFormType {
  searchType: string,
  searchValue: string,
  searchInfo: string
  activeMoreKey: string
}
