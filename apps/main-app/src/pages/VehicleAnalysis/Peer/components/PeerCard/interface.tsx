import { ResultRowType } from '@/pages/Search/Target/interface';
import React, { PropsWithChildren } from 'react'

// export type cardDataType = {
//   peerVehicle: ResultRowType
// }

export default interface PeercardProps extends PropsWithChildren {
  className?: string;
  /**
   * @description 控制同行卡片类型
   * @enum "Vehicle" | "Person" | "PersonTarget" | "PersonDetail"
   * @default "peerVehicle"
   */
  type?: "vehicle" | "person" | "personTarget" | "personDetail"
  /**
   * @description 是否显示checkbox
   * @default true
   */
  showChecked?: boolean;
  /**
    * @description 是否显示删除按钮
    * @default false
    */
  showDelete?: boolean
  /**
    * @description 删除按钮交互方式
    * @default "hover"
    */
  deleteInteraction?: "hover" | "block"
  /**
   * @description 控制选中状态，(多选框)在showChecked为true时启用
   * @default false
   */
  checked?: boolean;
  /**
   * @description 控制激活样式
   * @default false
   */
  active?: boolean;
  /**
   * @description 卡片状态变化回调
   * @default
   */
  onChange?: (data: { cardData: any, checked: boolean }) => void;
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
  * @description 图片拖拽结束事件
  */
  onDelete?: (data: ResultRowType) => void;
  /**
   * @description 卡片数据
   */
  cardData: ResultRowType;
  /**
    * @description 是否可拖拽
    */
  draggable?: boolean;
  /**
    * @description 标签数量
    */
  tagNum?: number
  /**
    * @description 图片大小
    */
   size?: "middle" | "small"
}
