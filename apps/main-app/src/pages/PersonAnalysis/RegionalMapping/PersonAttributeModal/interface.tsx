import { TargetType } from "@/config/CommonType";
import { characterDataType } from "@yisa/webui_business/es/CheckableTag/interface";
import { VectorType } from "../interface";

export interface PersonAttributeProps {
  open: boolean;
  cancel: () => void;
  confirm: (data: any, num: number, form?: any) => void;
  changevectorData: (data: VectorType[]) => void;
}

export type AttributeOptionType = {
  key: string;
  label: string;
  value: string[] | string;
  isSingle: boolean;
  data: characterDataType[];
};

export type LastResDataType = {
  targetType: TargetType;
  data: AttributeOptionType[];
};
