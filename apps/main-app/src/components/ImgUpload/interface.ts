import React, { ReactNode } from "react";
import { TargetType, TargetFeatureItem } from "@/config/CommonType";
import { ResultRowType } from "@/pages/Search/Target/interface";

export default interface ImgUploadProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * @description 数量限制
   * @default 5
   */
  limit?: number;
  /**
   * @description 禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
  * @description 上传地址
  * @default default
  */
  uploadUrl?: string
  /**
   * @description 描述
   * @default default
   */
  formData?: any;
  /**
   * @description 特征列表
   * @default []
   */
  featureList?: TargetFeatureItem[];
  /**
   * @description 特征列表变化回调
   */
  onChange?: (featureList: TargetFeatureItem[], type?: string) => void;
  /**
   * @description 内部插槽
   * @default null
   */
  innerSlot?: React.ReactNode | (() => React.ReactNode);
  /**
   * @description 是否刷新上传历史数据
   * @default false
   */
  flushHistory?: boolean
  /**
   * @description 请求历史完成回调
   */
  onFlushHistoryComplete?: () => void
  /**
   * @description 是否显示上传历史列表
   * @default true
   */
  showHistory?: boolean;
  /**
    * @description 选择的特征是否需要上传到历史
    * @default true
    */
  saveHistory?: boolean
  /**
   * @description 是否显示截图按钮
   * @default true
   */
  showCutBtn?: boolean;
  /**
   * @description 是否显示确认按钮
   * @default true
   */
  showConfirmBtn?: boolean
  /**
   * @description 隐藏上传按钮
   * @default false
   */

  hideFlag?: boolean;
  /**
   * @description 获取上传历史时，请求类型： TargetType
   * @default face
   */
  uploadHistoryType?: TargetType | "all" | string; //实现任意组合
  /**
   * @description 特征多选还是单选
   * @default false
   */
  multiple?: boolean;
  /**
    * @description 上传图片是否进行自定义操作
    * @default false
    */
  uploadType?: boolean
  /**
    * @description 展示照片墙
    * @default true
    */
  showImgList?: boolean
  /**
    * @description 是否需要聚类
    * @default false
    */
  searchCluster?: boolean;
  /**
    * @description 选择聚类数据
    * @default null
    */
  clusterData?: ResultRowType | null
  /**
    * @description 选择聚类数据
    * @default null
    */
  onClusterSelected?: (data: ResultRowType | null) => void
  /**
    * @description 聚类接口报错的时候
    * @default null
    */
  onClusterError?: (message: string, data: TargetFeatureItem[]) => void
  /**
    * @description 聚类数据被删除的时候
    * @default null
    */
  onClusterDelete?: (data: ResultRowType) => void
  /**
    * @description 是否展示聚类卡片数据
    * @default false
    */
  showClusterData?: boolean
  /**
    * @description 图片选择modal-title
    * @default 请选择要检索的目标
    */
  modalTitle?: string
  /**
    * @description 是否展示图片选择类型
    * @default true 
    */
  showRadio?: boolean
}

// 上传按钮
export interface UploadButtonProps {
  load?: boolean;
  innerSlot?: React.ReactNode | (() => React.ReactNode);
}

// 组件ref方法
export type RefImgUploadType = {
  /**
   * @description 图片上传，传值url
   */
  handleAutoUpload?: (params: AutoUploadParams) => void;
  /**
   * @decription 
   */
  handleSearchCluster?: (features: TargetFeatureItem[]) => void;
}

export type AutoUploadParams = {
  bigImage?: string
  [key: string]: string | number | undefined
}

// 图片识别数据
export type PicDataType = {
  bigImage: string;
  data: TargetFeatureItem[];
}

export type FormRadioChangeParamas = {
  value?: TargetType | 'all';
  text?: string;
}

// 上传弹框
export interface ImgUploadModalProps {
  analysisType?: string;
  /**
   * @description 最大上传个数
   */
  limit?: number
  /**
   * @description 图片识别数据
   */
  picData?: PicDataType;
  /**
   * @description 弹框关闭回调
   */
  handleCancel?: () => void;
  /**
   * @description 弹框显隐开关
   * @default false
   */
  visible?: boolean;
  /**
   * @description 选择特征
   */
  addFeature: (data: TargetFeatureItem[], getHistory?: boolean) => void;
  /**
   * @description 目标特征类型改变事件
   */
  handleFormRadioButtonChange?: (data: FormRadioChangeParamas) => void;
  /**
   * @description 是否显示截取图片按钮
   * @default true
   */
  showCutBtn?: boolean;
  /**
     * @description 是否显示确认按钮
     * @default true
     */
  showConfirmBtn?: boolean
  /**
   * @description 已选中特征列表
   * @default []
   */
  featureList?: TargetFeatureItem[];
  /**
   * @description 删除特征项
   */
  handleDelTargetFeature?: (id: string) => void;
  /**
  * @description 特征多选还是单选
  * @default false
  */
  multiple?: boolean;
  /**
    * @description 图片选择modal-title
    * @default 请选择要检索的目标
    */
  modalTitle?: string
  /**
    * @description 是否展示图片选择类型
    * @default true 
    */
  showRadio?: boolean
}

export interface ImgClusterModalProps {
  /**
   * @description 图片数据
   */
  data?: {
    target: TargetFeatureItem,
    result: ResultRowType[]
  };
  /**
   * @description 弹框关闭回调
   */
  handleClusterCancel?: () => void;
  /**
   * @description 弹框显隐开关
   * @default false
   */
  visible?: boolean;
  /**
   * @description 选择
   */
  handleClusterConfirm: (data: ResultRowType) => void;
}
