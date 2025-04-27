import ajax from "@/utils/axios.config";
const api = {
  /* 全部消息 */
  getHistoryMessage: <T, U>() => {
    return ajax<U>({
      method: "post",
      url: "v1/notify/all",
    });
  },
  /* 未读消息 */
  getUnreadMessage: <T, U>() => {
    return ajax<U>({
      method: "post",
      url: "v1/notify/unread",
    });
  },
  /* 未读消息 */
  getUnreadMessageCount: <T, U>() => {
    return ajax<U>({
      method: "post",
      url: "v1/notify/unread-count",
    });
  },
};
export default {
  ...api,
};
