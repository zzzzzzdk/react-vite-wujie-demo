import ajax from '@/utils/axios.config'
import initial from './initial'
import foothold from './foothold'
import vehicleTrack from './vehicleTrack'
import doublecar from './doublecar';
import activeNight from './activeNight';
import fakeClone from './fakeClone';
import frepass from './frepass';

const personAnalysis = {
  // 获取人脸聚类
  getFaceCluster: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/cluster/face/list`,
      data
    });
  },
}
const peer = {
  // 获取同行分析数据
  getPeerList: function <U, T>(data?: U, type:"face" | "vehicle" = "vehicle",  hanleGlobalLoading?: (loading: boolean) => void) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/accomplices/${type}/list`,
      data,
      onGlobalLoading: hanleGlobalLoading
    });
  },
  //详情数据
  getPeerDetail: function <U, T>(data?: U,type:"face" | "vehicle" = "vehicle") {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/accomplices/${type}/detail`,
      data
    });
  }
}

const multipoint = {
  // 获取车辆信息列表数据
  getVehicleInfoList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/collision/vehicle/list`,
      data
    });
  },
  // 获取车辆信息详情数据
  getVehicleDetailList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/collision/vehicle/detail`,
      data
    });
  },
  // 获取人员信息列表数据
  getPersonInfoList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/collision/face/list`,
      data
    });
  },
  // 获取人员信息详情数据
  getPersonDetailList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "post",
      url: `/v1/judgement/collision/face/detail`,
      data
    });
  },
  // 获取人员标签
  getLableList: function <U, T>(data?: U) {
    return ajax<T, U>({
      method: "get",
      url: `${window.YISACONF.pdm_host}/api/pdm/v1/label-manage/label-list`,
      data
    });
  },

}

export default {
  initial,
  peer,
  foothold,
  vehicleTrack,
  multipoint,
  doublecar,
  activeNight,
  personAnalysis,
  fakeClone,
  frepass
}
