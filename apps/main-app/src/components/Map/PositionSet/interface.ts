import { ModalProps } from '@yisa/webui/es/Modal/interface'
export type lngLatType = {
  lng?: number;
  lat?: number;
}

export default interface PositionSetModalProps {
  calssName?: string;
  /**
 * @description Modal组件参数控制
 * @default {}
 */
  modalProps?: ModalProps;
  /**
   * @description 经纬度确认
   */
  onModalConfirm?: (data: lngLatType) => void;
  /**
   * @description 传入的经纬度
   */
  data?: lngLatType;
}