import ajax from '@/utils/axios.config'

const api = {

  // 获取落脚点分析数据
  getFootholdList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/parking/vehicle/locations`,
      data
    });
  },
  getFootholdDetailList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/parking/vehicle/info`,
      data
    });
  },
}

export default {
  ...api
}
