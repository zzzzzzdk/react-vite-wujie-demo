import { ResultRowType } from "@/pages/Search/Target/interface";

export default interface ImgTagWrapProps {
  currentData?: ResultRowType //结果图
  data: ResultRowType //目标图
  handleImgClick?: (data: ResultRowType) => void
}
