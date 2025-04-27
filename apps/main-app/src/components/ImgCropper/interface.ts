import React from "react";
import { PicDataType } from "../ImgUpload/interface";
import { TargetFeatureItem, TargetType } from "@/config/CommonType";

export type CropperApplicationType = 'bigImg' | 'embed' | 'uploadArea'

export type JumpItemType = {
  text?: string;
  url?: string;
  icon?: string;
  disabled?: boolean;
  disabledTip?: string;
  mode?: string;
}

export default interface ImgCropperProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * @description 图片
   * @default ''
   */
  pic?: string;
  /**
   * @description 选中特征
   */
  handleChooseFeature?: (data: TargetFeatureItem) => void;
  /**
   * @description cropper应用区域类型, 此类型不同, x,y定位依据不同
   * @default bigImg
   */
  applicationType?: CropperApplicationType;
  /**
   * @description 快捷跳转模板数组
   * @default []
   */
  jumpArr?: JumpItemType[];
  /**
   * @description 页面类型, 此类型不同,截取之后判断逻辑不相同
   * @default ""
   */
  pageType?: string | "yitu";
  /**
   * @description 所有图片特征数据, 用来判断截取数据交集
   */
  picData?: PicDataType;
  /**
   * @description 选中的特征
   */
  chooseFeature?: TargetFeatureItem[]
  // 选中特征数量限制，与chooseFeature配合使用
  limit?: number;
}

export type AreaPosType = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  endX: number;
  endY: number;
  targetImage?: string;
  targetType?: TargetType;
  feature?: string;
  originImg?: string;
  brandId?: string | number;
  modelId?: string | number;
  yearId?: string | number;
  bigImage?: string;
  areaValue?: number;
}
