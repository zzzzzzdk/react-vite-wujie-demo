var express = require('express');
var router = express.Router();

/**
  * @api {get} /table/get_list 模板列表
  * @apiName Table1
  * @apiUse APICommon
  * @apiGroup Table
  *
  * @apiQuery {String} search_value 模糊查询
  * @apiQuery {Number} pn 页码
  * @apiQuery {Number} pageSize 每页数量
  * @apiQuery {String} sorterField 排序字段
  * @apiQuery {String} sorterOrder 排序方式 <code>ascend 正序、descend 倒序</code>
  * @apiQuery {String} SubscribeDetail
  *
  * @apiSuccess {Number} totalRecords  总数
  * @apiSuccess {Object[]} data  列表数据
  * @apiSuccess {String} data.id  id
  * @apiSuccess {String} data.name  页面跳转
  * @apiSuccess {String} data.hostname  地址
  * @apiSuccess {String} data.collect_time  开始采集时间
  * @apiSuccess {String} data.SubscribeDetail  订阅
  *
  */
router.get('/table/get_list', async function (req, res, next) {
  req.json.data = [
    {
      "id": 1,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 2,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 3,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 4,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 5,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 6,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 7,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 8,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 9,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 10,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
    {
      "id": 11,
      "name": "页面跳转",
      "hostname": "192.1.1.1",
      "collect_time": "2022-08-05 12:12:12",
      "SubscribeDetail": 2,
      "account": "121321"
    },
  ]

  // req.json.data = []
  req.json.totalRecords = 156

  await req.sleep(2)
  res.json(req.json);
});



/**
  * @api {get} /table/del_one 删除一条数据
  * @apiName Table2
  * @apiUse APICommon
  * @apiGroup Table
  *
  * @apiQuery {String} id 数据id
  *
  */
router.get('/table/del_one', function (req, res, next) {
  // req.json.status = 156
  // req.json.message = '删除失败'
  res.json(req.json);
});

module.exports = router;
