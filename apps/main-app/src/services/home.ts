import ajax from "@/utils/axios.config";
const api = {
  // 获取常用app
  getShortcuts: <T, U>() => {
    return ajax<U>({
      method: "get",
      url: "/api/v1/homepage/common-apps",
    });
  },
  // 编辑常用app
  updateShortcuts: <T, U>(data: T) => {
    return ajax<U>({
      method: "post",
      url: "/api/v1/homepage/common-apps",
      data,
    });
  },
  // 获取告警统计数据
  getWarningStatistic: <T, U>() => {
    return ajax<U>({
      method: "get",
      url: "/api/v1/homepage/warning-statistics",
    });
  },

  // 获取告警统计数据
  getWarningHistory: <T, U>() => {
    return ajax<U>({
      method: "get",
      url: "/api/v1/homepage/warning-history",
    });
  },
};
export default {
  ...api,
};
