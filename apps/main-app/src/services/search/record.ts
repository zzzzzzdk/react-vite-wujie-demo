
import ajax from "@/utils/axios.config"
type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'

const api = {
  // 获取档案检索检索
  getRecordList: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/record/list',
      data
    })
  },
  // 权限审批-获取消息数量
  getMsgCount: function <T, U, K = any>() {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/msgCount',
    })
  },
  // 权限审批-更新已读状态
  changeMsgStatus: function <T, U, K = any>() {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/msgStatus',
    })
  },
  // 上传文件
  importRecordExcel: function <T, U, K = any>(data: T, url?: string) {
    return ajax<U, K>({
      method: "post",
      url: url || '/v1/personArchives/excel',
      data
    })
  },
  // 获取档案检索结果数据-精准条件
  getArchivesResultData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/result/precision',
      data
    })
  },
  // 获取档案检索结果数据-关键词
  getArchivesResultBlurData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/result/blur',
      data
    })
  },
  // 获取检索条件配置文字
  getConditionsData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/result/conditions',
      data
    })
  },
  // 获取历史检索记录
  getHistoryData: function <T, U, K = any>() {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/history',
    })
  },
  // 获取档案检索列表
  getSeacrhRecordData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/record',
      data
    })
  },
  // 获取上传文件进度
  getRecordProgress: function <T, U, K = any>(data: T, url?: string) {
    return ajax<U, K>({
      method: "get",
      url: url || '/v1/personArchives/process',
      data
    })
  },
  // 获取档案统计数量
  getReordNum: function <T, U, K = any>() {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/recordNum',
    })
  },
  // 获取审批列表
  getAuditLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/auditList',
      data
    })
  },
  // 审批意见
  auditMessage: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/audit',
      data
    })
  },
  // 撤销审批
  revokeAudit: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/revoke',
      data
    })
  },
  // 提交审批/重新提交
  submitApprove: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/submitApprove',
      data
    })
  },
  // 获取黑名单
  getBlackLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/black/details',
      data
    })
  },
  // 判断该用户是否是黑名单
  getPersonIsBlack: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/isBlack',
      data
    })
  },
  // 加入黑名单
  addBlackLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/addBlack',
      data
    })
  },
  // 移出黑名单
  delBlackLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/delBlack',
      data
    })
  },
  // 获取是否有查看详情页权限
  getDetailAuth: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/auth',
      data
    })
  },
  // 获取是否有管理员权限
  getAdminAuth: function <T, U, K = any>() {
    return ajax<U, K>({
      method: "get",
      url: '/v1/common/auth',
    })
  },
  // 获取导入模板
  getExportExcel: function <T, U, K = any>(data: T, url?: string) {
    return ajax<U, K>({
      method: "get",
      url: url || '/label-manage/excel',
      data
    })
  },
  getExportVehicleExcel: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/excel',
      data
    })
  },
  // 获取档案库结果数据
  getRecordLabelDataList: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/record-list/label/data',
      data
    })
  },
  // 详情页-基本信息
  // 获取人员信息
  getPersonInfo: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/record-detail/baseinfo',
      data
    })
  },
  //编辑人员标签及姓名
  changePersonLabel: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "put",
      url: '/v1/personArchives/labels',
      data
    })
  },
  // 获取人员标签
  getPersonLabel: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      // url: `${window.YISACONF.pdm_host || ''}/api/pdm/v1/label-manage/label-tree`,
      url: `/v1/label-manage/label-tree`,
      data
    })
  },
  // 获取基本信息
  getDetailBaseInfo: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/baseInfo',
      data
    })
  },
  // 编辑基本信息、证件照、标签
  changeDetailBaseInfo: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/updateBaseInfo',
      data
    })
  },
  changeDetailPhoto: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/updatePhoto',
      data
    })
  },
  // 获取证件照
  getDetailPhotoLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: 'get',
      url: '/v1/personArchives/photo',
      data
    })
  },
  // 获取名下车辆
  getDetailUnderCar: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: 'get',
      url: '/v1/personArchives/cars',
      data
    })
  },
  // 通过车牌号、车牌颜色获取车辆信息
  getCarInfo: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: 'get',
      url: '/v1/personArchives/car/person',
      data
    })
  },
  // 编辑名下车辆
  changeDetailUnderCar: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: 'post',
      url: '/v1/personArchives/updateCars',
      data
    })
  },
  // 获取驾乘车辆
  getTransportCarData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: 'get',
      url: '/v1/personArchives/driving/cars',
      data
    })
  },
  getViolationCarData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: 'get',
      url: '/v1/personArchives/violation',
      data
    })
  },
  // 获取联系方式
  getDetailPhoneInfo: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/phoneInfo',
      data
    })
  },
  // 获取出行方式
  getDriveInfo: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/transport',
      data
    })
  },
  // 获取同行人聚类
  getPeerCluterLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/judgement/accomplices/face/list',
      data
    })
  },
  // 获取关联人员数据
  getRelateInfoLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/images',
      data
    })
  },
  // 关联人员
  handleRelateInfo: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "put",
      url: '/v1/personArchives/identity',
      data
    })
  },
  // 获取抓拍图像数据
  getPortraitData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/portrait',
      data
    })
  },
  // 获取抓拍图像-人体数据
  getPortraitPersonData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/cluster/pedestrian',
      data
    })
  },
  // 获取抓拍图像-人脸数据
  getPortraitFaceData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/cluster/face',
      data
    })
  },
  // 获取抓拍图像-人脸聚类数据
  getPortraitFaceCluterData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/cluster/facegroup',
      data
    })
  },
  // 获取抓拍图像-二轮车数据
  getPortraitBicycleData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/cluster/bicycle',
      data
    })
  },
  // 获取抓拍图像-三轮车数据
  getPortraitTricycleData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/cluster/tricycle',
      data
    })
  },
  // 获取抓拍图像-汽车数据
  getPortraitVehicleData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/cluster/vehicle',
      data
    })
  },
  // 获取抓拍图像-汽车数据
  getPortraitGaitData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/cluster/gait',
      data
    })
  },
    // 获取抓拍图像-各聚类数量
    getPortraitClusterCount: function <T, U, K = any>(data: T) {
      return ajax<U, K>({
        method: "get",
        url: '/v1/personArchives/cluster/count',
        data
      })
    },
  // 获取关系人数据
  getRelationPersonData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/relationPerson',
      data
    })
  },
  // 获取关系人详情数据
  getRelationDetailData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/relationDetail',
      data
    })
  },
  // 获取户籍详情
  getRelationHouseHoldData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/houseHold',
      data
    })
  },
  // 获取户籍中两人关系
  getHouseHoldDetailData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/houseHold/person',
      data
    })
  },
  //  获取职业画像
  getCharacterizationData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/characterization',
      data
    })
  },
  //  获取交通工具
  getBehaviorTrafficData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/portrait/transport',
      data
    })
  },
  //  获取行为画像类型-活动频率
  getBehaviorRateData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/frequency',
      data
    })
  },
  //  获取行为画像类型-活动频率
  getActiveLocationsData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/locations',
      data
    })
  },
  // 获取行为轨迹数据
  getTrackData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/track',
      data
    })
  },
  // 获取下拉数据-民族、文化程度、宗教信仰、婚姻状态
  getSelectData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/dict',
      data
    })
  },
  // 获取区域数据
  getPlaceData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/common/region',
      data
    })
  },
  // 获取档案数量
  getRecordNum: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/recordNum',
      data
    })
  },
  // 获取基本信息总数
  getBasicNum: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/basicNum',
      data
    })
  },
  // 获取操作日志
  getOptionLogData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/logs',
      data
    })
  },
  // 获取案件列表
  getCaseLists: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/cases',
      data
    })
  },
  // 获取关系分析数据
  getRelateData: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "get",
      url: '/v1/personArchives/relate',
      data
    })
  },
  // 人员共性分析
  addCommonality: function <T, U, K = any>(data: T) {
    return ajax<U, K>({
      method: "post",
      url: '/v1/personArchives/commonality',
      data
    })
  },
}

export default {
  ...api
}
