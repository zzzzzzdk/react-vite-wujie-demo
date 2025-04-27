import React from "react";
import { PlateTypeId } from "@/components/FormPlate/interface";
import { FormItemProps } from "@yisa/webui/es/Form";

export type PlateType = 'single' | 'batch' | 'multi';

export type ParamsPlateNumberType = {
  /**
   * @description 单牌single/批量batch
   * @default
   */
  type?: PlateType;
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
   * @description 上传成功文件地址
   * @default default
   */
  licensePlateFile?: string;
  /**
   * @description 成功个数
   */
  successNum?: number;
  /**
   * @description 无车牌选中
   * @default ""
   */
  noplate?: "" | "noplate";
};

export default interface FormPlateNumberProps {
  className?: string;
  style?: React.CSSProperties;
  formItemProps?: FormItemProps;
  /**
   * @description 受控参数
   * @default null
   */
  params?: ParamsPlateNumberType;
  /**
   * @description 变化回调
   */
  onChange?: (value: ParamsPlateNumberType) => void;
  /**
   * @description 是否显示开关
   * @default true
   */
  showSwitch?: boolean;
  /**
   * @description 自定义上传地址
   * @default ""
   */
  address?: string;
  /**
   * @description 是否禁用
   * @default false
   */
  disabled?:boolean;
}

export type Noplate = "" | "noplate";
export interface PlateValueProps {
  /**
   * 车牌颜色
   */
  plateTypeId?: PlateTypeId;
  /**
   * 车牌号
   */
  plateNumber: string;
  /**
   * 是否是无牌'noplate'为无车牌
   */
  noplate: Noplate;
}

export type ImportResultType = {
  successNum: number;
  successUrl: string;
  failNum: number;
  failUrl: string;
  totalNum: number;
};
