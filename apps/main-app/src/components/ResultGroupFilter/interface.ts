import { GroupFilterItem, TargetType } from "@/config/CommonType";
import React from "react";

export type GroupFilterCallBackType = {
  // groupActive?: boolean;
  filterTags?: GroupFilterItem[];
}
/**
 * @description 过滤条件类型
 */
export type DefaultFilterTypeOptions = {
  text: string;
  value: string;
  targetType: string;
}[]

export interface ResultGroupFilterChooseProps {
  className?: string;
  style?: React.CSSProperties;
  // groupActive?: boolean;
  onChange?: (data: GroupFilterCallBackType) => void;
  disabled?: boolean;
  targetType?: TargetType;
  defaultFilterTypeOptions?: DefaultFilterTypeOptions
  needgroupchoose?: boolean//是否可选择分组
  needFilterChoose?: boolean; // 是否可选择筛选
}

export interface ResultGroupFilterShowProps {
  className?: string;
  style?: React.CSSProperties;
  onChange?: (data: GroupFilterCallBackType) => void;
}
