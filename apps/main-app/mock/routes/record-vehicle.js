const express = require("express");
const router = express.Router();
const recordData = require("./json/record-vehicle.json")

// 获取车辆识别信息(左边)
router.get("/v1/vehicle-archives/vehicle/identify-info", (req, res) => {
  const { licensePlate, plateColorTypeId } = req.query
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: { ...recordData.vehicleInfoData, licensePlate, plateColorTypeId },
  }
  res.send(data);
});
// 获取车辆基本信息
router.get("/v1/vehicle-archives/vehicle/basic-info", (req, res) => {
  const { registrationInfo, physicalFeature, drivingLicenseInfo, trafficViolation } = recordData
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: {
      registrationInfo,
      physicalFeature,
      drivingLicenseInfo,
      trafficViolationInfo: trafficViolation
    },
  }
  res.send(data);
});
// 获取车主基本信息
router.get("/v1/vehicle-archives/owner/basic-info", (req, res) => {
  const { baseInfo, driverLicense, ownerOtherVehicles, trafficViolation } = recordData
  const data = {
    status: 0,
    message: "编辑成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: {
      baseInfo:{...baseInfo,idcard:""},
      driverLicense,
      ownerOtherVehicles,
      trafficViolationInfo: trafficViolation
    },
  }
  res.send(data);
});
// 车辆行迹分析-按点位
router.get("/v1/vehicle-archives/locus-analysis/location", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.locusAnalysisLocation,
  }
  res.send(data);
});
// 车辆行迹分析-按时间
router.get("/v1/vehicle-archives/locus-analysis/time", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.locusAnalysisTime,
  }
  res.send(data);
});
// 驾乘聚类
router.get("/v1/vehicle-archives/cluster/driver-passenger", async (req, res) => {
  await new Promise((reslove, rej) => {
    setTimeout(() => {
      reslove()
    }, 1000)
  })
  const data = {
    status: 0,
    message: "成功",
    data: recordData.driver,

  }
  res.send(data);
});
// 驾乘聚类详情
router.get("/v1/vehicle-archives/cluster/details", (req, res) => {
  setTimeout(() => {
    const data = {
      status: 0,
      message: "请求成功",
      totalRecords: 48,
      usedTime: 1.44,
      data: recordData.clusterDetails
    }
    res.send(data);
  }, 300)
});
// 人脸身份比对
router.get("/v1/vehicle-archives/cluster/identity-comparison", (req, res) => {
  const data = {
    status: 0,
    message: "成功",
    data: []
    // data: recordData.identityComparison
  }
  res.send(data);
});
// 确认人员身份
router.post("/v1/vehicle-archives/cluster/confirm-identity", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
  }
  res.send(data);
});
//更新车辆标签
router.put('/v1/vehicle-archives/vehicle/labels', (req, res) => {
  setTimeout(() => {
    const data = {
      status: 0,
      message: "请求成功"
    }
    res.send(data);
  }, 1000)
});
//文件上传
router.post("/v1/vehicle-archives/excel", (req, res) => {
  const data = {
    status: 0,
    "errorMessage": "",
    "message": "上传成功",
    "taskId": "123123"
  }
  res.send(data);
});
// 获取上传进度
router.get("/v1/vehicle-archives/process", (req, res) => {
  const data = {
    "data": {
      "success": 0,
      "failed": 2,
      "failedReason": "数据库查询失败或身份证号在库中已存在",
      "failedUrl": "D:/git/人员档案导入失败_20231222102249.xlsx"
    },
    "errorMessage": "",
    "message": "获取成功",
    "process": 100,
    "status": 1
  }
  res.send(data);
});

module.exports = router;
