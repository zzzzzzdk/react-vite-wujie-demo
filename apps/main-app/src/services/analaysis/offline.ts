import ajax from '@/utils/axios.config'

const api = {

  // 获取离线任务列表
  getJobList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "get",
      url: `/v1/offline/job/list`,
      data: data
    });
  },

  // 获取任务中的文件
  getFileList: function <T, U>(data?: T, signal?: AbortSignal) {
    return ajax<U>({
      method: "get",
      url: '/v1/offline/file/list',
      data: data,
      signal: signal
    });
  },

  // 增加离线任务
  addJob: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/offline/job/add',
      data: data
    });
  },
  // 删除任务
  delJob: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/offline/job/delete',
      data: data
    });
  },
  // 修改离线任务状态
  updateJob: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/offline/job/update',
      data: data
    });
  },
  // 增加文件
  addFile: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/offline/file/add',
      data: data
    });
  },
  // 删除文件
  delFile: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/offline/file/delete',
      data: data
    });
  },
  // 更新文件信息
  updateFile: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/offline/file/update',
      data: data
    });
  },
  // 下载文件
  getDownloadFile: function <T, U>(data?: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/offline/file/install',
      data: data
    });
  },
  // 播放视频
  getVideoUrl: function <T, U>(data?: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/offline/video/play',
      data: data
    });
  },
  // 获取离线压缩包图片
  getOfflineImages: function <T, U>(data?: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/offline/images/show',
      data: data
    });
  },
  // 获取所有任务及对应的文件
  getAllOfflineFile: function <T, U>(data?: T) {
    return ajax<U>({
      method: "get",
      url: "/v1/offline/job/all",
      data: data,
    });
  },
}

export default {
  ...api
}
