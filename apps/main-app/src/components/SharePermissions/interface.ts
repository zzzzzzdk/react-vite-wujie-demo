import React from "react";
import { ModalProps } from '@yisa/webui/es/Modal/interface'
import { Receiver } from "@/pages/Deploy/Deploy/interface";
import { OfflineTreeItem } from "@/pages/Analysis/Offline/interface";
import { ClueFormData, ClueTreeItem } from "../SearchTree/interface";

export interface SharePermissionsProps {
  style?: React.CSSProperties;
  className?: string;

  /**
 * @description Modal组件参数控制
 * @default {}
 */
  modalProps?: ModalProps;
  /**
   * @description 弹窗确定
   */
  onOk?: (data: { privilege: number, sharedUsers: Receiver[] }) => void;
  data?: OfflineTreeItem | null | ClueTreeItem|ClueFormData;
  // data?: OfflineTreeItem | null;
}