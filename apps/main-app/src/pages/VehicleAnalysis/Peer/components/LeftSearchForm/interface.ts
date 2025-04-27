import { DrawType } from "@/components/LocationMapList/interface";
import { PeerFormDataType } from "@/pages/VehicleAnalysis/Peer/interface";
import { PlateTypeId } from "@/components/FormPlate/interface";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { BasicFormDataType } from "@/pages/VehicleAnalysis/Initial/interface";

type CommonSortType = {
  displaySort?: string //排序方式
  sort?: { field: string, order: string }
  displayTimeSort?: CommonSortType["displaySort"] //详情排序
  timeSort?: CommonSortType["sort"]
  cacheId?: string //缓存Id(方便后端查询)
  exportCacheId?: string //导出缓存Id(方便后端导出)
  peerPlate?: string //选中车牌
  elementId?: string //选中同行人特征
}

export type VehicleFormDataType = Omit<BasicFormDataType, "pageNo" | "pageSize" | "groupFilters" | "excludeLicensePlates"> & CommonSortType & {
  excludeLicensePlate: {
    licensePlate: string
    plateColorTypeId: PlateTypeId
    noplate?: '' | 'noplate'
  }
  interval: string //跟车时间
  minCount: string // 同行点位
  peerSpot: string // 同行次数
}

export type PersonFormDataType = Pick<BasicFormDataType, 'timeType' | 'beginDate' | 'endDate' | 'beginTime' | 'endTime' | 'locationIds' | 'locationGroupIds'> & CommonSortType & {
  clusterData?: ResultRowType[] | null,
  interval: string //跟随时间
  peerSpot: string // 同行次数
}

export type VehicleLeftSearchFormType = {
  formData?: VehicleFormDataType
  onChange?: (formData: VehicleFormDataType) => void
  drawType?: DrawType
  onChangeDrawType?: (type: DrawType) => void
}

export type PersonLeftSearchFormType = {
  showJump?: boolean
  jumpLoading?:boolean
  formData?: PersonFormDataType
  onChange?: (formData: PersonFormDataType) => void
  drawType?: DrawType
  onChangeDrawType?: (type: DrawType) => void
}
