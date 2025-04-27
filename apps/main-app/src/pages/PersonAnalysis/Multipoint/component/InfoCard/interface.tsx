import React, { PropsWithChildren } from 'react'

export default interface InfoCardProps<T = any> extends PropsWithChildren {
  className?: string;
  /**
   * @description 控制激活样式
   * @default false
   */
  active?: boolean;
  /**
   * @description 是否显示图片放大镜
   * @default false
  */
  showImgZoom?: boolean;
  /**
   * @description 当前卡片的索引
  */
  index?: number,
  /**
 * @description 当前卡片的数据
*/
  cardData: T;
  /**
   * @description 图片的点击回调
  */
  conditionNum: number,
  /**
 * @description 条件个数
*/
  onImgClick?: () => void;
  /**
   * @description 卡片点击回调
  */
  onCardClick?: (event: React.MouseEvent) => void;
  /**
   * @description 卡片状态变化回调
   * @default
   */
  onChange?: (data: { cardData: any, checked: boolean }) => void;
  /**
   * @description 标签数量
   * @default 3
   */
  tagNum?: number;
}
