import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { ImgListDataType } from '@yisa/webui_business/es/ImgPreview';
import { ResultRowType } from '@/pages/Search/Target/interface';
import { ReactNode } from 'react';
import { TargetType } from '@/config/CommonType';

export type PointType = {
  x: number;
  y: number;
}

export type TargetPointType = {
  infoId: string;
  targetType: TargetType;
  point: PointType;
}

// 大图右侧信息展示props
export interface ImgInfoProps {
  mapId?: string
  data?: ResultRowType[];
  currentIndex?: number;
  /**
   * @description 是否显示右下角地图
   * @default false
   */
  showInfoMap?: boolean;
  /**
   * @description 右侧信息渲染方法
   */
  imgInfoRender?: JSX.Element | ((data: any, currentIndex: number) => JSX.Element);
  /**
   * @description 大图弹框开关状态
   * @default false
   */
  modalVisible?: boolean;
  /**
   * @description 关联目标数据
   * @default []
   */
  connectData?: ResultRowType[];
  /**
   * @description 点击关联目标回调
   */
  onConnectItemClick?: (item: ResultRowType) => void;
  /**
   * @description 是否显示关联目标
   * @default false
   */
  showConnect?: boolean;
  /**
   * @description 当前正在显示的关联目标数据
   */
  showCData?: ResultRowType;
  /**
   * @description 同画面数据回调
   */
  onSameScenceChange?: (data: ResultRowType[], reset?: boolean) => void;

  showtab?: boolean // 是否显示tab
  // 检索条件描述
  matchesDesc?: string;
  // 检索结果描述
  resultDesc?: string;
  movePath?: PointType[];
  targetPoint?: TargetPointType[];
}

// 大图props
export default interface BigImgProps extends ImgInfoProps {
  calssName?: string;
  wrapClassName?: string
  /**
   * @description 数据选中索引
   * @default 0
   */
  currentIndex?: number;
  /**
   * @description 关联数据，用于在步态大图中，点击人脸目标时，打开的弹窗框的是人脸，为这块提供数据
   * @default undefined
   */
  connectDataTarget?: ResultRowType
  /**
   * @description 索引改变传参
   * @default 0
   */
  onIndexChange?: (index: number) => void
  /**
   * @description Modal组件参数控制
   * @default {}
   */
  modalProps?: ModalProps;
  /**
   * @description 大图数据
   * @default []
   */
  data?: any[];
  /**
   * @description 是否展示 右侧信息
   * @default true
   */
  showRightInfo?: boolean;
  /**
   * @description 禁用关联目标查询
   * @default false
   */
  disabledAssociateTarget?: boolean;
  /**
   * @description 大图下方卡片列表
   * @default <List />
   */
  listRender?: () => ReactNode;
  /**
 * @description 每个卡片自定义渲染
 * @default <List />
 */
  listItemRender?: (data: ImgListDataType, index: number) => ReactNode;
  /**
* @description 是否默认播放视频
* @default false
*/
  isShowVideo?: boolean
  // showtab?:boolean //是否展示切换tab
  /**
   * @description 关联目标被点击事件(现在需求是关联目标需要额外大图弹窗)
   *
   */
  onConnectItemClick?: (item: ResultRowType) => void
  /**
   * @description 关联目标被点击事件(现在需求是关联目标需要额外大图弹窗)
   *
   */
  only?: (item: ResultRowType) => void
}

export interface SameSceneProps {
  currentIndex?: number;
  /**
  * @description 大图弹框开关状态
  * @default false
  */
  modalVisible?: boolean;
  currentData?: ResultRowType;
  /**
   * @description 同画面数据回调
   */
  onSameScenceChange?: (data: ResultRowType[], reset?: boolean) => void;
}



export type QuickLinkItemType = {
  text: string;
  link?: string;
  icon?: string;
  disabled?: boolean;
  children?: QuickLinkItemType[];
  // onClick?:()=>void
}
