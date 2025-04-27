const express = require("express");
const router = express.Router();
router.all("/v1/notify/all", (req, res) => {
  res.send({
    data: Array.from({ length: 10 }).map((_, idx) => {
      return {
        type: "archAppState",
        type_data: 2,
        content: "这是一条消息".repeat(100),
        create_time: "2023-11-11 11:11:11",
        feedback_message: "feedback",
        link_url: "#/deployment",
        image_url:
          Math.random() > 0.5
            ? null
            : "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C1e2cb8f38b1e51.jpg&xywh=1182%2C239%2C179%2C386",
      };
    }),
    message: "全部消息",
  });
});

router.all("/v1/notify/unread", (req, res) => {
  res.send({
    data: Array.from({ length: 10 }).map((_, idx) => {
      return {
        type: "monitorResult",
        type_data: 2,
        content: "这是一条未读消息".repeat(100),
        create_time: "2023-11-11 11:11:11",
        feedback_message: "feedback",
        link_url: "http://www.baidu.com",
        image_url:
          Math.random() > 0.5
            ? null
            : "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C1e2cb8f38b1e51.jpg&xywh=1182%2C239%2C179%2C386",
      };
    }) && null,
    message: "未读消息",
  });
});

router.all("/v1/notify/unread-count", (req, res) => {
  res.send({
    data: 100,
    message: "未读消息",
  });
});
module.exports = router;
