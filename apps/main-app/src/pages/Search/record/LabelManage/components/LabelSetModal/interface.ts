import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { ResultLabelItem } from '../../interface';
import { PermissionsType } from '../../interface';
import { Receiver } from "@/pages/Deploy/Deploy/interface";
import { SelectDataType } from '../../interface';

export default interface BaseModalProps {
  calssName?: string;
  /**
 * @description Modal组件参数控制
 * @default {}
 */
  modalProps?: ModalProps;
  onModalConfirm?: (data: any) => void;
  data?: any;
  modalType?: LabelSetType;
  receiverList?: Receiver[];
  selectData?: SelectDataType;
}

export type RadioDataType = {
  type: PermissionsType;
  persons: string[]
  names: string[]
}

export type LabelSetType = 'add' | 'edit' | 'view';