import ajax from '@/utils/axios.config'

const api = {
  // 增加离线任务
  addJob: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/history/job/add',
      data: data
    });
  },
  // 删除任务
  delJob: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/history/job/delete',
      data: data
    });
  },
  // 修改离线任务状态
  updateJob: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/history/job/update',
      data: data
    });
  },
  // 获取任务列表
  getJobList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "get",
      url: `/v1/history/job/list`,
      data: data
    });
  },
  // 获取历史视频点位
  getFileList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "get",
      url: '/v1/history/video/list',
      data: data,
    });
  },
  // 添加历史视频点位
  addVideoLocation: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/history/video/add',
      data: data
    });
  },
  // 删除历史视频点位
  deleteVideoLocation: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/history/video/delete',
      data: data
    });
  },
}

export default {
  ...api
}
