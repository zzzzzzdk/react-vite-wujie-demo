const express = require("express");
const router = express.Router();
// const data = require("./json/foothold1.json")
// const data2=require("./json/staycard.json")
const data =require("./json/doublecar.json")
// 双胞胎车
router.post("/v1/judgement/twins/vehicle/list", (req, res) => {
  res.send(data);

});

module.exports = router;
