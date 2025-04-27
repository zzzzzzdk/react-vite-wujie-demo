import { ResultRowType } from "@/pages/Search/Target/interface";

export default interface InfoTagCardType {

  tag?: string[],
  type?:"vehicle"|"person",
  cardData: ResultRowType,
  size?: "middle" | "small",
  onDelete?: (data: ResultRowType) => void;
  showDelete?: boolean
  deleteInteraction?: "hover" | "block"
  onImgClick?: () => void;
  //   {
  //   name: string,
  //     age ?: string,
  //     idcard: string,
  //       personTags: any[]
  //   idcardUrl ?: string
  // }
}
