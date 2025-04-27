import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { ImgListDataType } from '@yisa/webui_business/es/ImgPreview';
import { ReactNode } from 'react';
export default {};

export interface ComparativeBigImgProps {
  wrapClassName?: string
  currentIndex?: number;
  onIndexChange?: (index: number) => void
  modalProps?: ModalProps;
  data: any[];
  defaultCurrentIndex?: number;
  listRender?: (props?: any) => React.ReactNode;
  listItemRender?: (data: ImgListDataType, index: number) => ReactNode;
}