import BaseModalProps from "../LabelSetModal/interface";

export type ImportResultType = {
  success: number;
  // successUrl?: string;
  failed: number;
  failedUrl: string;
  failedReason: string;
  // totalNum: number;
};