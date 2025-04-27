import { ResultRowType } from "@/pages/Search/Target/interface";
import { VehicleInfoDataType } from "../interface";

export type TrackAnalysisType = {
  mainFormData: Pick<VehicleInfoDataType, "licensePlate" | "plateColorTypeId">
}

export type VehicleLocusAnalysisLocationType = Pick<ResultRowType, "captureTime" | "bigImage" | "lngLat" | "locationId" | "locationName"> & {
  count: number,
}
export type VehicleLocusAnalysisLocation = Pick<ResultRowType, "captureTime" | "bigImage" | "lngLat" | "locationId" | "locationName"> & {
  count: number,
  id: number
}
export type VehicleLocusAnalysisTime = {
  dateData: {
    [key: string]: string;
  },
  timeData: {
    [key: string]: string;
  }
}
export type MarkerProps={
  data:VehicleLocusAnalysisLocation[],
  contentCb:any,
  // curIndex:number
  // click:number
}