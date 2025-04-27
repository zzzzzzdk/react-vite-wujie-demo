const express = require("express");
const router = express.Router();
const totalData = require("./json/personAnalysis.json")
//人脸聚类
router.post("/v1/judgement/cluster/face/list", (req, res) => {
  if (req.body.idcard) {
    res
      .send({
        ...totalData,
        data: Math.random() > 0.5 ? [] : totalData.faceCluster.slice(0, 1),
        message: "未查询到该人员信息，请重新上传图片或输入证件号"
      });
  } else {
    res
      // .status(500)
      .send({
        ...totalData,
        data: Math.random() > 0.5 ? totalData.faceCluster : totalData.faceCluster.slice(0, 1),
        // data: [],
        message: "未查询到该人员信息，请重新上传图片或输入证件号"
      });
  }

});

// 人脸同行分析
router.post("/v1/judgement/accomplices/face/list", (req, res) => {
  res.send({
    ...totalData,
    data: {
      ...totalData.data,
      cacheId: Math.random()
    },
    detailsData: [],
    initialData: []
  });
});
//人脸同行详情数据
router.post("/v1/judgement/accomplices/face/detail", async (req, res) => {
  const { timeSort } = req.body
  const order = timeSort
  await new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove()
    }, 1000)
  })
  res.send({
    ...totalData,
    data: order === "desc" ? totalData.detailsData : totalData.detailsData.reverse(),
    // data: [],
    detailsData: [],
    initialData: [],
    totalRecords: 10
  })
})


module.exports = router;
