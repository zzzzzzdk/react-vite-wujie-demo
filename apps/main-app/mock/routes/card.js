var express = require('express');
var router = express.Router();

/**
  * @api {get} /card/get_card_data 模板列表
  * @apiName Card1
  * @apiUse APICommon
  * @apiGroup Card
  *
  * @apiQuery {String} tabs 类型
  * @apiQuery {String} name 巡逻人员
  * @apiQuery {String} locationIds 点位id
  * @apiQuery {String} pn 页码
  * @apiQuery {String} beginTime 开始时间
  * @apiQuery {String} endTime 结束时间
  * @apiQuery {Number} pageSize 每页数量
  *
  * @apiSuccess {Number} totalRecords  总数
  * @apiSuccess {Object[]} data  列表数据
  * @apiSuccess {String} data.id  id
  * @apiSuccess {String} data.img_url 抓拍人脸图片
  * @apiSuccess {String} data.name  姓名
  * @apiSuccess {String} data.locationName  地址
  * @apiSuccess {String} data.captureTime  抓拍时间
  *
  */
router.all('/card/get_card_data', async function (req, res, next) {
  if (req.query.tabs === '1') {
    req.json.data = [
      {
        "id": "1",
        "img_url": "./error.png",
        "name": "张三1",
        "locationName": "澳柯玛摄像头1",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "2",
        "img_url": "./images/2.png",
        "name": "张三2",
        "locationName": "澳柯玛摄像头2",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "3",
        "img_url": "./images/1.png",
        "name": "张三3",
        "locationName": "澳柯玛摄像头3",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "4",
        "img_url": "./images/2.png",
        "name": "张三4",
        "locationName": "澳柯玛摄像头4",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "5",
        "img_url": "./images/1.png",
        "name": "张三5",
        "locationName": "澳柯玛摄像头5",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "6",
        "img_url": "./images/2.png",
        "name": "张三6",
        "locationName": "澳柯玛摄像头6",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "7",
        "img_url": "./images/1.png",
        "name": "张三7",
        "locationName": "澳柯玛摄像头7",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "8",
        "img_url": "./images/2.png",
        "name": "张三8",
        "locationName": "澳柯玛摄像头8",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "9",
        "img_url": "./images/1.png",
        "name": "张三9",
        "locationName": "澳柯玛摄像头9",
        "captureTime": "2022-08-05 12:12:12"
      },
      {
        "id": "10",
        "img_url": "./images/2.png",
        "name": "张三10",
        "locationName": "澳柯玛摄像头10",
        "captureTime": "2022-08-05 12:12:12"
      }
    ]
  } else {

  }

  req.json.totalRecords = 156

  await req.sleep(2)
  res.json(req.json);
});

module.exports = router;
