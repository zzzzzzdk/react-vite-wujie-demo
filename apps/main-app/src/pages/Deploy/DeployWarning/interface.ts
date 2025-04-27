import { ResultRowType } from "@/pages/Search/Target/interface";
import { BkType, Measure } from "../DeployDetail/interface";
import { DeployBy, MonitorType } from "../Deploy/interface";
import { BaseFormData } from "../Deploy/AddDeployModal";
import { PlateTypeId } from "@/components/FormPlate/interface";
import { RawLabelTreeNode } from "@/components/FormLabelSelect";
import { uniqueId } from "lodash";
export type WarningItem = {
  /**
   *
   * @description 所有用到`WarningItem`的地方无法保证infoId唯一
   * 接口拿到数据后，先生成uniqueId。（仅前端使用）
   */
  uniqueId: string | number;
  infoId: number | string;
  resultId:number | string
  jobId: number | string; // 布控单号
  title: string; // 布控标题
  measure: Measure; // 采取措施
  monitorType: MonitorType;
  // 原始布控目标
  bkType?: BkType;
  monitorTarget?: {
    itemId: string | number;
    monitorTargetId?: string | string;
    monitorTargetUrl?: string;
    licensePlate?: string;
    vehicleTypeId: string;
    plateColorTypeId?: PlateTypeId;
    brandId?: number | string;
    modelId?: (number | string)[];
    yearId?: (number | string)[];
    license?: string;
    personName?: string;
    labelInfos?: RawLabelTreeNode[];
  };
} & Partial<ResultRowType>;

export type WarningListProps = {
  items: WarningItem[];
  selected?: (number | string)[];
  onSeletedChange?: (seleted: (string | number)[]) => void;
};
