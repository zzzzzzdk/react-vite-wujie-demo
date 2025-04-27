import ajax from "@/utils/axios.config";

const api = {
  // 获取落脚点分析数据
  getFakeCloneList: function <U, T>(data?: U, type?: string, hanleGlobalLoading?: (loading: boolean) => void) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/counterfeit/vehicle/${type}`,
      data,
      onGlobalLoading: hanleGlobalLoading
    });
  },
};

export default {
  ...api,
};
