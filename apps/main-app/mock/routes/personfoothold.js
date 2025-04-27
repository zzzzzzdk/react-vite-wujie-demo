const express = require("express");
const router = express.Router();
const data = require("./json/foothold2.json")
const data2=require("./json/staycard2.json")
// 人员落脚点
router.post("/v1/judgement/parking/person/locations", (req, res) => {
  res.send(data);
  // res.send([]);
});
//详情数据
router.post("/v1/judgement/parking/person/info", (req, res) => {
  res.send({data: data2})
  // res.send({data: []})
})
module.exports = router;
