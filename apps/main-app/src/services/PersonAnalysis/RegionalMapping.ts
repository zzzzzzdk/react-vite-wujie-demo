import ajax from "@/utils/axios.config";

// 获取车辆信息列表数据
export default {
  getRegionalMappingList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: "/v1/judgement/regional/face/suspicious-list",
      data,
    });
  },
  getRegionalMappingDetail: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/regional/face/suspicious-detail`,
      data,
    });
  },
  getRegionalMappingPeerList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: "/v1/judgement/regional/face/accomplices-list",
      data,
    });
  },
  getRegionalMappingPeerDetail: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/regional/face/accomplices-detail`,
      data,
    });
  },
};
