import { FormItemProps } from "@yisa/webui/es/Form"
import { ResultRowType } from "@/pages/Search/Target/interface";

export interface ImgUploadOrIdcardType {
  className?: string;
  formItemProps?: FormItemProps
  /**
   * @description label值
   * @default "person"
   */
  infoValue?: string
  /**
   * @description 人员聚类(可以传递一个对象或者数组)
   * @default
   */
  clusterData?: ResultRowType[] | ResultRowType | null
  /**
   * @description 改变
   * @default
   */
  onClusterChange?: (data: ResultRowType | null) => void
  /**
   * @description 是否显示Tabs
   * @default true
   */
  showTab?:boolean;
  /**
   * @description 是否显示idcard
   * @default true
   */
  onIdCardSearch?: (idCard: string) => void;
  /** 
   * @description 是否显示loading
  */
  loading?: boolean;
}
