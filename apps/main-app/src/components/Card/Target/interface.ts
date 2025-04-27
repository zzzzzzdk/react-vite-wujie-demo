import React from "react";
import { ResultRowType } from "@/pages/Search/Target/interface";

export interface CardTargetProps<T = any> {
  className?: string;
  style?: React.CSSProperties;
  /**
   * @description 控制选中状态，在showChecked为true时启用
   * @default false
   */
  checked?: boolean;
  /**
  * @description 卡片状态变化回调
  * @default defaul
  */
  onCheck?: (data: { cardData: any, checked: boolean }) => void;
  /**
  * @description 图片的点击回调
  */
  onImgClick?: (event: React.MouseEvent, data: ResultRowType) => void;
  /**
 * @description 卡片点击回调
 */
  onCardClick?: (event: React.MouseEvent, data: T) => void;
  /**
  * @description 点位项可点击
  * @default true
  */
  locationCanClick?: boolean;
  /**
  * @description 点位点击回调
  */
  onLocationClick?: (event: React.MouseEvent, data: any) => void;
  /**
    * @description 是否可拖拽
    */
  draggable?: boolean
  /**
   * @description 图片拖拽开始事件
   */
  onImgDragStart?: (event: React.DragEvent) => void;
  /**
   * @description 图片拖拽结束事件
   */
  onImgDragEnd?: (event: React.DragEvent) => void;
  /**
   * @description 卡片数据
   * @default {}
   */
  cardData: T;
}