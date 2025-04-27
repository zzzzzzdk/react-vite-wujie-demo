import React from "react";
import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { ResultRowType } from "@/pages/Search/Target/interface";

export type GaitSequenceData = {
  /**
   * @description 步态特征值
   */
  gaitFeature: string;
  /**
   * @description 步态灰度图
   * @default []
   */
  gaitMaskUrl: string[];
  /**
   * @description 步态目标图
   * @default []
   */
  gaitObjectUrl: string[];
  /**
   * @description 步态视频链接
   */
  gaitVideoUrl: string
  /**
   * @description 步态视频持续时间
   * @default 0
   */
  gaitVideoDuration: number;
  /**
   * @description 相似度（）
   */
  similarity?: number;
  /**
   * @description 检索条件
   */
  matches: GaitSequenceData;
}

export interface GaitSequenceModalProps {
  /**
   * @description Modal组件参数控制
   * @default {}
   */
  modalProps?: ModalProps;
  data?: {
    conditionData?: ResultRowType;
    resultData?: ResultRowType;
  };
}

export interface GaitSequenceListProps {
  data?: ResultRowType;
  onGaitSequenceListClick?: () => void
  disabledClick?: boolean
}

export default interface GaitSequenceProps extends GaitSequenceListProps {
  className?: string;
  style?: React.CSSProperties;
  isConditionFlag?: boolean
  isResultFlag?: boolean
}
