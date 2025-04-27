import { ResultRowType } from "@/pages/Search/Target/interface";

export type CardDataType= {
  captureTimeA:string,
  locationNameA:string,
  captureTimeB:string,
  locationNameB:string,
  distance:string,
  timedifference:string,
  speed:string
}
export type GoalDataType=Pick<ResultRowType,"licensePlate1"|"licensePlate2"|"carInfo"|"plateColorTypeId2">
export type ImgInfoCardType = {
  cardData:{
    lat:string,
    lng:string,
    locationName:string
  }[]|CardDataType|GoalDataType
  type?:"foothold"|"doublecar-message"|"doublecar-message"|"doublecar-goal"
}
