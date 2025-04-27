import services from "@/services";
import dayjs from 'dayjs'
import store from "@/store";
import { UserInfoState } from "@/store/slices/user";
import { TargetFeatureItem } from "@/config/CommonType";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { Message } from '@yisa/webui'
import routeData, { RoutesType } from "@/router/router.config";

export type ReportDataType = {
  type?: 'image' | 'none' | 'gait', // image会有大图数据；none无任何操作，只有日志字符串；
  data: {
    // 日志描述
    desc: string;
    /**
     * @description video是视频播放地址,图片是一组特征数据;
     */
    data?: string | TargetFeatureItem[] | TargetFeatureItem | ResultRowType | ResultRowType[];
  };
  // 系统名称
  sysText?: string;
  // 模块名称
  moduleName?: string;
}

// 上报参数格式
export interface ReportParams {
  // 用户信息
  userInfo: UserInfoState;
  // 上报时间
  reportTime: string;
  // 环境
  environment: string;
  // 上报日志数据
  logData: ReportDataType;
}


// 根据location.hash截取出当前路由
function getPathBayHash(str: string) {
  let path = ''
  try {
    if (str.indexOf('?') > -1) {
      path = str.split('#')[1].split('?')[0]
    } else {
      path = str.split('#')[1]
    }
  } catch (err) {
    console.log(err)
  }

  return path
}

// 根据路由找出对应模块名称
function getModuleNameByPath(path: string) {
  let moduleName = ''
  console.log(path)

  // 多层路由需要递归
  function recursion(data: RoutesType[]) {
    console.log(data)
    data.forEach(elem => {
      // elem.path可能会有不固定参数，采用include判断
      if (elem.path?.includes(path) && elem.breadcrumb && !!elem.breadcrumb.length) {
        const len = elem.breadcrumb.length
        elem.breadcrumb.forEach((bread, i) => {
          console.log(bread)
          moduleName = moduleName + (i === len - 1 ? bread.text : bread.text + ' - ')
        })
      } else {
        if (elem.children && elem.children.length) {
          recursion(elem.children)
        }
      }
    });
  }

  recursion(routeData)

  return moduleName
}


// 日志上报
export function logReport(logData: ReportDataType) {
  const { type = 'image', data } = logData
  const userInfo = store.getState().user.userInfo

  const locationHash = window.location.hash
  const modulePath = getPathBayHash(locationHash)
  console.log(modulePath)


  return new Promise((resolve, reject) => {
    services.log.logReport<ReportParams, any>({
      reportTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      environment: window.navigator.userAgent,
      userInfo,
      logData: {
        type,
        data,
        sysText: window.YISACONF.sys_text,
        moduleName: getModuleNameByPath(modulePath)
      }
    }).then(res => {
      console.log("上报成功")
      resolve(res)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

// 获取日志参数格式
export interface GetLogParams {
  token: string;
}

export function getLogData(params: GetLogParams) {
  return new Promise((resolve, reject) => {
    services.log.getLogData(params).then(res => {
      console.log("日志内容：", res)
      resolve(res)
    }).catch(err => {
      console.log(err)
      Message.error('获取日志失败！')
      reject(err)
    })
  })
}
