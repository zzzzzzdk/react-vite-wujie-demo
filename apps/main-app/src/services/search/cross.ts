import { TargetFeatureItem } from "@/config/CommonType"
import ajax from "@/utils/axios.config"

const api = {
  // 跨镜追踪taskid
  getCrossTaskId: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/assign-taskid',
      data
    })
  },
  // 跨镜追踪结果
  getCrossResult: function <U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/multi-source-track',
      data
    })
  },
  // 获取过滤名单
  getFilterate: function <U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/list-filter-item',
      data
    })
  },
  // 添加过滤名单
  addFilterate: function <U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/add-filter-item',
      data
    })
  },
  // 删除过滤名单
  delFilterate: function <U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/del-filter-item',
      data
    })
  },
  // 清理缓存数据
  clearCache: function <U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/clear-cache',
      data
    })
  },
  // 实时跨镜追踪
  getRealTimeTracking: function<U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/cross-source-track',
      data
    })
  },
  // 实时跨镜追踪列表接口
  getRealTimeTrackingList: function<U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/cross-source-track/list',
      data
    })
  },
  // 跨境追踪添加拓展目标记录日志
  realTimeTrackingAddTarget: function<U, T>(data: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/comparison/add-target',
      data
    })
  },
}

export default {
  ...api
}
