import { TargetFeatureItem } from "@/config/CommonType";
import React from "react";
import { PicDataType } from "../ImgUpload/interface";

export default interface ImgResizeProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * @description 最小缩放比例
   * @default 0.5
   */
  scaleMin?: number;
  /**
   * @description 是否支持多选
   * @default false
   */
  multiple?: boolean;
  /**
   * @description 最大缩放比例
   * @default 2.3
   */
  scaleMax?: number;
  /**
   * @description 图片特征数据
   */
  picData?: PicDataType;
  /**
   * @description 最大选择的数量
   * @default 5
   */
  limit?: number
  /**
   * @description 选中的特征
   */
  chooseFeature?: TargetFeatureItem[]
  /**
   * @description 选中特征回调
   */
  handleChooseFeature?: (data: TargetFeatureItem[]) => void;
  /**
   * @description 弹框是否打开
   * @default false
   */
  isShowModal?: boolean;
  /**
   * @description 是否显示确认按钮
   * @default true
   */
  showConfirmBtn?: boolean;
}

export type RefImgResizeType = {
  changeFeature: (item: TargetFeatureItem) => void;
}

export interface FeatureXYProps {
  multiple?: boolean
  limit?: number
  featureData: TargetFeatureItem[];
  /**
   * @param data 选中的特征框组合
   * @param currentClickItem 当前点击的特征框
   */
  selectFeature: (data: TargetFeatureItem[], currentClickItem?: TargetFeatureItem) => void;
  curFeature: TargetFeatureItem[]; //单选会被自动包装成数组
  boxScale: number;
  showConfirmBtn?: boolean
  /**
   * @description 单选时需要在点击框后颜色变成选中状态，需要存储点击索引
   */
  curFeatureIndex?:number
  setCurFeatureIndex?:(curFeatureIndex:number)=>void
}
