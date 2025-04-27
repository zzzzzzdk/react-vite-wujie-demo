import ajax from '@/utils/axios.config'
const api = {
  //纠错提交
  handleFeedback: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      // url:"/v1/judgement/twins/vehicle/list",
      url:window.YISACONF.pdm_host + '/api/pdm/v1/error-correction/error-correction',
      data
    });
  },
}
export default {
  ...api
}
