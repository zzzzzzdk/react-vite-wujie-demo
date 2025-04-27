import ajax from "@/utils/axios.config";

const api = {
  // 查询车辆轨迹数据
  getVehicleData: function <U, T>(data: U, hanleGlobalLoading?: (loading: boolean) => void) {
    return ajax<T>({
      method: "post",
      url: "/v1/targetretrieval/frequent_pass",
      data,
      onGlobalLoading: hanleGlobalLoading
    });
  },
};

export default {
  ...api,
};
