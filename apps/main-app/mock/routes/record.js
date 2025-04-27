const express = require("express");
const router = express.Router();
const recordData = require("./json/record.json")
router.post("/v1/record/list", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.recordDataList,
  }
  res.send(data);
});

// 获取人员信息
router.get("/v1/record-detail/baseinfo", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.personInfoData,
  }
  res.send(data);
});
// 检索-获取检索条件配置文字
router.post("/v1/personArchives/result/conditions", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: '人员姓名(统一返回的模拟数据)：张三；',
  }
  res.send(data);
});
// 获取人员标签
router.get("/v1/label-manage/label-tree", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.labelData,
  }
  res.send(data);
});
// 获取档案检索结果
router.get("/v1/personArchives/record", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.recordData,
  }
  res.send(data);
});
// 获取历史上传信息
router.get("/v1/personArchives/history", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: ['张三 蓝色上衣', '长发 蓝色上衣', '鲁B13244', '长发 蓝色上衣', '长发 蓝色上衣']
  }
  res.send(data);
});
// 上传文件
router.post("/api/fusion/v1/personArchives/excel", (req, res) => {
  const data = {
    status: 0,
    "errorMessage": "",
    "message": "上传成功",
    "taskId": "123123"
  }
  res.send(data);
});
// 获取上传进度
router.get("/v1/personArchives/process", (req, res) => {
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
// 获取档案统计数量
router.get("/v1/personArchives/recordNum", (req, res) => {
  const data = {
    status: 0,
    message: "获取成功",
    data: {
      carNum: 1230,
      carLabel: 345,
      personNum: 299222455,
      personLabel: 1345,
      noPersonInfo: 3455,
      noCaptureInfo: 145,
      activePerson: 445,
      activeLabel: 745,
      personInfo: 653,
    }
  }
  res.send(data);
});
// 权限审批-更新已读状态
router.get("/v1/personArchives/msgStatus", (req, res) => {
  const data = {
    status: 0,
    message: "获取成功",
  }
  res.send(data);
});

// 权限审批-获取消息数量
router.get("/v1/personArchives/msgCount", (req, res) => {
  const data = {
    status: 0,
    message: "获取成功",
    data: {
      count: 1
    }
  }
  res.send(data);
});
// 获取检索页结果数据-精准条件
router.post("/v1/personArchives/result/precision", (req, res) => {
  const data = {
    status: 0,
    message: "获取成功",
    data: {
      person: [{
        key: "eqwq",
        personName: '张三',
        name: '张三',
        idType: '111',
        idNumber: '',
        imageUrl: '',
        photoUrl: 'http://192.168.5.47:3003/target_pic.jpg',
        labelIds: ['0-0-1'],
        phone: ['187234451123', '187234435123', '187223445123', '187238445123', '187234455123', '187239445123', '187234405123', '187234451123',],
        age: '12',
        sex: '女',
        nation: '汉族',
        householsAddress: '山东省青岛市黄岛区江山瑞成1号楼1单元101室',
        residentialAddress: '山东省青岛市黄岛区江山瑞成1号楼1单元101室',
        carInfo: [
          { licensePlate: '鲁B12325', plateColor: '0' },
          { licensePlate: '鲁E12345', plateColor: '3' },
        ],
        driveInfo: { licensePlate: '鲁B12345', plateColor: '1' },
        groupCount: 12,
        groupPlateCount: 13,
        groupId: [1],
        groupPlateId: [1],
        "label": [
          {
            "name": "徘徊人员",
            "color": 1,
            "id": 1
          },
          {
            "name": "重点人员",
            "color": 2,
            "id": 2
          },
          {
            "name": "测试人员",
            "color": 3,
            "id": 3
          },
          {
            "name": "徘徊人员2",
            "color": 4,
            "id": 4
          }
        ],
        "labels": [
          {
            "name": "徘徊人员",
            "color": 1,
            "id": 1
          },
          {
            "name": "重点人员",
            "color": 2,
            "id": 2
          },
          {
            "name": "测试人员",
            "color": 3,
            "id": 3
          },
          {
            "name": "徘徊人员2",
            "color": 4,
            "id": 4
          }
        ],
        archivesUpdateTime: '2023-10-12 12:12:44',
        groupUpdateTime: '2023-10-23 10:12:34',
      }],
      car: [
        {
          key: "sdsdfs",
          licensePlate: '鲁B12345',
          idNumber: '123876534654',
          driveInfo: { licensePlate: '鲁B12345', plateColor: '2' },
          groupCount: 12,
          // groupPlateCount: 13,
          groupId: '123',
          groupPlateId: '134',
          groupUpdateTime: '2023-10-23 10:12:34',
          "label": [
            {
              "name": "徘徊人员",
              "color": 1,
              "id": 1
            },
            {
              "name": "重点人员",
              "color": 2,
              "id": 2
            },
            {
              "name": "测试人员",
              "color": 3,
              "id": 3
            },
            {
              "name": "徘徊人员2",
              "color": 4,
              "id": 4
            },
            {
              "name": "徘徊人员",
              "color": 5,
              "id": 5
            },
            {
              "name": "重点人员",
              "color": 6,
              "id": 6
            },
            {
              "name": "测试人员",
              "color": 7,
              "id": 7
            },
            {
              "name": "徘徊人员2",
              "color": 4,
              "id": 8
            },
          ],
          vehicleCategory: "小型普通轿车",
          vehicleColor: "白",
          identifyVehicleModel: "日产-轩逸",
          drivePerson: [
            {
              idNumber: '123876534654',
              idType: '111',
              groupId: '1234',
              name: '张三'
            }
          ]
        }
      ],
      select: [
        { label: '按更新时间倒序', value: '1' },
        { label: '档案更新时间降序', value: '2' },
        { label: '按抓拍人脸倒序', value: '3' },
        { label: '按抓拍人脸正序', value: '4' },
        { label: '按车中人脸倒序', value: '5' },
        { label: '按车中人脸正序', value: '6' },
      ],
      selectId: '1'
    },
    totalRecords: 300,
    personTotalRecords: 150,
    vehicleTotalRecords: 150,
    usedTime: 1.24,
    realNameRecords: 100,
    unrealNameRecords: 200,
  }
  res.send(data);
});
// 获取检索页结果数据-关键词
router.get("/v1/personArchives/result/blur", (req, res) => {
  const data = {
    status: 0,
    message: "获取成功",
    data: {
      person: [{
        key: '111',
        personName: '张三',
        name: '张三',
        idType: '111',
        idNumber: '',
        imageUrl: '',
        "photoUrl": "b.jpg",
        labelIds: ['0-0-1'],
        phone: ['187234345123', '187223445123', '187234445123', '187234435123', '187234451723', '187223445123', '187234451243', '187213445123',],
        age: '12',
        sex: '女',
        nation: '汉族',
        householsAddress: '山东省青岛市黄岛区江山瑞山东省青岛市黄岛区江山瑞成1号楼1单元101室成1号楼1单元101室',
        residentialAddress: '山东省青岛市黄岛区江山瑞成1号楼1单元101室',
        carInfo: [
          { licensePlate: '鲁B12345', plateColor: '0' },
          { licensePlate: '鲁E43242', plateColor: '15' },
          { licensePlate: '鲁E64544', plateColor: '3' },
          { licensePlate: '鲁E67555', plateColor: '3' },
          { licensePlate: '鲁E77755', plateColor: '3' },
        ],
        driveInfo: [
          { licensePlate: '鲁B23243', plateColor: '1' },
          { licensePlate: '鲁B34544', plateColor: '0' },
          { licensePlate: '鲁B87133', plateColor: '1' },
          { licensePlate: '鲁B54333', plateColor: '2' },
          { licensePlate: '鲁B12345', plateColor: '3' },
        ],
        groupUpdateTime: '2023-10-23 10:12:34',
        groupCount: 12,
        groupId: [1],
        groupPlateId: [1],
        "label": [
          {
            "name": "徘徊人员",
            "color": 1,
            "id": 1
          },
          {
            "name": "重点人员",
            "color": 2,
            "id": 2
          },
          {
            "name": "测试人员",
            "color": 3,
            "id": 3
          },
          {
            "name": "徘徊人员2",
            "color": 4,
            "id": 4
          }
        ],
        "labels": [
          {
            "name": "徘徊人员",
            "color": 1,
            "id": 1
          },
          {
            "name": "重点人员",
            "color": 2,
            "id": 2
          },
          {
            "name": "测试人员",
            "color": 3,
            "id": 3
          },
          {
            "name": "徘徊人员2",
            "color": 4,
            "id": 4
          }
        ],
        archivesUpdateTime: '2023-10-12 12:12:44'
      }, {
        idType: '414',
        idNumber: '372245199902011412',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '37224512011412',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '372245199902012',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '37224519990412',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '37229902011412',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '372245902011412',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '37299902011412',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '3722451999020112',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '3722451902011412',
        key: "332323"
      },

      {
        idType: '414',
        idNumber: '3722451999020112',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '3722451999012',
        key: "332323"
      },
      {
        idType: '414',
        idNumber: '372199902011412',
        key: "332323"
      },

      {
        idType: '414',
        idNumber: '3722451999020112',
        key: "332323"
      },

      ],
      car: [{
        key: "1212",
        licensePlate: '鲁B12345',
        idNumber: '372245199902011412',
        driveInfo: [{ licensePlate: '鲁B12345', plateColor: '99' }],
        groupCount: 12,
        groupPlateCount: 13,
        groupId: [1],
        groupPlateId: [1],
        groupUpdateTime: '2023-10-23 10:12:34',
        "label": [
          {
            "name": "徘徊人员",
            "color": 1,
            "id": 1
          },
          {
            "name": "重点人员",
            "color": 2,
            "id": 2
          },
          {
            "name": "测试人员",
            "color": 3,
            "id": 3
          },
          {
            "name": "徘徊人员2",
            "color": 4,
            "id": 4
          },
          {
            "name": "徘徊人员",
            "color": 5,
            "id": 5
          },
          {
            "name": "重点人员",
            "color": 6,
            "id": 6
          },
          {
            "name": "测试人员",
            "color": 7,
            "id": 7
          },
          {
            "name": "徘徊人员2",
            "color": 4,
            "id": 8
          },
        ],
        vehicleCategory: "小型普通轿车",
        vehicleColor: "白",
        identifyVehicleModel: "日产-轩逸",
        drivePerson: [
          {
            idNumber: '123876534654',
            idType: '111',
            groupId: '1234',
            name: '张三'
          }
        ]
      }, {
        plateColor: 1,
        licensePlate: "鲁A22222",
        key: "csiehci1"
      }],
      select: [],
      selectId: ''
    },
    totalRecords: 250,
    personTotalRecords: 250,
    vehicleTotalRecords: 2,
    usedTime: 1.24
  }
  res.send(data);
});
// 获取黑名单数据
router.get("/v1/personArchives/black/details", (req, res) => {
  const data = {
    status: 0,
    message: "获取成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.blackData,
  }
  res.send(data);
});
// 判断该用户是否是黑名单
router.get("/v1/personArchives/isBlack", (req, res) => {
  const data = {
    status: 0,
    data: {
      ids: '123,134'
    },
    message: "获取成功",
  }
  res.send(data);
});
// 加入黑名单
router.get("/v1/personArchives/addBlack", (req, res) => {
  const data = {
    status: 0,
    message: "添加成功",
  }
  res.send(data);
});
// 移出黑名单
router.get("/v1/personArchives/delBlack", (req, res) => {
  const data = {
    status: 0,
    message: "移除成功",
  }
  res.send(data);
});
// 获取审批列表
router.get("/v1/personArchives/auditList", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.auditLists
  }
  res.send(data);
});
// 撤销审批
router.get("/v1/personArchives/revoke", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
  }
  res.send(data);
});
// 审批意见
router.post("/v1/personArchives/audit", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
  }
  res.send(data);
});
//提交审批/重新提交
router.post("/v1/personArchives/submitApprove", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
  }
  res.send(data);
});
// 编辑用户标签及姓名
router.put("/v1/personArchives/lables", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
    totalRecords: 48,
    usedTime: 1.44,
  }
  res.send(data);
});
// 审批意见
router.post("/v1/personArchives/updatePhoto", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
  }
  res.send(data);
});
// 获取用户基本信息
router.get("/v1/personArchives/baseInfo", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.baseinfoData
  }
  res.send(data);
});
// 编辑用户基本信息
router.post("/v1/personArchives/updateBaseInfo", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
    totalRecords: 48,
    usedTime: 1.44,
  }
  res.send(data);
});
// 获取联系方式
router.get("/v1/personArchives/phoneInfo", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.phoneData,
  }
  res.send(data);
});
// 编辑联系方式
router.post("/v1/personArchives/updatePhone", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
  }
  res.send(data);
});
// 获取地址信息
router.get("/v1/personArchives/address", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.addressData,
  }
  res.send(data);
});
// 编辑地址信息
router.post("/v1/personArchives/updateAddress", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
  }
  res.send(data);
});
// 获取出行信息
router.get("/v1/personArchives/transport", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.driveData,
  }
  res.send(data);
});
// 获取宾馆住宿信息
router.get("/v1/personArchives/hotel", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.hotelData,
  }
  res.send(data);
});
// 获取上网记录信息
router.get("/v1/personArchives/internet", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.interData,
  }
  res.send(data);
});
// 获取证件照
router.get("/v1/personArchives/photo", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.photoData,
  }
  res.send(data);
});
// 编辑证件照
router.put("/v1/personArchives/photo", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
  }
  res.send(data);
});
// 获取名下车辆
router.get("/v1/personArchives/cars", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.underCarData,
  }
  res.send(data);
});
// 通过车牌号、车牌颜色获取车辆信息
router.get("/v1/personArchives/car/person", async (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: {
      "key": "2-6bKBQjAzMjFM",
      "licensePlate": "鲁A12345",
      "plateColor": 1,
      "vehicleCategory": "X99",
      "registeredVehicleModel": "K1",
      "identifyVehicleModel": "别克-GL8-2004,2003",
      "vehicleColor": "其他",
      "firstRegistrationDate": "2023-01-01",
      "vehicleStatus": "Z",
      "vehicleImage": "http://192.168.7.206:8000/07ef05d2-54bc-11ec-88b0-0cc47a9c4b97.jpg",
      "labels": []
    },
  }

  await req.sleep(5)
  res.send(data);
});
// 编辑名下车辆
router.post("/v1/personArchives/updateCars", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
  }
  res.send(data);
});
// 增加名下车辆
router.post("/v1/personArchives/cars", (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
    data: recordData.baseinfo.underCarData[0],
  }
  res.send(data);
});
// 获取驾乘车辆
router.get("/v1/personArchives/driving/cars", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.driveCarData,
  }
  res.send(data);
});
// 获取违法车辆
router.get("/v1/personArchives/violation", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.violationData,
  }
  res.send(data);
});
// 获取区域数据
router.get("/v1/common/region", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.placeData,
  }
  res.send(data);
});
// 获取同行人聚类数据
// router.post("/v1/judgement/accomplices/face/list", (req, res) => {
//   const data = {
//     status: 0,
//     message: "请求成功",
//     totalRecords: 48,
//     usedTime: 1.44,
//     data: recordData.baseinfo.peerData,
//   }
//   res.send(data);
// });
// 获取下拉数据-婚姻、宗教、教育、民族
router.get("/v1/personArchives/dict", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.selectData,
  }
  res.send(data);
});
// 获取基本信息数量
router.get("/v1/personArchives/basicNum", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    data: recordData.basicNum,
  }
  res.send(data);
});
// 获取关系人列表数据
router.get("/v1/personArchives/relationPerson", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.relation,
  }
  res.send(data);
});

// 获取单个关系人详情数据
router.get("/v1/personArchives/relationDetail", (req, res) => {
  let resultData = []
  if (req.query.relationType == '1') {
    resultData = recordData.relationNativeDetail
  } else if (req.query.relationType == '2') {
    resultData = recordData.relationPhoneDetail
  } else if (req.query.relationType == '3') {
    resultData = recordData.relationViolateDetail
  } else if (req.query.relationType == '4') {
    resultData = recordData.relationViolateDetail
  } else if (req.query.relationType == '5') {
    resultData = recordData.relationCaseDetail
  } else if (req.query.relationType == '6') {
    resultData = recordData.relationTravelDetail
  } else if (req.query.relationType == '7') {
    resultData = recordData.relationStayDetail
  } else if (req.query.relationType == '8') {
    resultData = recordData.relationInterDetail
  }
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: resultData,
  }
  res.send(data);
});
// 获取户籍详情
router.get("/v1/personArchives/houseHold", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.houseHoldData,
  }
  res.send(data);
});
// 获取户籍中两人关系
router.get("/v1/personArchives/houseHold/person", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.relationNativeDetail,
  }
  res.send(data);
});
// 获取行为画像类型
router.get("/v1/personArchives/characterization", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: {
      "characterId": "1",
      "characterName": "上班族",
      "description": "周一到周五平均每天活动时间(精确到时)存在顶点，且顶点间相距时间不低于3小时。依据推述信息为[周一到周五早N左右到达工作区域，晚上M左右离开工作区域] (N、M为时间信息，精确到时)"
    },
  }
  res.send(data);
});
// 获取交通工具
router.get("/v1/personArchives/portrait/transport", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.behaviorData.transport,
  }
  res.send(data);
});
// 获取行为画像类型-活动频率
router.get("/v1/personArchives/frequency", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.rateData
  }
  res.send(data);
});
// 生成导入模板
router.post("/v1/personArchives/excel", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: "",
    successUrl: '/112',
    successNum: 112,
    failNum: 111,
    failUrl: "",
  }
  res.send(data);
})
// 详情页-抓拍图像-获取人脸抓拍
router.post("/v1/personArchives/cluster/face", async (req, res) => {
  await req.sleep(2)
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.faceData
  }
  res.send(data);
})
// 详情页-抓拍图像-获取人脸聚类抓拍
router.post("/v1/personArchives/cluster/facegroup", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.faceCluterData
  }
  res.send(data);
})
// 详情页-抓拍图像-获取人体聚类抓拍
router.post("/v1/personArchives/cluster/pedestrian", (req, res) => {
  let resultData = recordData.bicycleData
  if (req.body.groupBy == '2') {
    resultData = recordData.personClothData
  } else if (req.body.groupBy == '3') {
    resultData = recordData.personColorData
  }
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: resultData
  }
  res.send(data);
})
// 详情页-抓拍图像-获取二轮车聚类抓拍
router.post("/v1/personArchives/cluster/bicycle", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.bicycleData,
  }
  res.send(data);
})
// 详情页-抓拍图像-获取汽车聚类抓拍
router.post("/v1/personArchives/cluster/vehicle", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.vehicleData,
  }
  res.send(data);
})
// 详情页-抓拍图像-获取三轮车聚类抓拍
router.post("/v1/personArchives/cluster/tricycle", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.tricycleData,
  }
  res.send(data);
})
// 详情页-抓拍图像-获取步态聚类抓拍
router.post("/v1/personArchives/cluster/gait", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.gaitData,
  }
  res.send(data);
})
// 详情页-抓拍图像-获取步态聚类抓拍
router.get("/v1/personArchives/cluster/count", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    data: {
      face: 12,
      pedestrian: 290,
      gait: 100,
      vehicle: 23,
      bicycle: 34,
      tricycle: 45
    },
  }
  res.send(data);
})

// 获取是否有管理员权限
router.get("/v1/common/auth", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: true
  }
  res.send(data);
})
// 获取是否有查看该用户详情权限
router.get("/v1/personArchives/auth", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: true
  }
  res.send(data);
})
// 获取关联人员
router.post("/v1/personArchives/images", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.relateInfo,
  }
  res.send(data);
})
// 关联人员
router.put("/v1/personArchives/identity", (req, res) => {
  const data = {
    status: 0,
    message: "关联成功",
    totalRecords: 48,
    usedTime: 1.44,
  }
  res.send(data);
})
// 获取抓拍图像-人脸
router.get("/v1/personArchives/portrait", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.portraitData,
  }
  res.send(data);
})
// 获取活动范围
router.get("/v1/personArchives/locations", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.locationsData
  }
  res.send(data);
});
// 获取行为轨迹数据
router.get("/v1/personArchives/track", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.trackData,
  }
  res.send(data);
});
// 获取标签库检索结果数据
router.get("/v1/record-list/label/data", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.recordDataList,
  }
  res.send(data);
});
// 获取操作日志
router.get("/v1/personArchives/logs", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.optionLogData,
  }
  res.send(data);
});
router.get('/v1/personArchives/cases', (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    usedTime: 1.44,
    data: recordData.baseinfo.caseData,
  }
  res.send(data);
});
router.put('/v1/personArchives/lables', (req, res) => {
  const data = {
    status: 0,
    message: "编辑成功",
    data: recordData.baseinfo.personInfoData,
  }
  res.send(data);
});
// 关系分析-获取列表
router.get('/v1/personArchives/relate', (req, res) => {
  let resultData = []
  if (req.query.relateType == 1) {
    resultData = recordData.relate.relationPerson
  } else if (req.query.relateType == 2) {
    resultData = recordData.relate.relationVehicle
  } else if (req.query.relateType == 3) {
    resultData = recordData.relate.relationArea
  } else if (req.query.relateType == 4) {
    resultData = recordData.relate.relationThing
  }
  const data = {
    status: 0,
    totalRecords: 100,
    usedTime: 1.34,
    message: "编辑成功",
    data: resultData
  }
  res.send(data);
});
router.post("/v1/personArchives/relate", (req, res) => {
  res.send({
    data: "http://localhost:8081/#/target"
  })
})
module.exports = router;
