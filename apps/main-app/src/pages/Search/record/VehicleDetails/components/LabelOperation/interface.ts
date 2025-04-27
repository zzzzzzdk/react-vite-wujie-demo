import { LabelDataType } from "../../interface";

export type LabelOperationType = {
  isEdit?: boolean
  tagNum?: number
  labelData: LabelDataType[]
  value: string[] //树形组件选中id
  labels: LabelDataType["labels"] //展示状态下的标签
  handleChangeSelect?: (value: string[], option: any) => void
}
