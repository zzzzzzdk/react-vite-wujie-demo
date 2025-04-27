var express = require('express');
var router = express.Router();

router.all('/v1/history/job/list', async function (req, res, next) {
  req.json = {
    "data": [{
        "jobId": 15,
        "name": "testJobName",
        "creator": "zhengsl",
        "createTime": "2023-12-28 16:20:51",
        "parentId": 0,
        permission: 1,
        "children": [{
          "jobId": 16,
          "name": "testJobName",
          "creator": "zhengsl",
          "createTime": "2023-12-28 16:26:19",
          "parentId": 15
        }]
      },
      {
        "jobId": 14,
        "name": "testJobName",
        "creator": "zhengsl",
        "createTime": "2023-12-28 16:20:41",
        "parentId": 0,
        "children": []
      },
      {
        "jobId": 13,
        "name": "testJobName",
        "creator": "zhengsl",
        "createTime": "2023-12-28 16:19:54",
        "parentId": 0,
        "children": []
      },
      {
        "jobId": 12,
        "name": "testJobName",
        "creator": "zhengsl",
        "createTime": "2023-12-28 16:18:36",
        "parentId": 0,
        "children": []
      },
      {
        "jobId": 11,
        "name": "testJobName",
        "creator": "zhengsl",
        "createTime": "2023-12-28 16:18:30",
        "parentId": 0,
        "children": []
      },
      {
        "jobId": 10,
        "name": "testJobName",
        "creator": "zhengsl",
        "createTime": "2023-12-28 16:17:35",
        "parentId": 0,
        "children": []
      },
      {
        "jobId": 8,
        "name": "parentJob",
        "creator": "userName",
        "createTime": "2023-12-21 17:35:00",
        "parentId": 0,
        "children": [{
          "jobId": 9,
          "name": "childrenJob",
          "creator": "userName",
          "createTime": "2023-12-21 17:35:00",
          "parentId": 8
        }]
      },
      {
        "jobId": 5,
        "name": "parentJob",
        "creator": "userName",
        "createTime": "2023-12-21 16:31:43",
        "parentId": 0,
        privilege: 1,
        permission: 1,
        sharedUsers: [{
          id: "yiyisasasa",
          permission: 1
        }],
        "children": [{
          "jobId": 6,
          "name": "childrenJob",
          "creator": "userName",
          "createTime": "2023-12-21 16:31:43",
          "parentId": 5
        }]
      },
      {
        "jobId": 1,
        "name": "update",
        "creator": "",
        "createTime": "2023-12-21 14:38:43",
        "parentId": 0,
        "children": []
      }
    ],
  }
  await req.sleep(2)
  res.json(req.json);
});
router.all('/v1/history/job/add', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
    jobId: '123' + Math.floor(Math.random() * 100),
    parentId: 0
  }
  res.json(req.json);
});
router.all('/v1/history/job/delete', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});
router.all('/v1/history/job/update', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});

router.all('/v1/history/video/list', async function (req, res, next) {
  req.json = {
    "data": [{
        "videoId": 72,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "",
        "status": 0,
        "parseError": "",
        "parsedNumber": {
          "face": 3,
          // "pedestrian": 0,
          // "bicycle": 0,
          // "tricycle": 0,
          // "vehicle": 2,
          // "gait": 0
        },
        "startTime": "2040-06-02 11:56:52",
        "endTime": "2040-06-02 11:56:52",
        "creator": "",
        "createTime": "2023-12-28 16:51:13"
      },
      {
        "videoId": 78,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "",
        "status": 1,
        "parseError": "",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "2040-06-02 11:56:52",
        "endTime": "2040-06-02 11:56:52",
        "creator": "",
        "createTime": "2023-12-29 14:13:57"
      },
      {
        "videoId": 88,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "vehicle,bicycle,tricycle,pedestrian,face,gait",
        "status": 2,
        "parseError": "",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "2040-06-02 11:56:52",
        "endTime": "2040-06-02 11:56:52",
        "creator": "",
        "createTime": "2023-12-29 15:31:58"
      },
      {
        "videoId": 91,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "vehicle,bicycle,tricycle,pedestrian,face,gait",
        "status": 3,
        "parseError": "",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "1970-01-27 01:16:52",
        "endTime": "1970-01-27 01:16:52",
        "creator": "",
        "createTime": "2023-12-29 15:47:38"
      },
      {
        "videoId": 93,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "vehicle,bicycle,tricycle,pedestrian,face,gait",
        "status": 4,
        "parseError": "拉取视频错误: 拉取历史视频失败:发出Invite请求失败!",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "1970-01-01 00:00:00",
        "endTime": "1970-01-01 00:00:00",
        "creator": "",
        "createTime": "2023-12-29 15:51:18"
      },
      {
        "videoId": 97,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "vehicle,bicycle,tricycle,pedestrian,face,gait",
        "status": 1,
        "parseError": "",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "1970-01-01 08:00:01",
        "endTime": "1970-01-01 08:00:01",
        "creator": "",
        "createTime": "2023-12-29 16:10:18"
      },
      {
        "videoId": 99,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "vehicle,bicycle,tricycle,pedestrian,face,gait",
        "status": 2,
        "parseError": "",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "1970-01-01 08:00:01",
        "endTime": "1970-01-01 08:00:01",
        "creator": "",
        "createTime": "2023-12-29 16:24:53"
      },
      {
        "videoId": 101,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "vehicle,bicycle,tricycle,pedestrian,face,gait",
        "status": 2,
        "parseError": "",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "1970-01-01 08:00:01",
        "endTime": "1970-01-01 08:00:01",
        "creator": "",
        "createTime": "2023-12-29 16:26:00"
      },
      {
        "videoId": 103,
        "locationName": "测试点位",
        "locationId": 1024,
        "targetType": "vehicle,bicycle,tricycle,pedestrian,face,gait",
        "status": 1,
        "parseError": "",
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        },
        "startTime": "1970-01-01 08:00:01",
        "endTime": "1970-01-01 08:00:01",
        "creator": "",
        "createTime": "2023-12-29 16:39:12"
      }
    ],
    // "data":[],
    "errorMessage": "",
    "message": "",
    "totalRecords": 0
  }
  res.json(req.json);
});
router.all('/v1/history/video/add', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
    "status": 0,
    "message": "提交成功"
  }
  res.json(req.json);
});
router.all('/v1/history/video/delete', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
    "status": 0,
    "message": "提交成功"
  }
  res.json(req.json);
});

module.exports = router;
