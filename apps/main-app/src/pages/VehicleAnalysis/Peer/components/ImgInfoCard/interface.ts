import { ResultRowType } from "@/pages/Search/Target/interface";
import { ReactNode } from "react";


export type ImgInfoCardType = {
  type?: "cardInfo" | "personInfo" | "trackInfo"
  data: ResultRowType & { idcard?: string, name?: string }
  onLocationClick?: () => void
  onTrackCardClick?: (data: ResultRowType) => void
  /**
   * @description 索引
   */
  trackIndex?: number
  /**
   * @description 标注
   */
  sign?: ReactNode
  /**
   * @description 是否选中
   */
  active?: boolean
}
