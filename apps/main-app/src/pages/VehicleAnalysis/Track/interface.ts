import { ResultRowType as TargetResultItemType } from "../../Search/Target/interface";
import { PlateNumberItemType } from '@/components/FormPlateMulti/interface'
import { PlateTypeId } from "@/components/FormPlate/interface";
import { TrackDataItem } from '@/components/Map/TrackMulti/interface'

export type FormDataType = {
  licensePlates: PlateNumberItemType[];
  timeType: string;
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
}

export interface ResultItem {
  licensePlate: string;
  licensePlateUrl: string;
  plateColorTypeId: PlateTypeId;
  data: TrackDataItem[];
}

export interface ResultDataType {
  data: ResultItem[];
}

