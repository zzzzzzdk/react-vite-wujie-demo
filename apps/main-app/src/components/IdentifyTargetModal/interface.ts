import { YituResultType } from "@/pages/Search/Image/interface";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { ReactNode } from "react";

export default interface IdentifyTargetProps {
  title?: string
  data: ResultRowType
  visible: boolean
  onCancel: () => void
  type?: YituResultType,
  showbtnTemplate?: boolean
  btnTemplate?: ReactNode
}
