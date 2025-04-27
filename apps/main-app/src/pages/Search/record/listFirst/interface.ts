import { SortOrder } from '@/config/CommonType'

export type PlateTypeId = -1 | 1 | 2 | 5 | 6 | 9 | 15 | 16
export type SortField = "captureTime" | "captureNum"

export interface ResultDataProps {
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
  }
  locationNames: string
  personTags: string[]
}
export interface FormDataProps {
  /**
   * @description 人员姓名 
   */
  personName?: string
  /**
 * @description 证件类型 111 身份证 414 护照 123 警官证 
 */
  idType?: string
  /**
  * @description 证件号 
  */
  idCard?: string
  /**
  * @description 联系方式 
  */
  personTel?: string
  /**
  * @description 车牌号码 
  */
  licensePlate?: string
  /**
  * @description 车牌颜色id 
  */
  plateColorTypeId?: PlateTypeId
  /**
  * @description 是否无车牌 
  */
  noplate?: string
  /**
  * @description 人员标签 
  */
  personLabel?: string
  /**
  * @description 详细地址 
  */
  address?: string
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
  captureType?: string
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
  * @description 检索类型  person 聚类组/身份检索  group 抓拍图像检索 
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
  sort: {
    field: SortField,
    order: SortOrder
  }
}
export interface RecordNumProps {
  "person": number,
  // "person-capture": number,
  // "person-dirver": number,
  "face": number,
  "faceReal": number,
  "faceUnReal": number,
  "driver": number,
  "driverReal": number,
  "driverUnReal": number,
  "labelCount": number,
}
export interface LabelData {
  id: string,
  labels: { id: string, name: string }[],
  name: string,
}
