import { SortField, SortOrder } from '@/config/CommonType'
import React from 'react'
export type SortItemType = { label: string | React.ReactNode, value: any, order?: SortOrder }
export type FormRadioGroupType = {
  style?: React.CSSProperties;
  className?: string
  disabled?: boolean
  isSort?: boolean
  yisaData: SortItemType[]       // 数据数组 {label:"",value:"",order?:"desc"}
  defaultOrder?: SortOrder
  defaultValue: string
  onChange: (value: any, sort?: SortOrder) => void
}
