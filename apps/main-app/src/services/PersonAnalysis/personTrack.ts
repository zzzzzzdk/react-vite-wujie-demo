import ajax from '@/utils/axios.config'

const api = {
  // 查询车辆轨迹数据
  getPersonTracks: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: `/v1/trajectory/face`,
      data
    });
  }
}

export default {
  ...api
}
