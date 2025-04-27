import ajax from "@/utils/axios.config";
const api = {
  // 获取日志数据
  getLogData: <T, U>(data: T) => {
    return ajax<U>({
      method: "get",
      url: "/v1/common/token/get",
      data
    });
  },
  // 日志上报
  logReport: <T, U>(data: T) => {
    return ajax<U>({
      method: "post",
      url: "/v1/common/log/post",
      data
    });
  },
};
export default {
  ...api,
};
