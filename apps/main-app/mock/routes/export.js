const express = require("express");
const router = express.Router();
// 发起导出
router.all("/v1/targetretrieval/*/export", async (req, res) => {
  req.json = {
    jobId: 'jobiddddddd'
  }
  await req.sleep(1)
  res.send(req.json);
});
// 请求进度
router.all("/v1/export/progress", async (req, res) => {
  req.json = {
    progress: 100,
    successUrl: "res.successUrl",
    successNum: 102,
    failUrl: `res.failUrl`,
    failNum: 2
  }
  await req.sleep(1)
  res.send(req.json);
})
module.exports = router;
