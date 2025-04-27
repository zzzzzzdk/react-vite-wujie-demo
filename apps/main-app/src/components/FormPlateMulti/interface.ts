import React from "react";
import { PlateTypeId } from "@/components/FormPlate/interface";
import { FormItemProps } from "@yisa/webui/es/Form"

export type PlateNumberItemType = {
  /**
   * @description 车牌
   * @default ""
   */
  licensePlate?: string;
  /**
   * @description 车牌颜色id
   * @default -1
   */
  plateColorTypeId?: PlateTypeId;
  /**
   * @description 无车牌选中
   * @default ""
   */
  noplate?: '' | 'noplate';
}

export interface FormPlateMultiProps {
  className?: string;
  style?: React.CSSProperties;
  formItemProps?: FormItemProps;
  /**
   * @description 设置模式为多选或者单选
   * @default multiple
   */
  mode?: 'multiple' | 'single';
  /**
   * @description 最大车牌限制数量
   * @default 2
   */
  limit?: number;
  /**
   * @description value受控，数组最少有一项
   * @default []
   */
  value?: PlateNumberItemType[];
  /**
   * @description 内容变化回调
   */
  onChange?: (value: PlateNumberItemType[]) => void;
  /**
   * @description 键盘输入提示
   */
  remind?: string;
}
