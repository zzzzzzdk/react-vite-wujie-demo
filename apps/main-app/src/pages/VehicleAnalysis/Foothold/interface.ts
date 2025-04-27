import { PlateTypeId } from "@/components/FormPlate/interface";
import { ResultRowType } from "@/pages/Search/Target/interface";

export type ChartData={
    type:"days"|"short"|"night",
    value:string[]
}

export type ChartDataArr={
  time:string,
  data:ChartData[]
}

//右侧数据
export type FootholdResultType={
  id:string
  locationName:string,
  parkingFrequency: number,
  parkingActions:string[]
  locationId: string,
  parkingCount: number,
  stayTime:ChartDataArr[],
  index?:number
}
export type DataList={
  down:FootholdResultType[],
  up:FootholdResultType[]
}
//左侧详情数据
export type DetailResultType = {
  parkingDuration:number//落脚时长，
  vehicleInfo:ResultRowType[],
  index?:number|0,
  duration?:string
}
export type DetailList={
  down:DetailResultType[],
  up:DetailResultType[],
  total:number
}
//大图数据
export type totalImg={
  down:ResultRowType[],
  up:ResultRowType[],
}
export type SearchingInfoType={
  carInfo:string,
  licensePlate:string,
  lpColor:number,
  plateColorTypeId2:number,
  // message:string|undefined,
  reqUuid:string,
  targetImage:string
}
