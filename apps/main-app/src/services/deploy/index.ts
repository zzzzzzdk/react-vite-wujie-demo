import ajax from "@/utils/axios.config";

// 获取审批人
const getApprover = <T, U>() => {
  return ajax<U>({
    method: "get",
    url: "v1/monitor/approveUsers",
  });
};
// 获取接收人
const getReceiver = <T, U>() => {
  return ajax<U>({
    method: "get",
    url: "v1/monitor/receiverUsers",
  });
};
// 当前用户是否有审批权限
const isApprover = <T, U>() => {
  return ajax<U>({
    method: "get",
    url: "v1/monitor/permission",
  });
};
/* ===============================================目标布控=============== */
// 提交布控单:更新/创建
const postDeploy = <T, U>(data: T, mode: "add" | "update") => {
  return ajax<U>({
    method: "post",
    url: `v1/monitor/${mode}`,
    data,
  });
};
// 获取布控单用于修改
const getSingleDeploy = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/view",
    data,
  });
};

/* ===============================================布控明细=============== */
// 获取布控标题
const getTitles = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/list-titles",
    data,
  });
};
// 获取布控列表
const getDeployList = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/list",
    data,
  });
};
// 审批
const review = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/review",
    data,
  });
};
// 关闭 or 撤销
const close = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/close",
    data,
  });
};

/* ===============================================布控单详情=============== */
const getDeploymentDetail = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/detail",
    data,
  });
};
/* ===============================================告警历史=============== */

const getAlarmHistory = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/result",
    data,
  });
};
const getAlarmDetail = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "v1/monitor/result/detail",
    data,
  });
};

const getPersonProfile = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "/v1/monitor/person-photo",
    data,
  });
};
//根据布控单Id获取点位
const getLocationIdsByJobId = <T, U>(data: T) => {
  return ajax<U>({
    method: "post",
    url: "/v1/monitor/locations",
    data,
  });
};


export default {
  getDeploymentDetail,
  getApprover,
  getReceiver,
  postDeploy,
  isApprover,
  getDeploy: getSingleDeploy,

  getDeployList,
  getPersonProfile,
  getTitles,
  review,
  close,

  getAlarmDetail,
  getAlarmHistory,
  getLocationIdsByJobId,
};
