import ajax from '@/utils/axios.config'

const api = {

  common: {
  },

  // 列表模板
  getList: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/table/get_list',
      data
    });
  },

  // 删除
  delOne: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/table/del_one',
      data
    });
  },
}

export default {
  ...api
}
