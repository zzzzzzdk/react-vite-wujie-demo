const express = require("express");
const router = express.Router();
router.post("/v1/judgement/counterfeit/vehicle/*", async (req, res) => {
  await req.sleep(3)
  res.send({
    data: [
      {
        infoId: "65791848-0af9-ffac-1b44-d05ddb548be8",
        licensePlate1: "浙CDS6720",
        licensePlate2: "浙CDS6720",
        plateColorTypeId: 15,
        plateColorTypeId2: 2,
        plateColorTypeString: "白绿",
        carInfo: "广汽传祺-AION Y-2021",
        drivingLibraryModel: "登记车型",
        imageUrl:
          "http://192.168.7.206:8000/992_6cbf5c34-927b-11ed-8d2d-a0369f1f7f36.jpg",
        targetImage:
          "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F992_6cbf5c34-927b-11ed-8d2d-a0369f1f7f36.jpg&xywh=780%2C343%2C135%2C127",
        detection: {
          x: 100,
          y: 200,
          w: 130,
          h: 200,
        },
        downloadUrl:
          "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011484672369-20231103160356-41&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F992_6cbf5c34-927b-11ed-8d2d-a0369f1f7f36.jpg",
        minCaptureTime: "2023-12-13 10:34:48",
        captureTime: "2023-12-13 10:34:48",
        locationId: "3702014290702064",
        locationName: "藏南镇崖上北路口东北角混合抓拍机",
        lngLat: {
          lng: 119.788963,
          lat: 35.793556,
        },
        daysElapsed: 1,
        warningId: 1,
        warningStr: "假牌",
      },
      {
        infoId: "65791848-0af9-ffac-1b44-d05ddb548asdbe8",
        licensePlate1: "无牌",
        licensePlate2: "浙CDS6720",
        plateColorTypeId: 1,
        plateColorTypeId2: 3,
        plateColorTypeString: "白绿",
        carInfo: "广汽传祺-AION Y-2021",
        imageUrl:
          "http://192.168.7.206:8000/992_6cbf5c34-927b-11ed-8d2d-a0369f1f7f36.jpg",
        targetImage:
          "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F992_6cbf5c34-927b-11ed-8d2d-a0369f1f7f36.jpg&xywh=780%2C343%2C135%2C127",
        detection: {
          x: 0,
          y: 0,
          w: 0,
          h: 0,
        },
        downloadUrl:
          "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011484672369-20231103160356-41&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F992_6cbf5c34-927b-11ed-8d2d-a0369f1f7f36.jpg",
        minCaptureTime: "2023-12-13 10:34:48",
        captureTime: "2023-12-13 10:34:48",
        locationId: "3702014289162621",
        locationName: "藏南镇崖上北路口东北角混合抓拍机",
        lngLat: {
          lng: 119.748963,
          lat: 35.7323556,
        },
        daysElapsed: 1,
        warningId: 1,
        warningStr: "假牌",
      },
    ],
    errorMessage: "",
    message: "",
    totalRecords: 100,
    usedTime: 0.09,
  });
});

module.exports = router;
