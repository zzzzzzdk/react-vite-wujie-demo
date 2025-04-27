import ajax from '@/utils/axios.config'
const api = {
  // 获取落脚点分析数据
  getDoublecarList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      // url:"/v1/judgement/twins/vehicle/list",
      url:"/v1/judgement/twins/vehicle/list",
      data
    });
  },
}
export default {
  ...api
}
