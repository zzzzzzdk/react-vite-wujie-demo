import React from 'react'

export type PlateTypeId = -1 | 1 | 2 | 5 | 6 | 9 | 15 | 16

export type Noplate = '' | 'noplate'

type placement = "top" | "left" | "right" | "bottom"


export interface PlateValueProps {
  /**
   * 车牌颜色
   */
  plateTypeId: PlateTypeId;
  /**
   * 车牌号
   */
  plateNumber: string;
  /**
   * 是否是无牌'noplate'为无车牌
   */
  noplate: Noplate;
}

export interface FormPlateProps {
  /**
  * 是否禁用不限按钮
  */
  isDisableNoLimit?: boolean
  /**
  * 类名
  */
  className?: string;
  dropdownMenuClassName?:string
  dropdownMenuLabelClassName?:string

  /**
    * 输入框提示文字
    */
  placeholder?: string;

  /**
    * 值
    */
  value?: PlateValueProps;

  /**
    * 值发生变化
    */
  onChange?: (value: PlateValueProps) => void

  /**
    * 是否显示无车牌按钮
    */
  isShowNoPlate?: boolean;

  /**
    * 是否显示选择车牌号面板
    */
  isShowKeyboard?: boolean;
  /**
    * 点击键盘面板是否聚焦回input
    */
  selectFocusInput?: boolean;
  /**
  * 弹框类名
  */
  keyboardClassName?: string;

  /**
    * 是否显示车牌颜色选择
    */
  isShowColor?: boolean;

  /**
  * 是否显示不限 true
  */
  isShowNoLimit?: boolean;

  /**
    * 位置，可选 top left right bottom
    */
  placement?: placement;

  /**
  * 上下距离
  */
  verticalDis?: number;

  /**
  * 左右距离
  */
  horizontalDis?: number;

  /**
  * 默认省份
  */
  province?: string;

  /**
  * 弹窗底部提示信息
  */
  remind?: React.ReactNode;

  /**
   * 获取挂在到哪个元素上
   */
  getPopupContainer?: () => HTMLElement;
  getTriggerContainer?: () => HTMLElement;
  /**
  * 是否禁用
  */
  disabled?: boolean;
  allowClear?: boolean
  /**
   * 是否精确车牌，不显示？和*
   */
  accurate?: boolean;
  /**
   * @description 配置车牌左侧下拉选项
   */
  plateTypeOption?: {
    label: string;
    value: number;
    position: number
  }[]
}

export interface PlateKeyboardProps {
  onClick: (value: string) => void;
  onDel: () => void;
  onConfirm: () => void;
  remind: React.ReactNode;
  province: string;
  position: any;
  show: boolean;
  placement: string,
  verticalDis: number,
  horizontalDis: number,
  prefixCls: string,
  keyboardClassName?: string,
  getPopupContainer: () => void;
  /**
 * 是否精确车牌，不显示？和*
 */
  accurate?: boolean;
}

export interface ModalBodyPros {
  children: React.ReactNode,
  getPopupContainer: () => void
}
