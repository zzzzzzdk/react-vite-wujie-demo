import { PlateTypeId } from '@/components/FormPlate/interface'
import { GroupFilterItem } from '@/config/CommonType'
import { ResultRowType, resultShowType, TargetResultProps, TimeRangeType } from '@/pages/Search/Target/interface'
import type { Dayjs } from 'dayjs'
import { ApiResponse } from "@/services";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import { BasicFormDataType } from '../Initial/interface';

//双胞胎车
export type DoublecarFormDataType = Omit<BasicFormDataType, | "excludeLicensePlates"|"objectTypeId"|"directionId"|"vehicleFuncId"|"colorTypeId">

export type DoubleCarResultProps=Omit<TargetResultProps, |"resultData" >&{
  resultData: ApiResponse<DoublecarListType[], any>,
  carlist: ResultRowType[]
}
export interface DoublecarListType {
  distance:string,
  id:string,
  speed:string,
  timedifference:string
  doublecar:ResultRowType[]
}

// export type DoubleImgData={
//   data:
// }