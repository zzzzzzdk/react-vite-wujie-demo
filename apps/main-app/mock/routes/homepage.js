const express = require("express");
const router = express.Router();

router.get("/api/v1/homepage/common-apps", (req, res) => {
  res.send({
    data: [
      {
        icon: "lixianshujufenxi1",
        text: "离线数据分析",
        remarks: "",
        path: "/offline",
        name: "offline",
        type: "",
        id: "fe3e694f-0412-587b-20c6-0a385948fa6b",
        pid: "37c2e1a1-6608-f658-6543-20ff76388cdc",
        target: "",
        children: null,
      },
      {
        icon: "lishishipinfenxi",
        text: "历史视频分析",
        remarks: "",
        path: "/history",
        name: "history",
        type: "",
        id: "2833b431-87ca-99e4-39b1-d38e8e7f2668",
        pid: "37c2e1a1-6608-f658-6543-20ff76388cdc",
        target: "",
        children: null,
      },
      {
        icon: "lishishipinfenxi",
        text: "目标1:1比对",
        remarks: "",
        path: "/one2one",
        name: "one2one",
        type: "",
        id: "e38aa547-44a0-734a-ba63-0aa015a3138e",
        pid: "37c2e1a1-6608-f658-6543-20ff76388cdc",
        target: "",
        children: null,
      },
      {
        icon: "lishishipinfenxi",
        text: "人脸N:N比对",
        remarks: "",
        path: "/n2n",
        name: "N2N",
        type: "",
        id: "18a6fcc7-7107-3cf8-cd79-5a587bee4dbc",
        pid: "37c2e1a1-6608-f658-6543-20ff76388cdc",
        target: "",
        children: null,
      },
    ],
    message: "获取常用应用",
  });
});

router.post("/api/v1/homepage/common-apps", (req, res) => {
  res.send({
    data: 100,
    message: "编辑常用应用",
  });
});

router.get("/api/v1/homepage/warning-statistics", (req, res) => {
  res.send({
    data: {
      personnelCount: 100,
      vehicleCount: 20,
      imageCount: 300,
    },
    message: "获取统计信息",
  });
});

module.exports = router;
