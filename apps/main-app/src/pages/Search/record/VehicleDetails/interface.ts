import type { Dayjs } from 'dayjs'
import { TimeRangeType } from "../../Target/interface"
export type ItemType<T extends any[]> = T extends (infer U)[] ? U : never;

export interface LabelDataType {
  id: string,
  labels: { id: string, name: string, color: string | string }[],
  name: string,
}

export type VehicleInfoDataType = {
  licensePlate: string;
  plateColorTypeId: string;
  vehicleImages: string[];
  labels: LabelDataType["labels"]
  labelsId: string[];
}

export type VehicleBasicInfoType = {
  registrationInfo: { [key: string]: string },
  physicalFeature: { [key: string]: string },
  drivingLicenseInfo: { [key: string]: string },
  trafficViolationInfo: { [key: string]: string }[]
}
export type OwnerBasicInfoType = {
  baseInfo: {
    [key: string]: string,
    // phoneNumber:string
    // labels:string
  },
  driverLicense: { [key: string]: string },
  ownerOtherVehicles: { [key: string]: string }[],
  trafficViolationInfo: { [key: string]: string }[]
}
export type DriverPassengerClusterType = {
  age?: number
  sex?: string
  groupPlateId?: string	//聚类id
  feature?: string
  idcard?: string
  idType?: string
  targetImage: string
  name?: string
  groupCount?: number
  similarity?: string
  labels?: VehicleInfoDataType["labels"]
  labelIds?: string[]
}[]


export type VehicleDetailFormDataType = {
  licensePlate: string;
  plateColorTypeId: string;

  beginDate?: | null | string;
  endDate?: Dayjs | null | string;
  beginTime?: Dayjs | null | string;
  endTime?: Dayjs | null | string;
  timeType?: string; // 'time' | 'range' 时间， 时段
  timeRange?: TimeRangeType; //请求的格式化参数
  pageNo?: number;
  pageSize?: number;
}
