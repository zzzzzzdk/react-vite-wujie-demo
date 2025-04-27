import ajax from '@/utils/axios.config'

const api = {

  // 请求运维管理点位接口location
  getLocationList: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: `${window.YISACONF.pdm_host}/api/pdm/v1/common/location`,
      data
    });
  },
  // 请求运维管理点位接口：区域点位数量
  getLocationVisual: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: `${window.YISACONF.pdm_host}/api/pdm/v1/common/location-count`,
      data
    });
  },

  // 请求离线任务
  getOfflineList: function <T, U>(data?: T) {
    return ajax<U>({
      method: "get",
      url: '/common/offline_list',
      data
    });
  },

  // 获取周边范围点位
  getRangeLocationList: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: `${window.YISACONF.pdm_host}/api/pdm/v1/common/nearby-location`,
      data
    });
  },
}

export default {
  ...api
}
