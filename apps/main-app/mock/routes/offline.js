var express = require('express');
var router = express.Router();

router.all('/v1/offline/job/list', async function (req, res, next) {
  req.json = {
    data: [
      {
        "jobId": 26,
        "name": "任务一",
        "creator": "张三",
        "createTime": "2023-09-05 02:39:59",
        "parentId": 0,
        "children": [
          {
            "jobId": 27,
            "name": "子任务一",
            "creator": "丘处机",
            "createTime": "2023-09-05 02:39:59",
            "parentId": 26,
            // "children": []
          }
        ]
      },
      {
        "jobId": 21,
        "name": "任务二",
        "creator": "李元昊",
        "createTime": "2023-09-05 02:32:07",
        "parentId": 0,
        privilege: 1,
        permission: 1,
        sharedUsers: [
          {
            id: "yiyisasasa",
            permission: 1
          }
        ],
        "children": [
          {
            "jobId": 22,
            "name": "子任务二",
            "creator": "黄飞鸿",
            "createTime": "2023-09-05 02:32:07",
            "parentId": 21,
            // "children": []
          },
          {
            "jobId": 23,
            "name": "子任务三",
            "creator": "成龙",
            "createTime": "2023-09-05 02:32:07",
            "parentId": 21,
            // "children": []
          }
        ]
      }
    ]
  }
  // await req.sleep(2)
  res.json(req.json);
});

router.all('/v1/offline/file/list', async function (req, res, next) {
  req.json = {
    "data": [
      {
        "fileId": 511,
        "fileName": "testFileName111",
        "fileSize": 1024,
        "uploadTime": "2023-09-07 14:55:19",
        "isUserSet": 0,
        "userTime": "2023-09-07 06:55:21",
        "status": 1,
        "uploaded": 1,
        "uploadError": "",
        "parseError": "",
        "progress": 0.9,
        targetType: 'face,pedestrian,bicycle',
        fileType: 1,
        imgUrl: [
          "http://192.168.5.47:3003/10001.jpg",
          "http://192.168.5.47:3003/706.jpg"
        ],
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        }
      },
      {
        "fileId": 6,
        "fileName": "testFileName222",
        "fileSize": 1024,
        "uploadTime": "2023-09-07 14:55:19",
        "isUserSet": 1,
        "userTime": "2023-09-07 06:55:21",
        "status": 1,
        "uploaded": 1,
        "uploadError": "失败元婴",
        "parseError": "",
        "progress": 50,
        fileType: 1,
        "parsedNumber": {
          "face": 0,
          "pedestrian": 0,
          "bicycle": 0,
          "tricycle": 0,
          "vehicle": 0,
          "gait": 0
        }
      },
      {
        "fileId": 7,
        "fileName": "testFileName333",
        "fileSize": 1024,
        "uploadTime": "2023-09-07 14:55:19",
        "isUserSet": 1,
        "userTime": "2023-09-07 06:55:21",
        "status": 2,
        "uploaded": 1,
        "uploadError": "",
        "parseError": "转码失败",
        "progress": "",
        "parsedNumber": {
          "face": 1,
          "pedestrian": 2,
          "bicycle": 3,
          "tricycle": 4,
          "vehicle": 5,
          "gait": 6
        },
        "latitude": 1.1,
        "longitude": 1.1,
        fileType: 1,
      }
    ],
    "errorMessage": "",
    "totalRecords": 36,
    "usedTime": 0.006
  }

  res.json(req.json);
});

router.all('/v1/offline/job/add', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
    jobId: '123' + Math.floor(Math.random() * 100),
    parentId: 0
  }
  res.json(req.json);
});
router.all('/v1/offline/job/delete', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});
router.all('/v1/offline/job/update', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});

router.all('/v1/offline/file/add', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
    data: {
      // fileId: 'this is a fileId' + new Date().getTime()
      fileId: 511
    }
  }
  res.json(req.json);
});
router.all('/v1/offline/file/delete', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});
router.all('/v1/offline/file/update', async function (req, res, next) {
  req.json = {
    "errorMessage": "",
  }
  res.json(req.json);
});

// router.all('/v1/offline/file/download', async function (req, res, next) {
//   req.json = {
//     fileUrl: 'http://192.168.5.47:3003/video/bgfx.mp4'
//   }
//   await req.sleep(2)
//   res.json(req.json);
// });

router.all('/v1/offline/video/play', async function (req, res, next) {
  let url = ''
  if (req.query.fileId === '6') {
    url = 'http://192.168.5.47:3003/video/offline - 副本 (1).mp4'
  } else if (req.query.fileId === '7') {
    url = 'http://192.168.5.47:3003/video/testout2.flv'
  } else {
    url = 'http://192.168.11.15:8889/offline/377/d51ef5e6e327ab49392a593df037d133/hls.m3u8'
  }
  req.json = {
    playUrl: url
  }
  await req.sleep(1)
  res.json(req.json);
});

router.all('/v1/offline/images/show', async function (req, res, next) {
  req.json = {
    data: [
      "http://192.168.5.47:3003/10001.jpg",
      "http://192.168.5.47:3003/706.jpg"
    ]
  }
  res.json(req.json);
});

router.all('/v1/offline/job/all', async function (req, res, next) {

  res.send(
    {
      "data": [
        {
          "jobId": 49,
          "name": "test1111",
          "creator": "0",
          "createTime": "2023-10-23 11:20:00",
          "parentId": 0,
          "children": [
            {
              "jobId": 52,
              "name": "撒大苏打大苏打大苏打实打实大苏",
              "creator": "0",
              "createTime": "2023-10-23 13:27:57",
              "parentId": 49,
              "children": []
            },
            {
              "jobId": 50,
              "name": "默认",
              "creator": "0",
              "createTime": "2023-10-23 11:20:00",
              "parentId": 49,
              "children": []
            }
          ]
        },
        {
          "jobId": 47,
          "name": "testing",
          "creator": "0",
          "createTime": "2023-10-17 13:35:47",
          "parentId": 0,
          "children": [
            {
              "jobId": 48,
              "name": "默认",
              "creator": "0",
              "createTime": "2023-10-17 13:35:47",
              "parentId": 47,
              "children": [
                {
                  "fileId": 174,
                  "fileName": "1017.mp4",
                  "fileSize": 28413672,
                  "fileType": 1,
                  "uploadTime": "2023-10-23 10:23:34",
                  "isUserSet": 0,
                  "userTime": "2017-08-22 11:16:07",
                  "status": 1,
                  "uploaded": 0,
                  "uploadError": "",
                  "parseError": "",
                  "progress": 0,
                  "parsedNumber": {
                    "face": 0,
                    "pedestrian": 0,
                    "bicycle": 0,
                    "tricycle": 0,
                    "vehicle": 0,
                    "gait": 0
                  }
                }
              ]
            }
          ]
        },
        {
          "jobId": 43,
          "name": "test",
          "creator": "0",
          "createTime": "2023-10-17 11:19:34",
          "parentId": 0,
          "children": [
            {
              "jobId": 46,
              "name": "zhq",
              "creator": "0",
              "createTime": "2023-10-17 11:20:57",
              "parentId": 43,
              "children": []
            },
            {
              "jobId": 44,
              "name": "默认",
              "creator": "0",
              "createTime": "2023-10-17 11:19:34",
              "parentId": 43,
              "children": []
            }
          ]
        },
        {
          "jobId": 41,
          "name": "测试任务003fdagaaaa",
          "creator": "0",
          "createTime": "2023-10-16 13:58:47",
          "parentId": 0,
          "children": [
            {
              "jobId": 42,
              "name": "默认sdfdsfssssdsd",
              "creator": "0",
              "createTime": "2023-10-16 13:58:47",
              "parentId": 41,
              "children": []
            }
          ]
        },
        {
          "jobId": 37,
          "name": "默认",
          "creator": "11111",
          "createTime": "2023-09-10 15:14:05",
          "parentId": 0,
          "children": []
        },
        {
          "jobId": 36,
          "name": "默认",
          "creator": "11111",
          "createTime": "2023-09-20 07:28:19",
          "parentId": 0,
          "children": []
        },
        {
          "jobId": 34,
          "name": "测试任务002",
          "creator": "11111",
          "createTime": "2023-09-13 01:43:01",
          "parentId": 0,
          "children": [
            {
              "jobId": 35,
              "name": "默认",
              "creator": "11111",
              "createTime": "2023-09-13 01:43:01",
              "parentId": 34,
              "children": []
            }
          ]
        },
        {
          "jobId": 32,
          "name": "测试任务001",
          "creator": "11111",
          "createTime": "2023-09-12 09:56:26",
          "parentId": 0,
          "children": [
            {
              "jobId": 38,
              "name": "分组1",
              "creator": "0",
              "createTime": "2023-10-11 17:14:13",
              "parentId": 32,
              "children": [
                {
                  "fileId": 163,
                  "fileName": "offline - 副本 (1).mp4",
                  "fileSize": 1434988479,
                  "fileType": 1,
                  "uploadTime": "2023-10-18 16:54:10",
                  "isUserSet": 0,
                  "userTime": "2022-07-30 10:48:10",
                  "status": 1,
                  "uploaded": 0,
                  "uploadError": "",
                  "parseError": "",
                  "progress": 0,
                  "parsedNumber": {
                    "face": 0,
                    "pedestrian": 0,
                    "bicycle": 0,
                    "tricycle": 0,
                    "vehicle": 0,
                    "gait": 0
                  }
                },
                {
                  "fileId": 159,
                  "fileName": "001.mp4",
                  "fileSize": 3323914,
                  "fileType": 1,
                  "uploadTime": "2023-10-18 16:47:13",
                  "isUserSet": 0,
                  "userTime": "2023-10-18 16:47:13",
                  "status": 1,
                  "uploaded": 0,
                  "uploadError": "",
                  "parseError": "",
                  "progress": 0,
                  "parsedNumber": {
                    "face": 0,
                    "pedestrian": 0,
                    "bicycle": 0,
                    "tricycle": 0,
                    "vehicle": 0,
                    "gait": 0
                  }
                }
              ]
            },
            {
              "jobId": 33,
              "name": "分组2",
              "creator": "11111",
              "createTime": "2023-09-12 09:56:26",
              "parentId": 32,
              "children": [
                {
                  "fileId": 168,
                  "fileName": "hp.mp4",
                  "fileSize": 1098584,
                  "fileType": 1,
                  "uploadTime": "2023-10-20 15:19:20",
                  "isUserSet": 0,
                  "userTime": "2023-10-20 15:19:20",
                  "status": 1,
                  "uploaded": 0,
                  "uploadError": "",
                  "parseError": "",
                  "progress": 0,
                  "parsedNumber": {
                    "face": 0,
                    "pedestrian": 0,
                    "bicycle": 0,
                    "tricycle": 0,
                    "vehicle": 0,
                    "gait": 0
                  }
                },
                {
                  "fileId": 166,
                  "fileName": "1017.mp4",
                  "fileSize": 28413672,
                  "fileType": 1,
                  "uploadTime": "2023-10-19 15:37:19",
                  "isUserSet": 0,
                  "userTime": "2017-08-22 11:16:07",
                  "latitude": 35.965781,
                  "longitude": 120.205252,
                  "status": 1,
                  "uploaded": 0,
                  "uploadError": "",
                  "parseError": "",
                  "progress": 0,
                  "parsedNumber": {
                    "face": 0,
                    "pedestrian": 0,
                    "bicycle": 0,
                    "tricycle": 0,
                    "vehicle": 0,
                    "gait": 0
                  }
                }
              ]
            }
          ]
        }
      ],
      "errorMessage": "",
      "message": ""
    }
  )
});

module.exports = router;
