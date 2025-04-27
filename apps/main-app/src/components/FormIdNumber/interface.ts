import React from "react";
import { FormItemProps } from "@yisa/webui/es/Form";
import useControllableValue, {
  StandardProps,
} from "ahooks/es/useControllableValue";
export type IdentityValue = {
  /**
   * @description 单single/批量batch
   * @default
   */
  type?: "single" | "batch";
  /**
   * @description 上传成功文件地址
   * @default default
   */
  uploadedFileURL?: string;
  /**
   * @description 批量上传成功的个数
   */
  batchCount?: number;
};

export default interface FormIdNumberProps
  extends Partial<StandardProps<IdentityValue>> {
  className?: string;
  style?: React.CSSProperties;
  /**
   * @description 是否显示开关single/batch
   * @default true
   */
  showSwitch?: boolean;
  /**
   * @description 是否禁用
   * @default false
   */
  disabled?: boolean;
}

export type Noplate = "" | "noplate";

// export type ImportResultType = {
//   successNum: number;
//   successUrl: string;
//   failNum: number;
//   failUrl: string;
// };
