import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { ResultRowType } from '../interface';

export default interface BaseModalProps {
  calssName?: string;
  /**
 * @description Modal组件参数控制
 * @default {}
 */
  modalProps?: ModalProps;
  onModalConfirm?: (data: any) => void;
  data?: ResultRowType;
}

export interface OfflineTreeSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}