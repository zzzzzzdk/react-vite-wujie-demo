const express = require("express");
const router = express.Router();
const logData = require("./json/log.json")

router.post("/v1/common/token/put", (req, res) => {
  res.send({
    message: "成功",
    data: '123'
  });
});

router.post("/v1/common/log/post", (req, res) => {
  res.send({
    message: "成功",
  });
});
//直接在logdata 的json文件中mock日志复现参数
router.get("/v1/common/token/get", (req, res) => {
  let pageName = "target";
  try {
    pageName = req.headers["frontend-route"]?.match(/#\/([^?]+)/)[1]
    if (pageName == 'record-list') {
      pageName = pageName + '-2'
    }
  } catch (error) {
    pageName = "target"
  }
  res.send({
    data: logData[pageName]
    // data: {
    //   beginDate: "2040-06-02 11:56:52",
    //   endDate: "2040-06-02 11:56:52",
    //   locationIds: ["1024"]
    // }
  });
});
module.exports = router;
