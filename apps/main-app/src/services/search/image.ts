import { TargetFeatureItem } from "@/config/CommonType"
import ajax from "@/utils/axios.config"

const api = {

  // 以图检索
  getCatureImage: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/comparison/image-search',
      data
    })
  },
  // getPersonIdentify: function <T, U, K = any>(data: T) {
  //   return ajax<U, K>({
  //     method: "post",
  //     url: '/v1/comparison/person-identity',
  //     data
  //   })
  // },
  //旧
  getImageList: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/comparison/image-search',
      data
    })
  },
  // 去获取身份落地
  getPersonIdentify: function <T, U, K = any>(data: T, hanleGlobalLoading?: (loading: boolean) => void) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/comparison/person-identity',
      data, 
      onGlobalLoading: hanleGlobalLoading
    })
  },
  // 图片检索-身份落地-(档案数据)
  getPersonIdCard: function <T, U, K = any>(data: T, hanleGlobalLoading?: (loading: boolean) => void) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/comparison/person-idcard',
      data, 
    })
  },
  // 图片检索-身份落地-(聚类数据)
  getPersonCluster: function <T, U, K = any>(data: T, hanleGlobalLoading?: (loading: boolean) => void) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/comparison/person-cluster',
      data, 
    })
  },
  // 视频步态解析进度
  getVideoAnalysisProgress: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/analysis/progress',
      data
    })
  },

}

export default {
  ...api
}
