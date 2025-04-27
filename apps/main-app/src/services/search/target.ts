import ajax from '@/utils/axios.config'

const api = {
  // 请求运维管理点位接口location
  getTargetResult: function <U, T>(data: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/targetretrieval/${data['targetType']}`,
      data: data
    });
  },

  // 同画面目标
  analyzeSameScene: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/api/analysis/scene_peer_analyze',
      data: data
    });
  },
  // 步态目标检索
  getPedestrianGait: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/targetretrieval/pedestrian-gait',
      data: data
    });
  },
}

export default {
  ...api
}
