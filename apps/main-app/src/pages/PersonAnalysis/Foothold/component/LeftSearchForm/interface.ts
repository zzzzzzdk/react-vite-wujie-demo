import { DrawType } from "@/components/LocationMapList/interface";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { BasicFormDataType } from "@/pages/VehicleAnalysis/Initial/interface";
import { TimeDataType } from "../../interface";
type SortType = {
    displaySort: string //点位排序
    displayTimeSort: string //详情排序
}
export type PersonFootholdFormDataType = TimeDataType & SortType & {
    clusterData: ResultRowType | null,
    parkingCount: string|number //落脚次数
    parkingHour: string|number // 落脚时长
    group:string
}
export type VehicleFootholdFormDataType = Omit<BasicFormDataType, "pageNo" | "pageSize" | "excludeLicensePlates" | "groupFilters"> & {
    parkingHour:string|number//落脚时长
    directionId:number//行驶方向
    displaySort:string,
    displayTimeSort:string,
  }
export type PersonFootholdSearchType={
    formData?: PersonFootholdFormDataType
    onChange?: (formData: PersonFootholdFormDataType) => void
}
export type VehicleFootholdSearchType={
    formData?: VehicleFootholdFormDataType
    onChange?: (formData: VehicleFootholdFormDataType) => void
    drawType?: DrawType
    onChangeDrawType?: (type: DrawType) => void
}