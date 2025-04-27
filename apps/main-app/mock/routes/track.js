var express = require("express");
var router = express.Router();
const vehicleTrack = require("./json/vehicle-track.json");


/**
* @api {post} /v1/trajectory/vehicle 车辆 - 获取拼接的轨迹数据
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/trajectory/vehicle', async function (req, res, next) {
  const vehicle1 = [
    {
      minCaptureTime: '2023-10-01 14:10:00',
      maxCaptureTime: '2023-11-01 14:10:00',

      locationId: '370211400047',
      locationName: '7楼澳柯玛摄像头03',
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
          infoId: '32131243546574571111',
        },
      ],
      lngLat: {
        lng: '131.16894166666665',
        lat: '33.87929'
      },
      path: [],
    },
    {
      minCaptureTime: '2023-09-01 14:10:00',
      maxCaptureTime: '2023-10-01 14:10:00',
      locationId: '370211400047',
      locationName: '7楼澳柯玛摄像头04',
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
          similarity: '98.9',
          // 汽车
          // licensePlate1: '车牌1',
          // licensePlate2: '车牌2',
          // plateColorTypeId2: '1',
          licensePlate: '车联车',
          licensePlateUrl: './',
          infoId: '32131243546574572222',
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
          infoId: '3123123123123213333',
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
          infoId: '312312312321312331232144444',
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
          infoId: '32131242141241231234155555',
        },
      ],
      // lngLat: { lng: 0, lat: 0 },
      // path: ["0.000000,0.000000"],
      lngLat: {
        lng: '134.87333333333333',
        lat: '34.57700166666667'
      },
      path: [
        {
          "lng": '134.87333333333333',
          "lat": '34.57700166666667',
          "time": 1502168424,
          "info": []
        },
        {
          "lng": 135.26777833333333,
          "lat": 34.644596666666665,
          "time": 1502174991,
          "info": []
        },
        {
          "lng": 135.24607333333333,
          "lat": 34.653655,
          "time": 1502175917,
          "info": []
        },
        {
          "lng": 135.26325166666666,
          "lat": 34.64709166666667,
          "time": 1502191767,
          "info": []
        },
        {
          "lng": 135.32421,
          "lat": 34.61122666666667,
          "time": 1502192674,
          "info": []
        },
        {
          "lng": 135.36138333333332,
          "lat": 34.612215,
          "time": 1502193897,
          "info": []
        },
        {
          "lng": 135.36040833333334,
          "lat": 34.61272666666667,
          "time": 1502200158,
          "info": []
        },
        {
          "lng": 135.36009333333334,
          "lat": 34.61233,
          "time": 1502201598,
          "info": []
        },
        {
          "lng": 135.35963833333332,
          "lat": 34.611505,
          "time": 1502206458,
          "info": []
        },
        {
          "lng": 135.35962833333335,
          "lat": 34.61150166666667,
          "time": 1502206817,
          "info": []
        },
        {
          "lng": 135.35994666666667,
          "lat": 34.611285,
          "time": 1502215818,
          "info": []
        },
        {
          "lng": 135.359795,
          "lat": 34.61171,
          "time": 1502221397,
          "info": []
        },
        {
          "lng": 135.35987166666666,
          "lat": 34.61168166666667,
          "time": 1502223558,
          "info": []
        },
        {
          "lng": 135.35986333333332,
          "lat": 34.6119,
          "time": 1502229318,
          "info": []
        },
        {
          "lng": 135.36015166666667,
          "lat": 34.61261,
          "time": 1502241737,
          "info": []
        },
        {
          "lng": 135.36007666666666,
          "lat": 34.61262166666667,
          "time": 1502244258,
          "info": []
        },
        {
          "lng": 135.363895,
          "lat": 34.61022,
          "time": 1502252629,
          "info": []
        },
        {
          "lng": 135.376335,
          "lat": 34.62924666666667,
          "time": 1502253556,
          "info": []
        },
        {
          "lng": 135.39856166666667,
          "lat": 34.645781666666664,
          "time": 1502254746,
          "info": []
        },
        {
          "lng": 135.399135,
          "lat": 34.64816166666667,
          "time": 1502277661,
          "info": []
        },
        {
          "lng": 135.39914333333334,
          "lat": 34.64814666666667,
          "time": 1502282081,
          "info": []
        },
        {
          "lng": 135.40157833333333,
          "lat": 34.647551666666665,
          "time": 1502283001,
          "info": []
        },
        {
          "lng": 135.35547333333332,
          "lat": 34.619258333333335,
          "time": 1502283905,
          "info": []
        },
        {
          "lng": 135.27196833333332,
          "lat": 34.613548333333334,
          "time": 1502284920,
          "info": []
        },
        {
          "lng": 135.20049666666668,
          "lat": 34.60802666666667,
          "time": 1502285802,
          "info": []
        },
        {
          "lng": 134.985115,
          "lat": 34.624703333333336,
          "time": 1502288102,
          "info": []
        },
        {
          "lng": 132.95545666666666,
          "lat": 34.156863333333334,
          "time": 1502312672,
          "info": []
        },
        {
          "lng": 131.16894166666665,
          "lat": 33.87929,
          "time": 1502336462,
          "info": []
        }
      ]
    },

  ]
  const vehicle2 = [
    {
      minCaptureTime: '2023-08-01 14:10:00',
      maxCaptureTime: '2023-10-01 14:10:00',
      locationId: '370211400047',
      locationName: '7楼澳柯玛摄像头03',
      lngLat: {
        lng: '133.33666666666667',
        lat: '33.98'
      },
      path: [],
      infos: [
        {
          targetImage: 'http://192.168.5.47:3003/706.jpg',
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
          plateColorTypeId2: '9',
          carInfo: '品牌-型号-年款',
          movingDirection: '移动方向',
          similarity: '99.9',
          infoId: '31231231231232133312333',
        },
        {
          targetImage: 'http://192.168.5.47:3003/707.jpg',
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
          plateColorTypeId2: '3',
          carInfo: '品牌-型号-年款',
          movingDirection: '移动方向',
          infoId: '31231231232131233123232131144444',
        },
      ]
    },
    {
      minCaptureTime: '2023-07-01 14:10:00',
      maxCaptureTime: '2023-10-01 14:10:00',
      locationId: '370211400047',
      locationName: '7楼澳柯玛摄像头03',
      lngLat: {
        lng: '120.167748',
        lat: '35.943059'
      },
      path: [
        {
          "lng": '120.167748',
          "lat": '35.943059',
          "time": 1502259071,
          "info": []
        },
        {
          "lng": 132.61833333333334,
          "lat": 34.06666666666667,
          "time": 1502270475,
          "info": []
        },
        {
          "lng": 133.33666666666667,
          "lat": 34.005,
          "time": 1502285652,
          "info": []
        },
        {
          "lng": 133.33666666666667,
          "lat": 33.98,
          "time": 1502324567,
          "info": []
        },
        {
          "lng": 133.56835,
          "lat": 34.3177,
          "time": 1502354127,
          "info": []
        },
        {
          "lng": 133.67166666666665,
          "lat": 34.50666666666667,
          "time": 1502359749,
          "info": []
        },
        {
          "lng": 133.85586666666666,
          "lat": 34.41088333333333,
          "time": 1502373168,
          "info": []
        },
        {
          "lng": 133.33666666666667,
          "lat": 33.98,
          "time": 1502424666,
          "info": []
        }
      ],
      infos: [
        {
          targetImage: 'http://192.168.5.47:3003/708.jpg',
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
          infoId: '312312312123',
        },
      ]
    },

  ]

  req.json = {
    data: [
      {
        licensePlate: "鲁B12345",
        plateColorTypeId: 1,
        data: vehicle1
      },
      {
        licensePlate: "鲁B11111",
        plateColorTypeId: 2,
        data: vehicle2
      }
    ]
  }
  await req.sleep(1)
  // res.json(vehicleTrack);
  res.json(req.json);
});

/**
* @api {post} /v1/trajectory/face 人脸 - 轨迹
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/trajectory/face', async function (req, res, next) {
  req.json = {
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
        // path: ["0.000000,0.000000"],
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
            similarity: '98.9',
            // 汽车
            // licensePlate1: '车牌1',
            // licensePlate2: '车牌2',
            // plateColorTypeId2: '1',
            licensePlate: '车联车',
            licensePlateUrl: './'
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
        // path: ['120.167748,35.943059;120.167861,35.942603;120.16799,35.942271;120.168076,35.942099;120.168263,35.941772;120.168392,35.94159;120.168456,35.941514;120.16865,35.941289;120.168826,35.941112;120.169486,35.9405;120.170082,35.939894;120.17065,35.939224;120.170903,35.938891;120.171273,35.938376;120.171337,35.938285;120.172759,35.936279;120.172914,35.936064;120.172952,35.936016;120.173145,35.935726'],
        // lngLat: { lng: 0, lat: 0 },
        // path: ["0.000000,0.000000"],

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
        ],
        path: [
          {
            "lng": '134.87333333333333',
            "lat": '34.57700166666667',
            "time": 1502168424,
            "info": []
          },
          {
            "lng": 135.26777833333333,
            "lat": 34.644596666666665,
            "time": 1502174991,
            "info": []
          },
          {
            "lng": 135.24607333333333,
            "lat": 34.653655,
            "time": 1502175917,
            "info": []
          },
          {
            "lng": 135.26325166666666,
            "lat": 34.64709166666667,
            "time": 1502191767,
            "info": []
          },
          {
            "lng": 135.32421,
            "lat": 34.61122666666667,
            "time": 1502192674,
            "info": []
          },
          {
            "lng": 135.36138333333332,
            "lat": 34.612215,
            "time": 1502193897,
            "info": []
          },
          {
            "lng": 135.36040833333334,
            "lat": 34.61272666666667,
            "time": 1502200158,
            "info": []
          },
          {
            "lng": 135.36009333333334,
            "lat": 34.61233,
            "time": 1502201598,
            "info": []
          },
          {
            "lng": 135.35963833333332,
            "lat": 34.611505,
            "time": 1502206458,
            "info": []
          },
          {
            "lng": 135.35962833333335,
            "lat": 34.61150166666667,
            "time": 1502206817,
            "info": []
          },
          {
            "lng": 135.35994666666667,
            "lat": 34.611285,
            "time": 1502215818,
            "info": []
          },
          {
            "lng": 135.359795,
            "lat": 34.61171,
            "time": 1502221397,
            "info": []
          },
          {
            "lng": 135.35987166666666,
            "lat": 34.61168166666667,
            "time": 1502223558,
            "info": []
          },
          {
            "lng": 135.35986333333332,
            "lat": 34.6119,
            "time": 1502229318,
            "info": []
          },
          {
            "lng": 135.36015166666667,
            "lat": 34.61261,
            "time": 1502241737,
            "info": []
          },
          {
            "lng": 135.36007666666666,
            "lat": 34.61262166666667,
            "time": 1502244258,
            "info": []
          },
          {
            "lng": 135.363895,
            "lat": 34.61022,
            "time": 1502252629,
            "info": []
          },
          {
            "lng": 135.376335,
            "lat": 34.62924666666667,
            "time": 1502253556,
            "info": []
          },
          {
            "lng": 135.39856166666667,
            "lat": 34.645781666666664,
            "time": 1502254746,
            "info": []
          },
          {
            "lng": 135.399135,
            "lat": 34.64816166666667,
            "time": 1502277661,
            "info": []
          },
          {
            "lng": 135.39914333333334,
            "lat": 34.64814666666667,
            "time": 1502282081,
            "info": []
          },
          {
            "lng": 135.40157833333333,
            "lat": 34.647551666666665,
            "time": 1502283001,
            "info": []
          },
          {
            "lng": 135.35547333333332,
            "lat": 34.619258333333335,
            "time": 1502283905,
            "info": []
          },
          {
            "lng": 135.27196833333332,
            "lat": 34.613548333333334,
            "time": 1502284920,
            "info": []
          },
          {
            "lng": 135.20049666666668,
            "lat": 34.60802666666667,
            "time": 1502285802,
            "info": []
          },
          {
            "lng": 134.985115,
            "lat": 34.624703333333336,
            "time": 1502288102,
            "info": []
          },
          {
            "lng": 132.95545666666666,
            "lat": 34.156863333333334,
            "time": 1502312672,
            "info": []
          },
          {
            "lng": 131.16894166666665,
            "lat": 33.87929,
            "time": 1502336462,
            "info": []
          }
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
        path: [],
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
        path: [],
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
  await req.sleep(1)
  res.json(req.json);
});

// 生成轨迹获取id
router.all('/v1/trajectory/track/add', async function (req, res, next) {
  req.json = {
    id: 'this is a trackid'
  }
  await req.sleep(1)
  res.json(req.json);
});

// 根据id获取轨迹
router.all('/v1/trajectory/track/get', async function (req, res, next) {
  req.json = { "data": [{ "minCaptureTime": "2024-01-21 08:21:22", "minCaptureStamp": 1705796482000, "maxCaptureTime": "2024-01-21 08:21:22", "maxCaptureStamp": 1705796482000, "locationId": "3702011443252162", "locationName": "团结路与生态园38号线交叉口东侧", "infos": [{ "bigImage": "http://192.168.11.12:81/image-proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1048225c-547d-11ec-88b0-0cc47a9c4b97.jpg", "bkType": 1, "captureTime": "2024-01-21 08:21:22", "captureTimeStamp": 1705796482, "carInfo": "大众-宝来-2021,2020,2019", "detection": { "h": 484, "w": 514, "x": 357, "y": 451 }, "deviceId": "0", "direction": "方向未知", "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=%E5%9B%A2%E7%BB%93%E8%B7%AF%E4%B8%8E%E7%94%9F%E6%80%81%E5%9B%AD38%E5%8F%B7%E7%BA%BF%E4%BA%A4%E5%8F%89%E5%8F%A3%E4%B8%9C%E4%BE%A7-20240121082122-05\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1048225c-547d-11ec-88b0-0cc47a9c4b97.jpg", "feature": "bzDHrRKvuKxnK/Gtdyb9KGykIiRbKEorczLdqwyycCDmIkYh26zpsr2oFC/fLXOwbxIBpAwqtqiIrzsqF6lvrKuqbbRPKCuonKR5JTUtzawJpCSwwikrqg8nH54sJ+wkVbLspa+wsyh/rBCvuyqenC4ycCzPsKutPa2Hn/UvVaXgrJ4s1qJSJpsxrqyfJY8pCCyfrEigxS6HrT2stCf9rI0eHizzKoClyy+VL++w2y1VLQ0rfaqJL7EaIq+bLD+YzK1WniahDi66LrgteDFvKx4UpDCHLBesKKxNsBwjvTHnIfwrsi1LJ76pbK9PpJ2uuK0MrrItyKzUqgyifaxBLQ==", "infoId": "65ac6382-a64b-39f2-fb0a-f48eae6755d1", "jobId": 10011, "licensePlate1": "鲁BTA064", "licensePlate2": "鲁BTA064", "lngLat": { "lat": 36.062285, "lng": 120.125051 }, "locationId": "3702011443252162", "locationName": "团结路与生态园38号线交叉口东侧", "matches": [], "measure": 1, "monitorTarget": { "brandId": [], "itemId": 12000, "labelInfo": [], "license": "", "licensePlate": "鲁B*4", "modelId": [], "monitorTargetId": 3388430682, "monitorTargetUrl": "", "personName": "", "plateColorTypeId": -1, "yearId": [] }, "monitorType": "monitorVehiclePropertyType", "plateColorTypeId1": 0, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "plateImage": "", "similarity": 0, "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1048225c-547d-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=357%2C451%2C514%2C484", "targetType": "vehicle", "title": "车牌号码布控消息提示", "uniqueId": 43, "windowFeature": "" }], "lngLat": { "lng": 120.125051, "lat": 36.062285 }, "path": [] }, { "minCaptureTime": "2024-01-21 07:42:20", "minCaptureStamp": 1705794140000, "maxCaptureTime": "2024-01-21 07:42:20", "maxCaptureStamp": 1705794140000, "locationId": "3702010077327257", "locationName": "小井村小井村出口人车混合抓拍", "infos": [{ "bigImage": "http://192.168.11.12:81/image-proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0ecbd9ac-5453-11ec-88b0-0cc47a9c4b97.jpg", "bkType": 1, "captureTime": "2024-01-21 07:42:20", "captureTimeStamp": 1705794140, "carInfo": "大众-宝来-2021,2020,2019", "detection": { "h": 585, "w": 583, "x": 1782, "y": 443 }, "deviceId": "0", "direction": "方向未知", "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=%E5%B0%8F%E4%BA%95%E6%9D%91%E5%B0%8F%E4%BA%95%E6%9D%91%E5%87%BA%E5%8F%A3%E4%BA%BA%E8%BD%A6%E6%B7%B7%E5%90%88%E6%8A%93%E6%8B%8D-20240121074220-66\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0ecbd9ac-5453-11ec-88b0-0cc47a9c4b97.jpg", "feature": "niBqJaGtH7CMpLqyDy1qJPaqiSbppyimoDIQqdavHxkqqZoxaaf4qBCerSy4MBglOap4J8omgaf5sg8uB67FolGuw7RvJnupYa13nGosB7AXqeCuoSZhrKEqFCZvIsYsE64DrdCw6xwSr0WuyiNBMcIxPixSK3qsoCw/pwkoEyvDsXYsPyCGpWow56RDsIwcKCabLVqvMjGtnlWu2K1NsEgptDBMLD2srC5xLl+wMBzAG+UpY6gEJJSj1acIKnOrqKS6HWemGaYPLxssqDCHqastzi0cJx8pR6T0pJqmHzKIJ7ec1iyyKAKslbAOnaixw6XbniAthC2tqNQtI6lqKQ==", "infoId": "65ac5a5c-898a-c61c-c53e-6ff76af93408", "jobId": 10011, "licensePlate1": "鲁BTR244", "licensePlate2": "鲁BTR244", "lngLat": { "lat": 35.844377, "lng": 119.990832 }, "locationId": "3702010077327257", "locationName": "小井村小井村出口人车混合抓拍", "matches": [], "measure": 1, "monitorTarget": { "brandId": [], "itemId": 12000, "labelInfo": [], "license": "", "licensePlate": "鲁B*4", "modelId": [], "monitorTargetId": 3388430682, "monitorTargetUrl": "", "personName": "", "plateColorTypeId": -1, "yearId": [] }, "monitorType": "monitorVehiclePropertyType", "plateColorTypeId1": 0, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "plateImage": "", "similarity": 0, "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0ecbd9ac-5453-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1782%2C443%2C583%2C585", "targetType": "vehicle", "title": "车牌号码布控消息提示", "uniqueId": 44, "windowFeature": "" }], "lngLat": { "lng": 119.990832, "lat": 35.844377 }, "path": [{ "lng": 119.990832, "lat": 35.844377, "time": 1705794140000 }, { "lng": 119.995438, "lat": 35.844339, "time": 1705794151152 }, { "lng": 119.99509, "lat": 35.847371, "time": 1705794162304 }, { "lng": 119.998374, "lat": 35.847644, "time": 1705794173456 }, { "lng": 120.000341, "lat": 35.847779, "time": 1705794184608 }, { "lng": 120.001947, "lat": 35.847935, "time": 1705794195760 }, { "lng": 120.002051, "lat": 35.848191, "time": 1705794206912 }, { "lng": 120.003518, "lat": 35.850889, "time": 1705794218064 }, { "lng": 120.005809, "lat": 35.855205, "time": 1705794229216 }, { "lng": 120.007032, "lat": 35.857546, "time": 1705794240368 }, { "lng": 120.007166, "lat": 35.857835, "time": 1705794251520 }, { "lng": 120.008094, "lat": 35.859646, "time": 1705794262672 }, { "lng": 120.009337, "lat": 35.861899, "time": 1705794273824 }, { "lng": 120.009447, "lat": 35.862066, "time": 1705794284976 }, { "lng": 120.010086, "lat": 35.862851, "time": 1705794296128 }, { "lng": 120.010745, "lat": 35.863498, "time": 1705794307280 }, { "lng": 120.013232, "lat": 35.865719, "time": 1705794318432 }, { "lng": 120.014999, "lat": 35.86732, "time": 1705794329584 }, { "lng": 120.015254, "lat": 35.867576, "time": 1705794340736 }, { "lng": 120.015747, "lat": 35.868193, "time": 1705794351888 }, { "lng": 120.015942, "lat": 35.868546, "time": 1705794363040 }, { "lng": 120.016257, "lat": 35.869321, "time": 1705794374192 }, { "lng": 120.016376, "lat": 35.869899, "time": 1705794385344 }, { "lng": 120.01705, "lat": 35.874332, "time": 1705794396496 }, { "lng": 120.017602, "lat": 35.877418, "time": 1705794407648 }, { "lng": 120.017731, "lat": 35.878257, "time": 1705794418800 }, { "lng": 120.017765, "lat": 35.878739, "time": 1705794429952 }, { "lng": 120.017752, "lat": 35.879209, "time": 1705794441104 }, { "lng": 120.017693, "lat": 35.879719, "time": 1705794452256 }, { "lng": 120.017431, "lat": 35.881173, "time": 1705794463408 }, { "lng": 120.016945, "lat": 35.883592, "time": 1705794474560 }, { "lng": 120.016528, "lat": 35.886103, "time": 1705794485712 }, { "lng": 120.016368, "lat": 35.886949, "time": 1705794496864 }, { "lng": 120.01614, "lat": 35.887964, "time": 1705794508016 }, { "lng": 120.015869, "lat": 35.888604, "time": 1705794519168 }, { "lng": 120.015283, "lat": 35.889444, "time": 1705794530320 }, { "lng": 120.014279, "lat": 35.890726, "time": 1705794541472 }, { "lng": 120.013824, "lat": 35.891246, "time": 1705794552624 }, { "lng": 120.013372, "lat": 35.891896, "time": 1705794563776 }, { "lng": 120.012446, "lat": 35.893509, "time": 1705794574928 }, { "lng": 120.008338, "lat": 35.900402, "time": 1705794586080 }, { "lng": 120.008308, "lat": 35.900498, "time": 1705794597232 }, { "lng": 120.007927, "lat": 35.901068, "time": 1705794608384 }, { "lng": 120.006937, "lat": 35.902726, "time": 1705794619536 }, { "lng": 120.006462, "lat": 35.903722, "time": 1705794630688 }, { "lng": 120.006265, "lat": 35.904275, "time": 1705794641840 }, { "lng": 120.006135, "lat": 35.904978, "time": 1705794652992 }, { "lng": 120.005331, "lat": 35.912707, "time": 1705794664144 }, { "lng": 120.005216, "lat": 35.913394, "time": 1705794675296 }, { "lng": 120.005146, "lat": 35.913685, "time": 1705794686448 }, { "lng": 120.004988, "lat": 35.914173, "time": 1705794697600 }, { "lng": 120.004746, "lat": 35.914752, "time": 1705794708752 }, { "lng": 120.003185, "lat": 35.917537, "time": 1705794719904 }, { "lng": 120.002761, "lat": 35.918239, "time": 1705794731056 }, { "lng": 120.002461, "lat": 35.918953, "time": 1705794742208 }, { "lng": 120.002287, "lat": 35.919531, "time": 1705794753360 }, { "lng": 120.001386, "lat": 35.923562, "time": 1705794764512 }, { "lng": 120.00127, "lat": 35.923963, "time": 1705794775664 }, { "lng": 119.999903, "lat": 35.927825, "time": 1705794786816 }, { "lng": 119.999946, "lat": 35.928069, "time": 1705794797968 }, { "lng": 119.999995, "lat": 35.928184, "time": 1705794809120 }, { "lng": 120.000079, "lat": 35.928284, "time": 1705794820272 }, { "lng": 120.000222, "lat": 35.928362, "time": 1705794831424 }, { "lng": 120.000374, "lat": 35.92842, "time": 1705794842576 }, { "lng": 120.000515, "lat": 35.928411, "time": 1705794853728 }, { "lng": 120.000652, "lat": 35.928383, "time": 1705794864880 }, { "lng": 120.000834, "lat": 35.928319, "time": 1705794876032 }, { "lng": 120.00118, "lat": 35.928009, "time": 1705794887184 }, { "lng": 120.001729, "lat": 35.927469, "time": 1705794898336 }, { "lng": 120.003256, "lat": 35.925965, "time": 1705794909488 }, { "lng": 120.003492, "lat": 35.925795, "time": 1705794920640 }, { "lng": 120.003666, "lat": 35.925704, "time": 1705794931792 }, { "lng": 120.004095, "lat": 35.925599, "time": 1705794942944 }, { "lng": 120.004308, "lat": 35.925599, "time": 1705794954096 }, { "lng": 120.004582, "lat": 35.925653, "time": 1705794965248 }, { "lng": 120.004799, "lat": 35.925754, "time": 1705794976400 }, { "lng": 120.004965, "lat": 35.925891, "time": 1705794987552 }, { "lng": 120.00512, "lat": 35.926063, "time": 1705794998704 }, { "lng": 120.005205, "lat": 35.926254, "time": 1705795009856 }, { "lng": 120.005286, "lat": 35.926963, "time": 1705795021008 }, { "lng": 120.005341, "lat": 35.927223, "time": 1705795032160 }, { "lng": 120.005437, "lat": 35.927427, "time": 1705795043312 }, { "lng": 120.005552, "lat": 35.927607, "time": 1705795054464 }, { "lng": 120.005962, "lat": 35.928009, "time": 1705795065616 }, { "lng": 120.006299, "lat": 35.928298, "time": 1705795076768 }, { "lng": 120.0112, "lat": 35.931067, "time": 1705795087920 }, { "lng": 120.012421, "lat": 35.931659, "time": 1705795099072 }, { "lng": 120.013137, "lat": 35.932028, "time": 1705795110224 }, { "lng": 120.015666, "lat": 35.933517, "time": 1705795121376 }, { "lng": 120.019463, "lat": 35.936141, "time": 1705795132528 }, { "lng": 120.021072, "lat": 35.937358, "time": 1705795143680 }, { "lng": 120.023366, "lat": 35.939232, "time": 1705795154832 }, { "lng": 120.026562, "lat": 35.942079, "time": 1705795165984 }, { "lng": 120.027855, "lat": 35.94335, "time": 1705795177136 }, { "lng": 120.029315, "lat": 35.944977, "time": 1705795188288 }, { "lng": 120.030488, "lat": 35.946466, "time": 1705795199440 }, { "lng": 120.031388, "lat": 35.94775, "time": 1705795210592 }, { "lng": 120.031936, "lat": 35.948604, "time": 1705795221744 }, { "lng": 120.032895, "lat": 35.950308, "time": 1705795232896 }, { "lng": 120.033455, "lat": 35.951382, "time": 1705795244048 }, { "lng": 120.034155, "lat": 35.952935, "time": 1705795255200 }, { "lng": 120.034762, "lat": 35.95453, "time": 1705795266352 }, { "lng": 120.035056, "lat": 35.955449, "time": 1705795277504 }, { "lng": 120.035441, "lat": 35.956838, "time": 1705795288656 }, { "lng": 120.035701, "lat": 35.958014, "time": 1705795299808 }, { "lng": 120.035911, "lat": 35.959643, "time": 1705795310960 }, { "lng": 120.036037, "lat": 35.960388, "time": 1705795322112 }, { "lng": 120.036167, "lat": 35.962514, "time": 1705795333264 }, { "lng": 120.036151, "lat": 35.964402, "time": 1705795344416 }, { "lng": 120.036086, "lat": 35.965863, "time": 1705795355568 }, { "lng": 120.035902, "lat": 35.968085, "time": 1705795366720 }, { "lng": 120.035888, "lat": 35.970225, "time": 1705795377872 }, { "lng": 120.035942, "lat": 35.971941, "time": 1705795389024 }, { "lng": 120.036057, "lat": 35.973001, "time": 1705795400176 }, { "lng": 120.036289, "lat": 35.974427, "time": 1705795411328 }, { "lng": 120.036609, "lat": 35.976577, "time": 1705795422480 }, { "lng": 120.03691, "lat": 35.978201, "time": 1705795433632 }, { "lng": 120.0379, "lat": 35.982219, "time": 1705795444784 }, { "lng": 120.039267, "lat": 35.985727, "time": 1705795455936 }, { "lng": 120.040571, "lat": 35.988351, "time": 1705795467088 }, { "lng": 120.043256, "lat": 35.993258, "time": 1705795478240 }, { "lng": 120.044729, "lat": 35.99527, "time": 1705795489392 }, { "lng": 120.047189, "lat": 35.998511, "time": 1705795500544 }, { "lng": 120.047605, "lat": 35.999019, "time": 1705795511696 }, { "lng": 120.049233, "lat": 36.000828, "time": 1705795522848 }, { "lng": 120.051284, "lat": 36.002905, "time": 1705795534000 }, { "lng": 120.054091, "lat": 36.005449, "time": 1705795545152 }, { "lng": 120.055464, "lat": 36.006592, "time": 1705795556304 }, { "lng": 120.057392, "lat": 36.008075, "time": 1705795567456 }, { "lng": 120.058614, "lat": 36.008899, "time": 1705795578608 }, { "lng": 120.060967, "lat": 36.010522, "time": 1705795589760 }, { "lng": 120.062967, "lat": 36.011801, "time": 1705795600912 }, { "lng": 120.065226, "lat": 36.012999, "time": 1705795612064 }, { "lng": 120.069324, "lat": 36.015596, "time": 1705795623216 }, { "lng": 120.070914, "lat": 36.016723, "time": 1705795634368 }, { "lng": 120.07456, "lat": 36.019618, "time": 1705795645520 }, { "lng": 120.075751, "lat": 36.020681, "time": 1705795656672 }, { "lng": 120.079435, "lat": 36.024173, "time": 1705795667824 }, { "lng": 120.082346, "lat": 36.027047, "time": 1705795678976 }, { "lng": 120.082879, "lat": 36.027554, "time": 1705795690128 }, { "lng": 120.085149, "lat": 36.029585, "time": 1705795701280 }, { "lng": 120.085757, "lat": 36.030063, "time": 1705795712432 }, { "lng": 120.086396, "lat": 36.030536, "time": 1705795723584 }, { "lng": 120.087175, "lat": 36.031067, "time": 1705795734736 }, { "lng": 120.087937, "lat": 36.031543, "time": 1705795745888 }, { "lng": 120.088944, "lat": 36.032105, "time": 1705795757040 }, { "lng": 120.090494, "lat": 36.032875, "time": 1705795768192 }, { "lng": 120.091347, "lat": 36.033242, "time": 1705795779344 }, { "lng": 120.093319, "lat": 36.033994, "time": 1705795790496 }, { "lng": 120.094552, "lat": 36.034378, "time": 1705795801648 }, { "lng": 120.095943, "lat": 36.034744, "time": 1705795812800 }, { "lng": 120.097972, "lat": 36.035175, "time": 1705795823952 }, { "lng": 120.098532, "lat": 36.035263, "time": 1705795835104 }, { "lng": 120.099574, "lat": 36.035374, "time": 1705795846256 }, { "lng": 120.101502, "lat": 36.035497, "time": 1705795857408 }, { "lng": 120.103272, "lat": 36.035547, "time": 1705795868560 }, { "lng": 120.10456, "lat": 36.035526, "time": 1705795879712 }, { "lng": 120.115884, "lat": 36.035144, "time": 1705795890864 }, { "lng": 120.140242, "lat": 36.034219, "time": 1705795902016 }, { "lng": 120.141809, "lat": 36.034212, "time": 1705795913168 }, { "lng": 120.142853, "lat": 36.034268, "time": 1705795924320 }, { "lng": 120.143732, "lat": 36.034354, "time": 1705795935472 }, { "lng": 120.144519, "lat": 36.034473, "time": 1705795946624 }, { "lng": 120.14542, "lat": 36.034643, "time": 1705795957776 }, { "lng": 120.146287, "lat": 36.034858, "time": 1705795968928 }, { "lng": 120.147218, "lat": 36.035128, "time": 1705795980080 }, { "lng": 120.148307, "lat": 36.035491, "time": 1705795991232 }, { "lng": 120.149444, "lat": 36.035964, "time": 1705796002384 }, { "lng": 120.150217, "lat": 36.036363, "time": 1705796013536 }, { "lng": 120.150988, "lat": 36.036799, "time": 1705796024688 }, { "lng": 120.151635, "lat": 36.037202, "time": 1705796035840 }, { "lng": 120.15234, "lat": 36.037683, "time": 1705796046992 }, { "lng": 120.152927, "lat": 36.03813, "time": 1705796058144 }, { "lng": 120.153494, "lat": 36.038613, "time": 1705796069296 }, { "lng": 120.153975, "lat": 36.039081, "time": 1705796080448 }, { "lng": 120.155071, "lat": 36.040258, "time": 1705796091600 }, { "lng": 120.15582, "lat": 36.041228, "time": 1705796102752 }, { "lng": 120.156071, "lat": 36.041592, "time": 1705796113904 }, { "lng": 120.158816, "lat": 36.04626, "time": 1705796125056 }, { "lng": 120.158915, "lat": 36.046479, "time": 1705796136208 }, { "lng": 120.16096, "lat": 36.049981, "time": 1705796147360 }, { "lng": 120.161088, "lat": 36.050308, "time": 1705796158512 }, { "lng": 120.161102, "lat": 36.050557, "time": 1705796169664 }, { "lng": 120.161044, "lat": 36.050797, "time": 1705796180816 }, { "lng": 120.160895, "lat": 36.051033, "time": 1705796191968 }, { "lng": 120.160692, "lat": 36.051198, "time": 1705796203120 }, { "lng": 120.160477, "lat": 36.051307, "time": 1705796214272 }, { "lng": 120.160226, "lat": 36.051354, "time": 1705796225424 }, { "lng": 120.159264, "lat": 36.051381, "time": 1705796236576 }, { "lng": 120.158783, "lat": 36.051528, "time": 1705796247728 }, { "lng": 120.15847, "lat": 36.051694, "time": 1705796258880 }, { "lng": 120.158214, "lat": 36.051867, "time": 1705796270032 }, { "lng": 120.158045, "lat": 36.052057, "time": 1705796281184 }, { "lng": 120.157386, "lat": 36.052704, "time": 1705796292336 }, { "lng": 120.156914, "lat": 36.053268, "time": 1705796303488 }, { "lng": 120.154838, "lat": 36.056301, "time": 1705796314640 }, { "lng": 120.154128, "lat": 36.057572, "time": 1705796325792 }, { "lng": 120.153185, "lat": 36.059036, "time": 1705796336944 }, { "lng": 120.151201, "lat": 36.061352, "time": 1705796348096 }, { "lng": 120.150629, "lat": 36.061978, "time": 1705796359248 }, { "lng": 120.150346, "lat": 36.061385, "time": 1705796370400 }, { "lng": 120.15006, "lat": 36.060837, "time": 1705796381552 }, { "lng": 120.14969, "lat": 36.060526, "time": 1705796392704 }, { "lng": 120.144534, "lat": 36.057846, "time": 1705796403856 }, { "lng": 120.142808, "lat": 36.059283, "time": 1705796415008 }, { "lng": 120.140684, "lat": 36.060516, "time": 1705796426160 }, { "lng": 120.138763, "lat": 36.061142, "time": 1705796437312 }, { "lng": 120.136413, "lat": 36.061339, "time": 1705796448464 }, { "lng": 120.1303, "lat": 36.061679, "time": 1705796459616 }, { "lng": 120.125051, "lat": 36.062285, "time": 1705796470768 }] }], "errorMessage": "", "message": "", "totalRecords": 0, "usedTime": 0.02 }
  await req.sleep(1)
  res.json(req.json);
});

module.exports = router;
