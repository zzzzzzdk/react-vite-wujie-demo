import { ResultRowType } from '@/pages/Search/Target/interface'
import React, { PropsWithChildren, ReactNode } from 'react'
import { GroupFilterItem } from '@/config/CommonType';

export interface GroupFilterCallBackType extends GroupFilterItem {
  cardData?: ResultRowType;
}

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
   * @description 分组类型
   * @default ""
   */
  groupType?: string;
  /**
   * @description 聚合数量
   * @default ""
   */
  onPortraitClick?: (event: React.MouseEvent) => void
  /**
   * @description 同行次数
   * @default ""
   */
  onPeerClick?: (event: React.MouseEvent) => void
  /**
   * @description 筛选回调
   */
  onFilterChange?: (data: GroupFilterCallBackType) => void;
  /**
   * @description 分组改变回调
   */
  onGroupChange?: (data: GroupFilterCallBackType) => void;
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
  * @description 是否为需要footer的卡片,
  */
  hasfooter?: boolean;
  /**
    * @description 卡片类型,
    */
  cardtype?: string
  /**
    * @description 是否需要相似度展示
    */
  showSimilarity?: boolean
  /**
   * @description 相似度类型
   */
  similarType?: string
  /**
  * @description 是否展示聚类数量
  */
  showCaptureNum?: boolean
  /**
  * @description tag 标签展示几个
  */
  tagNum?: number
  /**
    * @description 关联人员事件回调
  */
  onRelateClick?: () => void
  /**
    * @description 是否有关联人员按钮
  */
  isRelate?: boolean
  /**
   * @description 抓拍时间 title
   */
  captureTimeTitle?: string
  /**
   * @description 卡片 title
   */
  cardTitle?: ReactNode | string
  /**
   * @description 同行标识
   */
  peerFlag?: Boolean
  hasCaptureTitle?: boolean//是否需要显示抓拍时间上的文字
  /**
   * @description 必须显示抓拍时间（没有用 -）
   */
  showCaptureTime?: Boolean
  /**
  * @description 必须显示抓拍地点（没有用 -）
  */
  showLocation?: Boolean
  /**
  * @description 页面名
  */
  pageName?: string
}
