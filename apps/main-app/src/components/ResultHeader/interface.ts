import React from "react";
import { ApiResponse } from "@/services";
import { DefaultFilterTypeOptions, GroupFilterCallBackType } from "../ResultGroupFilter/interface";
import { TargetType } from "@/config/CommonType";
import { resultShowType } from "@/pages/Search/Target/interface";

export default interface ResultHeaderProps {
  pageType?: "record" | "target";
  className?: string;
  style?: React.CSSProperties;
  resultData?: ApiResponse<any>;
  leftSlot?: React.ReactNode | null;
  rightSlot?: React.ReactNode | null;
  onGroupFilterChange?: (data: GroupFilterCallBackType) => void;
  groupFilterDisabled?: boolean;
  targetType?: TargetType;
  defaultFilterTypeOptions?: DefaultFilterTypeOptions,
  needgroupchoose?: boolean;//是否显示选择分组
  needFilterChoose?: boolean;
  resultShowType?: resultShowType;
}
