const express = require("express");
const router = express.Router();
const data = require("./json/foothold1.json")
const data2=require("./json/staycard.json")
// 车辆落脚点
router.post("/v1/judgement/parking/vehicle/locations", (req, res) => {
  res.send(data);
  // res.send([]);

});
//详情数据
router.post("/v1/judgement/parking/vehicle/info", (req, res) => {
  res.send({data: data2})
  // res.send({data:[]});
})
module.exports = router;
