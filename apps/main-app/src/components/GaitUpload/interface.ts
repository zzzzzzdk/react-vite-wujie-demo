import React, { ReactNode } from "react";
import { SortField, SortOrder, TargetFeatureItem } from "@/config/CommonType";
import { LocationListType } from '@/components/LocationMapList/interface'
import { ResultRowType } from "@/pages/Search/Target/interface";

//  参数列表
export type GaitFormDataType = {
  isGait:1
  timeType: string;
  beginDate: string;
  beginTime?:string
  endTime?:string
  endDate: string;
  offlineBeginDate: string;
  offlineEndDate: string;
  checkedLocationIds: string[]
  checkedLocationGroupIds: string[]
  checkedOfflineIds: string[],
  pageNo?:number
  pageSize?:number
  sort?:{
    field:SortField
    order:SortOrder
  }
}

export default interface GaitUploadProps {
  className?: string;
  /**
   * @description 数量限制
   * @default 5
   */
  limit?: number;
  /**
   * @description 禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * @description 描述
   * @default default
   */
  formData?: any;
  /**
   * @description 特征列表
   * @default []
   */
  featureList?: ResultRowType[];
  /**
   * @description 特征列表变化回调
   */
  onChange?: (featureList: ResultRowType[]) => void;
  /**
   * @description 内部插槽
   * @default null
   */
  innerSlot?: React.ReactNode | (() => React.ReactNode);
  /**
   * @description 默认tab类型
   * @default "region"
   */
  defaultListType?: LocationListType,
}
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 22 }
];


type ExtractArrayProperty<T extends Record<string, any>[], K extends keyof T[0]> = T[number][K];

// 提取 users 数组中所有对象的 id 属性值的并集
type UserIds = ExtractArrayProperty<typeof users, 'id'>; // 类型为 number

