import { ApiResponse } from '@/services'
import { ModalProps } from '@yisa/webui/es/Modal/interface'

export enum STATUS {
  FORM = "FORM",
  RESULT = "RESULT",
}

export type FormDataType = {
  /**
   * @description 表名
   */
  table: string;
  /**
   * @description 导入多少条
   */
  size: number;
  exportType: number  //导出类型，1全部档案，2实名档案，3未实名档案
}

export type ResultDataType = {
  status: 'success' | 'error';
  size?: number;
  errorReason?: string;
  url?: string;
  archivesCount?:number
  captureCount?:number
}

export interface ImportCubeModalProps {
  className?: string;
  /**
 * @description Modal组件参数控制
 * @default {}
 */
  modalProps?: ModalProps;
  /**
   * @description 结果页请求参数
   */
  resultFormData?: any;
  /**
   * @description 导入接口地址
   */
  url?: string;

  recordData?: ApiResponse<{ person: any[], car: any[], select: any[], selectId: string }>

  type?:"target" | "record"
  // 检索条件文本信息
  searchInfo?: string;
}
