import React, { PropsWithChildren } from 'react'

export default interface DetailCardProps<T = any> extends PropsWithChildren {
  className?: string;
  /**
   * @description 控制激活样式
   * @default false
   */
  index?: number;
  /**
   * @description 详情的页码
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
  onImgClick?: (data: [], index: number) => void;
  /**
   * @description 卡片点击回调
   */
  onCardClick?: (event: React.MouseEvent) => void;

  cardData: T;
}
