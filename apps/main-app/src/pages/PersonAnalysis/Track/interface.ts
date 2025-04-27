import { ResultRowType as TargetResultRowType } from '@/pages/Search/Target/interface';

export type FormDataType = {
  timeType: string;
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
  clusterData: TargetResultRowType | null;
}