import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { ResultRowType } from '@/pages/Search/Target/interface';
import { PointType, TargetPointType } from '../BigImg/interface';

export default interface MovePathModalProps {
  className?: string;
  /**
 * @description Modal组件参数控制
 * @default {}
 */
  modalProps?: ModalProps;
  onModalConfirm?: (data: any) => void;
  data?: ResultRowType[];
  movePath: PointType[];
  targetPoint: TargetPointType[]
  bigImage: string;
}

export type PointData = {
  
}