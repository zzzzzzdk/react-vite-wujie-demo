// 操作栏激活的modal弹窗
import { isArray } from "@/utils";
import { BaseFormData } from "../Deploy/AddDeployModal";
import pick from "@/utils/pick";
export interface DeployUserInfo {
  userUUID: string;
  userName: string;
  tel?: string;
  organizationName?: string;
}
export type DeployItem = {
  title: string; // 布控标题
  jobId: string | number; // 布控单号
  deployTimeType: DeployTime; // 时间类型
  timeRange?: {
    times?: [string, string];
    periods?: {
      times?: [string, string];
      dates?: [string, string];
    };
  }; // 布控时间   // 时间
  locationIds: string[]; // 点位范围
  locationCount?: number; //点位数量，用于解决locationIds太多卡顿的问题
  measure: Measure; // 采取措施
  createTime: string; // 创建时间
  createUser: DeployUserInfo; // 创建人
  approveTime: string; // 审批时间
  approveUser: DeployUserInfo; // 审批人
  receiveUsers: DeployUserInfo[]; // 接收人
  status: DeployStatus | CloseType; // 布控状态
  monitorCount?: string | number; // 布控结果,有几结果
  reason?: string; // 布控原因
  closeReason?: string; // 关闭原因
  closeTime?: string; // 关闭时间
  approveStatus?: 1 | 2; // 1通过、2:驳回
  approveReason?: string; // 审批原因
  bkType: BkType; // 布控类型
  monitorList: BaseFormData[]; // 原始布控目标
  permissions: ("view" | "edit" | "undo" | "approval" | "close" | "redeploy")[] //权限数组 "view", "edit", "undo", "approval", "close", "redeploy"
  monitorItemCount: number; // 布控目标数量
};

// prettier-ignore
export type TextSetting = {
  text: string;   // 统一配置文字，
  iconfont?: string;  // icon-font
  backgroundColor?: string; // 背景颜色
};
/*======================================布控详情======================================*/
/* 一个布控（布控单）对应多个布控目标, 一个布控目标对应多个布控对象 */

/* 传入相应的对象类型，根据key来配置显示文字、图标、颜色 */
// TODO 改成Map manupulation
type Name2TextSetting<T> = Record<keyof T, TextSetting>;
export enum Measure {
  // 关注
  Concern = 1,
  // 抓捕
  Capature = 2,
  // 管控
  Control = 3,
}
export const MeasureTextSetting: Name2TextSetting<typeof Measure> = {
  Concern: {
    text: "关注",
  },
  Capature: {
    text: "抓捕",
  },
  Control: {
    text: "管控",
  },
};
/*======================================布控状态======================================*/

export type DeployStatus = "reviewing" | "monitoring" | "close";
export const DeployStatusTextSetting: Record<DeployStatus, TextSetting> = {
  close: {
    text: "已关闭",
    iconfont: "yishibai",
    backgroundColor: "#FF5B4D1A",
  },
  monitoring: {
    text: "布控中",
    iconfont: "bukongzhong",
    backgroundColor: "#FF8D1A1A",
  },
  reviewing: {
    text: "待审批",
    iconfont: "daishenpi",
    backgroundColor: "#3377FF1A",
  },
};
/*======================================布控类型======================================*/
export enum BkType {
  All = -1, // 不限
  Target = 1, // 目标布控
  // Time = 2, // 事件布控
}
export const BkTypeTextSetting: Name2TextSetting<typeof BkType> = {
  All: {
    text: "不限",
  },
  Target: {
    text: "目标布控",
  },
  // Time: {
  //   text: "事件布控",
  // },
};
/*======================================布控目标&布控对象======================================*/
// 布控目标类型
export enum DeployTargetType {
  Vehicle, // 车辆布控
  Identity, // 证件号码布控
  Picture, // 人脸布控
  // PhoneNumber, // 手机号码布控
}

let DeployTargetPickKeys: string[] = []
// 根据YISACONF的deployTypeConfig，判断显示不显示人脸/车辆布控
if (window.YISACONF.systemControl?.deployTypeConfig && isArray(window.YISACONF.systemControl?.deployTypeConfig)) {
  if (window.YISACONF.systemControl.deployTypeConfig.every(conf => conf === 'face' || conf === 'picture')) {
    DeployTargetPickKeys = ["Identity", "Picture"]
  } else if (window.YISACONF.systemControl?.deployTypeConfig.every(conf => conf === 'vehicle')) {
    DeployTargetPickKeys = ["Vehicle"]
  } else {
    DeployTargetPickKeys = ["Vehicle", "Identity", "Picture"]
  }
} else {
  DeployTargetPickKeys = ["Vehicle", "Identity", "Picture"]
}
export { DeployTargetPickKeys };
console.log(DeployTargetPickKeys)

const DeployTargetText: Name2TextSetting<
  typeof DeployTargetType
> = {
  Vehicle: {
    text: "车辆布控",
    iconfont: "cheliangxinxibukong",
  },
  Identity: {
    text: "人员布控",
    iconfont: "zhengjianhaomabukong",
  },
  Picture: {
    text: "人脸布控",
    iconfont: "tupianbukong",
  },
};

export const DeployTargetTextSetting = pick(DeployTargetText, DeployTargetPickKeys)

/*======================================关闭原因======================================*/
export type CloseType = "close" | "undo" | "reject" | "expire";
export const CloseTextSetting: Record<CloseType, string> = {
  expire: "过期",
  undo: "撤销",
  reject: "驳回",
  close: "手动关闭",
};
export enum ThresholdType {
  Dynamic, // 动态抓拍
  Driving, // 驾乘抓拍
}
export const ThresholdTypeTextSetting: Name2TextSetting<typeof ThresholdType> =
{
  Dynamic: {
    text: "动态抓拍阈值",
  },
  Driving: {
    text: "驾乘抓拍阈值",
  },
};

/**
 * @description 告警方式
 */
export enum AlarmType {
  System = 1, // 系统
  APP = 2, // app
  Message = 3, // 短信
}

export const AlarmTypeTextSetting: Name2TextSetting<typeof AlarmType> = {
  System: {
    text: "系统告警",
  },
  APP: {
    text: "APP告警",
  },
  Message: {
    text: "短信",
  },
};
// prettier-ignore
export enum DeployTime {
  Short = 1,   // 短期
  Forever = 2, //长期
}
export const DeployTimeTextSetting: Name2TextSetting<typeof DeployTime> = {
  Short: { text: "短期布控" },
  Forever: {
    text: "永久布控",
  },
};

export const IdentityDeployThresholdText = {
  dynSysThreshold: "动态抓拍系统预警阈值",
  dynSmsThreshold: "动态抓拍短信预警阈值",
  dynAppThreshold: "动态抓拍APP预警阈值",
  driSysThreshold: "驾乘抓拍系统预警阈值",
  driSmsThreshold: "驾乘抓拍短信预警阈值",
  driAppThreshold: "驾乘抓拍App预警阈值",
};
