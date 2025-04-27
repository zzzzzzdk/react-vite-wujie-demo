var express = require('express');
var router = express.Router();
const data2=require("./json/cluedetail.json")
let datainfo = Array.from({ length: 120 }).map((item, index) => {
  return {
    id: index + '1' + Math.floor(Math.random() * 10),
    caseId: 'xxxx',
    infoid: index + '1' + Math.floor(Math.random() * 10),
    // :originSmallPic,
    bigImage: "http://192.168.7.206:8000/992_6cbf5c34-927b-11ed-8d2d-a0369f1f7f36.jpg",
    targetImage: "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Frlimg%3Furl%3Dhttp%3A%2F%2F192.168.5.80%3A9081%2F1842%2C011010cfb4720a47.jpg&xywh=24,22,49,61&cut_img=1",
    name: 'kfy',
    "similarity": 99.99,
    time: '2001-01-01 ---' + (index + 1),
    jiontime: '2023-10-17',
    place: '家佳源'
  }
});
datainfo[0] = { ...datainfo[0], targetImage: 'http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F10404c86-55a3-11ec-88b0-0cc47a9c4b97.jpg&xywh=701%2C56%2C117%2C261' }
datainfo[19] = { ...datainfo[19], targetImage: 'http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F10404c86-55a3-11ec-88b0-0cc47a9c4b97.jpg&xywh=701%2C56%2C117%2C261' }
datainfo[39] = { ...datainfo[39], targetImage: 'http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F10404c86-55a3-11ec-88b0-0cc47a9c4b97.jpg&xywh=701%2C56%2C117%2C261' }
//获取线索列表
router.get('/v1/clue/list', async function (req, res, next) {
  req.json = {
    data: [
      {
        "id": 1,
        "title": "测试1",
        "caseId": "455111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        "caseDetails": "详情xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //   "caseTime": "2023-11-01 00:00:00 ~ 2023-11-02 00:00:00",
        "caseTime": ["2023-11-13 04:07:05", "2023-12-13 04:07:05"],
          // "caseRegionCode": "370211",
        "caseRegionCode": ["120000","120102"],
        "caseRegionName":"天津市-河东区",
        "casePlace": "详细地址111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        "caseStatus": 0,
        "privilege": 0,
        // "permission":1,
        // "privilege": 1,
        "privilegeUser": [],
        "children": [
          {
            "id": 2,
            "title": "分组一"
          },
          {
            "id":5,
            "title":"分组二"
          }
        ]
      },
      {
        "id": 3,
        "title": "测试2",
        "caseId": "4665111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        "caseDetails": "详情xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //   "caseTime": "2023-11-01 00:00:00 ~ 2023-11-02 00:00:00",
        "caseTime": ["2023-11-13 04:07:05", "2023-12-13 04:07:05"],
          // "caseRegionCode": "370211",
        // "caseRegionCode":"120102",
        "caseRegionCode": ["110000","110111"],
        "caseRegionName":"北京市-房山区",
        "casePlace": "详细地址111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
        "caseStatus": 0,
        "privilege": 1,
        // "permission":1,
        // "privilege": 1,
        "privilegeUser": [
          // "javascript"
        ],
        "children": [
          {
            "id": 4,
            "title": "分组一"
          }
        ]
      }
    ],
  }
  // await req.sleep(2)
  res.json(req.json);
});
//新建分组或案件
router.post('/v1/clue/list', async function (req, res, next) {
  req.json = {
    data: Math.floor(Math.random() * 1000),
    parentId: 0
  }
  res.json(req.json);
});
//删除线索
router.delete('/v1/clue/list', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});
//修改线索
router.put('/v1/clue/list', async function (req, res, next) {
  // console.log(req,12);
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});
//获取线索详情
router.get('/v1/clue/details', async function (req, res, next) {
  const { caseId, pageNo, pageSize, featureType } = req.body;
  // const data = datainfo.slice(start, end);
  // if (caseId === '') {
  //   req.json = {
  //     data: [],
  //     total: 0
  //   }
  // }
  // else {
    req.json = data2
    // req.json = {data:[]}
  res.json(req.json);
})
//批量修改线索分组
router.put('/v1/clue/details', async function (req, res, next) {
  const { data, oldgroup, newgroup } = req.body;
  req.json = {
    // ddd:1
    // data:req.body,
    data: data,
    oldgroup: oldgroup,
    newgroup: newgroup
  }
  res.json(req.json);
});
//批量删除线索详情
router.delete('/v1/clue/details', async function (req, res, next) {
  const { deletearr } = req.body;
  req.json = {
    // ddd:1
    // data:req.body,
    data: deletearr
  }
  res.json(req.json);
})
//获取地区和当前地点
router.get('/v1/common/region', async function (req, res, next) {
  // const{deletearr}=req.body;
  req.json = {
    // ddd:1
    // data:req.body,
    data: [
      {
        "id": "110000",
        "parentId": "000086",
        "name": "北京市",
        "level": "1",
        "nodes": [
          {
            "id": "110111",
            "parentId": "110000",
            "name": "房山区",
            "level": "3"
          },
        ]
      },
      {
        "id": "120000",
        "parentId": "000086",
        "name": "天津市",
        "level": "1",
        "nodes": [
          {
            "id": "120101",
            "parentId": "120000",
            "name": "和平区",
            "level": "3"
          },
          {
            "id": "120102",
            "parentId": "120000",
            "name": "河东区",
            "level": "3"
          }
        ]
      }],
    regionCode: ["110000","110111"],
    regionName:'北京市-房山区'
  }
  res.json(req.json);
})
//加入线索库
router.post('/v1/clue/details', async function (req, res, next) {
  req.json = {
    // message:'成功'
  }
  res.json(req.json);
});
module.exports = router;

