const express = require("express");
const router = express.Router();
router.get("/one2one/id-card", (req, res) => {
  const data = {
    data: {
      bigImage: "http://192.168.5.47:3003/image_proxy.jpg",
      data: Array.from({ length: 20 }).fill({
        x: 500,
        y: 500,
        w: 100,
        h: 100,
        targetImage: "http://192.168.5.47:3003/image_proxy.jpg",

        targetType: "pedestrian",
        feature:
          "Vij0LAGzAirvLk6q/6horE6ofrE9qaik8quML5ahUavZKKSlBa+MKu6s1iW5KOyqrKcCp6ytjSf+LKWgS5rVqBus7a3wJEiklLCKrVWtNS6FL6SlA67jp6SvYKuZpUgiaK86MEssch9hpQma8aUmsIWrZC/aMNKoXC06sSSrw64kL6itFzErrCexDSfQreCxQjDDMbOePyiBLKGsMC79rGAvlq0/HAKLwizjJ/srqC8HsIwspq8cKj0oICwmK+auu5p8Me0cua3oqEOr4SzWrpArvTSvKZqt6q54qPGqkyCqJMsoNScOJzoqqq7tLW6pmaUasAOt165tKU0kB7KtLQ==",
      }),
    },
  };
  res.send(data);
});

router.post("/v1/comparison/onevsone", (req, res) => {
  let data;
  if (Math.random() > 0.5) {
    data = {
      code: 0,
      message: "服务器发生了错误",
      // data: {
      //   similarityity: "94.09",
      //   evaluation: "可能为同目标",
      // },
    };
    res.status(500).send(data);
  } else {
    data = {
      code: 0,
      message: "服务器发生了错误",
      data: {
        similarity: "94.09",
        evaluation: "可能为同目标",
      },
    };
  }
  res.send(data);
});
module.exports = router;
