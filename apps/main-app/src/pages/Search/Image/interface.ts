
import { TargetFeatureItem, SortOrder } from '@/config/CommonType'
import { ResultRowType, resultShowType } from '@/pages/Search/Target/interface'
import { GroupFilterItem, SortField } from "@/config/CommonType";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import React from 'react';
import { ApiResponse } from '@/services';
export interface FormDataType {
  imageType: string
  similarity: number | number[]
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  timeType: string; // 'time' | 'range'
  locationIds: string[];
  locationGroupIds: string[];
  offlineIds: (string | number)[];
  faceType: string
  gaitType: string
  sort: {
    field: SortField,
    order: SortOrder
  }
  // 分组筛选参数
  groupFilters?: GroupFilterItem[];
  pageNo: number; //分页只有在表格分组用到
  pageSize: number;
}

// export type PersonInfoType = {
//   targetImage: string
//   personBasicInfo: {
//     name: string
//     sex: string
//     age: number
//     nation: string
//     idcard: string
//     idcardUrl: string
//   }
//   personTags: string[]
//   captureTime: string
//   // [key:string]:string
// }

export type YituResultDataType = {
  personInfoData?: ResultRowType[] // 身份信息
  data?: ResultRowType[] //抓拍信息 ,分组数据
}

export type YituResultType = "person" | "target"
//身份信息，抓拍信息
export type YituTargetResultProps = {
  type: YituResultType //身份信息，抓拍信息
  resultShowType?: resultShowType
  imageType?: "image" | "gait" //以图类型，图片/步态
  pageSize?: number
  data?: ResultRowType[]
  resultData?:ApiResponse<ResultRowType[]>
  onCheckedChange?: ({ cardData, checked }: { cardData: ResultRowType, checked: boolean, type: YituResultType }) => void;
  checkedList?: ResultRowType[];
  onGroupFilterChange?: ({ filterTags }: GroupFilterCallBackType) => void;
  onlyIncludeVehicleFlag?: boolean;
  onlyIncludeCarFlag?:boolean
  resultHeaderRightTemplate?:React.ReactNode
  resultHeaderFilterTemplate?:React.ReactNode
  groupLoading?:boolean
}

export interface ajaxFormDataType extends FormDataType {
  featureList: (TargetFeatureItem | ResultRowType)[]
}


