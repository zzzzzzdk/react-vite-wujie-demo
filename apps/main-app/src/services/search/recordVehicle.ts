
import ajax from "@/utils/axios.config"
type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'
/**
 * 车辆：registrationInfo， physicalFeature， drivingLicenseInfo，  trafficViolation，
 * 车主：baseInfo，         driverLicense，   ownerOtherVehicles，  trafficViolation
 * 聚类：driver             passenger
 * 行迹：locusAnalysisLocation locusAnalysisTime
 */

const api = {
  getExportVehicleExcel: function <T, U>() {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/excel',
    })
  },
  // 获取车辆识别信息(左边)
  getVehicleIdentifyInfo: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/vehicle/identify-info',
      data
    })
  },
  // 车辆基本信息
  getVehicleBasicInfo: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/vehicle/basic-info',
      data
    })
  },
  // 车主基本信息
  getOwnerBasicInfo: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/owner/basic-info',
      data
    })
  },
  // // 车辆违法信息
  // getVehicleTrafficViolation: function <T, U>(data: T) {
  //   return ajax<U>({
  //     method: "get",
  //     url: '/v1/vehicle-archives/vehicle/traffic-violation',
  //     data
  //   })
  // },
  // 车辆行迹分析-按点位
  getVehicleLocusAnalysisLocation: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/locus-analysis/location',
      data
    })
  },
  // 车辆行迹分析-按时间
  getVehicleLocusAnalysisTime: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/locus-analysis/time',
      data
    })
  },
  // // 车主交通违法信息
  // getOwnerTrafficViolation: function <T, U>(data: T) {
  //   return ajax<U>({
  //     method: "get",
  //     url: '/v1/vehicle-archives/owner/traffic-violation',
  //     data
  //   })
  // },
  // 驾乘聚类
  getClusterDriverPassenger: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/cluster/driver-passenger',
      data
    })
  },
  // 驾乘聚类详情
  getClusterDetails: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/cluster/details',
      data
    })
  },
  // 人脸身份比对
  getClusterIdentityComparison: function <T, U>(data: T) {
    return ajax<U>({
      method: "get",
      url: '/v1/vehicle-archives/cluster/identity-comparison',
      data
    })
  },
  // 确认人员身份
  confirmClusterIdentify: function <T, U>(data: T) {
    return ajax<U>({
      method: "post",
      url: '/v1/vehicle-archives/cluster/confirm-identity',
      data
    })
  },
  //更新车辆标签
  updateVehicleLabels: function <T, U>(data: T) {
    return ajax<U>({
      method: "put",
      url: '/v1/vehicle-archives/vehicle/labels',
      data
    })
  },
}

export default {
  ...api
}
