const express = require("express");
const router = express.Router();
const monitorDetailsJson = require('./json/monitor-details.json')
const usersJson = require('./json/users.json')

router.get("/v1/monitor/permission", (rq, res) => {
  res.send({
    data: {
      approveMonitor: true,
    },
    message: "是否有权限？",
  });
});
router.get("/v1/monitor/approveUsers", (rq, res) => {
  res.send({
    data: Array.from({ length: 5 }).map((_, idx) => {
      return {
        account: "10000",
        userName: `hongqing-${idx}`,
        userUUID: idx.toString(),
        tel: "10010",
        origanizationUUID: Math.random().toString(),
      };
    }),
    message: "",
  });
});
router.get("/v1/monitor/receiverUsers", (req, res) => {
  // res.send({
  //   data: [
  //     {
  //       type: "org",
  //       name: "组织1",
  //       id: "vue",
  //     },
  //     {
  //       type: "user",
  //       name: "用户1",
  //       id: "yiyisasasa",
  //     },
  //     {
  //       type: "org",
  //       parentId: 0,
  //       name: "yisa",
  //       id: "yisa",
  //       tel: "yisa",
  //       children: [
  //         {
  //           type: "user",
  //           parentId: "yisa",
  //           name: "张三",
  //           id: "angular",
  //           tel: "10086",
  //         },
  //         {
  //           type: "user",
  //           parentId: "yisa",
  //           name: "李四",
  //           id: "javascript",
  //           tel: "10086",
  //         },
  //         {
  //           type: "user",
  //           parentId: "yisa",
  //           name: "张奶萨张奶萨张奶萨张奶萨张奶萨张奶萨张奶萨张奶萨张奶萨",
  //           id: "zhnagsaksa",
  //           tel: "10010",
  //         },
  //       ],
  //     },
  //   ],
  //   message: "",
  // });
  res.send(usersJson)
});
router.post("/v1/monitor/list-titles", (req, res) => {
  res.send({
    message: "获取布控标题",
    data: Array.from({ length: 10 }).map((_, idx) => {
      return {
        jobId: idx,
        title: `这是第${idx}个布控标题`,
      };
    }),
  });
});

/* ================目标布控===================== */
/* 添加布控 */
router.post("/v1/monitor/add", (req, res) => {
  res.send({ message: "ok" });
});

// 编辑布控
router.post("/v1/monitor/view", (req, res) => {
  res.send({ data: database[1], message: "编辑布控" });
});
// 更新布控
router.post("/v1/monitor/update", (req, res) => {
  res.send({ message: "更新布控" });
});

router.post("/v1/monitor/person-photo", (req, res) => {
  return res.send({
    // data: alarms,
    data: {
      license: "360722199805063658",
      personName: "yisa",
      featureList: Array(10).fill({
        feature:
          "fKONJjkjVqzmIbUqZa0OH70YbCoEKMklZ684JPkv+KRyrSMpUKjhJGssgyhMLWOoyx28KlaaS6qSoCyoqyVPLvCmPKv3pQYoeSatHk8s3CqvH7wiR6pepSEm6y7cm80nZ6VZHBUtf6benokmMhy8HGarFZ0Krv8mXyihFwAoMiOELbajqaW3JQuRyZq3pVQiFSsAo/YsvJ/nKFIWOyTiKYSRIiwar7wtyq4uJsCUjChMLAeuKiljJSGrAIclHEwoup8xKNumziDxqcertir/Kmio7KzNLDOrSQtzIycnSKe2rI0f5KokLjEiqByuJ0SpjqS9oiaquiXNJ9ghLC3CKfOnOyVpquqnsqhLJ66RmCUzqW0rjqVwpk6u/aZ9JZElSK3MH2qs7SV+k+KhAJQkJEkdCiXjqC6kdKj6qGspUJ4gnKGghCxLKyyocilQHrmmxip7q/alth6qq4ujVCXUp1GlaiuJqfEsAiyZrZwnYarZILshNq2yJbagOa9rpRcdsS+6KwanYaR+I1kslKjGK7Gp0qxlmV8nPyBTLIws/6kNJ7AkfhwkKtEp6iGtJEKgDCXEl8As/5XUKHqppKjaKsqqoivRqt0nZifIInsbRR0rG8+SOBUlKn2ltC36GTasHS8So5CnkqkqqdokH5LHIwmtp6YgFc8lh6FlqRyurROqo7EnayoZoHWqcaqdGDStKiYjKA0tfaBzHbOqHCi5KsIjIqzXqw+keKnoHuMqeqompw+piqLRpKkqOCv8lQuuDig7onmkvy0XLPIvi6sSq3+gnZ8Ip2MiM6P2IXOlXB9ILMArtyfJKEcqZ6z9KjqomiUBK+emLpZRpH2gQKkJJxWt4ql3pxcpiyXwoD+r0ZQzHXSpF6Z+H4+qUCgEp/ooZyJ0pWMnJKx/qEqlAqYdKWgpHaZKJCGkLiOhqA2kMZ4mKAYB+KiUqEAsrSfxD3yZSiR2JMirGyhhGxMpOSgRKlojEZp6qa8qDqo0FByoGKJsmI4p9iPZp3slAiZ9KNCvPajIogmgoiiJpBEsuhxSkcMooChrrVUo1yBdHJmhzqjRKg+q76weqdctvhnsKw0o4B7qqFCu36pip7qdkKxtKuEvGSc+HoGsWa17LKgiu6UtJBeqKKa0oY+sAhihrJ2hBKKTIFIaHCrypxWkMClHql2lUyAXrGYpAqq6pighxyn2G6mnM6QgKb4pp6PXLLWqAivBmsMnk6oXqskpq510KgyqJizmKjkoBCO3IJYmAKaxI0winyb5GCQg6qrFrg8q5CG8rPAo5SsZpR4nR4jpKbkmAacZoMUpu60zMG6bxKGfmhEhpyG6K/MnqilmqLcrsqk0oyIocCBSISIoHSkbpQ==",
        targetImage:
          "http://192.168.5.47:3003/target_pic.jpg",
      }),
    },
    message: "人员",
    totalRecords: 41,
    usedTime: 10,
  });
});
// 上传身份证
router.post("/v1/monitor/importPersonLicense", (req, res) => {
  res.send({ successNum: 1234, successUrl: "abc", failNum: 0, failUrl: "" });
});
/* ================布控明细===================== */
const database = Array.from({
  length: 41,
}).map((_, index) => {
  return {
    jobId: index, // 布控单号
    title: "这是一个标题", // 布控标题
    deployTimeType: 1,
    timeRange: {
      times: ["2023-9-18 00:00:00", "2023-11-24 23:31:48"],
      periods: {
        dates: ["1999-11-19", "2023-11-25"],
        times: [
          "09:04:09",
          "14:04:04",
          "10:04:09",
          "14:04:04",
          "10:04:09",
          "14:04:04",
        ],
      },
    },
    locationIds: [
      "3702020625728343777test-01",
      "370211400056555",
    ], // 点位范围
    offlineIds: [],
    measure: 1, // 采取措施
    createTime: "2023-9-18 00:00:00", // 创建时间
    createUser: {
      userUUID: "1",
      userName: "创建人",
      tel: "10086",
      organizationName: "cri",
    }, // 创建人
    approveTime: "审批时间", // 审批时间
    approveUser: {
      userUUID: 1234,
      userName: "approver",
      tel: "10086",
      organizationName: "pbg",
    }, // 审批人
    receiveUsers: Array(50).fill({ userUUID: "router", userName: "receiver1" }),
    status: "reviewing", //
    monitorCount: 100008,
    reason:
      "这是布控原因这这是关闭原因这是关闭原因这是关闭原因这是关闭原因这是关闭原因是关闭原这这是关闭原因这是关闭原因这是关闭原因这是关闭原因这是关闭原因是关闭原因因",
    closeType: "close",
    approveReason: "布控单审批通过",
    closeReason:
      "这这是关闭原因这是关闭原因这是关闭原因这是关闭原因这是关闭原因是关闭原因",
    bkType: 1,
    monitorList: [
      {
        itemId: 0,
        alarmTypes: [1],
        featureList: [{ "targetType": "face", "id": "3738717368", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=151%2C497%2C134%2C162", "detection": { "x": 151, "y": 497, "w": 134, "h": 162 }, "feature": "a6dRqz0kYyRIIsKkryUaL7ultagypBylcaflroMqDimdkDkjqCisIbMmn5y8qBIqaCdgLB8kGCpfK6qlJalxpegl9ynFJDKkMqw3pbEqx52QqT+afR6bqVUtzSrNqSGjK6FwIIgp7yp8omEsTqe8LQglPaQBKxKqiayoKvirnSsiHt+oXKFAo4cfliQTo2+ssameJKEt5SmeKCQscCazKemmXg6ljjqgTioCJBqt2SqLKjessqO5noElCSwOLSAovqt2FjMrO6iHnUSqJKd/rHotZiVrKColZiZGqagtsSggpw0rrariKlQsIS1wI9Co8aUcoVIhxywqJLUnsawNmDOb4iFYpKyggyh4FaGusaDWHnMo4SCuLNmo4SWnrDQgTiUyJH+irij3qcOtM6t5JjUoaSlOKCWiKCKnphEogir0Kj2ptCDNK6El/CeBq8ensKAsMJclKChiLIepjKY+KiGrFSZ2ljslfabRlHKuqZj6IxAfqQ8wnaoutCOqJKImk50zp5wmQCSPp0EimChTLUmjCizPoT4tgypQooYrlSr7qtsxcSCOorUhOKEKKiqgwaY7LeOsY6YaLMyqDpF9LHOoASghn3AgQqmmp7slXiQHpc6ozKS4KQ0oHx2HJX2oA6oHKT+jfKVArPaYLaNMqGQtY6H4GhCj4Smyp26l3qmuJwGvc6+CKfqgUafNI66a56Nkrowlh6jHImKgPagpLgcmBybIJ5oDRKj7Gn6ViawTqtAoF6DCJF8YESkdpRohCim6mgCmLSO4J0WvjqUIq7QqJCWaphMmL66RKasq4RvXJFqmQySdrEusJSYcqtYrd6EBoCSgl6jvp2osTylgHUujFKXLqfKsGqNrHBypqaXhpHOljSjCqDmrfxxZJqIbnywCq1Ipj6ySK+2pHSX/LBStGiRnLawp8ygeoyksHShzp3QnpitmqSCsG62brHSvUqijI42cVioQJCcsHapCK/gmei00HoWd76jWK7QayiexokIvPyFgKWuoMCzhqOkoWCNxKC6dNSp3o7WbKaZpqFSrqKDwLP8jWR70KtMcCaluKAmwQqfVqqUq0Cy+rdsrfqVrpwscza5pJt4ov6R6mi2fYC6ypzyoPCyiqBIm4R8fKcEqmyWYk3aiOisWo0IrvS7KK8eX+SlvmV6qviRUIQEg5CCvKYyoR6XaoecjRiHaILosMaUgHweUn6SNpZ0ggaEHpq6i26jhIfwj+SBZraglCKN6LLAqaSV7J5UkV6S4J0gjqCramWKoEKy1nwSLWyF3pWMp5qZnH2spYivWJqWq2K4rJSYl4KVCqJAoq6JGJ8Ypqh2ULJYbTiXLp1smiyplJ5KQ/59gmYwgBqa4GA==", "objectTypeId": 6 }, { "targetType": "face", "id": "1155887626", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=670%2C343%2C122%2C180", "detection": { "x": 670, "y": 343, "w": 122, "h": 180 }, "feature": "PiitKNah8aj7rJQszSJJLf2pAyzkqX4nMKtNrK2n4xvGpaqe1aP5pwYqfSn+pCMomil6oRIuUSsSqjkoQh0aLCIrWS2xqACipagWqNIqQacUqTibzSoQrFkoPCnKoa6kdK1FquUWzZaJJ4Um/6igrFIoUBSILMEs+qMooFAsQihqKD0naaaVK5KYUBc+KSKZkaxWqy0ksqsAqySdiabyrGmo7CANluenRyjvpGKtwqwcLFAkZKampJyuCqQuqOWkCqbqmmieda1oKOksICoQm4akWaWeKgepfiCYKlopNagxGbEodCBaFrgotS06ndIivxtWqHIjSqyCrAahAiAqp7yY9KmBKnitdRgNokGeHSvCqkKufi18JJ8oGJS1qmmtWCvUIBGj9qdtLYClhS6XrGan+qhiKfaqcCSkKTCu5SY4qHAqRKgqqragUpgSJ1UKxqOcok+p7SJ7IKio8Z4GoMCpASdSLtwo9Rfcps4loBoxo46kSKVGJPilMCIJn9gidiisKcYpFKWdp2KkfijYrc6oqK1AKDKtAaaNGIkqfqYtpQKZDK4anYmpvqRCLAOkMyjcoEkrpihWIscrrixalKwjIaNKK0WqEKO9LJqZLaq7J5gtmiWll+OnT6mJJOKseKsGqOggzKkqKBYl/qfSpCapFibqE70dh6hpqK0poqOuoxAo6K2AKFgsGqREqOmkYSpMJRWJDa0AnsurxKyCJPkmlaImLQaoqKV6LKkq9ZolqfwmRRjqrDCoLKSaKHyuxKJBoEkpwKp5GPKoaqH4IiUbNqcUqW8kTBxqqHagkaSdp/0mup8fJUKnwh9RJUIsmKrnLMSqmKU8pLOoYSy0q8ScKylypowo6h1YKbGpyakdJKwucqjvqB4osqiqKn0kch4hLeEm+Ka7L+Am9Su5p5amlqltG52t4KxdmmkdUChgrugZ/iVupC0ZcKj5pa2t1ijeJTyrCB+VmpWsKSjbp+4sIiUlKjKp1qqPpHEs+CiSJxEqXR7VpHWqeKO8KHcsAJ9IJL6gKKuirPUeTSIxK+iipSUkKjMpLiyBrpglBitkqaqniirCq/qlYqhZLAoqlR3Zqoys8aUJpHwvFSM1oCwg7yAQKCmdqh2Aqb6sSCq4sGyml6SqrEqk3Z9eMI4auquqJsUaXh/xIJwsaCo4IV6o0xxmpaimyqmUGEacrCzTKBormCQZqGgi+R0wrJonDC8wG9wc/pttmVypxSPwoqYoLKjVCRYtGqkppXAiDaWPLJsgKKz2IeqqWCy5LcWoAifWKFigDKgcqmiqjSUqlKifJSj6KESo7avyH6KdfimQKSqp5aIyJb+jKiLnq6wmfapMJGssRax4qD8p5B5iog==", "objectTypeId": 5 }, { "targetType": "face", "id": "3068871255", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=1292%2C362%2C136%2C122", "detection": { "x": 1292, "y": 362, "w": 136, "h": 122 }, "feature": "Yqt4JoGtBR2CKbQouifqpu+lbSG/sJWpE6pQLoCqHSJCHSIpr6b9pfIofSaQKKyugKjCqoao8yZgJgUVKhbULM+hOShKqnqpcqGypcSsTS0KLDqmaaq/qTGql6nsq4UpBxzpJy8hjKQerjigZSt/psguOSxrKDcoZCRlq5Kp+aZgIKumiSq9qYApOC1MnrSu1ShpoiClGSRiIfutgybPKHmnPyjapvifJCpMqBMgFqvQKGWqsSTFKGcV/SljKV+ooCDMpb8mvib+Ghis2ieAqEsfQqXuqVCsJyMnooYlX6SYKRknYy21ITSaqCOgKeAsjixQo8Qph6j0InGs2x7cqY2h2qryoBUgtCCTLTMsXabmq0ApNq0loDgbCST+rKsk8JzbJVUsX6kBrOItGiYKK3qlbSBxJ9umdCkknTyrtaaTqvOqZKkPJ0OlZSLLqpUaMqF7Ekks6yDaJhGqwpX7pjetlK94IScpQB39JwiooKuTnY+akSh1oyUUqKkWLGwmRqMBpiUrCayYHgue7CTrqQadTywwpmml1qMxKTqeu6VhqWioOStzoe4ZCh+KrAuqDCz6mUslAyULIRQhq67THZ4rnqjjphgiQCi8qNuqMJOiHSqpXyc/pQYpoK0nGXinnqnIFVih0SlxowimSqUPLIMkdiiWLNcpdCTKIOwk/qplG18pjijGqc6lTCKlGAeoXi3YIAGrDSYfq0QuFaCnKzWl7iBhrcekvywaKyclvqrkp0wtgJ2Cp8kXqJ/0mc8cSaxTKDwiRazMp4clu6POqU+s0a3Gra0rQi0RJryokinMrHknM6c5qAEnUwtjKniop56xKHijiyQfH3IfBJscLZiqiiDzHp0pQKd9IlEp7qkXp28sNBpMnrAk+S7cqc6jtx96oTSmySdcKRarASnmqHapoJvUHQqnQiM8Kows9qDGLbOoSip7pH4vjSmPJxcvnpKSJ9AhfqSooEwkKaBenwAn6xhvJ5kqVi+wLTIrkq6IJpWtGK48K1OdFihuqRukY63gKC0v6658nTkc3hasHP6iRqwHE54ojqMvIXkiKCw9JKUttSleo3Ik66G1pqWnNqeorWqlrKhforqgRiukHDqhXCQFqMmnQoxBJFqokRweJsieV6DgH+SoAaQsm4WtTSW0KM4pL6cxrMklUqYDIZasByRyq8alhB3IqX4tdRpfLY2t+isCEoiilhmsKMQkQC0TqMmkA6yVpWYqBKZjKWApcZfCqGKg2KQpKtAoACzbqiCmA6uaKCsqUycqG4urgCp2oSQeCSmepfEhQqN8KT0mKauap+ee4qQNrDYrLSdLrHQjICQnqw0rM6hTKDmj1quxhxSmnBWuqpko6yhXLg==", "objectTypeId": 5 }, { "targetType": "pedestrian", "id": "4105366340", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=437%2C358%2C192%2C691", "detection": { "x": 437, "y": 358, "w": 192, "h": 691 }, "feature": "Vh8ELKys1CGcsOGu1C1IrxMsFqV8LKCsADGqIfmufKgALeYPHawDMwApxy0sK02qVa9zIder1a+SqIMnvCzdKDuhWy7QMIOoqKyvsdwk/aeyLQ+w3CaYJ2moBRidsWgpDzNjrWAsRitYJQsnkxDrL2SsLis/KkevGiuepmkuHC1rr+klGSqsrKsvCixDLfIu2S0IsLWkj62OIxKj/C0ZnvuuAqw/J76woCyCLBcYe5Igqdgu8qq9Ir6raSyrsNYqA6hXLbWxEy1dLOoqC6mSrFSyFjE+rDS0kK0CMsirSCtNLb0glSwiLakr66rulmewpCMKr9yoc6juqP+qHC2SJw==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "3926407798", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=140%2C485%2C317%2C600", "detection": { "x": 140, "y": 485, "w": 317, "h": 600 }, "feature": "SDK9Jamuq64DKJes8StSIx8sfqiDKawaLC4Wp8uo2y0ssuItvaqdKOOriSTwMSUgUq10r4avMyzdmY8w4ibypzSkKzD2L7Us6KaWIFcw2ilSK9wo0ykZn1Wqbybnr/StpqworhkvYQzjrOCZjixPrVIyTrDQsMyrUCvdsZQk9yzZpg2veyrrrxCsHqcHICgmKayMJ5KtXCvXLOeuMyllpSgveyreL5IlCDN7LOyuv64Vk/EuXqbBpsmZLiE9r1GpEKUZMUQsxDEUqpIwFC9MKbSxkKVBLMeqtK2MI70q3qqMK42sJCF0K7Auyio3J5CpbK6fsR4w0LDsrTul8SmQrg==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "1151859975", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=960%2C164%2C74%2C235", "detection": { "x": 960, "y": 164, "w": 74, "h": 235 }, "feature": "gizUpIocGitAK/wuDinUoZafgqQvLrWxm6zGrZ2t+SqjpAOtP6ByLiSnhS1fKmqfUrCRJYYl3aZ6kh2x0hIxrYW0Vax+recofq3jqNQuTysXr94x9y00KRsq8jFqpnmvFiq8Gv2eI6lopzcrliujJmSpOChOpS6eAi0ysbgqGzGILRQsyyaCJcSt8aMkJ3qm2qrXpeyo7q5Rrd8xna48qiIoeLLWL4gthLJgIyopzytSqVks4qoBrdgw2i4Zp3UNN60jKOkuLSwrISwwuDAZrJipGDFssYovwp/kqL2x2rLcoCWnvyf9on+deq2sm2GpHZFUqR6k/bCAm/guZS7Now==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "1110868400", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=1114%2C255%2C111%2C419", "detection": { "x": 1114, "y": 255, "w": 111, "h": 419 }, "feature": "rzArK6woTCzArveq4qJdMHOv2ywCrA4rMyXeqqCkoSw6rvEtfKn8G8Wv4zAksGMcCqturaykqoBrqscuRCxjquytFy0KIw0sBaS4q+omUKUYrZIxpyp0sdUonK1ksGUq2ikYKYeu4i1cqA6osSvVsNQg1K5VsfqshyvgsMufKKWssIwpYLFCrreuXy+6KVyfHK0TIUKr2CWMMIytFy4SK7Awea2MK1cu3KS4L3yjMa5DLryn6SSqMN8w0p0esfKiZKTJLE2lnC9vrGMpjSkqKH4cWy0TsPClubD0MaGt3Kl3sGmuZ6xno8WsUCxcrRGu0LFIpMGfJaWysCcu3C8vLA==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "1777855735", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=1071%2C483%2C375%2C597", "detection": { "x": 1071, "y": 483, "w": 375, "h": 597 }, "feature": "AyzYLYut4rFPphcrZiBhFFEtlSizKfstXDDaHXCt3qnYsAIlqrG1KfKmjKlXLtylTCsfqvKe5DAfMDGiGig0JtGxWKcprF6pVaugK5YxYyZGIoIuyyyZLo2mT60nsTuuU6eiJBik3CgfMOWwCSairNIhbK3vo/Uojy//pU0xv6iALO+k2KRTG0SxZ6m0MGqkaaoCsXytJyVvqUQwsauGICEoIyDbLZcrhau7pqWt/qobr+Uqsa/mr0wCbiXSsncp4Kh8L3OnqzCIrJQo8CcDo1wuOzOCrRWqa6qCL7kviKpQLYSoPaxeLzcqAzNFqZqtqxj5rUEqE7FEsD0rDyxKpA==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "226953084", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=1426%2C370%2C139%2C454", "detection": { "x": 1426, "y": 370, "w": 139, "h": 454 }, "feature": "caByqYWrHLAqqVsjHa1brKal4xwiKy6pYqYbMEepFzGJsQmtJKngMGauiCPlLpYs7iY3ra+tNS/NLIYtF7Fvq6+yKKn3qO8sZ6BEq3YtraWnqAqwx6pyrGQqGKwip/mvJKwFma0kDqj7LK4nZilPsLgbvisiLZUgJ6qqsLMshh1tMG0wVyDQKxi0jB4hMqMsbyTurSyxCywwoeeqR6ouqRWtcagErbsqdShGLOusVqTaqUUsTqTYsVaxwqa5ru0m0SzgLD6s3aYAq9EkiKtEsVQqEDBnrKyvtaQ4pvosha+nKrmpF6ooMWQxwSpuqSGwn6wOsIuxAq9WrXep8Cj0rA==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "3665592343", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=911%2C216%2C94%2C339", "detection": { "x": 911, "y": 216, "w": 94, "h": 339 }, "feature": "SK0gMCQrVK/PMpGlAaerrJWlYCcOKf0k1qOhrCGwkTFArmcsdqpeKcavO6DZMPgpIywerJyojK2DKJWaK58ysmuobC4jrcWq2ieUr30r1KKMLgGs8DFHq+WeDaxarjGYO6qDqmEkXCtJqV6wVKvMH1EgO6k6JySti692sdYuBCE3ragwWarCH+GwoCw0LwutHDDMncakCKxTLk0pE6gnLK6rhrIzI0Ys/xnnLKgwgq74o2swraelsP6qTyXTrTMrnSm4IZ2oCSq5p5ejMy99plYz6SvIp7QvarAKKOmsRzIEjSmqRK6Lq1iw0hyaqzOxBq84HR+tky3tMPMsfCU4Kw==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "2175472119", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=533%2C537%2C365%2C546", "detection": { "x": 533, "y": 537, "w": 365, "h": 546 }, "feature": "ByzxKo+turG7I9+uyzDopYgtyy5rISIptivQK06pUidmr0cxVrFmKOSmM6t2Mm+spSrUq1Gg/S7wLJYodi+BK5isAKfPrM+jZScEpjQp0KSkr3AtdCv0L36kMakYsNwnqikcKjatMCypKGGwASh3pdYm26MclmypEDBwJBgx5quVq96vHSnwse2xIq14L2IhnC5Gsh4iqqiVIGItA7CsHUYpmKwCKp0qi6RLpXCtX68YproQKafAsomrFSs6qjQtASwMMImVgjDJLs4muC1IKyMmMjI3rUWrkq8UKjsqRShUKPqtK7AxMJutly/bJjeuIzCErqssXLD5sDEsDiuhKA==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }, { "targetType": "pedestrian", "id": "4029868725", "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30", "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F12%2C6c66474abd30\u0026xywh=1197%2C281%2C131%2C364", "detection": { "x": 1197, "y": 281, "w": 131, "h": 364 }, "feature": "s6RcIjYvwyYjLhgeyDJzqmMiO68+qIOQSzLIqLGsZDEuseGk/Rm6rUClsqh8IOqmUKkpKSuv764ZqKcqii80LLKudi+BpLEvZqKtJKgroKAnqGgusDHosJCk4q9+rBWsCpnnrO4pUSwBpn2ntCr6rAsywKlhLjevz6rxseekMy1jLhsvm6oRFSuc6yX4I2Wr5aytqxiyp7D9LFqufR3qJqYmMqebL6orJqt9FeoolKdqLi8w8Kq3qG8slK+ssLKkXqlcLw6sYyoDJa4xCyvvJ2qfyy53rYathCZwMEIkJ6x8MCGv8bGZpoUjOzGNLIWvw63RLU0mDaVqLM8vKDFBJg==", "objectTypeId": 1, "gaitMaskUrl": null, "gaitObjectUrl": null }],
        thresholds: {
          faceThreshold: 31,
        },
        remark: "picture",
        monitorType: "monitorImageType",
        captureTime: "2023-10-11",
        locationName: "这是抓拍地点",
      },
      {
        itemId: 1,
        alarmTypes: [1],
        featureList: [
          {
            bigImage:
              "http://192.168.5.76:8021/rlimg?url=http://192.168.11.16:9080/219,21b342cf517abd.jpg",
            feature:
              "fKONJjkjVqzmIbUqZa0OH70YbCoEKMklZ684JPkv+KRyrSMpUKjhJGssgyhMLWOoyx28KlaaS6qSoCyoqyVPLvCmPKv3pQYoeSatHk8s3CqvH7wiR6pepSEm6y7cm80nZ6VZHBUtf6benokmMhy8HGarFZ0Krv8mXyihFwAoMiOELbajqaW3JQuRyZq3pVQiFSsAo/YsvJ/nKFIWOyTiKYSRIiwar7wtyq4uJsCUjChMLAeuKiljJSGrAIclHEwoup8xKNumziDxqcertir/Kmio7KzNLDOrSQtzIycnSKe2rI0f5KokLjEiqByuJ0SpjqS9oiaquiXNJ9ghLC3CKfOnOyVpquqnsqhLJ66RmCUzqW0rjqVwpk6u/aZ9JZElSK3MH2qs7SV+k+KhAJQkJEkdCiXjqC6kdKj6qGspUJ4gnKGghCxLKyyocilQHrmmxip7q/alth6qq4ujVCXUp1GlaiuJqfEsAiyZrZwnYarZILshNq2yJbagOa9rpRcdsS+6KwanYaR+I1kslKjGK7Gp0qxlmV8nPyBTLIws/6kNJ7AkfhwkKtEp6iGtJEKgDCXEl8As/5XUKHqppKjaKsqqoivRqt0nZifIInsbRR0rG8+SOBUlKn2ltC36GTasHS8So5CnkqkqqdokH5LHIwmtp6YgFc8lh6FlqRyurROqo7EnayoZoHWqcaqdGDStKiYjKA0tfaBzHbOqHCi5KsIjIqzXqw+keKnoHuMqeqompw+piqLRpKkqOCv8lQuuDig7onmkvy0XLPIvi6sSq3+gnZ8Ip2MiM6P2IXOlXB9ILMArtyfJKEcqZ6z9KjqomiUBK+emLpZRpH2gQKkJJxWt4ql3pxcpiyXwoD+r0ZQzHXSpF6Z+H4+qUCgEp/ooZyJ0pWMnJKx/qEqlAqYdKWgpHaZKJCGkLiOhqA2kMZ4mKAYB+KiUqEAsrSfxD3yZSiR2JMirGyhhGxMpOSgRKlojEZp6qa8qDqo0FByoGKJsmI4p9iPZp3slAiZ9KNCvPajIogmgoiiJpBEsuhxSkcMooChrrVUo1yBdHJmhzqjRKg+q76weqdctvhnsKw0o4B7qqFCu36pip7qdkKxtKuEvGSc+HoGsWa17LKgiu6UtJBeqKKa0oY+sAhihrJ2hBKKTIFIaHCrypxWkMClHql2lUyAXrGYpAqq6pighxyn2G6mnM6QgKb4pp6PXLLWqAivBmsMnk6oXqskpq510KgyqJizmKjkoBCO3IJYmAKaxI0winyb5GCQg6qrFrg8q5CG8rPAo5SsZpR4nR4jpKbkmAacZoMUpu60zMG6bxKGfmhEhpyG6K/MnqilmqLcrsqk0oyIocCBSISIoHSkbpQ==",
            targetImage:
              "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Frlimg%3Furl%3Dhttp%3A%2F%2F192.168.11.16%3A9080%2F219%2C21b342cf517abd.jpg&xywh=39,27,88,119&cut_img=1",
            targetType: "face",
            h: 119,
            w: 88,
            x: 39,
            y: 27,
          },
          {
            targetImage:
              "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg&xywh=1061%2C974%2C74%2C86",
            bigImage:
              "http://192.168.7.206:8000/88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
            captureTime: "2023-11-25 22:25:05",
            detection: {
              x: 1061,
              y: 974,
              w: 74,
              h: 86,
            },
            feature:
              "VignJ2kqt6NGpVypGiKgL5kqkSW9KnmvZSybnIalkquyr5ioZaQoJZQiwylTLBcb7aF2JqWqLST2ok2l6KPvLASi75FkqZei5KnAGjQttylLKOyrDCyxrIKpzKQYKRYq5KP8Jl0sdSJWJmMqdZ7TKaeoOiAbKQOjAyXspF8oNCU1H8apdCvhplotrKoxKQKgOKwKpdclDqwjJ44odKlSpkUmlSoirKct/x8PqbilqaKhqsGsjZ1hGKEi/6ktKHkhzyZOorksPyOvqg6s5CUcrnaqnqaHKdWrJCUCplClkBw2JBkohqbipoIouKq8qQWNcaaZrBws/qJSGHgrlyYdCoymaKkSLRapaaxWLIcp3anKq06WbSgVJyWfkCPUIr4l+iNsrE8XzCnxn3Ykbx6bIBqopRjroeEoFaD3q1uZhx5UrOqdWBQ9JcOdkKp2ocYjyxRaHfIqpB/KJnkp3SIyqi6rGyu7quykN6M7K3qrKCX3Iy4nS6coKEQeoK4ipzkm1ypeLJ4r/qLfo12k5RzEomIpgycYJsAenSq6JZip3CE0LaQsMKrPrMct5RzYK8cWJqVusNIr/COAqESohRyjBiWn0KUjJ0CbjCZbLHCk0SMVK+yo36DtL5IsNqvoHtUjB6R/pWipYCr3qMAgxS6FK2yfcZ1VJxuq6ZoNJjCueamQpsMkkKSwIS2rd6UuHXSfYSvKqDsnrCllq7grEiB4qIIhUKoIqfck2yUMoFkjCKfMpGkqNqqqqU4ph63wKVsrq6owr3krJCSyniCZVSoMqykm2KlDrUklYyb5qX2ipKlAqSUmNigMGdgpq6KwHRwloqjSq1km7yl3KVeucaPZElGnc5/lH8gklCOnEtGkTiYjIUibN6d/pmUtXy3sqB4gciCKKseiaZwtpWwmzqsfqQWo56MJp+MkwyTQjUMhwi3VrZGlGKlIpoOrray6JHktiJrKpgin6CgPLBwgnSgLLT4ex6W1pIOsBaoRKs4qP6z7qVivnSArKR+h9Kyeqxmsu6rCpfMc4CLzITaRRSXzIVOkJywcJ4ckmxjUpsElfSnCqpmrWKyvqOQm7iq4JAWf2ZQEnmgBnShlpKapiaQcot8oSCXOpVEWHaBWLxEo0CpOpFssGqrzqkyn6aUuJSWsD6xIqPynsx1cLJKVlacZrbkdASwILcSkZyryn3oqIwPdqawpeypBlPUgQ63wnT0oC6RKKBoo2qDGmxouraRWrpWol6YgsKipNCxpqNQs/i4RLm4nJKZMKUCpACj1KK6oIyzGJT8ksywVJBSp26h3LMkhZqb5oCcq7ipSqc6qryHjoKYdLSlMKOAqtKEjoASlJCyoqO8s7SqHJn6tRysoKw==",
            infoId: "656203c1-b9c4-79e5-3e5a-53e6937937a9",
            locationName: "3702012739679345",
            locationId: "3702012739679345",
            targetType: "face",
            lngLat: {
              lng: 0,
              lat: 0,
            },
            downloadUrl:
              "http://192.168.11.12:81/image-proxy?browser_download_pic=3702012739679345-20231125222505-10&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
          },
        ],
        thresholds: {
          faceThreshold: 30,
        },
        remark: "picture",
        monitorType: "monitorImageType",
        captureTime: "2023-10-11",
        locationName: "这是抓拍地点",
      },
      {
        carInfo: "",
        // carInfo: Array(10).fill("比亚迪").join("/"),
        itemId: 2,
        licensePlate: "京ABCD",
        plateColorTypeId: -1,
        licensePlateFileUrl: "",
        vehicleTypeId: 10,
        // brandId: "37",
        brandId: -1,
        modelId: [],
        yearId: [],
        alarmTypes: [1, 2, 3],
        labelId: [],
        remark: "vehicle property",
        monitorType: "monitorVehiclePropertyType",
        captureTime: "2023-10-11",
        locationName: "2023-10-11",
      },
      {
        itemId: 3,
        licensePlate: "",
        plateColorTypeId: -1,
        licensePlateFileUrl: "/123",
        licenses: [{ plate: "京A12345", plateColorTypedId: 1 }],
        vehicleTypeId: -1,
        brandId: "",
        modelId: [],
        yearId: [],
        alarmTypes: [1, 2],
        labelId: [],
        remark: "vehicle batch",
        monitorType: "monitorVehicleBatchType",
        captureTime: "2023-10-11",
        locationName: "2023-10-11",
        licenses: Array.from({ length: 10 }).map((_, idx) => {
          return {
            licensePlate: `鲁A1234${idx}`,
            plateColorTypeId: Math.floor(Math.random() * 10),
          };
        }),
      },
      {
        itemId: 4,
        licensePlate: "",
        plateColorTypeId: -1,
        licensePlateFileUrl: "/123",
        licenses: [{ plate: "京A12345", plateColorTypedId: 1 }],
        vehicleTypeId: -1,
        brandId: "",
        modelId: [],
        yearId: [],
        alarmTypes: [1, 2],
        labelId: [],
        remark: "vehicle label",
        monitorType: "monitorVehicleTagType",
        captureTime: "2023-10-11",
        locationName: "2023-10-11",
        targetImage: 'http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F84_e66b71b0-9570-11ed-98ea-3473790e9619.jpg&xywh=870%2C302%2C339%2C271',
        licenses: Array.from({ length: 10 }).map((_, idx) => {
          return {
            plate: `鲁A1234${idx}`,
            plateColorTypeId: Math.floor(Math.random() * 10),
          };
        }),
        labelInfos: [
          {
            id: 111,
            name: "标签标签".repeat(5),
          },
          {
            id: 8,
            name: "标签标签",
          },
          {
            id: 9,
            name: "标签标签".repeat(5),
          },
          {
            id: 81,
            name: "标签标签",
          },
          { id: 0, name: "标" },
          {
            id: 1,
            name: "标签",
          },
          {
            id: 2,
            name: "标签标签",
          },
          {
            id: 4,
            name: "标签标签",
          },
        ],
        labelInfos: Array.from({ length: 30 }).map((_, idx) => {
          return {
            id: idx,
            name: `这这这标签${idx}`.repeat(1),
          };
        }),
      },
      /* 人员属性 */
      {
        itemId: 5,
        licensePlate: "",
        plateColorTypeId: -1,
        licensePlateFileUrl: "/123",
        licenses: [{ plate: "京A12345", plateColorTypedId: 1 }],
        vehicleTypeId: -1,
        brandId: "",
        modelId: [],
        yearId: [],
        alarmTypes: [1, 2],
        labelId: [],
        remark: "person property",
        personName: "person property",
        license: "370722188803048567",
        monitorType: "monitorPersonIdType",
        captureTime: "2023-10-11",
        locationName: "2023-10-11",
        featureList: [
          {
            bigImage:
              "http://192.168.5.76:8021/rlimg?url=http://192.168.11.16:9080/219,21b342cf517abd.jpg",
            feature:
              "fKONJjkjVqzmIbUqZa0OH70YbCoEKMklZ684JPkv+KRyrSMpUKjhJGssgyhMLWOoyx28KlaaS6qSoCyoqyVPLvCmPKv3pQYoeSatHk8s3CqvH7wiR6pepSEm6y7cm80nZ6VZHBUtf6benokmMhy8HGarFZ0Krv8mXyihFwAoMiOELbajqaW3JQuRyZq3pVQiFSsAo/YsvJ/nKFIWOyTiKYSRIiwar7wtyq4uJsCUjChMLAeuKiljJSGrAIclHEwoup8xKNumziDxqcertir/Kmio7KzNLDOrSQtzIycnSKe2rI0f5KokLjEiqByuJ0SpjqS9oiaquiXNJ9ghLC3CKfOnOyVpquqnsqhLJ66RmCUzqW0rjqVwpk6u/aZ9JZElSK3MH2qs7SV+k+KhAJQkJEkdCiXjqC6kdKj6qGspUJ4gnKGghCxLKyyocilQHrmmxip7q/alth6qq4ujVCXUp1GlaiuJqfEsAiyZrZwnYarZILshNq2yJbagOa9rpRcdsS+6KwanYaR+I1kslKjGK7Gp0qxlmV8nPyBTLIws/6kNJ7AkfhwkKtEp6iGtJEKgDCXEl8As/5XUKHqppKjaKsqqoivRqt0nZifIInsbRR0rG8+SOBUlKn2ltC36GTasHS8So5CnkqkqqdokH5LHIwmtp6YgFc8lh6FlqRyurROqo7EnayoZoHWqcaqdGDStKiYjKA0tfaBzHbOqHCi5KsIjIqzXqw+keKnoHuMqeqompw+piqLRpKkqOCv8lQuuDig7onmkvy0XLPIvi6sSq3+gnZ8Ip2MiM6P2IXOlXB9ILMArtyfJKEcqZ6z9KjqomiUBK+emLpZRpH2gQKkJJxWt4ql3pxcpiyXwoD+r0ZQzHXSpF6Z+H4+qUCgEp/ooZyJ0pWMnJKx/qEqlAqYdKWgpHaZKJCGkLiOhqA2kMZ4mKAYB+KiUqEAsrSfxD3yZSiR2JMirGyhhGxMpOSgRKlojEZp6qa8qDqo0FByoGKJsmI4p9iPZp3slAiZ9KNCvPajIogmgoiiJpBEsuhxSkcMooChrrVUo1yBdHJmhzqjRKg+q76weqdctvhnsKw0o4B7qqFCu36pip7qdkKxtKuEvGSc+HoGsWa17LKgiu6UtJBeqKKa0oY+sAhihrJ2hBKKTIFIaHCrypxWkMClHql2lUyAXrGYpAqq6pighxyn2G6mnM6QgKb4pp6PXLLWqAivBmsMnk6oXqskpq510KgyqJizmKjkoBCO3IJYmAKaxI0winyb5GCQg6qrFrg8q5CG8rPAo5SsZpR4nR4jpKbkmAacZoMUpu60zMG6bxKGfmhEhpyG6K/MnqilmqLcrsqk0oyIocCBSISIoHSkbpQ==",
            targetImage:
              "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Frlimg%3Furl%3Dhttp%3A%2F%2F192.168.11.16%3A9080%2F219%2C21b342cf517abd.jpg&xywh=39,27,88,119&cut_img=1",
            targetType: "face",
            h: 119,
            w: 88,
            x: 39,
            y: 27,
          },
          {
            targetImage:
              "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg&xywh=1061%2C974%2C74%2C86",
            bigImage:
              "http://192.168.7.206:8000/88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
            captureTime: "2023-11-25 22:25:05",
            detection: {
              x: 1061,
              y: 974,
              w: 74,
              h: 86,
            },
            feature:
              "VignJ2kqt6NGpVypGiKgL5kqkSW9KnmvZSybnIalkquyr5ioZaQoJZQiwylTLBcb7aF2JqWqLST2ok2l6KPvLASi75FkqZei5KnAGjQttylLKOyrDCyxrIKpzKQYKRYq5KP8Jl0sdSJWJmMqdZ7TKaeoOiAbKQOjAyXspF8oNCU1H8apdCvhplotrKoxKQKgOKwKpdclDqwjJ44odKlSpkUmlSoirKct/x8PqbilqaKhqsGsjZ1hGKEi/6ktKHkhzyZOorksPyOvqg6s5CUcrnaqnqaHKdWrJCUCplClkBw2JBkohqbipoIouKq8qQWNcaaZrBws/qJSGHgrlyYdCoymaKkSLRapaaxWLIcp3anKq06WbSgVJyWfkCPUIr4l+iNsrE8XzCnxn3Ykbx6bIBqopRjroeEoFaD3q1uZhx5UrOqdWBQ9JcOdkKp2ocYjyxRaHfIqpB/KJnkp3SIyqi6rGyu7quykN6M7K3qrKCX3Iy4nS6coKEQeoK4ipzkm1ypeLJ4r/qLfo12k5RzEomIpgycYJsAenSq6JZip3CE0LaQsMKrPrMct5RzYK8cWJqVusNIr/COAqESohRyjBiWn0KUjJ0CbjCZbLHCk0SMVK+yo36DtL5IsNqvoHtUjB6R/pWipYCr3qMAgxS6FK2yfcZ1VJxuq6ZoNJjCueamQpsMkkKSwIS2rd6UuHXSfYSvKqDsnrCllq7grEiB4qIIhUKoIqfck2yUMoFkjCKfMpGkqNqqqqU4ph63wKVsrq6owr3krJCSyniCZVSoMqykm2KlDrUklYyb5qX2ipKlAqSUmNigMGdgpq6KwHRwloqjSq1km7yl3KVeucaPZElGnc5/lH8gklCOnEtGkTiYjIUibN6d/pmUtXy3sqB4gciCKKseiaZwtpWwmzqsfqQWo56MJp+MkwyTQjUMhwi3VrZGlGKlIpoOrray6JHktiJrKpgin6CgPLBwgnSgLLT4ex6W1pIOsBaoRKs4qP6z7qVivnSArKR+h9Kyeqxmsu6rCpfMc4CLzITaRRSXzIVOkJywcJ4ckmxjUpsElfSnCqpmrWKyvqOQm7iq4JAWf2ZQEnmgBnShlpKapiaQcot8oSCXOpVEWHaBWLxEo0CpOpFssGqrzqkyn6aUuJSWsD6xIqPynsx1cLJKVlacZrbkdASwILcSkZyryn3oqIwPdqawpeypBlPUgQ63wnT0oC6RKKBoo2qDGmxouraRWrpWol6YgsKipNCxpqNQs/i4RLm4nJKZMKUCpACj1KK6oIyzGJT8ksywVJBSp26h3LMkhZqb5oCcq7ipSqc6qryHjoKYdLSlMKOAqtKEjoASlJCyoqO8s7SqHJn6tRysoKw==",
            infoId: "656203c1-b9c4-79e5-3e5a-53e6937937a9",
            locationName: "3702012739679345",
            locationId: "3702012739679345",
            targetType: "face",
            lngLat: {
              lng: 0,
              lat: 0,
            },
            downloadUrl:
              "http://192.168.11.12:81/image-proxy?browser_download_pic=3702012739679345-20231125222505-10&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
          },
        ],
        licenses: Array.from({ length: 10 }).map((_, idx) => {
          return {
            plate: `鲁A1234${idx}`,
            plateColorTypeId: Math.floor(Math.random() * 10),
          };
        }),
        labelInfos: [
          {
            id: 111,
            name: "标签标签".repeat(5),
          },
          {
            id: 8,
            name: "人员标签",
          },
          {
            id: 9,
            name: "标签标签".repeat(5),
          },
          {
            id: 81,
            name: "标签标签",
          },
          { id: 0, name: "标" },
          {
            id: 1,
            name: "标签",
          },
          {
            id: 2,
            name: "标签标签",
          },
          {
            id: 4,
            name: "标签标签",
          },
        ],
        thresholds: {
          dynSysThreshold: 1, // 动态抓拍系统预警阈值
          dynSmsThreshold: 2, // 动态抓拍短信预警阈值
          dynAppThreshold: 3, // 动态抓拍APP预警阈值
          driSysThreshold: 4, // 驾乘抓拍系统预警阈值
          driSmsThreshold: 5, // 驾乘抓拍短信预警阈值
          driAppThreshold: 6, // 驾乘抓拍App预警阈值
        },
      },
      /* 人员标签 */
      {
        thresholds: {
          dynSysThreshold: 1, // 动态抓拍系统预警阈值
          dynSmsThreshold: 2, // 动态抓拍短信预警阈值
          dynAppThreshold: 3, // 动态抓拍APP预警阈值
          driSysThreshold: 4, // 驾乘抓拍系统预警阈值
          driSmsThreshold: 5, // 驾乘抓拍短信预警阈值
          driAppThreshold: 6, // 驾乘抓拍App预警阈值
        },
        itemId: 6,
        licensePlate: "",
        plateColorTypeId: -1,
        licensePlateFileUrl: "/123",
        licenses: [{ plate: "京A12345", plateColorTypedId: 1 }],
        vehicleTypeId: -1,
        brandId: "",
        modelId: [],
        yearId: [],
        alarmTypes: [1, 2],
        labelId: [],
        remark: "person label",
        personName: "person label",
        license: "370722188803048567",
        monitorType: "monitorPersonTagType",
        captureTime: "2023-10-11",
        locationName: "2023-10-11",
        featureList: [
          {
            bigImage:
              "http://192.168.5.76:8021/rlimg?url=http://192.168.11.16:9080/219,21b342cf517abd.jpg",
            feature:
              "fKONJjkjVqzmIbUqZa0OH70YbCoEKMklZ684JPkv+KRyrSMpUKjhJGssgyhMLWOoyx28KlaaS6qSoCyoqyVPLvCmPKv3pQYoeSatHk8s3CqvH7wiR6pepSEm6y7cm80nZ6VZHBUtf6benokmMhy8HGarFZ0Krv8mXyihFwAoMiOELbajqaW3JQuRyZq3pVQiFSsAo/YsvJ/nKFIWOyTiKYSRIiwar7wtyq4uJsCUjChMLAeuKiljJSGrAIclHEwoup8xKNumziDxqcertir/Kmio7KzNLDOrSQtzIycnSKe2rI0f5KokLjEiqByuJ0SpjqS9oiaquiXNJ9ghLC3CKfOnOyVpquqnsqhLJ66RmCUzqW0rjqVwpk6u/aZ9JZElSK3MH2qs7SV+k+KhAJQkJEkdCiXjqC6kdKj6qGspUJ4gnKGghCxLKyyocilQHrmmxip7q/alth6qq4ujVCXUp1GlaiuJqfEsAiyZrZwnYarZILshNq2yJbagOa9rpRcdsS+6KwanYaR+I1kslKjGK7Gp0qxlmV8nPyBTLIws/6kNJ7AkfhwkKtEp6iGtJEKgDCXEl8As/5XUKHqppKjaKsqqoivRqt0nZifIInsbRR0rG8+SOBUlKn2ltC36GTasHS8So5CnkqkqqdokH5LHIwmtp6YgFc8lh6FlqRyurROqo7EnayoZoHWqcaqdGDStKiYjKA0tfaBzHbOqHCi5KsIjIqzXqw+keKnoHuMqeqompw+piqLRpKkqOCv8lQuuDig7onmkvy0XLPIvi6sSq3+gnZ8Ip2MiM6P2IXOlXB9ILMArtyfJKEcqZ6z9KjqomiUBK+emLpZRpH2gQKkJJxWt4ql3pxcpiyXwoD+r0ZQzHXSpF6Z+H4+qUCgEp/ooZyJ0pWMnJKx/qEqlAqYdKWgpHaZKJCGkLiOhqA2kMZ4mKAYB+KiUqEAsrSfxD3yZSiR2JMirGyhhGxMpOSgRKlojEZp6qa8qDqo0FByoGKJsmI4p9iPZp3slAiZ9KNCvPajIogmgoiiJpBEsuhxSkcMooChrrVUo1yBdHJmhzqjRKg+q76weqdctvhnsKw0o4B7qqFCu36pip7qdkKxtKuEvGSc+HoGsWa17LKgiu6UtJBeqKKa0oY+sAhihrJ2hBKKTIFIaHCrypxWkMClHql2lUyAXrGYpAqq6pighxyn2G6mnM6QgKb4pp6PXLLWqAivBmsMnk6oXqskpq510KgyqJizmKjkoBCO3IJYmAKaxI0winyb5GCQg6qrFrg8q5CG8rPAo5SsZpR4nR4jpKbkmAacZoMUpu60zMG6bxKGfmhEhpyG6K/MnqilmqLcrsqk0oyIocCBSISIoHSkbpQ==",
            targetImage:
              "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Frlimg%3Furl%3Dhttp%3A%2F%2F192.168.11.16%3A9080%2F219%2C21b342cf517abd.jpg&xywh=39,27,88,119&cut_img=1",
            targetType: "face",
            h: 119,
            w: 88,
            x: 39,
            y: 27,
          },
          {
            targetImage:
              "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg&xywh=1061%2C974%2C74%2C86",
            bigImage:
              "http://192.168.7.206:8000/88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
            captureTime: "2023-11-25 22:25:05",
            detection: {
              x: 1061,
              y: 974,
              w: 74,
              h: 86,
            },
            feature:
              "VignJ2kqt6NGpVypGiKgL5kqkSW9KnmvZSybnIalkquyr5ioZaQoJZQiwylTLBcb7aF2JqWqLST2ok2l6KPvLASi75FkqZei5KnAGjQttylLKOyrDCyxrIKpzKQYKRYq5KP8Jl0sdSJWJmMqdZ7TKaeoOiAbKQOjAyXspF8oNCU1H8apdCvhplotrKoxKQKgOKwKpdclDqwjJ44odKlSpkUmlSoirKct/x8PqbilqaKhqsGsjZ1hGKEi/6ktKHkhzyZOorksPyOvqg6s5CUcrnaqnqaHKdWrJCUCplClkBw2JBkohqbipoIouKq8qQWNcaaZrBws/qJSGHgrlyYdCoymaKkSLRapaaxWLIcp3anKq06WbSgVJyWfkCPUIr4l+iNsrE8XzCnxn3Ykbx6bIBqopRjroeEoFaD3q1uZhx5UrOqdWBQ9JcOdkKp2ocYjyxRaHfIqpB/KJnkp3SIyqi6rGyu7quykN6M7K3qrKCX3Iy4nS6coKEQeoK4ipzkm1ypeLJ4r/qLfo12k5RzEomIpgycYJsAenSq6JZip3CE0LaQsMKrPrMct5RzYK8cWJqVusNIr/COAqESohRyjBiWn0KUjJ0CbjCZbLHCk0SMVK+yo36DtL5IsNqvoHtUjB6R/pWipYCr3qMAgxS6FK2yfcZ1VJxuq6ZoNJjCueamQpsMkkKSwIS2rd6UuHXSfYSvKqDsnrCllq7grEiB4qIIhUKoIqfck2yUMoFkjCKfMpGkqNqqqqU4ph63wKVsrq6owr3krJCSyniCZVSoMqykm2KlDrUklYyb5qX2ipKlAqSUmNigMGdgpq6KwHRwloqjSq1km7yl3KVeucaPZElGnc5/lH8gklCOnEtGkTiYjIUibN6d/pmUtXy3sqB4gciCKKseiaZwtpWwmzqsfqQWo56MJp+MkwyTQjUMhwi3VrZGlGKlIpoOrray6JHktiJrKpgin6CgPLBwgnSgLLT4ex6W1pIOsBaoRKs4qP6z7qVivnSArKR+h9Kyeqxmsu6rCpfMc4CLzITaRRSXzIVOkJywcJ4ckmxjUpsElfSnCqpmrWKyvqOQm7iq4JAWf2ZQEnmgBnShlpKapiaQcot8oSCXOpVEWHaBWLxEo0CpOpFssGqrzqkyn6aUuJSWsD6xIqPynsx1cLJKVlacZrbkdASwILcSkZyryn3oqIwPdqawpeypBlPUgQ63wnT0oC6RKKBoo2qDGmxouraRWrpWol6YgsKipNCxpqNQs/i4RLm4nJKZMKUCpACj1KK6oIyzGJT8ksywVJBSp26h3LMkhZqb5oCcq7ipSqc6qryHjoKYdLSlMKOAqtKEjoASlJCyoqO8s7SqHJn6tRysoKw==",
            infoId: "656203c1-b9c4-79e5-3e5a-53e6937937a9",
            locationName: "3702012739679345",
            locationId: "3702012739679345",
            targetType: "face",
            lngLat: {
              lng: 0,
              lat: 0,
            },
            downloadUrl:
              "http://192.168.11.12:81/image-proxy?browser_download_pic=3702012739679345-20231125222505-10&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
          },
        ],
        licenses: Array.from({ length: 10 }).map((_, idx) => {
          return {
            plate: `鲁A1234${idx}`,
            plateColorTypeId: Math.floor(Math.random() * 10),
          };
        }),
        labelInfos: [
          {
            id: 111,
            name: "标签标签".repeat(5),
          },
          {
            id: 8,
            name: "人员标签",
          },
          {
            id: 9,
            name: "标签标签".repeat(5),
          },
          {
            id: 81,
            name: "标签标签",
          },
          { id: 0, name: "标" },
          {
            id: 1,
            name: "标签",
          },
          {
            id: 2,
            name: "标签标签",
          },
          {
            id: 4,
            name: "标签标签",
          },
        ],
        labelInfos: Array.from({ length: 100 }).map((_, idx) => {
          return {
            id: idx,
            name: `这这这标签${idx}`.repeat(1),
          };
        }),
      },
      /* 人员批量 */
      {
        itemId: 7,
        licensePlate: "",
        plateColorTypeId: -1,
        licensePlateFileUrl: "/123",
        licenses: [{ plate: "京A12345", plateColorTypedId: 1 }],
        vehicleTypeId: -1,
        brandId: "",
        modelId: [],
        yearId: [],
        alarmTypes: [1, 2],
        labelId: [],
        remark: "person batch",
        personName: "person batch ",
        license: "370722188803048567",
        monitorType: "monitorPersonBatchType",
        captureTime: "2023-10-11",
        locationName: "2023-10-11",
        featureList: [
          {
            bigImage:
              "http://192.168.5.76:8021/rlimg?url=http://192.168.11.16:9080/219,21b342cf517abd.jpg",
            feature:
              "fKONJjkjVqzmIbUqZa0OH70YbCoEKMklZ684JPkv+KRyrSMpUKjhJGssgyhMLWOoyx28KlaaS6qSoCyoqyVPLvCmPKv3pQYoeSatHk8s3CqvH7wiR6pepSEm6y7cm80nZ6VZHBUtf6benokmMhy8HGarFZ0Krv8mXyihFwAoMiOELbajqaW3JQuRyZq3pVQiFSsAo/YsvJ/nKFIWOyTiKYSRIiwar7wtyq4uJsCUjChMLAeuKiljJSGrAIclHEwoup8xKNumziDxqcertir/Kmio7KzNLDOrSQtzIycnSKe2rI0f5KokLjEiqByuJ0SpjqS9oiaquiXNJ9ghLC3CKfOnOyVpquqnsqhLJ66RmCUzqW0rjqVwpk6u/aZ9JZElSK3MH2qs7SV+k+KhAJQkJEkdCiXjqC6kdKj6qGspUJ4gnKGghCxLKyyocilQHrmmxip7q/alth6qq4ujVCXUp1GlaiuJqfEsAiyZrZwnYarZILshNq2yJbagOa9rpRcdsS+6KwanYaR+I1kslKjGK7Gp0qxlmV8nPyBTLIws/6kNJ7AkfhwkKtEp6iGtJEKgDCXEl8As/5XUKHqppKjaKsqqoivRqt0nZifIInsbRR0rG8+SOBUlKn2ltC36GTasHS8So5CnkqkqqdokH5LHIwmtp6YgFc8lh6FlqRyurROqo7EnayoZoHWqcaqdGDStKiYjKA0tfaBzHbOqHCi5KsIjIqzXqw+keKnoHuMqeqompw+piqLRpKkqOCv8lQuuDig7onmkvy0XLPIvi6sSq3+gnZ8Ip2MiM6P2IXOlXB9ILMArtyfJKEcqZ6z9KjqomiUBK+emLpZRpH2gQKkJJxWt4ql3pxcpiyXwoD+r0ZQzHXSpF6Z+H4+qUCgEp/ooZyJ0pWMnJKx/qEqlAqYdKWgpHaZKJCGkLiOhqA2kMZ4mKAYB+KiUqEAsrSfxD3yZSiR2JMirGyhhGxMpOSgRKlojEZp6qa8qDqo0FByoGKJsmI4p9iPZp3slAiZ9KNCvPajIogmgoiiJpBEsuhxSkcMooChrrVUo1yBdHJmhzqjRKg+q76weqdctvhnsKw0o4B7qqFCu36pip7qdkKxtKuEvGSc+HoGsWa17LKgiu6UtJBeqKKa0oY+sAhihrJ2hBKKTIFIaHCrypxWkMClHql2lUyAXrGYpAqq6pighxyn2G6mnM6QgKb4pp6PXLLWqAivBmsMnk6oXqskpq510KgyqJizmKjkoBCO3IJYmAKaxI0winyb5GCQg6qrFrg8q5CG8rPAo5SsZpR4nR4jpKbkmAacZoMUpu60zMG6bxKGfmhEhpyG6K/MnqilmqLcrsqk0oyIocCBSISIoHSkbpQ==",
            targetImage:
              "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Frlimg%3Furl%3Dhttp%3A%2F%2F192.168.11.16%3A9080%2F219%2C21b342cf517abd.jpg&xywh=39,27,88,119&cut_img=1",
            targetType: "face",
            h: 119,
            w: 88,
            x: 39,
            y: 27,
          },
          {
            targetImage:
              "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg&xywh=1061%2C974%2C74%2C86",
            bigImage:
              "http://192.168.7.206:8000/88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
            captureTime: "2023-11-25 22:25:05",
            detection: {
              x: 1061,
              y: 974,
              w: 74,
              h: 86,
            },
            feature:
              "VignJ2kqt6NGpVypGiKgL5kqkSW9KnmvZSybnIalkquyr5ioZaQoJZQiwylTLBcb7aF2JqWqLST2ok2l6KPvLASi75FkqZei5KnAGjQttylLKOyrDCyxrIKpzKQYKRYq5KP8Jl0sdSJWJmMqdZ7TKaeoOiAbKQOjAyXspF8oNCU1H8apdCvhplotrKoxKQKgOKwKpdclDqwjJ44odKlSpkUmlSoirKct/x8PqbilqaKhqsGsjZ1hGKEi/6ktKHkhzyZOorksPyOvqg6s5CUcrnaqnqaHKdWrJCUCplClkBw2JBkohqbipoIouKq8qQWNcaaZrBws/qJSGHgrlyYdCoymaKkSLRapaaxWLIcp3anKq06WbSgVJyWfkCPUIr4l+iNsrE8XzCnxn3Ykbx6bIBqopRjroeEoFaD3q1uZhx5UrOqdWBQ9JcOdkKp2ocYjyxRaHfIqpB/KJnkp3SIyqi6rGyu7quykN6M7K3qrKCX3Iy4nS6coKEQeoK4ipzkm1ypeLJ4r/qLfo12k5RzEomIpgycYJsAenSq6JZip3CE0LaQsMKrPrMct5RzYK8cWJqVusNIr/COAqESohRyjBiWn0KUjJ0CbjCZbLHCk0SMVK+yo36DtL5IsNqvoHtUjB6R/pWipYCr3qMAgxS6FK2yfcZ1VJxuq6ZoNJjCueamQpsMkkKSwIS2rd6UuHXSfYSvKqDsnrCllq7grEiB4qIIhUKoIqfck2yUMoFkjCKfMpGkqNqqqqU4ph63wKVsrq6owr3krJCSyniCZVSoMqykm2KlDrUklYyb5qX2ipKlAqSUmNigMGdgpq6KwHRwloqjSq1km7yl3KVeucaPZElGnc5/lH8gklCOnEtGkTiYjIUibN6d/pmUtXy3sqB4gciCKKseiaZwtpWwmzqsfqQWo56MJp+MkwyTQjUMhwi3VrZGlGKlIpoOrray6JHktiJrKpgin6CgPLBwgnSgLLT4ex6W1pIOsBaoRKs4qP6z7qVivnSArKR+h9Kyeqxmsu6rCpfMc4CLzITaRRSXzIVOkJywcJ4ckmxjUpsElfSnCqpmrWKyvqOQm7iq4JAWf2ZQEnmgBnShlpKapiaQcot8oSCXOpVEWHaBWLxEo0CpOpFssGqrzqkyn6aUuJSWsD6xIqPynsx1cLJKVlacZrbkdASwILcSkZyryn3oqIwPdqawpeypBlPUgQ63wnT0oC6RKKBoo2qDGmxouraRWrpWol6YgsKipNCxpqNQs/i4RLm4nJKZMKUCpACj1KK6oIyzGJT8ksywVJBSp26h3LMkhZqb5oCcq7ipSqc6qryHjoKYdLSlMKOAqtKEjoASlJCyoqO8s7SqHJn6tRysoKw==",
            infoId: "656203c1-b9c4-79e5-3e5a-53e6937937a9",
            locationName: "3702012739679345",
            locationId: "3702012739679345",
            targetType: "face",
            lngLat: {
              lng: 0,
              lat: 0,
            },
            downloadUrl:
              "http://192.168.11.12:81/image-proxy?browser_download_pic=3702012739679345-20231125222505-10&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F88_e7412e90-9570-11ed-98ea-3473790e9619.jpg",
          },
        ],
        licenses: Array.from({ length: 10 }).map((_, idx) => {
          return {
            personName: `张三${idx}`,
            license: Math.floor(Math.random() * 10),
          };
        }),
      },
    ],
    locationCount: 2
  };
});
/* 获取布控列表 */
router.post("/v1/monitor/list", (req, res) => {
  const { pageNo, pageSize } = req.body;
  const start = (pageNo - 1) * pageSize;
  const slice = database.slice(start, start + pageSize);
  res.send({
    totalRecords: database.length,
    usedTime: Math.random(),
    message: "获取布控列表",
    errorMessage: "ooook",
    data: database,
  });
});
/* 关闭布控单 */
router.post("/v1/monitor/close", (req, res) => {
  return res.send({
    message: "关闭成功",
  });
});
/* 审批布控单 */
router.post("/v1/monitor/review", (req, res) => {
  return res.send({
    message: "审批成功",
  });
});
/* ================布控单详情===================== */
router.post("/v1/monitor/detail", (req, res) => {
  console.log(req.body);
  return res.send({ data: database[1], message: "布控单详情" });
});
/* ================告警历史===================== */

const alarms = Array.from({ length: 10 }).map((_, idx) => {
  return {
    // id: idx,
    infoId: idx,
    jobId: idx,
    title: "布控",
    measure: 1,
    bkType: 1,

    monitorType: "monitorPersonTagype",
    monitorTarget: {
      monitorTargetUrl:
        "http://192.168.5.76:8021/img.php?xywh=530,1058,55,89&cut_img=1&exactly=1&img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Fimg.php%3Fimg_uuid%3Dhttp%253A%252F%252F192.168.7.206%253A8000%252F16ce8aa0-55c0-11ec-88b0-0cc47a9c4b97.jpg",
      licensePlate: "京A12345",
      vehicleTypeId: "2",
      plateColorTypeId: "2",
      brandId: "3",
      personName: "yisa",
      license: 123456789012345,
      labelInfos: [
        {
          id: 111,
          name: "标签".repeat(1),
        },
        {
          id: 8,
          name: "标签标签",
        },
        {
          id: 9,
          name: "标签标签".repeat(5),
        },
        {
          id: 81,
          name: "标签标签",
        },
        { id: 0, name: "标" },
        {
          id: 1,
          name: "标签",
        },
        {
          id: 2,
          name: "标签标签",
        },
        {
          id: 4,
          name: "标签标签",
        },
      ],
    },
    locationName: "yisa" + idx,
    licensePlate1: `鲁A${idx}`,
    licensePlate2: `鲁A${idx}`,
    bigImage:
      "http://192.168.7.206:8000/975_6b6a41f0-927b-11ed-8d2d-a0369f1f7f36.jpg",
    captureTime: "2021-12-16 12:20:06",
    carInfo: "客车车尾-车型2-A款",
    detection: {
      x: 754,
      y: 501,
      w: 76,
      h: 68,
    },
    downloadUrl:
      "http://192.168.11.12:81/image-proxy?browser_download_pic=3702010286480746-20231103160041-66&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F975_6b6a41f0-927b-11ed-8d2d-a0369f1f7f36.jpg",
    feature:
      "Sa2WLKikMzFgqtilKjGBmzsxpS2rLcAoxal7p2CsZh7LqIqiAidrJKSnPR/kq7uidqn6KI0k4J5Fp0ooZp/AIncyH6wmnUWjjqkEKXgnjqjZKcQoEKs8rlQx7yupqhcrcq9iMHwxMy0JpGEeXCYHJW8s/TG9pHiubaz0L0800hwOpoQsrSlkL1szOKthLcGsqZ7ypliknCj+nkunrrH+q16pv7D9MEApGCywsEWpZTVVpteiGaSTqWmnIKsUILOhxq+7KxmyexhKLvyg1DIiL5mZlawEqSuv1509LTywOahtrY8xrgsAKcSlQCU1p6AeR6XXqcKsFJLzo8aoqadTrQ==",
    windowFeature: "",
    lngLat: {
      // lng: 120.215252 + Math.random(),
      // lat: 35.965781 + Math.random(),

      lng: 120.215252,
      lat: 35.965781,
    },
    locationId: "3702010286480746",
    locationName: "S102与G205路口",
    direction: "未识别",
    plateColorTypeId2: 2,
    plateColorTypeString2: "其他",
    plateImage: "",
    targetImage:
      "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F156e7988-54ab-11ec-88b0-0cc47a9c4b97.jpg&xywh=1256%2C674%2C674%2C768",
    targetImage1:
      "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F04367df0-5550-11ec-88b0-0cc47a9c4b97.jpg&xywh=2295%2C533%2C603%2C600",
    targetType: "vehicle",
    similarity: 12,
  };
});

router.post("/v1/monitor/result", (req, res) => {
  return res.send({
    data: alarms,
    message: "告警历史",
    totalRecords: 41,
    usedTime: 10,
  });
});

router.post("/v1/monitor/result/detail", (req, res) => {
  // return res.send({
  //   // data: alarms,
  //   data: monitorDetailsJson,
  //   message: "告警详情",
  //   totalRecords: 41,
  //   usedTime: 10,
  // });
  return res.send(monitorDetailsJson)
});

module.exports = router;
