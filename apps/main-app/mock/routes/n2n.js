const express = require("express");
const router = express.Router();
let database = Array.from({ length: 120 }).map((t, idx) => {
  return {
    taskId: idx,
    taskName: idx,
    baseDb: 1,
    baseDbName: "这是一个很长很长很长很长很长的库名",
    baseDbType: 3,
    baseDbIsDeleted: 1,
    compareDb: 32,
    compareDbName: "这是一个个很长很长很长很长很长很长很长很长很长的库名",
    compareDbType: 3,
    compareDbIsDeleted: 0,
    similarity: 90,
    outCome: 100,
    uname: "zing",
    createTime: "2023/02/31 13:00:00",
    taskStatus: 4,
    errMsg: "完成拉啊",
  };
});
// 获取列表
router.post("/v1/comparison/nvsn/show/list", (req, res) => {
  const { page, pageSize } = req.body;
  const start = (page - 1) * pageSize;
  const slice = database.slice(start, start + pageSize);
  res.send({
    totalRecords: database.length,
    usedTime: 10,
    message: "okkkk",
    errorMessage: "ooook",
    //
    data: slice,
  });
});
// 删除任务
router.post("/v1/comparison/nvsn/remove", (req, res) => {
  const willDeleted = req.body.taskIdList;

  database = database.filter((task) => !willDeleted.includes(task.taskId));

  res.send({
    message: "okkkk",
    errorMessage: "ooook",
  });
});
// 获取任务结果

router.post("/v1/comparison/nvsn/show/result", (req, res) => {
  console.log(req.body);
  const data = Array.from({ length: 300 }).map((_, idx) => {
    return {
      taskId: Math.random(),
      infoId: idx,
      baseName: ``,
      baseDbId: idx,
      baseDbType:1,
      baseExtraDbId: [123123, 123, 1234, 12312312312],
      baseDbName: `bdn-${idx}`.repeat(10),
      baseExtraDbName: ["帅哥".repeat(10), "小伙子", "超级小伙子", "Super小伙子"],
      baseImage:
        "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F64%2C06c3a4d3712d&xywh=1220%2C1155%2C60%2C78",
      baseIdNumber: "",
      compareName: `compareName-${idx}`,
      compareDbId: 123,
      compareDbName: `compareDbName-${idx}`,
      compareExtraDbId: [],
      compareExtraDbName: [],
      compareImage: "http://192.168.5.47:3003/image_proxy.jpg",
      compareIdNumber: "360733199805063657",
      similarity: Math.random() * 100,
    };
  });
  res.send({
    data,
    message: "okkkk",
    errorMessage: "ooook",
    totalRecords: data.length,
    usedTime: 109,
  });
});
// 添加任务
router.post("/v1/comparison/nvsn/add", (req, res) => {
  res.send({
    message: "okkkk",
    errorMessage: "ooook",
  });
});
module.exports = router;
