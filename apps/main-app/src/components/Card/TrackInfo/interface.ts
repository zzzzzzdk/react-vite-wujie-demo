import { ResultRowType } from "@/pages/Search/Target/interface";

export type TrackInfoProps<T = any> = {
  data: T;
  onLocationClick?: () => void
  onTrackCardClick?: (data: ResultRowType) => void
  /**
   * @description 索引
   */
  trackIndex?: number
  /**
   * @description 标注
   */
  sign?: string
  /**
   * @description 是否选中
   */
  active?: boolean
}
