import React from "react";
import { ResultRowType } from "@/pages/Search/Target/interface";

export interface IdentifyProps<T = any> {
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
  onImgClick?: (event: React.MouseEvent, data: ResultRowType, index?: number) => void;
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
  /**
   * @description  // 更多链接，单个点击事件回调
   */
  linkEleClick?: (childElem: any, cardData: ResultRowType) => void;
  /**
   * @description 添加过滤名单回调
   */
  onAddFilterate?: (data: any) => void;
  /**
   * @description 是否显示相似度
   * @default true
   */
  showSimilarity?: boolean;
  /**
   * @description 是否显示图片放大镜，仅在车辆图片下
   * @default false
   */
  showImageZoom?: boolean;
  /**
   * @description 是否显示过滤名单
   * @default true
   */
  showAddFilterate?: boolean;
  /**
   * @description 索引背景颜色
   * @default string
   */
  indexColor?: string;
}