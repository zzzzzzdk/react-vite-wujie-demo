import ajax from '@/utils/axios.config'

const api = {

  // 获取初次入城数据
  getInitialList: function <U, T>(data?: U, hanleGlobalLoading?: (loading: boolean) => void) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/targetretrieval/city-first`,
      data,
      onGlobalLoading: hanleGlobalLoading
    });
  }
}

export default {
  ...api
}
