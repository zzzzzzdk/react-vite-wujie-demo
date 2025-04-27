var express = require('express');
var router = express.Router();
const realCross = require('./json/realCross.json')
const realCross2 = require('./json/realCross2.json')
const realCrossList = require('./json/realCrossList.json')

/**
  * @api {get} /v1/comparison/assign-taskid 跨镜追踪任务id
  *
  */
router.all('/v1/comparison/assign-taskid', async function (req, res, next) {
  req.json.data = new Date().getTime()

  // await req.sleep(1)
  res.json(req.json);
});

/**
  * @api {get} /v1/comparison/clear-cache 清除数据缓存
  *
  */
router.all('/v1/comparison/clear-cache', async function (req, res, next) {
  req.json = {
  }

  // await req.sleep(1)
  res.json(req.json);
});

/**
  * @api {get} /v1/comparison/multi-source-track 跨镜追踪结果
  *
  */
router.all('/v1/comparison/multi-source-track', async function (req, res, next) {
  req.json = {
    totalRecords: 200,
    usedTime: 1.73,
    data: {
      faces: [],
      data: [
        {
          minCaptureTime: '2023-10-01 14:10:00',
          maxCaptureTime: '2023-11-01 14:10:00',
          locationId: '370211400047',
          locationName: '7楼澳柯玛摄像头04',
          lngLat: {
            lng: '120.173145',
            lat: '35.935726'
          },
          path: [],
          // lngLat: { lng: 0, lat: 0 },
          // path: ["120.167861,35.942603"],
          infos: [
            {
              targetImage: 'http://192.168.5.47:3003/701.jpg',
              bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
              captureTime: '',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '2222222222222222',
              captureTime: '',
              locationName: '育英实验小学北泊子安置房简易卡口',
              locationId: '3702011611547297',
              targetType: 'pedestrian',
              videoFrom: 'realtime',
              lngLat: {
                lng: "120.157974",
                lat: "36.029556",
              },
              downloadUrl: '',
              infoId: 'this is a infoId',
              similarity: '98.9'
            },
            {
              targetImage: 'http://192.168.5.47:3003/702.jpg',
              bigImage: '',
              captureTime: '',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '33333333333333333',
              captureTime: '',
              locationName: '铁山街道办事处朱家园朱家园村入口人车混合抓拍',
              locationId: "3702014293522715",
              targetType: 'bicycle',
              videoFrom: 'realtime',
              lngLat: {
                lng: "119.95947",
                lat: "35.97949",
              },
              downloadUrl: '',
              // 人体
              gaitFeature: '111',
              gaitMaskUrl: ['11'],
              gaitObjectUrl: ['11'],
              gaitVideoUrl: '',
              gaitVideoDuration: 0,
              // 汽车
              licensePlate1: '车牌1',
              licensePlate2: '车牌2',
              plateColorTypeId2: '1',
              carInfo: '品牌-型号-年款',
              movingDirection: '移动方向',
              similarity: '99.9',
              infoId: '312312312312321',
            },
            {
              targetImage: 'http://192.168.5.47:3003/703.jpg',
              bigImage: '',
              captureTime: '',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '44444444444444444',
              captureTime: '',
              locationName: '点位名称',
              locationId: '123123',
              targetType: 'face',
              videoFrom: 'realtime',
              lngLat: {
                lng: "119.95947",
                lat: "35.97949",
              },
              downloadUrl: '',
              // 人体
              gaitFeature: '',
              gaitMaskUrl: [],
              gaitObjectUrl: [],
              gaitVideoUrl: '',
              gaitVideoDuration: 0,
              // 汽车
              licensePlate1: '车牌1',
              licensePlate2: '车牌2',
              plateColorTypeId2: '1',
              carInfo: '品牌-型号-年款',
              movingDirection: '移动方向',
              infoId: '3123123123213123312321',
            },
            {
              targetImage: 'http://192.168.5.47:3003/image_proxy.jpg',
              bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
              captureTime: '2023-06-01 14:10:00',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '555555555555555555',
              captureTime: '',
              locationName: '点位名称',
              locationId: '123123',
              targetType: 'vehicle',
              videoFrom: 'realtime',
              lngLat: {
                lng: "119.95947",
                lat: "35.97949",
              },
              downloadUrl: '',
              // 人体
              gaitFeature: '',
              gaitMaskUrl: [],
              gaitObjectUrl: [],
              gaitVideoUrl: '',
              gaitVideoDuration: 0,
              // 汽车
              licensePlate1: '车牌一',
              licensePlate2: '车牌二',
              plateColorTypeId2: '5',
              carInfo: '品牌-型号-年款',
              movingDirection: '移动方向',
              licensePlate1Url: '/321',
              licensePlate2Url: '/123',
              infoId: '3213124214124123123415',
            },
          ]
        },
        {
          minCaptureTime: '2023-09-01 14:10:00',
          maxCaptureTime: '2023-10-01 14:10:00',
          locationId: '370211400047',
          locationName: '7楼澳柯玛摄像头03',
          lngLat: {
            lng: '120.167748',
            lat: '35.943059'
          },
          path: ['120.167748,35.943059;120.167861,35.942603;120.16799,35.942271;120.168076,35.942099;120.168263,35.941772;120.168392,35.94159;120.168456,35.941514;120.16865,35.941289;120.168826,35.941112;120.169486,35.9405;120.170082,35.939894;120.17065,35.939224;120.170903,35.938891;120.171273,35.938376;120.171337,35.938285;120.172759,35.936279;120.172914,35.936064;120.172952,35.936016;120.173145,35.935726'],
          // lngLat: { lng: 0, lat: 0 },
          // path: ["120.167748,35.943059"],

          infos: [
            {
              targetImage: 'http://192.168.5.47:3003/704.jpg',
              bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
              captureTime: '2023-06-01 14:10:00',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '555555555555555555',
              captureTime: '',
              locationName: '点位名称',
              locationId: '123123',
              targetType: 'vehicle',
              videoFrom: 'realtime',
              lngLat: {
                lng: "119.95947",
                lat: "35.97949",
              },
              downloadUrl: '',
              // 人体
              gaitFeature: '',
              gaitMaskUrl: [],
              gaitObjectUrl: [],
              gaitVideoUrl: '',
              gaitVideoDuration: 0,
              // 汽车
              licensePlate1: '车牌一',
              licensePlate2: '车牌二',
              plateColorTypeId2: '5',
              carInfo: '品牌-型号-年款',
              movingDirection: '移动方向',
              licensePlate1Url: '/321',
              licensePlate2Url: '/123',
              infoId: '3213124354657457',
            },
          ]
        },
        {
          minCaptureTime: '2023-08-01 14:10:00',
          maxCaptureTime: '2023-09-01 14:10:00',
          locationId: '370211400047',
          locationName: '7楼澳柯玛摄像头02',
          lngLat: {
            lng: '120.167244',
            lat: '35.943317'
          },
          path: ['120.167244,35.943317;120.167443,35.943263;120.16762,35.943156;120.167748,35.943059'],
          infos: [
            {
              targetImage: 'http://192.168.5.47:3003/705.jpg',
              bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
              captureTime: '2023-06-01 14:10:00',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '555555111555555555555',
              captureTime: '',
              locationName: '点位名称',
              locationId: '123123',
              targetType: 'face',
              videoFrom: 'realtime',
              lngLat: {
                lng: "119.95947",
                lat: "35.97949",
              },
              downloadUrl: '',
              // 人体
              gaitFeature: '',
              gaitMaskUrl: [],
              gaitObjectUrl: [],
              gaitVideoUrl: '',
              gaitVideoDuration: 0,
              // 汽车
              licensePlate1: '车牌一',
              licensePlate2: '车牌二',
              plateColorTypeId2: '5',
              carInfo: '品牌-型号-年款',
              movingDirection: '移动方向',
              licensePlate1Url: '/321',
              licensePlate2Url: '/123',
              infoId: '12312466457123123',
            },
            {
              targetImage: 'http://192.168.5.47:3003/706.jpg',
              bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
              captureTime: '2023-06-01 14:10:00',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '1112321312',
              captureTime: '',
              locationName: '点位名称',
              locationId: '123123',
              targetType: 'face',
              videoFrom: 'realtime',
              lngLat: {
                lng: "119.95947",
                lat: "35.97949",
              },
              downloadUrl: '',
              // 人体
              gaitFeature: '',
              gaitMaskUrl: [],
              gaitObjectUrl: [],
              gaitVideoUrl: '',
              gaitVideoDuration: 0,
              // 汽车
              licensePlate1: '车牌一',
              licensePlate2: '车牌二',
              plateColorTypeId2: '5',
              carInfo: '品牌-型号-年款',
              movingDirection: '移动方向',
              licensePlate1Url: '/321',
              licensePlate2Url: '/123',
              infoId: 'jasdkaspi1238123',
            },
          ]
        },
        {
          minCaptureTime: '2023-06-01 14:10:00',
          maxCaptureTime: '2023-07-01 14:10:00',
          locationId: '370211400047',
          locationName: '7楼澳柯玛摄像头01',
          lngLat: {
            lng: '120.162212',
            lat: '35.942367'
          },
          path: ['120.162212,35.942367;120.162631,35.942437;120.162733,35.942453;120.163484,35.942582;120.16439,35.942753;120.165656,35.942984;120.166053,35.943059;120.166359,35.943118;120.166804,35.94321;120.167244,35.943317'],
          infos: [
            {
              targetImage: 'http://192.168.5.47:3003/705.jpg',
              bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
              captureTime: '2023-06-01 14:10:00',
              detection: {
                x: 100,
                y: 100,
                w: 200,
                h: 200,
              },
              feature: '555555111555555555555',
              captureTime: '',
              locationName: '点位名称',
              locationId: '123123',
              targetType: 'face',
              videoFrom: 'offline',
              lngLat: {
                lng: "119.95947",
                lat: "35.97949",
              },
              downloadUrl: '',
              // 人体
              gaitFeature: '',
              gaitMaskUrl: [],
              gaitObjectUrl: [],
              gaitVideoUrl: '',
              gaitVideoDuration: 0,
              // 汽车
              licensePlate1: '车牌一',
              licensePlate2: '车牌二',
              plateColorTypeId2: '5',
              carInfo: '品牌-型号-年款',
              movingDirection: '移动方向',
              licensePlate1Url: '/321',
              licensePlate2Url: '/123',
              infoId: '12312466457121231233123',
            },

          ]
        }
      ],
    }
  }

  if (req.body.index === 0) {
    req.json.data.faces = [
      {
        targetImage: 'http://192.168.5.47:3003/701.jpg',
        bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
        captureTime: '',
        detection: {
          x: 100,
          y: 100,
          w: 200,
          h: 200,
        },
        feature: '11111111111111',
        captureTime: '',
        locationName: '育英实验小学北泊子安置房简易卡口',
        locationId: '3702011611547297',
        targetType: 'pedestrian',
        videoFrom: 'realtime',
        lngLat: {
          lng: "120.157974",
          lat: "36.029556",
        },
        downloadUrl: '',
        // 人体
        gaitFeature: '1111',
        gaitMaskUrl: ['111'],
        gaitObjectUrl: ['222'],
        gaitVideoUrl: '',
        gaitVideoDuration: 0,
        similarity: 90,
        infoId: 'this is a infoId1',
      },
      {
        targetImage: 'http://192.168.5.47:3003/702.jpg',
        bigImage: '',
        captureTime: '',
        detection: {
          x: 100,
          y: 100,
          w: 200,
          h: 200,
        },
        feature: '222222222222222',
        captureTime: '',
        locationName: '铁山街道办事处朱家园朱家园村入口人车混合抓拍',
        locationId: "3702014293522715",
        targetType: 'bicycle',
        videoFrom: 'realtime',
        lngLat: {
          lng: "119.95947",
          lat: "35.97949",
        },
        downloadUrl: '',
        similarity: 91,
        infoId: 'this is a infoId5',
      },
      {
        targetImage: 'http://192.168.5.47:3003/703.jpg',
        bigImage: '',
        captureTime: '',
        detection: {
          x: 100,
          y: 100,
          w: 200,
          h: 200,
        },
        feature: '3333333333333333333',
        captureTime: '',
        locationName: '点位名称',
        locationId: '123123',
        targetType: 'tricycle',
        videoFrom: 'realtime',
        lngLat: {
          lng: "119.95947",
          lat: "35.97949",
        },
        downloadUrl: '',
        similarity: 92,
        infoId: 'this is a infoId2',
      },
    ]
  } else if (req.body.index === 1) {
    // req.json.data.faces = [
    //   {
    //     targetImage: 'http://192.168.5.47:3003/704.jpg',
    //     bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
    //     captureTime: '',
    //     detection: {
    //       x: 100,
    //       y: 100,
    //       w: 200,
    //       h: 200,
    //     },
    //     feature: '44444444444444',
    //     captureTime: '',
    //     locationName: '育英实验小学北泊子安置房简易卡口',
    //     locationId: '3702011611547297',
    //     targetType: 'pedestrian',
    //     videoFrom: 'realtime',
    //     lngLat: {
    //       lng: "120.157974",
    //       lat: "36.029556",
    //     },
    //     downloadUrl: '',
    //     // 人体
    //     gaitFeature: '1111',
    //     gaitMaskUrl: ['111'],
    //     gaitObjectUrl: ['222'],
    //     gaitVideoUrl: '',
    //     gaitVideoDuration: 0,
    //     similarity: 93,
    //     infoId: 'this is a infoId3',
    //   },
    //   {
    //     targetImage: 'http://192.168.5.47:3003/705.jpg',
    //     bigImage: '',
    //     captureTime: '',
    //     detection: {
    //       x: 100,
    //       y: 100,
    //       w: 200,
    //       h: 200,
    //     },
    //     feature: '55555555555',
    //     captureTime: '',
    //     locationName: '铁山街道办事处朱家园朱家园村入口人车混合抓拍',
    //     locationId: "3702014293522715",
    //     targetType: 'bicycle',
    //     videoFrom: 'realtime',
    //     lngLat: {
    //       lng: "119.95947",
    //       lat: "35.97949",
    //     },
    //     downloadUrl: '',
    //     similarity: 94,
    //     infoId: 'this is a infoId4',
    //   },
    //   {
    //     targetImage: 'http://192.168.5.47:3003/706.jpg',
    //     bigImage: '',
    //     captureTime: '',
    //     detection: {
    //       x: 100,
    //       y: 100,
    //       w: 200,
    //       h: 200,
    //     },
    //     feature: '66666666666',
    //     captureTime: '',
    //     locationName: '点位名称',
    //     locationId: '123123',
    //     targetType: 'tricycle',
    //     videoFrom: 'realtime',
    //     lngLat: {
    //       lng: "119.95947",
    //       lat: "35.97949",
    //     },
    //     downloadUrl: '',
    //     similarity: 95,
    //     infoId: 'this is a infoId',
    //   },
    // ]
  } else if (req.body.index === 2) {
    // req.json.data.faces = [
    //   {
    //     targetImage: 'http://192.168.5.47:3003/707.jpg',
    //     bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
    //     captureTime: '',
    //     detection: {
    //       x: 100,
    //       y: 100,
    //       w: 200,
    //       h: 200,
    //     },
    //     feature: '77777777',
    //     captureTime: '',
    //     locationName: '育英实验小学北泊子安置房简易卡口',
    //     locationId: '3702011611547297',
    //     targetType: 'pedestrian',
    //     videoFrom: 'realtime',
    //     lngLat: {
    //       lng: "120.157974",
    //       lat: "36.029556",
    //     },
    //     downloadUrl: '',
    //     // 人体
    //     gaitFeature: '1111',
    //     gaitMaskUrl: ['111'],
    //     gaitObjectUrl: ['222'],
    //     gaitVideoUrl: '',
    //     gaitVideoDuration: 0,
    //     similarity: 98,
    //     infoId: 'this is a infoId4',
    //   },
    // ]
  }

  // await req.sleep(1)
  // console.log(req.body, req.json.data.faces)
  req.json = { "data": { "data": [{ "infos": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7ce180f9c18a1b.jpg", "captureTime": "2024-02-27 14:48:18", "detection": { "x": 200, "y": 160, "w": 335, "h": 919 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240227144818-51\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7ce180f9c18a1b.jpg", "feature": "zyk2LLYwHbNipWwtALBLMiUqBC/PLnIlDqxgKIyqBTDHpXmrsrLtLSAyPKU5KegrRqm6rPklsS54JK4liyyQL7imKy3NKCssUZ+nrGUmXSy+qwynwrAPL8CqVCxsMruqiC0EKSMbGy5JLo2s8KweLu0pwin4qv6qhi6xK7EuUCHAKRetFycOqautUCqDJ0ep5p7wpm4pty94LOAo661WMS+iqqzaq5gxIC3CJo+t0yVcsNwu2ycwsyqv/ikKLmyq67KdKwKmKjDwMIgg/KD7pC2q9jCBLTar4q6zrL+wVq+9KEAlQS5eLnsikChdK7WvXiiVHtQflaV/qKgrsSs0Jg==", "gaitFeature": "", "gaitMaskUrl": null, "gaitObjectUrl": null, "gaitVideoDuration": 10, "gaitVideoUrl": "http://192.168.5.82:9898/image_proxy?img_uuid=\u0026type=mp4", "infoId": "65dd85b2-9030-9ede-3fa4-267ea978b822", "isGait": false, "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "91.79", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }, { "bigImage": "", "detection": { "x": 858, "y": 200, "w": 80, "h": 92 }, "feature": "PiplqlOpZaqdKsQdGqC3KwqpzCWqJKghlyloHZ6qm6RBpBSkL61SHWMozaKqKAampCqjosurHxnYJvcZqaXjKAOlKqyyJ3asL6JaKEwpY6MDp9MsHi37KsSr6K14JjMjM6OdoXqn1yxvpjWkvqkCKdYlYa8xrD0tuCMap42UPSYqoMYqwh1GKZUh8SqHHIKqIqrrrGqiAaVYqcOmshSsK9Wp7qgbpeihT6yWo+2t8iMdKEms7SR8qIid/6N5pgSXqCrwpNAbKygaqccUU6I/pysRiSOJKkoq6CrCKcusgq6fKGmra6nRF1whByurpgcuMyDEpwUsg6SAGW+qOCJZqoMoi6H+qJYpTKG5qq8nXq1SJIAp0CjJqe8qJSgfp/kpTijlhHYqhyYIrDqlUqvGK4ofji3cqD+tQ6iJoC0jKS56JUoqOq1MLUirJSVLolqubSIPKAosOCy2ojCpzSxVpwWqTymlJXeot6p+JUispCxRJWwdlqUYLmqq5yn5J6qpTalQJaEm3i0qBTKoIK1BHFIoVqWoLWalQqTlHsuo6Kt9qPskuq90LAirtCY4JqMhf6KtGpmZtasiJE+nMqa1K1OqpCDCHh8k3673ppQsFymsIZklTiZ5J0oc6Ko8GFEkYxdcoSCtS66WJUAsH6x5KzSi6KvwpQyuYw+oK1udCqrQqFGUFKU7qG8mbyierGItJ6rWJVWwkSpji7ejnyX6oe+klSz/o5KXPKAZJ1GsJKkKqKol7KJYLSqZaamAI84shS1qnlSjAyNRq5Oh5ybaJcOkCSCaFqEqSaQio1OaBiq/nvarJCofp3weYydHpc8lEKzKJGUoLZj/IwerR6kHK0Sk5aEnLhio5ShJoHGncaTkKa8seKbbqaskCCywLiQlLai3KlwmkibeKrGkPR7pnt0rf6RuLUoaFa0GJhcpxyewKbmsEioHH1igzaofpzqqgarWrXgpRhxDJRolO6ytnhqk1CR5GC4il6xIn0UtJ6AkKt2lJhU6LVglpCtgp+2fHaVWJrOu2if+JyUlridxKLslWChpGK6jtKaQJQylnhOCJLspU6ZgqAMs76JipRQsmyjqJ4KmiKmXKgqibSbLHaal5yjYrSYfGi2npVgp4aZCI3wk/iwipDYsi6Hvo2Es3yruKfsjTiV2q4yjNawgsZYnMiisqGWmDKiQKN6iZaV/owIsSB/IpIIqxiZLG5GkrC1vLJOkFKfJJVQqKKgVlhOr6qPZpzGoLauyJM4jNahzHBwsnq0tqLor5SxwJxck5SaBLEWpHClwLIgaZpUzodYnAZ9soVmi6JpDqfWqEJ6rJgupcalHJb2s36FyLDMbFqpWHWUkZiFNoRgtdJwVHQ==", "id": "", "objectTypeId": 6, "similarity": "88.56", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg\u0026xywh=858%2C200%2C80%2C92", "targetType": "face" }], "similarity": "91.79", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7ce180f9c18a1b.jpg\u0026xywh=200%2C160%2C335%2C919", "targetType": "pedestrian" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7ce1812cc7ac17.jpg", "captureTime": "2024-02-27 14:48:18", "detection": { "x": 473, "y": 2, "w": 150, "h": 204 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240227144818-56\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7ce1812cc7ac17.jpg", "feature": "8B3SqQys2KodKz8ogCZhJD2llqswjhSpEqQ9pVSpzaSZLjgaPagUEDscEKVaJEmpcCm8qg2t4qwIE/GpcBERoLyo7BTeK8epuSpZIzgb7aZ5J8ctvynLLNarBah4o1+kySZwq4wgNCm5JB2ouqV5KyMuJqxoIlYgJKK3pvkpBi6QKpUt0SRQozos7Cxko0eb4qCjrPwWQahoJE2n+ywPLhahkBwFqaIoZKk8pUOoHKVpKX8ryKxBrFst+aognX4liyler4EPG6qApH8lgik+ng0sjatELHSgpafQKSQqliI7p3Wq4qtMrDYoZSa4IGguq6PipA8uUZozHDijiaRjIqGY96nGogUroykhrM4oFakdKdcs0iWyHXuaRBRxICyg4qT5IB4pHp53rLCcd6xmJ3qQWCl6qaad7SStJFKldStCIZ+ea6wuLBSbaSO9o0WogagMqrIdASNUqYSn9SoKpSWgCyhiKLAMeK55Lxkfwyf/KdeoVSvbL70TqadEqCGls6oFKkmnDiTJKXqmXKlvni8fg7ACLsaiXByQorAom6QtrLerlqvsJNWodCg/mf2pAyVOJnknb67ko5ol5SESJiEqw6kmq18rPaeXpGIoJStyIsAqq5oSKoMpPKrOLNelB6XmKk6udK48JpksECHVK30ojadaqNWrKaDvqO2mWpZgqBykwI64JNMgkyloJGMp9Bn7FqWuJioFoBgs4Kg3pCEodyznp6MrDSVHqi+rDqRroNkrvi0ILPKe1CQwIYopXCgQI/aq6SSII3KhtiZmKh6mGBLoJOAoI624p6KaJ52GJMSrQKWZquOYOCrZp3smyaewqCqaFqkKoaKmaKBYJXmkgKiVLVgpuqJFKK8oaqlen6Ys4hmQqZwSeyY1KpopaqcBLO0sYaUXn5ohg6iAqcAqXSGtJIejoRiSpkAU5C34LMGpLinvKf6i5R3uLYAlqa1mqccrvasEowSpiCUwknAkEyhQowcpdSnjpJ6gAhT5JQirRaYvLFet7SH6p7OqHKlrJhSqtShYnMAk+RdnGX0e7CkEKHemAp0xIwopa6aLpLov5KuWqhspbKYBGfMhfanppjCarJ3oJIwsKSRPpMalHSfYooikraBAkZwtzK3LKhyrvCrWKPktcqxoqCQqvSpaKA8iIJ9IqJCqW6m3qOOqLp93rEEcc61FId0oSibNoc8qLybVmgooOx0bKqArSy0QKdAjK6wgqvkf2qhMrVSpAyp7qFGd3KiNK6ahlK1umD4oZ6xtqLMseCJAKbgsh50OLIut7SM0KTsrJaA0qTicnSmQLQipNKsgKKOtHagUF6ys4Y8Hq56lqyEmGIGLnafVqMkL0yn7rAwojSrvpA==", "infoId": "65dd85b2-d21b-4fe9-e6a1-58aeec6fe78c", "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "91.79", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }, { "bigImage": "", "detection": { "x": 858, "y": 200, "w": 80, "h": 92 }, "feature": "PiplqlOpZaqdKsQdGqC3KwqpzCWqJKghlyloHZ6qm6RBpBSkL61SHWMozaKqKAampCqjosurHxnYJvcZqaXjKAOlKqyyJ3asL6JaKEwpY6MDp9MsHi37KsSr6K14JjMjM6OdoXqn1yxvpjWkvqkCKdYlYa8xrD0tuCMap42UPSYqoMYqwh1GKZUh8SqHHIKqIqrrrGqiAaVYqcOmshSsK9Wp7qgbpeihT6yWo+2t8iMdKEms7SR8qIid/6N5pgSXqCrwpNAbKygaqccUU6I/pysRiSOJKkoq6CrCKcusgq6fKGmra6nRF1whByurpgcuMyDEpwUsg6SAGW+qOCJZqoMoi6H+qJYpTKG5qq8nXq1SJIAp0CjJqe8qJSgfp/kpTijlhHYqhyYIrDqlUqvGK4ofji3cqD+tQ6iJoC0jKS56JUoqOq1MLUirJSVLolqubSIPKAosOCy2ojCpzSxVpwWqTymlJXeot6p+JUispCxRJWwdlqUYLmqq5yn5J6qpTalQJaEm3i0qBTKoIK1BHFIoVqWoLWalQqTlHsuo6Kt9qPskuq90LAirtCY4JqMhf6KtGpmZtasiJE+nMqa1K1OqpCDCHh8k3673ppQsFymsIZklTiZ5J0oc6Ko8GFEkYxdcoSCtS66WJUAsH6x5KzSi6KvwpQyuYw+oK1udCqrQqFGUFKU7qG8mbyierGItJ6rWJVWwkSpji7ejnyX6oe+klSz/o5KXPKAZJ1GsJKkKqKol7KJYLSqZaamAI84shS1qnlSjAyNRq5Oh5ybaJcOkCSCaFqEqSaQio1OaBiq/nvarJCofp3weYydHpc8lEKzKJGUoLZj/IwerR6kHK0Sk5aEnLhio5ShJoHGncaTkKa8seKbbqaskCCywLiQlLai3KlwmkibeKrGkPR7pnt0rf6RuLUoaFa0GJhcpxyewKbmsEioHH1igzaofpzqqgarWrXgpRhxDJRolO6ytnhqk1CR5GC4il6xIn0UtJ6AkKt2lJhU6LVglpCtgp+2fHaVWJrOu2if+JyUlridxKLslWChpGK6jtKaQJQylnhOCJLspU6ZgqAMs76JipRQsmyjqJ4KmiKmXKgqibSbLHaal5yjYrSYfGi2npVgp4aZCI3wk/iwipDYsi6Hvo2Es3yruKfsjTiV2q4yjNawgsZYnMiisqGWmDKiQKN6iZaV/owIsSB/IpIIqxiZLG5GkrC1vLJOkFKfJJVQqKKgVlhOr6qPZpzGoLauyJM4jNahzHBwsnq0tqLor5SxwJxck5SaBLEWpHClwLIgaZpUzodYnAZ9soVmi6JpDqfWqEJ6rJgupcalHJb2s36FyLDMbFqpWHWUkZiFNoRgtdJwVHQ==", "id": "", "objectTypeId": 6, "similarity": "88.56", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg\u0026xywh=858%2C200%2C80%2C92", "targetType": "face" }], "similarity": "91.79", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7ce1812cc7ac17.jpg\u0026xywh=473%2C2%2C150%2C204", "targetType": "face" }], "minCaptureTime": "2024-02-27 14:48:18", "maxCaptureTime": "2024-02-27 14:48:18", "locationId": 370211400047, "locationName": "7楼澳柯玛摄像头01", "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "path": ["120.187683,35.968004;120.192993,35.968161;120.192993,35.968161;120.187683,35.968004;120.187683,35.968004"] }, { "infos": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e69dcbb8646.jpg", "captureTime": "2024-02-27 09:00:11", "detection": { "x": 1068, "y": 344, "w": 66, "h": 78 }, "deviceId": "370211400050", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B404-20240227090011-75\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e69dcbb8646.jpg", "feature": "HqnBoWqSc6SUpOOcKp3vK4+qeqUTnOEqrSb/phync6goHDyl+Kp6pmInKyQxKg2rXSikmC8g5ZldK9CmXSFeJbWkv6yZnueo6J/0o3il+SoxozkrIikzKWaur6oSKMwesqmzqW+nACUEK4iofa5HKDQtnKghFBMuz6TdG9CaISwljEwtBir1Ig8hpSl5KS2qJawZqUonoqRGpiCiViBwHQuttqr+KLUgDauVKGKtlaQOLIOgvihWqzWiE6o3qBUXtCoXlgGlOahVIZ6cW51iqDQSdaB0IaKkwycuLDiqk66xJESiLKX6q10USSpIpB8w5CgyITkki5I+HMEh9yS7qsycTSgzqNcrCqPWpd8nkaj8oiYmkakgnUETMyl0Kd+g1pDLLUAokCMrI9eqGajsIBQmsZiOrLSsMBpyp0Sc8ypoJz8tRK5BLSCnuqb1rA6s5aWbDgYqvxIVqXIkyhwlHGyosSOIpmkdb6fLJ8ihWyyELJwjRyjULuWpayopnmKpOKm/pLQqCC2EKSWmrKqNK6ks2qw8l9ybH6SXJourmaxNrJoo/618KF+kO4y8IfIX2ChjoBUrXCPGqPulXCZyLo6opiiDqLUrUK9PqVYuIqkKKd6iwaSDLBIpnqxlK0ifMyWDpU6sa677KqMcuKfGJBgkIKmIrC+osyG9LF+siKqhqe2lhSnLI84cnClpq4ErIamvJQCt9CtpKC6oE6YUID8mrp3xqzMlvqGIqiSso6W2rA0p+id0KSytSqxvGkAubioKIFEmOCssJN6kHyzlKQ4mmaF6JhUmY6TloBCl+6ZkJlSqACwCq8kn8yDHrC4kxKXjpJQQvZI0qbejQZ2gKIWeEigQLawqEx42JwmpQ6wUpKQqESRRJqwmEyaQLBAnGamaKhksTaTDKPsgEKqrrEsrEB+6L1cfd6eHJCihAy1vKvOsQCgWIaQmayJCKByf+qgGqfAiXxa9qMAjIK1lH30iBJBSp2IlEKosJAorUphwmaWrECV4LCctFySFq84hIKhzqtGqTyquK20hKaRTITymkCz5J7esuyexJQYmhabSoVQtdKOTphwtlJSUqG8o3B7+KtCqhpz+KSMo2iH+IZer0icBqG2lISf0pFgslKTRn12cMy0cIMEuAqt2q8ou3CYIqG4hCaeNqSGsQKpnr7OmACgJnk8k6K26KzIqSqk9qmYmOiWao3ApuiyhLe4oyizRkLATJaxLIreicapBo0KkEBfUH9OoN6wVJxwoRKd+p8Etq6nTqocmYyj8JtwszCpJIoanZyvdKeck+yX1qIgqNiR5KgCsfadTpIyqB6lFK9Oq06yVpU2oiKLwokYo9aaeLMEhfyVhLEUvzSRhoA==", "infoId": "65dd341b-d656-0022-e6b1-0da7f9eadbe6", "lngLat": { "lng": 120.136871, "lat": 35.983007 }, "locationId": "370211400050", "locationName": "7楼澳柯玛摄像头04", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "99.40", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }, { "bigImage": "", "detection": { "x": 858, "y": 200, "w": 80, "h": 92 }, "feature": "PiplqlOpZaqdKsQdGqC3KwqpzCWqJKghlyloHZ6qm6RBpBSkL61SHWMozaKqKAampCqjosurHxnYJvcZqaXjKAOlKqyyJ3asL6JaKEwpY6MDp9MsHi37KsSr6K14JjMjM6OdoXqn1yxvpjWkvqkCKdYlYa8xrD0tuCMap42UPSYqoMYqwh1GKZUh8SqHHIKqIqrrrGqiAaVYqcOmshSsK9Wp7qgbpeihT6yWo+2t8iMdKEms7SR8qIid/6N5pgSXqCrwpNAbKygaqccUU6I/pysRiSOJKkoq6CrCKcusgq6fKGmra6nRF1whByurpgcuMyDEpwUsg6SAGW+qOCJZqoMoi6H+qJYpTKG5qq8nXq1SJIAp0CjJqe8qJSgfp/kpTijlhHYqhyYIrDqlUqvGK4ofji3cqD+tQ6iJoC0jKS56JUoqOq1MLUirJSVLolqubSIPKAosOCy2ojCpzSxVpwWqTymlJXeot6p+JUispCxRJWwdlqUYLmqq5yn5J6qpTalQJaEm3i0qBTKoIK1BHFIoVqWoLWalQqTlHsuo6Kt9qPskuq90LAirtCY4JqMhf6KtGpmZtasiJE+nMqa1K1OqpCDCHh8k3673ppQsFymsIZklTiZ5J0oc6Ko8GFEkYxdcoSCtS66WJUAsH6x5KzSi6KvwpQyuYw+oK1udCqrQqFGUFKU7qG8mbyierGItJ6rWJVWwkSpji7ejnyX6oe+klSz/o5KXPKAZJ1GsJKkKqKol7KJYLSqZaamAI84shS1qnlSjAyNRq5Oh5ybaJcOkCSCaFqEqSaQio1OaBiq/nvarJCofp3weYydHpc8lEKzKJGUoLZj/IwerR6kHK0Sk5aEnLhio5ShJoHGncaTkKa8seKbbqaskCCywLiQlLai3KlwmkibeKrGkPR7pnt0rf6RuLUoaFa0GJhcpxyewKbmsEioHH1igzaofpzqqgarWrXgpRhxDJRolO6ytnhqk1CR5GC4il6xIn0UtJ6AkKt2lJhU6LVglpCtgp+2fHaVWJrOu2if+JyUlridxKLslWChpGK6jtKaQJQylnhOCJLspU6ZgqAMs76JipRQsmyjqJ4KmiKmXKgqibSbLHaal5yjYrSYfGi2npVgp4aZCI3wk/iwipDYsi6Hvo2Es3yruKfsjTiV2q4yjNawgsZYnMiisqGWmDKiQKN6iZaV/owIsSB/IpIIqxiZLG5GkrC1vLJOkFKfJJVQqKKgVlhOr6qPZpzGoLauyJM4jNahzHBwsnq0tqLor5SxwJxck5SaBLEWpHClwLIgaZpUzodYnAZ9soVmi6JpDqfWqEJ6rJgupcalHJb2s36FyLDMbFqpWHWUkZiFNoRgtdJwVHQ==", "id": "", "objectTypeId": 6, "similarity": "98.65", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg\u0026xywh=858%2C200%2C80%2C92", "targetType": "face" }], "similarity": "99.40", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e69dcbb8646.jpg\u0026xywh=1068%2C344%2C66%2C78", "targetType": "face" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e6a4a8a7f44.jpg", "captureTime": "2024-02-27 09:00:07", "detection": { "x": 1123, "y": 544, "w": 235, "h": 535 }, "deviceId": "370211400050", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B404-20240227090007-33\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e6a4a8a7f44.jpg", "feature": "uiyjLaMee7FkLy8omrMsqMoqdTKXLFeoBi7xrUOyObAjr8MhTK3CK1SnFiulLd4sByZyrzGonZQ9LVGoKqWtHYilfSwHLE0rNi4KpZkorKebo4orBqwVLLWqqCUoKB8sOiuoKLgurS4hLQ6pbaf6KAGpNzDfKputPyq/rYkysC1nqviqSin8q/afsLHbMKywSrDhqtMmXCl/ME8o4Z2sKokuP4Sdgrot56u+LTarsjJorEqmcbEkqm6w5Cx7qBCoR6gyMLUqZC6PLZgZTK3WsUexHTBsLAIroLF+IQmsg6Kprp0dDiyMLZ8r0i1aqlmsJZ/kKpau3yaPrOcv7CuULQ==", "gaitFeature": "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", "gaitMaskUrl": ["http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e8f58ba39a0.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e9269d1463e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e95b5c4e552.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4e9495eb7d3e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e939dcc8f71.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e90013f7a40.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e91e97590b6.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7c4e8ee557eab4.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e96ebdefed5.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e97a4a6f7e9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e99e17f8664.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4e984bc2b051.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e9afceaa807.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e9da64a1c39.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4e9b652ab202.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e9c75ce09d6.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e9fcd11ca0d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e9eb55a44f9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4ea03d3808fa.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7c4ea11cb3c43f.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4ea22f3e9aa8.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4ea3a7229233.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4ea4f7ed194c.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7c4ea5bf6bf3e8.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4ea6ecdf226f.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4ea7d18b497b.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4ea8f2efec9e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4ea998e639a9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4eab4e22053c.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4eaaa53a2093.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4eac1e9a86af.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4ead54c1a720.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4eae3c52db2b.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4eaf61f0ae35.jpg"], "gaitObjectUrl": ["http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e6d2a78a988.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e6c888c2ca2.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4e6f7123a613.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e7081b73f09.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e6e29bcf46d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e71c2b50a74.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e72c7258c25.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4e6b9419137d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e73410969ac.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7c4e770593e776.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4e76750b7ac9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e7591910f5a.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e74c53bdf86.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4e7883f00e93.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e7aeda4c255.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e79f4d477c6.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e7b9f556d23.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e7cddbc1b3d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e7d2e658bff.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7c4e7eb48e9aee.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e7fd5c4a67b.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e807fb14095.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4e8183b40202.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4e830adab1f9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e823a97df1d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C7c4e849a810a30.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e852dfb32ff.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4e86dda2bcf1.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e87f2d522c0.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e8849b00dc0.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C7c4e89d08b3670.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C7c4e8ad7cbd1e1.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e8bba447670.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4e8c8fd6d889.jpg"], "gaitVideoDuration": 10, "gaitVideoUrl": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F109%2C7c4eb1795b8c10.mp4\u0026type=mp4", "infoId": "65dd3417-a7fe-39e6-6c42-0be7666988f9", "isGait": true, "lngLat": { "lng": 120.136871, "lat": 35.983007 }, "locationId": "370211400050", "locationName": "7楼澳柯玛摄像头04", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "91.09", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }], "similarity": "91.09", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C7c4e6a4a8a7f44.jpg\u0026xywh=1123%2C544%2C235%2C535", "targetType": "pedestrian" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4eb20d8bc63f.jpg", "captureTime": "2024-02-27 09:00:12", "detection": { "x": 1082, "y": 354, "w": 66, "h": 92 }, "deviceId": "370211400050", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B404-20240227090012-67\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4eb20d8bc63f.jpg", "feature": "HaK6qkUgi6HKHk0otKMaoyIqUyVtnRAsJijfKdiW+SaILPma7qwAKDyitiVSLBGonp6aqc2nLCmtKBYmXiuELW0gJ46GrH+r4qTpJWAm5CgWKn0efy2bJJmstq8TIVMsJSFhqSsfPJYKnY+m5aqxJTMnLKX5p/on6KpJnBoE4i3sKFcsLhARK8skaiGGLSuuKBldFWkkiaAqKCGsHSz2Kt2sdipanoam3KuupJSqi6XIIqMrUyV4rW4gsqpMpY0dQihVH1gnWaABqSKiTaR4HsInyR5ULgufsSrlLlyqiaYQlFEiFRhRrl8mQim7ndow+aIMHi4k+iOQovQfoKn6nyqqIiRZJ9OhhSbhKG6qs6gwqq+sp6cFLBOjZyybKgOeMqQkKxYkoqmlnP+sTqhepn4mpSs3qGqqBSwHKHytWiejITEs6KwBJcUbnaIcoVulP54Xpx8noSaDJCYs5CkdHA2nribcJ9ene6hGJIEpFiwLK9soISwfLLusS6fuKMGou6WgLQIpNi03KSikFa0WKAosZyjTGp+hd6X5IZWsT6f2qGMYO6TeLLSlzJUxKEumOSOJKsSmcqXjKgQm/h6kKfqsrKUhqD0r3KsDoQkpBCNbKQGowiXzK9ckk6hHLYahSiizqMmdjyADIt2n4qRyKUgouqY2oNus/p6QppmprqVVp3CkcynkIyslQSdkoecn9awdJCqulyxGI1WqmSm/FvicyiuYHkEivxr+JUWoJqYXqnibByh0oluqUR1bqdcsISaPKgUmTRQGLT4qKatQK9ClGB7fJxQYnajzKBaoJqMyqEaoYi3NqNmlxiQ6rJstlKGfJFQYFqatq9smUpyupIunaSoMJuwpwCIuIHMnZKtRpVcmxRcrItwr06NSLBcu4CjFKUYuJaQyGWgrNKrbJPej+KwJLY4kvak6IY6qMyrVnR2op6cgpseYxad+oT8s8q3JpBYsISQop40stqnUJaeluC7GpVQfIqqyKRIpNSW7LYmkCCFfJ+sjkCutreGnCKd8rJ8pjiZWKuYqrJv3rcWhRCGfHIYT7CRBpk+lxKFNJEAppyTsohkt/CgXqoste6YxphKrWKFMJc0uRiZWKfis5ipiqFCjGCz2qbcjBKptrWiiGCnIJzAt7KP5KMAocyKJq1Gn7KgxnoAgv6VssIytJp/bqNGjXa2PJkQmmiCMrE0oGSSqJ3whfSowJ+kogCw1LK4guKysmSkfSieVqZmieKU6JLYhq6PxLJsp3qkYoOAuD66SqBKlOSDwJ+IpwSXiJ6qrgigflGGphyK3pvUNCKzYLealrSCSKCKgRKrvKYQnTa52npapyB7tqN6hla8WpkmlyisZnoKkgyoZrA==", "infoId": "65dd341c-5c9b-5479-04f9-a096d18ec3f6", "lngLat": { "lng": 120.136871, "lat": 35.983007 }, "locationId": "370211400050", "locationName": "7楼澳柯玛摄像头04", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "91.09", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }], "similarity": "91.09", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C7c4eb20d8bc63f.jpg\u0026xywh=1082%2C354%2C66%2C92", "targetType": "face" }], "minCaptureTime": "2024-02-27 09:00:07", "maxCaptureTime": "2024-02-27 09:00:12", "locationId": 370211400050, "locationName": "7楼澳柯玛摄像头04", "lngLat": { "lng": 120.136871, "lat": 35.983007 }, "path": ["120.187683,35.968004;120.192993,35.968161;120.193271,35.966490;120.193359,35.966243;120.194591,35.964009;120.194264,35.963699;120.194143,35.963504;120.194080,35.963298;120.194089,35.962942;120.192371,35.962730;120.189580,35.962665;120.189505,35.964290;120.189474,35.966089;120.189600,35.966188;120.165446,35.974283;120.165319,35.974280;120.158192,35.972850;120.150672,35.971361;120.146272,35.979287;120.144601,35.982188;120.144196,35.982840;120.143995,35.982789;120.146040,35.979150;120.142465,35.978384;120.142376,35.978611;120.142029,35.979156;120.141537,35.979516;120.140769,35.980010;120.140969,35.980183;120.141268,35.980678;120.141460,35.981180;120.141503,35.981728;120.141429,35.982232;120.141144,35.983018;120.136871,35.983007;120.136871,35.983007"] }, { "infos": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C77d9a45a91ce86.jpg", "captureTime": "2024-02-22 08:40:18", "detection": { "x": 644, "y": 259, "w": 206, "h": 524 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240222084018-19\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C77d9a45a91ce86.jpg", "feature": "hiTAMI0s6Kuap/0vCaX3Lm4wQi+eJWKidy7urhaSXC9Ws6Iws6/4pkWy4y24KT4slSy+pcCsZq3gKlOkCSmFsLqhMCdcouon4SPnKrin0SEGp80rNaqQMLmwWyiTrskvl6rPHWqwhxzzLM+v2SlFoqalRS6rpUGsNajjrWOUx6ynIYutP6nPJeGu/q4+LXqsm60er4WkybB2L1kwESWSJ38wEbIiMXgeD655L0cvCiwTsRery687sDWqhjBOmL0jYC5GqACtxKmPKccuGKzvKE6ubCkVJ98pZq8dLcEtra0WokMkeCmIG6Yus6Z9oQyw0KjnrMOrpq+hMC0xhy6zrA==", "gaitFeature": "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", "gaitMaskUrl": ["http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9ba952fffea.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C77d9bb3e31ffa8.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9bcb13994f4.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9bdd1aadb92.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C77d9b916b4e518.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C77d9b8c558c684.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C77d9be50267f2a.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9b7f2162d49.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9bfd9fbc87c.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9c01e48e2bf.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9c27856c16c.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9c1bcda3494.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9c535ab692c.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77d9c62bcda989.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77d9c40ba3f85d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77d9c33bedaa03.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9c7ec2d44ee.jpg"], "gaitObjectUrl": ["http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77d9ad08b87202.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9a6cb4028a9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9ab26302011.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C77d9aa1b1a9320.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C77d9a8c121dc04.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a7f2726c74.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9a9aaff2960.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a5ef10ae5e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C77d9ac18d49063.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9aebc34e68e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9b02511ee37.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77d9b17bbbd240.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C77d9affd98d1d6.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C77d9b4467ab520.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9b2237ad042.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C77d9b38a4cdd03.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C77d9b58c90664b.jpg"], "gaitVideoDuration": 10, "gaitVideoUrl": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F108%2C77d9c9a5c44a32.mp4\u0026type=mp4", "infoId": "65d697f2-5832-acc9-8afa-6c60227f7539", "isGait": true, "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "98.67", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }], "similarity": "98.67", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C77d9a45a91ce86.jpg\u0026xywh=644%2C259%2C206%2C524", "targetType": "pedestrian" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg", "captureTime": "2024-02-22 08:40:19", "detection": { "x": 858, "y": 200, "w": 80, "h": 92 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240222084019-19\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg", "feature": "PiplqlOpZaqdKsQdGqC3KwqpzCWqJKghlyloHZ6qm6RBpBSkL61SHWMozaKqKAampCqjosurHxnYJvcZqaXjKAOlKqyyJ3asL6JaKEwpY6MDp9MsHi37KsSr6K14JjMjM6OdoXqn1yxvpjWkvqkCKdYlYa8xrD0tuCMap42UPSYqoMYqwh1GKZUh8SqHHIKqIqrrrGqiAaVYqcOmshSsK9Wp7qgbpeihT6yWo+2t8iMdKEms7SR8qIid/6N5pgSXqCrwpNAbKygaqccUU6I/pysRiSOJKkoq6CrCKcusgq6fKGmra6nRF1whByurpgcuMyDEpwUsg6SAGW+qOCJZqoMoi6H+qJYpTKG5qq8nXq1SJIAp0CjJqe8qJSgfp/kpTijlhHYqhyYIrDqlUqvGK4ofji3cqD+tQ6iJoC0jKS56JUoqOq1MLUirJSVLolqubSIPKAosOCy2ojCpzSxVpwWqTymlJXeot6p+JUispCxRJWwdlqUYLmqq5yn5J6qpTalQJaEm3i0qBTKoIK1BHFIoVqWoLWalQqTlHsuo6Kt9qPskuq90LAirtCY4JqMhf6KtGpmZtasiJE+nMqa1K1OqpCDCHh8k3673ppQsFymsIZklTiZ5J0oc6Ko8GFEkYxdcoSCtS66WJUAsH6x5KzSi6KvwpQyuYw+oK1udCqrQqFGUFKU7qG8mbyierGItJ6rWJVWwkSpji7ejnyX6oe+klSz/o5KXPKAZJ1GsJKkKqKol7KJYLSqZaamAI84shS1qnlSjAyNRq5Oh5ybaJcOkCSCaFqEqSaQio1OaBiq/nvarJCofp3weYydHpc8lEKzKJGUoLZj/IwerR6kHK0Sk5aEnLhio5ShJoHGncaTkKa8seKbbqaskCCywLiQlLai3KlwmkibeKrGkPR7pnt0rf6RuLUoaFa0GJhcpxyewKbmsEioHH1igzaofpzqqgarWrXgpRhxDJRolO6ytnhqk1CR5GC4il6xIn0UtJ6AkKt2lJhU6LVglpCtgp+2fHaVWJrOu2if+JyUlridxKLslWChpGK6jtKaQJQylnhOCJLspU6ZgqAMs76JipRQsmyjqJ4KmiKmXKgqibSbLHaal5yjYrSYfGi2npVgp4aZCI3wk/iwipDYsi6Hvo2Es3yruKfsjTiV2q4yjNawgsZYnMiisqGWmDKiQKN6iZaV/owIsSB/IpIIqxiZLG5GkrC1vLJOkFKfJJVQqKKgVlhOr6qPZpzGoLauyJM4jNahzHBwsnq0tqLor5SxwJxck5SaBLEWpHClwLIgaZpUzodYnAZ9soVmi6JpDqfWqEJ6rJgupcalHJb2s36FyLDMbFqpWHWUkZiFNoRgtdJwVHQ==", "infoId": "65d697f3-732f-4266-9f9f-4be92fd52be2", "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "98.67", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }], "similarity": "98.67", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg\u0026xywh=858%2C200%2C80%2C92", "targetType": "face" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77e26a7ba59c15.jpg", "captureTime": "2024-02-22 09:11:02", "detection": { "x": 620, "y": 170, "w": 222, "h": 266 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240222091102-13\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77e26a7ba59c15.jpg", "feature": "bKl9rSur26hYKdai/ycxIwCqliDGq/QgK6aUqjYVEa2pIdOoJKlYopGpM6pNnoesFKKGpFOtXqq+KCuqL6jwJJcm2KXYJvCfO6dHomIhOZmuK0knUaOjJv+qf6vIKPSg1aeTInarFyUtpsEonZ+qp10sOq6FpeIr9qmdoKWkPSqRInktmyw/qPyj/C1cmtElGK1AKPYmbSSJJu8iDaXlJAiueawIKPIhlhydIympCahpL/2oxCgdq+Sl36bpqworgyw+omgmQaQBKO6kx6ZnnA4klJuxkXKkACoxJVymQq8tKjKonSLFJGgorKATpfMueCYjKwon0qbMHvAbLCirqhClESk/rLsruagdIeyotaafKBme/6VJqJ0saSUUKIElOSmjLCQnpp1bI+yn+akkJ2ysGC27qZCpryR8q7ekDSvOHPQrmqlyLVWkAKeEqeWp1iPFJaAssSqJqGmfgywTqtup8ynIKKAiGChSKE+jsjEDKdGtMa2nLPCroiD0IEGdCKxSI+IlziyDJSOtB61HKdEptauOLMsVpiQqn9upvakUq9ScLK3BJMGpISfaqBon/iiPKgkfYhbZJKSl5yQTKrMl+5zFJ1QoX63CrnQsoyMqKrWn7KGYKyqjHKgcHScmlKMhKu2sxKu+JE8oRKo+K4YhPpkYILekTaa8L4erHiN2nb2OdKgvIVuqyirhruEhPiZ7qaqvyRtLJDeroKrllq8t3ilKqreoUqKfpfKjGifmrSoniRrDLImtZCZbJV4o7CnXpQmoZaXSKByoAZxmIzcc1qORnO4daZn/Hj2uBiAlqB+qTSz/qSQrVZSQqUOgX6cZphWpfCK9qBATJSRDLH4k8ajzJP4gQieCKMoe6Km4Jv4sU6R3q9WZ4ibzmsQpt6jlmRKl+CkDLzmpWJunocQlDSMqMAslyqpzqc4qCSpVLDKrPic7qe2afKRPJg0rZR0np4IiCibOqPMjwyGIpTqkk6gSHUEqVSbQLJwqJKXiKSisDSpRLFUs/CmCrFyAp5OuJ9+qRiy9Ja8kmyQWJf4gAi0CInOogKbqnOwoBSTIJ5snY6Q3IFApHiR/qPUeKSFfLZ+pkSijJhapFSwUoEKsxiSSrMimxaMGqp8owKW1pkOpbyANm/YsbKzeqWAo0ZpXqAstt6ZwqG6sH6iCrponFp04rVCoSKsCLyYrAahPJQspbCxSpuucqKF5LGkmmS0AoocqQqxrqJWoKqiYA86nPiUJGRutX638J2YifRz5KBYfFakNp1Kfo6comGklACpXKgOrISy4KvAbV6Dtp9Qq8SEPH4WmgqpoqicbZqWMKDuljqwNom+YQZ6ApEskJx9Sn6ohNiq6mfstBRLFqQ==", "infoId": "65d69f26-3d6f-cacd-3f63-bd171ae6c15e", "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "96.44", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }], "similarity": "96.44", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C77e26a7ba59c15.jpg\u0026xywh=620%2C170%2C222%2C266", "targetType": "face" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789b81a584b803.jpg", "captureTime": "2024-02-22 16:34:49", "detection": { "x": 753, "y": 325, "w": 276, "h": 678 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240222163449-00\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789b81a584b803.jpg", "feature": "0C1AKcirOKmKr2cnhSwwL1ws1DBerhsie4mcJ2Cq8yIYsMGqf7AnrGWwXqjTLt8kpCm6pMMlbim4JOQqMadPJ5ivhqHeqAqkX62YrHQsOSbzrl4vqivKMuauBqoorKOau6FWHhuymikQqHqmJxiFrNgvfzHgI4mqhKzqrNAmiyEbsDWv9Cg+tPmtQ7G/qWUnFiNCqLUrOrAmLCMr2aYJLH8o+ajuq2YwYCnoLOcu9S2dqw8uHiPFqBkohTLyqkgYYCJZKCmuI60hLt0ZoZ3QKbKtKyg9JWGtQLLpKwOwihjvLGYtEC3NrEswx6gPrkqzji/Porqpj6n6MXwy7i1NJw==", "gaitFeature": "2qhqJlMmQKVZD78oeaX8nwmgXiS9pcskyqWjpGiqfKZ5KkqdiClAo0incypkJYQlbCi0n8gkCauoKs6mZ6e0n4MZPCk0KvCh+6HfJBenQybkpRotlCdClo2mN6HEHcemL6SQKLymNyVcKCWqZygeqHGlLqEkJGOQLiI7K0AniKNdqQgYfigsKjkcRp40JPsotqikJ0SmOpyOJgWeLR/dJ5co2KeirJUWCSdkprWpkiLcIDuryilsKoQhXKQmFtsk+ymIKp8gcql+KZms8B12rfIpXRguIcSqpaiPp+YsD6ucqKwnEau1mMCgCptoKYasQSTCKdCtBSUsJlIiKyYcJ0KjT6iqIMSl8KB/pgSe4SlFHl+lnqkwJ84TuyQuph8SxB6UKMYeSqIiGMkqMSQSJbGqtCJQpnuol6y4JWkn26qIp8ifkqSWKFmrwylBjQgmv6r+pIkowaMuqdElgw2vqgShL6C7JLWhH5qNpXKofKUup44m76PepKGn7akKIa6n9a2+I3AggKsKK58k7xt3IgClXyeOItiroae5pumk+SiPoA0qEKQeHsUc954VpE2n1ihppeGZ9B4/FKknQC0JJEom643hKX0U3KhYoj0qG6hlKMAjuKUPqX0UTCwNKaWcR6ndpB+lNaYkpl4oA6QxoAqtOZLXoRahT6e6LFkk4yg6JGMUMaYmKCUbHSRSn9GspSXyIqKi7Zw5qCcRTSh0GcuYeSasqXabBCoToeSg4K0yFAsu+6lNFmyh3iRuGgul9aEfInooUispIiOmHxo/ndQdFKW1nAoZiyUKpZobkCNjoGMn4KICo3oo8igwqNkQgqglKVIftyp0GK+pdCERKhwj3inwKg4ojaQYLf+lPSGUnWwnFyc2qJGoIaIxKR4ifafTHYio46mlqk6VD6ANGWCoySeDpMyYwhw7nQSfNSuaox4nfiMopE2m9abeokOkfCBvKFEmk6IrpzEouCTHKsUjsaBkJEwnD6YfKoiqPKnTo8CoKKbQopCg4yB2qXGhxBxrKCCtYijqIz+nfqfwnpAmcyBSncCbKKwLLbYrpx9qKFCm5hREI1WoH4q0l3+kXKEHrNCnUxwppckiyCC2qNGo8KkqpbySD6eHKCyeGaVzJ/CiYCGDG68er5UsKZSr+B3/H/WkWSm2pjKTkiAmIg6pZ6VmJnQmp6PIJ1uhMx5ZqBoqSKSfnmagxKh6JjCjVqXtqDUo6SDYH9mm0iv+I8yqky4YpPalRiYPp7YcqyXwpR8Su6T1oGAoWimYKNoc+p9sLQQoaqDIJ5+VNaTXKbSjgyp2poIi46URp2GnLyCqKEIn0ylzJo4knSrNJ1UtOp9VHHaneKMLLFCkT6s4Kxuhqx3gHfWdT54Hql6rwSu1qFulVSV8LKQnRR+iluMmlSWIhtCacJ+3if0WYpwNKXwpzKllHeYgCaMsojakiyF3pc0l9KdkJemhBai2HXqpjKhCJkycXSxvJaScZakalask6SVnnqEllqVcIUIi8CGapfUjS6Ueqimj9iXUpNKoTKsXpAgpkKLWniUghSZ2IpskmyguqdkeNqTGIoeleCT8m34lqSGTng4jfZzQogwp76ckKbIMLSSSI0Apfp8pLvigaho8pDeoTikqIQGopxtTpL+o5ihjKPYhKKxMq8inOCdcpy0nVx7ZpnGicJiSKr6o/qhBJFIoNCwnpGcsCpsyrAklLKIkmtIhGCH9qs6hPByPqRSmxqd2JQglaByyqE+rDiALIkeoiAqlpASi2yMFLACRdaJTpkYpkKZxrWQmmihDJbOhoyV8pFol2qhOKWuoJyUbIBmm5KfCIcAsFKp6pc6pqaQwq4CnZ5q0HHQpbSk2qDwo6hvRjW6rRyUXIU0pTaVGJh6fziGsF9ieoCQsmlSrdRxUJAon0ag7qfuodpmrIH0r0SQRrigo4ij8IgSe+h6KGLur0it7o0eokCe2KC0nV6aHpJSrXaSTKL8oNygcK92oF6qaqzEkkRx3mFYcbykfpfmgtxGUJ9YrTo3eIo+oJRgWLpsq+yWXIIMnnSWenGwpqSWjqYWeqB6ijkMoYan5qyKc9yCXIKaplCtXJUmsA6XpqYGYtybgpGQmuKDwKPmfwKV2qSWs2CIXqUchkCleI1yo1iXxHIsqi6UBon+k6iaAo9gl0J6LoOumpyfyibce+SEKKdqnPiBHLCKs6CTnnzYakSQBmPElAJWfHhYmnqBJLA4oTKOUGIunFirVotcpJptwnF6orKaKowKjryUEnwaV1qXjpIgG9Rf3oq4kT6SSJvAcd6SMKEwo+yTdKIqc5ggXLHyk5h7bF7Il4qdjqxwjX6fPJTKpsKlEI9aqaqGcKM0ovKKvJQ8knyd2qD4lVKedHHwde6eNqZGolia6KG4iKhkFKMqoNincoUYkc6PTIZqpUaolp1IbaB2KJNiojKXHpH+g3CXVqHkjAyWnJoeleiVQqDgkkiLKKCqohitmqJUeeyipKPIpzihZpv8pBqhKqA2mpaWAG8GnxiGipeAlGSRXI4YdcqGgpOsmmyY2Kvmk1hiLIbEmtyJ4p6wkcJzoJ0gekSERKsUcYSbgH4oocaIDJfEf+KIFEpOpO6cFJz4k3hEMoVsoYCmBlk+mDh/5nBEmTamJLbGntSELGFUo7CdZJwQq2R1fmagqSSIToPeWISgZKlMoExyfqoEoZpuaqLwit6VELDcdHSUAiT2nVqanqQ8jFiE=", "gaitMaskUrl": ["http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bac89b3fb2a.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bad4ae70668.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789bb3dc745406.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789baf75661f66.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bb19a6e6cc8.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bb2e164183e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bae518ffad7.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789bb0c7fd8395.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789bb45a138759.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789bb514db44b5.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bb6283c2f63.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bb79faf9bf5.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bb94b4ddf01.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bb81e577afb.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789bba0d74d651.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789bbbf8e23c36.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789bbcb25cb045.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bbeea0b9934.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789bbfd406fcea.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bbd1813f121.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bc04958108b.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bc1732f0e07.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789bc2363f14d0.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789bc3e2dc5677.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789bc4dc79bafc.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789bc6f5613ddb.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789bc5c58decdb.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bc7b3812157.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bc87ad68645.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789bc90a306316.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789bca0b5921af.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789bcb7a90700a.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789bcdb9db6e00.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789bccdec61cfc.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789bd04f8add65.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789bce3a6f8569.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789bcf2dab190f.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789bd1850983a6.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789bd3dd8de80f.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bd25537f8ff.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789bd4c621b9ad.jpg"], "gaitObjectUrl": ["http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789b87f99ee0c9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b895be5e94d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789b8680c237d4.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789b83cc41d428.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789b84726a30fa.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789b889ed2cdac.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b85c5e6d322.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789b82183d139f.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b8d46aa0890.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789b8ac9c58b4c.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789b8bab5fd0bf.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789b8cb9bf2086.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789b8eaeaa4db2.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789b8fcd337829.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b90b01776e5.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b91c2c389e1.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b92d98a3dca.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789b946762e950.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789b9645998b9a.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b932d774bcf.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789b95b22577ef.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789b97f5221c27.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789b9844ed0360.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789b9982b9cdb5.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789b9a495ded7f.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789b9b8ac55397.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C789b9e4fcc2fcb.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789b9d66cbbd18.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789b9cc9119438.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789b9f2c385a74.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789ba03c0bd74e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C789ba11c1d7ce6.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789ba22cbbe01d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789ba4cea8e08d.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789ba3f275e6d0.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789ba5be53f95e.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789ba6e5e3e264.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C789ba79feefe98.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C789ba87a7b7625.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C789ba9cc046ba9.jpg", "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789baa3b423f09.jpg"], "gaitVideoDuration": 10, "gaitVideoUrl": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F108%2C789bd61d2b0c0d.mp4\u0026type=mp4", "infoId": "65d70729-4f85-993d-ac8e-4aadd615294c", "isGait": true, "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "95.59", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }], "similarity": "95.59", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C789b81a584b803.jpg\u0026xywh=753%2C325%2C276%2C678", "targetType": "pedestrian" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789b7f246aa838.jpg", "captureTime": "2024-02-22 16:34:56", "detection": { "x": 886, "y": 200, "w": 84, "h": 96 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240222163456-54\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789b7f246aa838.jpg", "feature": "GJ8sqPOorqinpUuaEiO2KIihEK64rWwpMS3tp7OnwKjhIVgm0alwoFmmXqMvK8yqWKd3p1arvIBQKzglz6VlJJisUauIJoGqYaGtEK4j1B/TJiUoTSx/Kyesoq1hKjQd2CFsqw0mbSjDpF8lKapbLXEvqhCopisrQ6DEpBwjBC56KPgpOiMZKrchUSwOL06nGKsGqV0p9ao6JTqsuywsLO2rRyURJX6oyqqaKsetcyEYLIimI5ioppknU6r1qiwkjy3mnvuVaSgVJ2ymq6bhJ9qmjaM6qRGgniq8LJWl36Wsq1Cpm6x0qEsmvCzVJzYumB1LoNol1aR0JAapOpUNovMd46DqpysrTR0LqLwpOamCpwwlzR46qjGgPRjJJekqFiarJ1smaaTjJhyqy6tPKMwqESzEqyqspaatqoemOi5/Kl6gjqq6Ki0kC6zZqOGrqagNKNsrXpVLrBykBy2SJ8Osih7rKPykmKXiK7EpWSmHJUWgiKhGMMGpp6VLprKnyalsJ2UqQSujLFGtLqkRJj0sMKzmLsOebKS7nXSkOq8Wq2eo56yoJ0WjxwnEqa8lrydrIDupgarLp0MqgilFHdUdSKIHKE0nO6uKpEAiy6kGKsQdqyMNntGjSKqkoAolxqVVJFGo6KwbqE8tYakyKrCiQ6YRJDuogpv2KMeke6Kgl1CflyriKfodyiUQqqEizp8vqOSo8ynwqiyjNSGVqQ8kVivAplMpsKZ0HzCoSqWVKdohyS5HJQ6sIiG/JzQv5qTqKTSrTKCiGawk7idGKF2flCgkJZ2nh6VfnsErvam3mmep7CpFpnShFC5Rp8YpE7BdmY0pP6SgoCcpkqZLKxomKpyfLEsgh6hpIS6ftKqOnqknQqRNpuUozylnL78rBqp6KQApnSkwIEGshKi3qncsF6a4LaCeqaQUqJwn1CpxLLCU1aT4IOsjKiQ/KD4paaynqoctBJ4gqocnp60qqx+nVivqIXEg1KsVJ3sq3p2PKlSsQKSCKRct8aftoyScMqcrKI2soylAKLGhL6BmrEYkoSiTI2Ws7hsPLG0lViSrJQMw4SPaJKUqXqoPI9kkfCp7mnSq+JmyIUgWDCxWoMSobykfnGylRy0srJ8nCakYHdSp7CwdqoUsc6vYpKUucSUpntGhayDdoOaim6FprUgkzil/o5MjFaugKUurAqk4nfulYSDuI2IgSCZ8Jhsjpy2Umqwh9Z+dJvUptCYhpi2pU6R3ncCg+CLMIQSmxKmjL6Aqja0RrBMmmyypLXwtoKrtKtWlLyv0KyMmNSr3q++guSCuKZcmMiKdqWGrfyDBoV6n56eSIhCq7qeCnvYgzqcLrEOUoyFeKEorIijmpA==", "infoId": "65d70730-657e-8997-6f80-b023ca88d5e7", "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "95.59", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }], "similarity": "95.59", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C789b7f246aa838.jpg\u0026xywh=886%2C200%2C84%2C96", "targetType": "face" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c427824ad55a3.jpg", "captureTime": "2024-02-27 08:32:03", "detection": { "x": 346, "y": 77, "w": 434, "h": 875 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240227083203-87\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c427824ad55a3.jpg", "feature": "pyUyplSlULHQLk8lZa8VhHYa1jBRLgYg46K3rYKxxKfdrQMvYq8PJbig8ytap4YumCa6qEYo97DdLZsuGSNZKmulVC4jLIcm5ywTpZyfoK5moFAsSq4KrA6wwqUoKLmrtSg/rHsnqjDdLpStzZ9hHDsjhy9pKTCqkSk6pRsx6CciLIWsBS4/qhew2rC7LYixuay9pSAoDibILPItw6yXMGAtxCUFqx8pFKsBKJSuXzIgLvOrC6/osVGraKq5nxUMHagALRYthitBMBmohKwMrS6tNiswL2isybCeJe+u8askq+Cr2SacMkWhx58ILBGy3ylyLtes8CZ7HuIwJjTBMA==", "gaitFeature": "", "gaitMaskUrl": null, "gaitObjectUrl": null, "gaitVideoDuration": 10, "gaitVideoUrl": "http://192.168.5.82:9898/image_proxy?img_uuid=\u0026type=mp4", "infoId": "65dd2d83-0d1f-a0dd-e57c-d70a26a96d5d", "isGait": false, "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "93.85", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }, { "bigImage": "", "detection": { "x": 858, "y": 200, "w": 80, "h": 92 }, "feature": "PiplqlOpZaqdKsQdGqC3KwqpzCWqJKghlyloHZ6qm6RBpBSkL61SHWMozaKqKAampCqjosurHxnYJvcZqaXjKAOlKqyyJ3asL6JaKEwpY6MDp9MsHi37KsSr6K14JjMjM6OdoXqn1yxvpjWkvqkCKdYlYa8xrD0tuCMap42UPSYqoMYqwh1GKZUh8SqHHIKqIqrrrGqiAaVYqcOmshSsK9Wp7qgbpeihT6yWo+2t8iMdKEms7SR8qIid/6N5pgSXqCrwpNAbKygaqccUU6I/pysRiSOJKkoq6CrCKcusgq6fKGmra6nRF1whByurpgcuMyDEpwUsg6SAGW+qOCJZqoMoi6H+qJYpTKG5qq8nXq1SJIAp0CjJqe8qJSgfp/kpTijlhHYqhyYIrDqlUqvGK4ofji3cqD+tQ6iJoC0jKS56JUoqOq1MLUirJSVLolqubSIPKAosOCy2ojCpzSxVpwWqTymlJXeot6p+JUispCxRJWwdlqUYLmqq5yn5J6qpTalQJaEm3i0qBTKoIK1BHFIoVqWoLWalQqTlHsuo6Kt9qPskuq90LAirtCY4JqMhf6KtGpmZtasiJE+nMqa1K1OqpCDCHh8k3673ppQsFymsIZklTiZ5J0oc6Ko8GFEkYxdcoSCtS66WJUAsH6x5KzSi6KvwpQyuYw+oK1udCqrQqFGUFKU7qG8mbyierGItJ6rWJVWwkSpji7ejnyX6oe+klSz/o5KXPKAZJ1GsJKkKqKol7KJYLSqZaamAI84shS1qnlSjAyNRq5Oh5ybaJcOkCSCaFqEqSaQio1OaBiq/nvarJCofp3weYydHpc8lEKzKJGUoLZj/IwerR6kHK0Sk5aEnLhio5ShJoHGncaTkKa8seKbbqaskCCywLiQlLai3KlwmkibeKrGkPR7pnt0rf6RuLUoaFa0GJhcpxyewKbmsEioHH1igzaofpzqqgarWrXgpRhxDJRolO6ytnhqk1CR5GC4il6xIn0UtJ6AkKt2lJhU6LVglpCtgp+2fHaVWJrOu2if+JyUlridxKLslWChpGK6jtKaQJQylnhOCJLspU6ZgqAMs76JipRQsmyjqJ4KmiKmXKgqibSbLHaal5yjYrSYfGi2npVgp4aZCI3wk/iwipDYsi6Hvo2Es3yruKfsjTiV2q4yjNawgsZYnMiisqGWmDKiQKN6iZaV/owIsSB/IpIIqxiZLG5GkrC1vLJOkFKfJJVQqKKgVlhOr6qPZpzGoLauyJM4jNahzHBwsnq0tqLor5SxwJxck5SaBLEWpHClwLIgaZpUzodYnAZ9soVmi6JpDqfWqEJ6rJgupcalHJb2s36FyLDMbFqpWHWUkZiFNoRgtdJwVHQ==", "id": "", "objectTypeId": 6, "similarity": "90.91", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg\u0026xywh=858%2C200%2C80%2C92", "targetType": "face" }], "similarity": "93.85", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c427824ad55a3.jpg\u0026xywh=346%2C77%2C434%2C875", "targetType": "pedestrian" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4277fb45f4e0.jpg", "captureTime": "2024-02-27 08:32:03", "detection": { "x": 458, "y": 42, "w": 174, "h": 230 }, "deviceId": "370211400047", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20240227083203-89\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4277fb45f4e0.jpg", "feature": "wB/NqomqYagtpsEkHSZHJnqk9KTNomEozCKZJCKd9ia1Joen+KcimBKOK5T5KIamtSJGIyGkdKq3KeIijqD0JCSqYKnfKFiqJCYkpgqm7al/oWsiViw2K9OpybBupQclox/QpNKeWic4JiCn9KtnKC8tth5+qt4rA6M1JfoeyyuYLa8um6tnqaEsoJiuK4Cl2qHfrIWoE6jpKImm1Sx2KRWgmKgYlrEc1KGBqWitpiC/KQWkoamZqBkpOKk1oTUqui9BqlcnUaeCoW2rJ5hnpQomqarlIzqm6p70KbqrV6ieICqlGqwdrTcUNS2sqM0phiIOKB0qwqKrn6kahhZnHp4mkiTQmx0nXCjyqBIpzqzVoCgoeChBoogYsCappOiibBajKikoYCHJIbSoKqhqJSgsdiqvqRqplps6qF+snyh5K8goQat2L/2mVKZZpnSll6eDrSIvkSqMplMpFyq5KEooKCmqLaUidKtbLJkpnS0+LLWfyicgLdatsau+JMyd7qgGpKkkwSkuLLuqiqjlIGwn8qzvJq2d86jhrLqrmaApo0skoqzdKpyhNywNmu6kjiT1JeMpd7B9KVQpzahgK9MsEqInmkeZm6Y0qIEnP6ZYLVQbwZ0PK7oppaizLtSVgin6IKuqX6j7jaajvKiBIjepQqVnHKyqoCgfKritYajPpE6oBy3lJUOnFCKqJfUsFKQbno6r9yVqq6snj6SAp/UmAC3bqS4qBSL1Igast6koqJAkxinwJhis/CB2KgMp1yncnEMrNSy/HHCphKRcKo6kXyxdnFEmxqn4qK4qPip/oquqhiZKpJGlaScRrGAlw6LBJEoiZaLIICKio6bRo8meEawrLHsmHiYqDj6mcKm+nhUp8qqyIa8kKikgLbMrW6X7KwgsMiKEH7mi4a1ypqotIyPMKOIjb6kfpgIadSw7KL2l3aYgH3AFxCjCJQssUa+yrdAqTJ5Hp90mDql/poeoNyY1pqsjeKlsK/so8SjzKJOs7yYyKR8fzBLuqSGlNwwQJqafBCzXoOQpCibjpIYXfSsQKC2b/JQvJlclv6yvol4wjKyBnlAvbCiuIxYlUiS8pDquuKz9JVgqXyp7JFKlsiydIZSbgylLIoubVabUo6WYVineJRgwda14piMsCyp6qY2lvqYDqWqhKRgTq0CtARptm8kmia7/I/UeiSLZphgsNZxcpe0maihfKbOprStPKEKkmKw8I+qgNSW5qp4nBh1VKL6VZyUvKc6ok6m/Kqst7KojrDGcKihEK0QqaZ58LI6m9Sq+KsKi5aoxrdwqZJV3K4aiG6TZkHCoMy1iKI+qiammpR2gYSS7p6SkZKSprOasmaUyI/MuSi6ypQ==", "infoId": "65dd2d83-0ff7-cce4-878d-c8ce96752a86", "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "locationId": "370211400047", "locationName": "7楼澳柯玛摄像头01", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "93.85", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }, { "bigImage": "", "detection": { "x": 858, "y": 200, "w": 80, "h": 92 }, "feature": "PiplqlOpZaqdKsQdGqC3KwqpzCWqJKghlyloHZ6qm6RBpBSkL61SHWMozaKqKAampCqjosurHxnYJvcZqaXjKAOlKqyyJ3asL6JaKEwpY6MDp9MsHi37KsSr6K14JjMjM6OdoXqn1yxvpjWkvqkCKdYlYa8xrD0tuCMap42UPSYqoMYqwh1GKZUh8SqHHIKqIqrrrGqiAaVYqcOmshSsK9Wp7qgbpeihT6yWo+2t8iMdKEms7SR8qIid/6N5pgSXqCrwpNAbKygaqccUU6I/pysRiSOJKkoq6CrCKcusgq6fKGmra6nRF1whByurpgcuMyDEpwUsg6SAGW+qOCJZqoMoi6H+qJYpTKG5qq8nXq1SJIAp0CjJqe8qJSgfp/kpTijlhHYqhyYIrDqlUqvGK4ofji3cqD+tQ6iJoC0jKS56JUoqOq1MLUirJSVLolqubSIPKAosOCy2ojCpzSxVpwWqTymlJXeot6p+JUispCxRJWwdlqUYLmqq5yn5J6qpTalQJaEm3i0qBTKoIK1BHFIoVqWoLWalQqTlHsuo6Kt9qPskuq90LAirtCY4JqMhf6KtGpmZtasiJE+nMqa1K1OqpCDCHh8k3673ppQsFymsIZklTiZ5J0oc6Ko8GFEkYxdcoSCtS66WJUAsH6x5KzSi6KvwpQyuYw+oK1udCqrQqFGUFKU7qG8mbyierGItJ6rWJVWwkSpji7ejnyX6oe+klSz/o5KXPKAZJ1GsJKkKqKol7KJYLSqZaamAI84shS1qnlSjAyNRq5Oh5ybaJcOkCSCaFqEqSaQio1OaBiq/nvarJCofp3weYydHpc8lEKzKJGUoLZj/IwerR6kHK0Sk5aEnLhio5ShJoHGncaTkKa8seKbbqaskCCywLiQlLai3KlwmkibeKrGkPR7pnt0rf6RuLUoaFa0GJhcpxyewKbmsEioHH1igzaofpzqqgarWrXgpRhxDJRolO6ytnhqk1CR5GC4il6xIn0UtJ6AkKt2lJhU6LVglpCtgp+2fHaVWJrOu2if+JyUlridxKLslWChpGK6jtKaQJQylnhOCJLspU6ZgqAMs76JipRQsmyjqJ4KmiKmXKgqibSbLHaal5yjYrSYfGi2npVgp4aZCI3wk/iwipDYsi6Hvo2Es3yruKfsjTiV2q4yjNawgsZYnMiisqGWmDKiQKN6iZaV/owIsSB/IpIIqxiZLG5GkrC1vLJOkFKfJJVQqKKgVlhOr6qPZpzGoLauyJM4jNahzHBwsnq0tqLor5SxwJxck5SaBLEWpHClwLIgaZpUzodYnAZ9soVmi6JpDqfWqEJ6rJgupcalHJb2s36FyLDMbFqpWHWUkZiFNoRgtdJwVHQ==", "id": "", "objectTypeId": 6, "similarity": "90.91", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg\u0026xywh=858%2C200%2C80%2C92", "targetType": "face" }], "similarity": "93.85", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C7c4277fb45f4e0.jpg\u0026xywh=458%2C42%2C174%2C230", "targetType": "face" }], "minCaptureTime": "2024-02-22 08:40:18", "maxCaptureTime": "2024-02-27 08:32:03", "locationId": 370211400047, "locationName": "7楼澳柯玛摄像头01", "lngLat": { "lng": 120.187683, "lat": 35.968004 }, "path": ["120.136871,35.983007;120.141144,35.983018;120.141429,35.982232;120.141503,35.981728;120.141460,35.981180;120.141268,35.980678;120.140969,35.980183;120.140769,35.980010;120.141537,35.979516;120.142029,35.979156;120.142376,35.978611;120.142501,35.978258;120.146096,35.979064;120.149117,35.973751;120.150448,35.971311;120.150516,35.971228;120.150541,35.971170;120.165239,35.974135;120.165437,35.974123;120.165446,35.974283;120.165729,35.975163;120.165947,35.975637;120.167086,35.977157;120.167324,35.977415;120.167646,35.977541;120.167935,35.977680;120.168092,35.977703;120.168273,35.977674;120.168670,35.977519;120.168876,35.977513;120.168995,35.977523;120.169144,35.977566;120.169294,35.977670;120.169458,35.977842;120.169617,35.977938;120.169844,35.978007;120.170078,35.978036;120.170269,35.978014;120.170552,35.977901;120.172020,35.977407;120.172880,35.977207;120.174719,35.976547;120.180239,35.974682;120.186110,35.972623;120.191243,35.970905;120.192641,35.970378;120.192892,35.968630;120.192947,35.968434;120.192993,35.968161;120.187683,35.968004;120.187683,35.968004"] }], "faces": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e69dcbb8646.jpg", "captureTime": "2024-02-27 09:00:11", "detection": { "x": 1068, "y": 344, "w": 66, "h": 78 }, "deviceId": "370211400050", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B404-20240227090011-04\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e69dcbb8646.jpg", "feature": "HqnBoWqSc6SUpOOcKp3vK4+qeqUTnOEqrSb/phync6goHDyl+Kp6pmInKyQxKg2rXSikmC8g5ZldK9CmXSFeJbWkv6yZnueo6J/0o3il+SoxozkrIikzKWaur6oSKMwesqmzqW+nACUEK4iofa5HKDQtnKghFBMuz6TdG9CaISwljEwtBir1Ig8hpSl5KS2qJawZqUonoqRGpiCiViBwHQuttqr+KLUgDauVKGKtlaQOLIOgvihWqzWiE6o3qBUXtCoXlgGlOahVIZ6cW51iqDQSdaB0IaKkwycuLDiqk66xJESiLKX6q10USSpIpB8w5CgyITkki5I+HMEh9yS7qsycTSgzqNcrCqPWpd8nkaj8oiYmkakgnUETMyl0Kd+g1pDLLUAokCMrI9eqGajsIBQmsZiOrLSsMBpyp0Sc8ypoJz8tRK5BLSCnuqb1rA6s5aWbDgYqvxIVqXIkyhwlHGyosSOIpmkdb6fLJ8ihWyyELJwjRyjULuWpayopnmKpOKm/pLQqCC2EKSWmrKqNK6ks2qw8l9ybH6SXJourmaxNrJoo/618KF+kO4y8IfIX2ChjoBUrXCPGqPulXCZyLo6opiiDqLUrUK9PqVYuIqkKKd6iwaSDLBIpnqxlK0ifMyWDpU6sa677KqMcuKfGJBgkIKmIrC+osyG9LF+siKqhqe2lhSnLI84cnClpq4ErIamvJQCt9CtpKC6oE6YUID8mrp3xqzMlvqGIqiSso6W2rA0p+id0KSytSqxvGkAubioKIFEmOCssJN6kHyzlKQ4mmaF6JhUmY6TloBCl+6ZkJlSqACwCq8kn8yDHrC4kxKXjpJQQvZI0qbejQZ2gKIWeEigQLawqEx42JwmpQ6wUpKQqESRRJqwmEyaQLBAnGamaKhksTaTDKPsgEKqrrEsrEB+6L1cfd6eHJCihAy1vKvOsQCgWIaQmayJCKByf+qgGqfAiXxa9qMAjIK1lH30iBJBSp2IlEKosJAorUphwmaWrECV4LCctFySFq84hIKhzqtGqTyquK20hKaRTITymkCz5J7esuyexJQYmhabSoVQtdKOTphwtlJSUqG8o3B7+KtCqhpz+KSMo2iH+IZer0icBqG2lISf0pFgslKTRn12cMy0cIMEuAqt2q8ou3CYIqG4hCaeNqSGsQKpnr7OmACgJnk8k6K26KzIqSqk9qmYmOiWao3ApuiyhLe4oyizRkLATJaxLIreicapBo0KkEBfUH9OoN6wVJxwoRKd+p8Etq6nTqocmYyj8JtwszCpJIoanZyvdKeck+yX1qIgqNiR5KgCsfadTpIyqB6lFK9Oq06yVpU2oiKLwokYo9aaeLMEhfyVhLEUvzSRhoA==", "infoId": "65dd341b-d656-0022-e6b1-0da7f9eadbe6", "lngLat": { "lng": 120.136871, "lat": 35.983007 }, "locationId": "370211400050", "locationName": "7楼澳柯玛摄像头04", "matches": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158", "detection": { "x": 1632, "y": 106, "w": 136, "h": 176 }, "feature": "BKk/p7edmaaMo4UUQCGCKUepZqNspZUrcSk4oxOprqJdJJUkoKoVqE8k2SCJG0is5ChupRigt5vrJEynpClGKCwd4KjBoD6echQXIRmoTSpFqJooICyzKP+tAKskn8sgNqtuqAWm8iZ/K86m6q5YKEYsJam0gSgsiac4pR+kOyr0m+wsiCl1FFkpnCuuKECqpqVGrM0ndqKInTyl/xvPJfmrfafXJ48asq07Khqsl6XPLdmcdizuqDemyarJntGm9CokpaGlt6keodwaXahVqSgneKXfH2am6ShkK3Sr4ayvoQarGh/Bq20ocCz2pHEv5iRBHgEpZyT9HAKc6RporGYfgSOSqwktZpn2oCkmPKnrpLYo6KWOBYGgkiyAKrqnNZV2LUcpSQ34I22tT6jLk+YmwhX+q6SqmqQ1oc8enCwgKVwriKzTLIaou6S3rd2rBp95IvAqEyYtqm8kzSfvn9+ocyZgpDyj16dlKZCmuSy3LVwpoyVWL1eqcigIoxmsfKyzJPspzy42K22ovaQoLO4rja6SI4mfcaCYJSSsH6sJrRUi9ayPKOKnrCWbG04hZSj0pUAr8KTzpk2qLR1hKrqo+iT5pBYtL6/qpgsuoKzgInMhcaD6KhQnC6mfK34YcyOIp+OuGq6NKLYgxqRmJr4WkadxrBSogRypKxasp6gtqt2njytlmI8d7iR/rDsrVKJOLMOtOSzfJmypWKq1JdAlYSKTrHEeX5q6FFWpNpfaq18qWiV4JwSqVqzMJEYu9irMJaAncyZvIGykDypUKJ4j/6gQKUUk5g7+ptChhh1tI62q/Cj+rSUnHiQyrWkhJakomy2hnqd1qIup0JypK2WmTSZ7LPkqXZ0dJ4+pCKxUJPQpByEpon8eAyiSK3soB6khK2QqwKi7KswhIqlKqxYsRSOVMGmlM6gzJ9KiQy3jKiat3SaGIGuZjiCSKT+dZKcRrfQqjBwsqgckC6vPimwhTCNroxacmKnzpJAqe52SpYqqvCmiLNIsqSjnrUcknakDqKapryk8HcAfCakuHyqm9S2EKPGtNiYeKPokyxSoFiksTZS9rCgrKiRbqDokPB8zKOCpcJ/EKl4iSyTDJ+irDiR0qL6cSigwqSYt86Z+IQ4ZziwOHW4tJqo4qHAtNCq7moOkdqaopQKtLamGrcGm5CXqFXcl561OKRMqn6WAqZInCSl3p20rYi2MK1EoNSyXJJcqJ6vYIwIlI6nepeYekyTnHZqmnKpkI9coAqYCpSwqVKaQqE0otiiLJGYsjSjRKsWoZyxOKWkpUyChqZAt3h8DKYeqYqSppeSrGKxuIRmsIK3yqe6nIKV8HHUkeajcKocnDCbyKWIuWigaJg==", "id": "3727814028", "objectTypeId": 5, "similarity": "99.40", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6c0a7c3d3158\u0026xywh=1632%2C106%2C136%2C176", "targetType": "face" }, { "bigImage": "", "detection": { "x": 858, "y": 200, "w": 80, "h": 92 }, "feature": "PiplqlOpZaqdKsQdGqC3KwqpzCWqJKghlyloHZ6qm6RBpBSkL61SHWMozaKqKAampCqjosurHxnYJvcZqaXjKAOlKqyyJ3asL6JaKEwpY6MDp9MsHi37KsSr6K14JjMjM6OdoXqn1yxvpjWkvqkCKdYlYa8xrD0tuCMap42UPSYqoMYqwh1GKZUh8SqHHIKqIqrrrGqiAaVYqcOmshSsK9Wp7qgbpeihT6yWo+2t8iMdKEms7SR8qIid/6N5pgSXqCrwpNAbKygaqccUU6I/pysRiSOJKkoq6CrCKcusgq6fKGmra6nRF1whByurpgcuMyDEpwUsg6SAGW+qOCJZqoMoi6H+qJYpTKG5qq8nXq1SJIAp0CjJqe8qJSgfp/kpTijlhHYqhyYIrDqlUqvGK4ofji3cqD+tQ6iJoC0jKS56JUoqOq1MLUirJSVLolqubSIPKAosOCy2ojCpzSxVpwWqTymlJXeot6p+JUispCxRJWwdlqUYLmqq5yn5J6qpTalQJaEm3i0qBTKoIK1BHFIoVqWoLWalQqTlHsuo6Kt9qPskuq90LAirtCY4JqMhf6KtGpmZtasiJE+nMqa1K1OqpCDCHh8k3673ppQsFymsIZklTiZ5J0oc6Ko8GFEkYxdcoSCtS66WJUAsH6x5KzSi6KvwpQyuYw+oK1udCqrQqFGUFKU7qG8mbyierGItJ6rWJVWwkSpji7ejnyX6oe+klSz/o5KXPKAZJ1GsJKkKqKol7KJYLSqZaamAI84shS1qnlSjAyNRq5Oh5ybaJcOkCSCaFqEqSaQio1OaBiq/nvarJCofp3weYydHpc8lEKzKJGUoLZj/IwerR6kHK0Sk5aEnLhio5ShJoHGncaTkKa8seKbbqaskCCywLiQlLai3KlwmkibeKrGkPR7pnt0rf6RuLUoaFa0GJhcpxyewKbmsEioHH1igzaofpzqqgarWrXgpRhxDJRolO6ytnhqk1CR5GC4il6xIn0UtJ6AkKt2lJhU6LVglpCtgp+2fHaVWJrOu2if+JyUlridxKLslWChpGK6jtKaQJQylnhOCJLspU6ZgqAMs76JipRQsmyjqJ4KmiKmXKgqibSbLHaal5yjYrSYfGi2npVgp4aZCI3wk/iwipDYsi6Hvo2Es3yruKfsjTiV2q4yjNawgsZYnMiisqGWmDKiQKN6iZaV/owIsSB/IpIIqxiZLG5GkrC1vLJOkFKfJJVQqKKgVlhOr6qPZpzGoLauyJM4jNahzHBwsnq0tqLor5SxwJxck5SaBLEWpHClwLIgaZpUzodYnAZ9soVmi6JpDqfWqEJ6rJgupcalHJb2s36FyLDMbFqpWHWUkZiFNoRgtdJwVHQ==", "id": "", "objectTypeId": 6, "similarity": "98.65", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C77d9a37986d32e.jpg\u0026xywh=858%2C200%2C80%2C92", "targetType": "face" }], "similarity": "99.40", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C7c4e69dcbb8646.jpg\u0026xywh=1068%2C344%2C66%2C78", "targetType": "face" }] }, "errorMessage": "", "message": "", "totalRecords": 3, "usedTime": 0.32 }
  res.json(req.json);
});


/**
  * @api {get} /v1/comparison/cross-source-track 实时跨镜追踪结果
  *
  */
router.all('/v1/comparison/cross-source-track', async function (req, res, next) {
  req.json = realCross
  // req.json = realCross2
  // await req.sleep(1)
  // console.log(req.body, req.json.data.faces)
  res.json(req.json);
});


router.all('/v1/comparison/cross-source-track/list', async function (req, res, next) {
  req.json = realCrossList
  // await req.sleep(1)
  // console.log(req.body, req.json.data.faces)
  res.json(req.json);
});

router.all('/v1/comparison/add-target', async function (req, res, next) {
  req.json = {}
  // await req.sleep(1)
  // console.log(req.body, req.json.data.faces)
  res.json(req.json);
});


/**
  * @api {get} /v1/comparison/add-filter-item 添加过滤名单
  *
  */
router.all('/v1/comparison/add-filter-item', async function (req, res, next) {
  req.json = {}

  // await req.sleep(1)
  res.json(req.json);
});

/**
  * @api {get} /v1/comparison/del-filter-item 删除过滤名单(批量)
  *
  */
router.all('/v1/comparison/del-filter-item', async function (req, res, next) {
  req.json = {
  }

  // await req.sleep(1)
  res.json(req.json);
});

/**
  * @api {get} /v1/comparison/list-filter-item 获取过滤名单
  *
  */
router.all('/v1/comparison/list-filter-item', async function (req, res, next) {
  let item = {
    targetImage: 'http://192.168.5.47:3003/701.jpg',
    bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
    captureTime: '',
    detection: {
      x: 100,
      y: 100,
      w: 200,
      h: 200,
    },
    feature: '11111111111111',
    captureTime: '',
    locationName: '育英实验小学北泊子安置房简易卡口',
    locationId: '3702011611547297',
    targetType: 'pedestrian',
    videoFrom: 'realtime',
    lngLat: {
      lng: "120.157974",
      lat: "36.029556",
    },
    downloadUrl: '',
    // 人体
    gaitFeature: '1111',
    gaitMaskUrl: ['111'],
    gaitObjectUrl: ['222'],
    gaitVideoUrl: '',
    gaitVideoDuration: 0,
    similarity: 90
  }


  req.json = {
    data: Array.apply(null, Array(44)).map((o, index) => ({
      ...item,
      infoId: index + item.feature,
      ...(
        index === 0 || index === 1 ? {
          filterId: "37020141865662222024-03-27 02:16:59"
        } : index === 2 ? {
          filterId: "3702114000502024-03-28 17:08:43"
        } : {}
      )
    }))
  }

  // await req.sleep(1)
  res.json(req.json);
});

module.exports = router;
