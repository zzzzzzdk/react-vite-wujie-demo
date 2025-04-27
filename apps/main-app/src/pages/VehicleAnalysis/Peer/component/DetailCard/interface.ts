export type DetailCardType<T = any> = {
  className?: string
  /**
   * @description 是否激活
   * @default false
   */
  active?: boolean
  /**
   * @description 是否显示图片放大镜
   * @default false
   */
  showImgZooms?: [boolean, boolean];
  /**
 * @description 图片放大镜位置
 * @default false
 */
  positions?: ["left" | "right", "left" | "right"];
  /**
   * @description 图片的点击回调(查询车辆，同行车辆)
   */
  onImgClick?: ({ cardData, type }: { cardData: T, type?: "target" | "peer" }) => void;
  /**
   * @description 卡片点击回调
   */
  onCardClick?: (cardData: T) => void;

  cardData: T

}
