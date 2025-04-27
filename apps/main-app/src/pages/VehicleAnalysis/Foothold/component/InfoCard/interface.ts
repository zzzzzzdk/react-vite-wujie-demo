export type DetailCardType<T=any> = {
  className?: string
  /**
   * @description 索引
   * @default undefined
   */
  index?: number
  /**
   * @description 是否激活
   * @default false
   */
  active?: boolean
  /**
   * @description 是否显示图片放大镜
   * @default false
   */
  // showImgZoom?: boolean;
  // /**
  //  * @description 图片的点击回调(查询车辆，同行车辆)
  //  */
  // // onImgClick?: ({ cardData, index, type }: { cardData: T, index?: number, type?: "target" | "peer" }) => void;
  /**
   * @description 卡片点击回调
   */
  onCardClick?: (cardData: T, index?: number) => void;

  cardData: T,
  // type?:string//类型

}
