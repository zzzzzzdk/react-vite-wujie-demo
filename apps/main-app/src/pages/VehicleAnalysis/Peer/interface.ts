import { PlateTypeId } from "@/components/FormPlate/interface";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { BasicFormDataType } from "../Initial/interface";
import { PersonFormDataType, VehicleFormDataType, VehicleLeftSearchFormType } from "./components/LeftSearchForm/interface";

// export type PeerFormDataType = Omit<BasicFormDataType, "pageNo" | "pageSize" | "groupFilters" | "excludeLicensePlates"> & {
//   excludeLicensePlate: {
//     licensePlate: string
//     plateColorTypeId: PlateTypeId
//     noplate?: '' | 'noplate'
//   }
//   interval: string //跟车时间
//   minCount: string // 同行点位
//   peerSpot: string // 同行次数
//   displaySort?: string //排序方式
//   sort?: { field: string, order: string }
//   displayTimeSort?: PeerFormDataType["displaySort"] //详情排序
//   timeSort?: PeerFormDataType["sort"]
//   peerPlate?: string //选中车牌
//   cacheId?: string //缓存Id
// }
export type PeerFormDataType = Partial<VehicleFormDataType> & Partial<PersonFormDataType>

export type PeerResultType = {
  cacheId: string, //此次检索的token,后端需要
  exportCacheId?:string //导出id
  target: ResultRowType
  peers: (ResultRowType & { elementId?: string })[]
}


export type DetailResultType = {
  target: ResultRowType,
  peer: ResultRowType,
  /**
   * @description 用于编号的索引
   */
  index: number
}[]
