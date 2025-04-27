import { PlateTypeId } from "@/components/FormPlate/interface";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { BasicFormDataType } from "../Initial/interface";

export type MultipointFormDataType = Omit<BasicFormDataType, "pageNo" | "pageSize" | "excludeLicensePlates" | "groupFilters"> & {
  excludelicensePlate: {
    licensePlate: string
    plateColorTypeId: PlateTypeId
    noplate?: '' | 'noplate'
  },
  extra?: {}, // 品牌信息
  sort: string //排序方式
  associatePlate?: string //选中车牌
  timeSort?: string //详情排序
  type?: string // 条件类型   添加、排除
}

export type MultipointResultType = {
  key: string, //此次检索的token,后端需要
  target: ResultRowType
  peers: ResultRowType[]
}

export type VectorData = {
  type?: string,
  innerHtml?: string,
  color?: string,
}

export type VehicleInfoType = {
  elementId?: string;
  licensePlate2?: string;
  plateColorTypeId2?: number;
  plateColorTypeString2?: string;
  carInfo?: string;
  imageUrl?: string;
  conditionCounts?: number;
  count?: number;
  flags?: number[];
}[]

export type ConditionCard = {
  data?: any,
  dataIndex?: string | number,
  editCondition?: () => void,
  deleteCondition?: () => void,
  isActive: boolean,
  onCardClick?: () => void,
}

export type DetailResultType = { target: ResultRowType, data: ResultRowType }[]