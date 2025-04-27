const express = require("express");
const router = express.Router();

router.post('/api/pdm/v1/feedback/feedback', (req, res) => {
  // res.send({data: data2})
  res.send({
    message:"成功"
  });
})
module.exports = router;
