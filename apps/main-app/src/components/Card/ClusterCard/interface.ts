import { DriverPassengerClusterType, ItemType } from "@/pages/Search/record/VehicleDetails/interface";

export type ClusterCardType = {
  data: ItemType<DriverPassengerClusterType>,
  footerBtnText?: string
  onFooterBtnClick?: (data: ClusterCardType["data"]) => void
  onImgClick?: (data: ClusterCardType["data"]) => void
  imgCursor?: "default" | "pointer"
  showFooterBtn?:boolean
}
