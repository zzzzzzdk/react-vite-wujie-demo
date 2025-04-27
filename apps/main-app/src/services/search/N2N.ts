import ajax from "@/utils/axios.config";

// 获取任务列表
const getTaskList = <T, U>(data: T) => {
  return ajax<U>({
    url: "/v1/comparison/nvsn/show/list",
    method: "post",
    data,
  });
};
// 删除任务
const deleteTaskList = <T, U>(data: T) => {
  return ajax<U>({
    url: "/v1/comparison/nvsn/remove",
    method: "post",
    data,
  });
};

// 获取任务结果
const getTaskResult = <T, U>(data: T) => {
  return ajax<U>({
    url: "/v1/comparison/nvsn/show/result",
    method: "post",
    data,
  });
};

// 获取任务结果
const addN2NTask = <T, U>(data: T) => {
  return ajax<U>({
    url: "/v1/comparison/nvsn/add",
    method: "post",
    data,
  });
};


export default {
  getTaskList,
  deleteTaskList,
  getTaskResult,
  addN2NTask
};
