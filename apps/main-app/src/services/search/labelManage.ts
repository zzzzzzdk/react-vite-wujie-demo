import { TargetFeatureItem } from "@/config/CommonType"
import ajax from "@/utils/axios.config"

const api = {
  // 获取下拉select数据
  getSelectData: function <U, T>(data?: U) {
    return ajax<T>({
      method: "get",
      url: "/v1/label-manage/select",
      data
    })
  },
  // 获取标签列表
  getLabelList: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/label-manage/list',
      data
    })
  },
  // 新建、编辑标签集
  updateLabelSet: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/label-manage/label-set',
      data
    })
  },
  // 新建、编辑标签
  updateLabel: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/label-manage/label',
      data
    })
  },
  // 新建、编辑标签
  delLabel: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/label-manage/label/del',
      data
    })
  },
  // 添加目标
  addTarget: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/label-manage/add-target',
      data
    })
  },
  // 验证标签集名称是否存在
  checkLabelSetName: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: '/v1/label-manage/check-label-set-name',
      data
    })
  },
  getPersonDetails: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: "/v1/label-manage/person-query",
      data,
    });
  },
  // 获取导入进度
  getProcessData: function <U, T>(data?: U) {
    return ajax<T>({
      method: "get",
      url: "/v1/label-manage/process",
      data
    })
  },
  // 获取具有管理权限的标签集
  getLabelSetManage: function <U, T>(data?: U) {
    return ajax<T>({
      method: "get",
      url: "/v1/label-manage/list-manage-label-set",
      data
    })
  },
  // 删除标签集
  deleteLabelSet: function <U, T>(data?: U) {
    return ajax<T>({
      method: "post",
      url: "/v1/label-manage/label-set/del",
      data
    })
  },
}

export default {
  ...api
}
