import { PlateTypeId } from "@/components/FormPlate/interface";
import { GroupFilterItem } from "@/config/CommonType";
import { ResultRowType, TimeRangeType } from "@/pages/Search/Target/interface";
import type { Dayjs } from "dayjs";

export type LabelManageFormData = {
  beginDate: string;
  endDate: string;
  beginTime: Dayjs | null | string;
  endTime: Dayjs | null | string;
  timeType: string; // 'time' | 'range'
  labelSetIds: number[];
  labelIds: string[];
  remarks: string;
  creatorIds: string[];
  creatorDepartIds: string[];
  labelTypeIds: string[];
  labelCount: string[];
  timeRange?: TimeRangeType;
};

// 标签结果数据
export interface ResultLabelItem {
  // 标签集
  labelSetName: string;
  // 标签集Id
  labelSetId: number;
  // 标签名称
  labelName: string;
  // 标签Id
  labelId: string;
  // 备注
  remarks: string;
  // 目标类型
  labelType: string;
  // 目标类型id
  labelTypeId: "personnel" | "spaceTime" | 'vehicle'
  // 目标总数
  labelCount: number;
  // 是否可布控
  canDeploy: 'yes' | 'no'
  // 创建人
  creator: string;
  // 创建人部门
  creatorDepart: string;
  // 更新时间
  updateTime: string;
  // 标签集可见权限
  visiblePermissionsSet: PermissionsType;
  // 标签集管理权限
  managePermissionsSet: PermissionsType;
  // 部分可见人员
  visiblePersonsSet: string[];
  // 部分管理人员
  managePersonsSet: string[];
  // 标签可见权限
  visiblePermissions: PermissionsType;
  // 标签管理权限
  managePermissions: PermissionsType;
  // 标签部分可见人员
  visiblePersons: string[];
  // 标签部分管理人员
  managePersons: string[];
  // 标签颜色
  labelColorId: number;
  labelColorName: string;
  // 更新规则类型
  ruleType?: 'manual' | 'rule';
  // 规则配置
  // 用户标签权限
  authority?: 'visible' | 'manage';
  // 用户标签集权限
  authoritySet: 'visible' | 'manage';
  // 系统自带标签
  isSystem: 0 | 1;
}

export type PageSizeConfig = {
  pageNo: number;
  pageSize: number;
};

export type PermissionsType = "all" | "part";

export type SelectDataType = { [key: string]: { value: string | number, label: string }[] }

export type LabelManageFormProps = {
  onSearch: (formData: LabelManageFormData) => void;
  loading: boolean;
  selectData?: SelectDataType;
};

// export type PersonItemType = {
//   id: string;
//   name: string;
// }