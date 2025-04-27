
import { ResultRowType } from '@/pages/Search/Target/interface'
import React, { PropsWithChildren, ReactNode } from 'react'
import { LabelSetType } from '@/pages/Search/record/LabelManage/components/LabelSetModal/interface';

export default interface NormalProps<T = any> extends PropsWithChildren {
  className?: string;
  /**
   * @description 是否显示checkbox
   * @default true
   */
  showChecked?: boolean;
  /**
  * @description 是否显示删除按钮
  * @default false
  */
  showDelete?: boolean;
  /**
   * @description 控制选中状态，在showChecked为true时启用
   * @default false
   */
  checked?: boolean;
  /**
   * @description 卡片状态变化回调
   * @default defaul
   */
  onChange?: (data: { cardData: any, checked: boolean, type?: "target" | "person" }) => void;
  /**
   * @description 删除卡片事件回调
   * @default ()=>{}
   */
  handleDelete?: () => void
  /**
   * @description 是否显示图片放大镜
   * @default false
   */
  showImgZoom?: boolean;
  /**
   * @description 图片的点击回调
   */
  onImgClick?: () => void;
  /**
   * @description 卡片点击回调
   */
  onCardClick?: (event: React.MouseEvent) => void;
  /**
   * @description 点位项可点击
   * @default true
   */
  locationCanClick?: boolean;
  /**
   * @description 点位点击回调
   */
  onLocationClick?: (event: React.MouseEvent) => void;
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
   * @description 快捷链接点击事件回调，链接配置了isClick才有此事件
   */
  linkEleClick?: () => void;
  /**
    * @description 比中几项，有相似度才有此事件
    */
  onsimilarityNumberClick?: (cardData: ResultRowType) => void
  /**
    * @description 是否可拖拽
    */
  draggable?: boolean
  /**
   * @description 卡片 title
   */
  cardTitle?: ReactNode | string
  // 添加目标
  onAddTargetChange?: (cardData: any) => void;
  // 编辑标签
  onLabelChange?: (cardData: any, type: LabelSetType) => void;
  // 删除数据
  onDelChange?: (cardData: any) => void;
}
