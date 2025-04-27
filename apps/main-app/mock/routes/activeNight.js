const express = require("express");
const router = express.Router();
router.get("/v1/targetretrieval/nocturnal_vehicless", async (req, res) => {
  await req.sleep(6)
  const data = [];
  res.send({
    data,
    echo: req.body,
    totalRecords: 156,
    usedTime: 100,
  });
});

module.exports = router;
