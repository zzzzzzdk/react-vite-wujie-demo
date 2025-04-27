import ajax from '@/utils/axios.config'

const api = {
  // 查询车辆轨迹数据
  getVehicleTracks: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: `/v1/trajectory/vehicle`,
      // url: `http://192.168.12.89:8000/api/fusion/v1/trajectory/vehicle`,
      data
    });
  }
}

export default {
  ...api
}
