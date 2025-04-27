import { EXPORTTYPE, STATUS, ResultData } from "./hooks";
import { ReactNode } from "react";


export type ExportFormDataType = {
  checkedIds?: (string | number)[];
  [key: string]: any;
}

export interface ExportProps {
  /**
   * 导出请求数据
   */
  formData?: ExportFormDataType;
  /**
   * 是否展示顶部总数信息
   */
  showTotal?: boolean;
  /**
   * 总条数
   */
  total?: number;
  /**
   * 有图导出单次条数: 默认1000
   */
  sizeWithImage?: number;
  /**
   * 无图导出单次条数: 默认1000
   */
  size?: number;
  /**
   * className
   */
  className?: string;
  /**
   * 是否含有图片
   */
  hasImage?: boolean;
  /**
   * @description 是否含有进度
   * @default true
   */
  hasProgress?: boolean;
  /**
   * @description 是否含有全部导出
   * @default true
   */
  hasAll?: boolean;
  /**
   * 导出url
   */
  url?: string;
  /**
   * 进度url
   */
  progressUrl?: string;
  /**
   * 请求进度时间间隔
   */
  progressInterval?: number;
  /**
   * 自定义成功
   */
  customSuccess?: (data: ResultData) => ReactNode;
  /**
   * 自定义失败
   */
  customError?: (data: ResultData) => ReactNode;
  /**
   * 自定义消息提示
   */
  customTip?: (exportType: EXPORTTYPE, status: STATUS) => ReactNode;
  /**
   * 自定义按钮
   */
  customButton?: ReactNode;
  /**
   * 自定义底部按钮
   */
  footer?: (onClose: Function, onClick: Function) => React.ReactElement;
  /**
   * 自定义按钮文字
   */
  btnText?: ReactNode;
  /**
   * title: 弹框title
   */
  title?: string;
  /**
   * @description 是否禁用
   * @default false;
   */
  disable?: boolean;
}
