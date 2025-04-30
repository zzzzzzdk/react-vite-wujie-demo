import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type TokenType = string

export interface UserInfoState {
  id?: string; // 用户 id
  account?: string; // 用户账号
  name?: string; // 用户姓名
  phone?: string; // 联系电话
  lastLoginIp?: string; // 最后登录 ip
  lastLoginTime?: string; // 最后登录时间
}

export interface MicroAppConfig {
  name: string;
  url: string;
  path?: string;
  baseroute?: string;
  microType?: "react" | "vue";
  embedType?: "inlayout" | "outlayout" | "partial";
}

export interface ItemMenu {
  name: string;
  text: string;
  icon?: string;
  path: string;
  micro?: MicroAppConfig;
  children?: Array<ItemMenu>;
}

// export interface SysConfigItem {
//   id?: number;
//   // 系统名
//   module?: string;
//   // 1 时间 2 条件 3 围栏里面的布控所需类别(2级级联 需要配合 f_id使用)
//   type?: string;
//   // 页面名称
//   pageName?: string;
//   // 页面名称
//   pageText?: string;
//   // 类别字段 threshold、timeRange
//   categoryName?: string;
//   // 阈值和时间的描述
//   categoryText?: string;
//   // 当前的最小值
//   min?: string;
//   // 当前的默认值
//   default?: string;
//   // 当前的最大值
//   max?: string;
//   // 1: %    2: 次   3: 秒   4: 小时   5: 天
//   unitType?: number;
// }

export type SystemCommonConfig = {
  min?: string;
  default?: any;// string | string[]
  max?: string;
}

export type catagoryConfig =
  | "timeRange"
  | "threshold"
  // 人员档案
  | "inquiryTime"
  | "interval"
  | "peerSpot"
  | "logTimeRange"
  | "peerTimeRange"
  | "threshold"
  //初次入城-回溯时长
  | "backtrackTime"
  | "nighttime"
  | "percentage"
  | "passingNum"
  //同行分析
  | "interval"
  | "peerSpot"
  | "minCount"
  //落脚点分析
  | "footholdTime"
  | "footholdSpot"
  // n2n
  | "thresholdRange"
  // 布控
  | "bicycleThreshold"
  | "faceThreshold"
  | "pedestrianThreshold"
  | "tricycleThreshold"
  | "vehicleThreshold"
  //大图弹窗-拓展时长
  | "expandTime"


export interface SysConfigItem {
  // [key: string]: {
  //   time_range?: {
  //     min?: string;
  //     default?: string;
  //     max?: string;
  //   },
  //   threshold?: {
  //     min?: string;
  //     default?: string;
  //     max?: string;
  //   },
  //   nighttime?:{
  //     min?: string;
  //     default?: [string, string];
  //     max?: string;
  //   }
  // }
  [key: string]: Record<catagoryConfig, SystemCommonConfig>
}

interface State {
  YSTOKEN: TokenType;
  userInfo: UserInfoState;
  route: string[];
  menu: Array<ItemMenu>;
  sysConfig: SysConfigItem;
  userAuth: { [key: string]: any }
}

const initialState: State = {
  userInfo: {},
  YSTOKEN: "",
  route: [],
  menu: [],
  sysConfig: {},
  userAuth: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<State>) => {
      state.userInfo = action.payload.userInfo || {};
      state.menu = action.payload.menu || [];
      state.route = action.payload.route || [];
      state.userAuth = action.payload.userAuth || {}
    },
    setUserToken: (state, action: PayloadAction<TokenType>) => {
      state.YSTOKEN = action.payload
    },
    setSysConfig: (state, action: PayloadAction<SysConfigItem>) => {
      state.sysConfig = action.payload
    },
  },
})

export const { setUserInfo, setUserToken, setSysConfig } = userSlice.actions
export default userSlice.reducer
