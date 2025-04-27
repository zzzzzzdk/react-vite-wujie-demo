const express = require("express");
const router = express.Router();
const imageData = require("./json/image.json")
router.post("/v1/comparison/image-search", async (req, res) => {
  await req.sleep(6)
  const { imageType, groupFilters, featureList } = req.body
  if (imageType == "image") {
    //只上传车
    if (featureList.every(item => item.targetType === "vehicle")) {
      const data = {
        status: 0,
        message: "请求成功",
        totalRecords: 87,
        usedTime: 1.44,
        data: imageData.vehicleData,
      }
      res.send(data);
      return
    }
    if (!groupFilters || !groupFilters.length) {
      const data = {
        status: 0,
        message: "请求成功",
        totalRecords: 48,
        usedTime: 1.44,
        data: imageData.vehicleData,
        // data: [],
        personUsedTime: 1.22,
        personInfoDataRecords: 5, //身份信息（以图）
        // personInfoData: imageData.personInfoData
      }
      res.send(data);
    } else {
      const existLocation = groupFilters.findIndex(item => item.value == "licensePlate1") >= 0
      const exislocationId = groupFilters.findIndex(item => item.value == "locationId") >= 0
      if (existLocation && exislocationId) {
        const data = {
          status: 0,
          message: "请求成功",
          totalRecords: 200,
          usedTime: 1.44,
          data: imageData.data,
          // personUsedTime: 1.22,
          // personInfoData: imageData.personInfoData
        }
        res.send(data);
      } else if (exislocationId) {
        console.log('first')
        const data = {
          status: 0,
          message: "请求成功",
          totalRecords: 150,
          usedTime: 1.44,
          data: imageData.LocationGroupData,
          // personUsedTime: 1.22,
          // personInfoData: imageData.personInfoData
        }
        res.send(data)
      } else {
        const data = {
          status: 0,
          message: "请求成功",
          totalRecords: 150,
          usedTime: 1.44,
          data: imageData.data,
          // personUsedTime: 1.22,
          // personInfoData: imageData.personInfoData
        }
        res.send(data)
      }

    }
  } else {
    console.log('步态')
    const data = {
      status: 0,
      message: "请求成功",
      totalRecords: 87,
      usedTime: 1.44,
      data: imageData.gaitData,
      // personUsedTime: 1.44,
      // personInfoDataRecords: 5, //身份信息（以图）
      // personInfoData: imageData.personInfoData
    }
    res.send(data);
  }
});

router.post("/v1/comparison/person-identity", async (req, res) => {
  await req.sleep(2)
  const { imageType, groupFilters, featureList } = req.body
  if (!groupFilters || !groupFilters.length) {
    const data = {
      status: 0,
      message: "请求成功",
      totalRecords: 48,
      personInfoDataRecords: 5, //身份信息（以图）
      usedTime: 1.44,
      personUsedTime: 1.22,
      personInfoData: imageData.personInfoData
      // personInfoData: []
    }
    res.send(data);
  } else {
    const existLocation = groupFilters.findIndex(item => item.value == "licensePlate1") >= 0
    const exislocationId = groupFilters.findIndex(item => item.value == "locationId") >= 0
    if (existLocation && exislocationId) {
      const data = {
        status: 0,
        message: "请求成功",
        totalRecords: 200,
        usedTime: 1.44,
        personUsedTime: 1.22,
        personInfoData: imageData.personInfoData
      }
      res.send(data);
    } else if (exislocationId) {
      console.log('first')
      const data = {
        status: 0,
        message: "请求成功",
        totalRecords: 150,
        usedTime: 1.44,
        personUsedTime: 1.22,
        personInfoData: imageData.personInfoData
      }
      res.send(data)
    } else {
      const data = {
        status: 0,
        message: "请求成功",
        totalRecords: 150,
        usedTime: 1.44,
        data: imageData.data,
        personUsedTime: 1.22,
        personInfoData: imageData.personInfoData
      }
      res.send(data)
    }

  }
});

router.post("/v1/comparison/person-cluster", async (req, res) => {
  await req.sleep(1)
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    personInfoDataRecords: 5, //身份信息（以图）
    usedTime: 1.44,
    personUsedTime: 1.22,
    personInfoData: imageData.personInfoData.slice(0, 3)
    // personInfoData: []
  }
  res.send(data);

});
router.post("/v1/comparison/person-idcard", async (req, res) => {
  await req.sleep(3)
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 48,
    personInfoDataRecords: 5, //身份信息（以图）
    usedTime: 1.44,
    personUsedTime: 1.22,
    personInfoData: imageData.personInfoData.slice(3)
    // personInfoData: []
  }
  res.send(data);

});

router.post("/v1/comparison/onevsmulti/pedestrian", (req, res) => {
  const data = {
    status: 0,
    message: "请求成功",
    totalRecords: 200,
    usedTime: 1.44,
    data: imageData.gaitData,
  }
  res.send(data);
})
module.exports = router;
