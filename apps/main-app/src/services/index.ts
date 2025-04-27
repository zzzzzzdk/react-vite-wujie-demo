import ajax, { ApiResponse } from "@/utils/axios.config";
import card from "./card";
import location from "./location";
import exportReq from './exportReq'
import search from './search'
import analaysis from './analaysis'
import clue from "./clue";
// import one2one from "./one2one";
import vehicleAnalysis from './vehicleAnalysis'
import deploy from "./deploy";
import PersonAnalysis from "./PersonAnalysis";
import feedback from "./feedback";
import errorSubmit from "./errorSubmit";
import notify from "./notify";
import log from "./log";
import login from "./login";
import homepage from "./home";
/**
 * 公共接口
 */
const api = {
  common: {
    imageUploadUrl: window.YISACONF.api_host + "/v1/common/analysisImage",
    //车辆模板请求地址,车辆档案上传地址
    vehicleTemplateUrl: window.YISACONF.api_host + '/v1/vehicle-archives/excel',
    vehicleProgressUrl: window.YISACONF.api_host + '/v1/vehicle-archives/process',
    // 人员档案模板请求地址
    personTemplateUrl: window.YISACONF.api_host + '/v1/personArchives/excel',
    // 标签管理模板请求地址
    labelTemplateUrl: window.YISACONF.api_host + '/v1/label-manage/excel',
  },

  // TODO：错误信息上报
  postError: function <T, U>(url: string, data: T) {
    return ajax<U>({
      method: "post",
      url: url,
      data: data,
    });
  },

  changeStyle: function <T>(data: T) {
    return ajax({
      method: "post",
      url: "/v1/common/save-theme",
      data,
    });
  },

  // 获取用户信息
  getUserInfo: function () {
    return ajax({
      method: "get",
      url: `${window.YISACONF.pdm_host || ''}/api/pdm/v1/common/route-menu`,
      data: {
        sys: window.YISACONF.sys
      },
    });
  },

  // 获取系统配置
  getSysConfig: function () {
    return ajax({
      method: "get",
      url: `${window.YISACONF.pdm_host || ''}/api/pdm/v1/search-condition/setting`,
      data: {
        // module: window.YISACONF.sys,
        type: 'all', // 1 时间 2 条件 ， all表示1和2
      }
    });
  },

  // 退出登录
  // logout: function () {
  //   return ajax({
  //     method: "post",
  //     url: "/common/logout",
  //     data: {},
  //   });
  // },

  // 获取点位列表
  // getLocation: function () {
  //   return ajax({
  //     method: "post",
  //     url: "/common/get_location",
  //   });
  // },


  // 上传图片
  uploadImg: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: this.common.imageUploadUrl,
      data,
    });
  },

  // 保存上传历史
  saveUploadHistory: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: window.YISACONF.pdm_host + "/api/pdm/v1/common/upload-image",
      data,
    });
  },

  // 查询上传历史
  getUploadHistory: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: window.YISACONF.pdm_host + "/api/pdm/v1/common/show-history",
      data,
    });
  },

  // 截图查询
  getClippingFeature: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: "/v1/common/upload_analysis_image_clipping",
      data,
    });
  },

  // 查询车辆型号数据
  getBMY: function <U>() {
    return ajax<U>({
      method: "get",
      url: `${window.YISACONF.pdm_host || ''}/api/pdm/v1/common/bmy`,
    });
  },

  // 查询热门车型数据
  getHotBrands: function <U>() {
    return ajax<U>({
      method: "get",
      url: `${window.YISACONF.pdm_host || ''}/api/pdm/v1/common/hot-brands`,
    });
  },

  //获取步态数据
  getGaitData: function <T, U>(data?: T, url?: string) {
    return ajax<U>({
      method: "post",
      url: url || "/v1/comparison/onevsmulti/pedestrian",
      data,
    });
  },
  // 查询关联目标
  getConnectData: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: "/v1/targetretrieval/associatetarget",
      data
    });
  },

  // 验证上传
  verifyUpload: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: "/v1/common/upload/verify",
      data: data
    });
  },

  uploadFileChunk: function <T, U>(
    data: {
      data?: T,
      onUploadProgress?: (ev: ProgressEvent) => void,
      signal?: AbortSignal
    }
  ) {
    return ajax<U>({
      method: "post",
      url: "/v1/common/upload/chunk",
      data: data.data,
      onUploadProgress: data.onUploadProgress,
      signal: data.signal
    });
  },

  // 通知文件分片合并
  mergeUpload: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: "/v1/common/upload/merge",
      data: data
    });
  },

  // 获取磁盘可用空间
  getDiskFree: function <U>() {
    return ajax<U>({
      method: "get",
      url: `/v1/common/disk/free`,
    });
  },

  // 获取标签
  getLabels: function <T, U>(data?: T) {
    return ajax<U>({
      method: "get",
      // url: `${window.YISACONF.pdm_host || ''}/api/pdm/v1/label-manage/label-tree`,
      url: `/v1/label-manage/label-tree`,
      data,
    });
  },

  // 录像回放请求
  getVideo: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: `/v1/common/playback`,
      data,
    });
  },

  // 生成轨迹添加，获取id
  getTrackId: function <T, U>(data?: T) {
    return ajax<U>({
      method: "post",
      url: `/v1/trajectory/track/add`,
      data,
    });
  },
  // 生成轨迹根据id获取
  getTrackById: function <T, U>(data?: T) {
    return ajax<U>({
      method: "get",
      url: `/v1/trajectory/track/get`,
      data,
    });
  },

  // 导入数智万象
  importCube: function <T, U>(url: string, data?: T) {
    return ajax<U>({
      method: "post",
      url: url || `/v1/common/cube/import`,
      data,
    });
  },
  // 上传参数
  uploadTokenParams: function <T, U>(data?: T, url?: string) {
    return ajax<U>({
      method: "post",
      url: url || `/v1/common/token/put`,
      data,
    });
  },
  // 读取参数
  getTokenParams: function <T, U>(data?: T, url?: string) {
    return ajax<U>({
      method: "get",
      url: url || `/v1/common/token/get`,
      data,
    });
  },
  //
  doAppLogin: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `${window.YISACONF.iam_host || ''}/v1/admin/login/app_login`,
      data
    });
  },
  //
  getLoadPbk: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "get",
      url: `${window.YISACONF.iam_host || ''}/v1/admin/get_load_pbk`,
      data
    });
  },
  //获取验证码
  getVerifyCode:function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "get",
      url: `${window.YISACONF.iam_host || ''}/v1/admin/login/refresh_verify_code`,
      data
    });
  },
};

export default {
  card: card,
  location,
  ...search,
  ...analaysis,
  ...vehicleAnalysis,
  ...api,
  ...clue,
  deploy,
  ...PersonAnalysis,
  ...exportReq,
  ...feedback,
  ...errorSubmit,
  notify,
  log,
  homepage
  // ...login
};
export type { ApiResponse };
