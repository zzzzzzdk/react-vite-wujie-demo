import ajax from '@/utils/axios.config'
const api = {
  // 获取线索库任务列表
  getClueList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "get",
      url: `/v1/clue/list`,
      data: data
    });
  },
  //新增线索库案件
  // addClue: function <T, U>(data: T) {
  //   return ajax<U>({
  //     method: "post",
  //     url: '/clue/job/add',
  //     data: data
  //   });
  // },
  addClue: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/clue/list',
      data: data
    });
  },
  //删除线索库案件
  delClue: function <T, U>(data: T) {
    return ajax<U>({
      method: "delete",
      url: '/v1/clue/list',
      data: data
    });
  },
  //更新线索库
  // 二级-分组
  updateGroup: function <T, U>(data: T) {
    return ajax<U>({
      method: "put",
      url: '/v1/clue/list',

      // method: "post",
      // url: '/v1/clue/listd',
      data: data
    });
  },
  //获取信息列表
  getInfo: function <U, T>(data: U) {
    return ajax<T>({
      method: 'get',
      url: '/v1/clue/details',
      data: data
    })
  },
  getlocation:function(){
    return ajax({
      method:'get',
      url:'/v1/common/region',
    })
  },
  //修改分组
  changeGroup: function <T, U>(data: T) {
    return ajax<U>({
      // method:'post',
      method: 'put',
      url: '/v1/clue/details',
      data: data
    })
  },
  //删除info数据
  deleteInfo: function <T, U>(data: T) {
    return ajax<U>({
      method: 'delete',
      url: '/v1/clue/details',
      data: data
    })
  },
  // deleteInfo:function<T,U>(data:T){
  //   return ajax<U>({
  //     method:'post',
  //     url:'/clue/delete',
  //     data:data
  //   })
  // }
  //加入线索库
  joinClue: function <T, U>(data: T) {
    return ajax<U>({
      method: 'post',
      url: '/v1/clue/details',
      data: data
    })
  },
}

export default {
  ...api
}
