import BaseModalProps from "../LabelSetModal/interface";
import type { Dayjs } from 'dayjs'

export default interface LabelModalProps extends BaseModalProps {
  selectData?: { [key: string]: { value: string | number, label: string }[] };
}

export interface RuleSelectProps extends LabelModalProps {
  onChange?: (data: any) => void;
  rule?: string[][];
}


export type ModalDataType = {
  beginDate: Dayjs | null | string;
  endDate: Dayjs | null | string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  labelSetId: number | undefined;
  labelName: string;
  labelColorId: number;
  remarks: string;
  ruleType: 'manual' | 'rule';
  canDeploy: 'yes' | 'no';
  labelTypeId: 'personnel' | 'spaceTime' | 'vehicle';
  locationGroupIds: string[];
  timeType: 'nonFixed' | 'fixed';
  timeRange: {
    times?: string[]
    period?: number
    periods?: {
      dates: string[];
      times: string[];
    }
  },
  captureCounts: number;
  captureDays: number;
  rule?: string[][];
}