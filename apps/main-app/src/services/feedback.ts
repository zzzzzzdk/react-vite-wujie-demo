import ajax from '@/utils/axios.config'
const api = {
  // 获取落脚点分析数据
  handleFeedback: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      // url:"/v1/judgement/twins/vehicle/list",
      url:window.YISACONF.pdm_host + '/api/pdm/v1/feedback/feedback',
      data
    });
  },
}
export default {
  ...api
}
