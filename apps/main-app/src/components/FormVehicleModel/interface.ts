import React from "react";
import { FormItemProps } from "@yisa/webui/es/Form"

export default interface FormVehicleModelProps {
  className?: string;
  style?: React.CSSProperties;
  formItemProps?: FormItemProps;
  /**
   * @description 品牌
   * @default ""
   */
  brandValue?: string;
  /**
   * @description 型号
   * @default []
   */
  modelValue?: string[];
  /**
   * @description 年款
   * @default []
   */
  yearValue?: string[];
  /**
   * @description 回调
   */
  onChange?: (value: { brandValue: any, modelValue: any, yearValue: any, extra?: any }) => void;
  getTriggerContainer?: () => HTMLElement
}
