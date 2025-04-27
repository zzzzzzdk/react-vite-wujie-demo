const express = require("express");
const router = express.Router();
const labelManageJson = require('./json/labelManage.json');

router.all('/v1/label-manage/select', (req, res) => {
  // res.send({data: data2})
  res.send({
    "data": {
      labelSet: [
        {
          "value": 10,
          "label": "标签集一",

        },
        {
          "value": 1,
          "label": "标签集一"
        },
        {
          "value": 2,
          "label": "标签集一"
        },
        {
          "value": 5,
          "label": "标签集一"
        },
        {
          "value": 6,
          "label": "标签集一"
        },
        {
          "value": 9,
          "label": "标签集一"
        },
      ],
      labelName: [
        {
          "value": 10,
          "label": "标签名称一"
        },
        {
          "value": 1,
          "label": "标签名称一"
        },
        {
          "value": 2,
          "label": "标签名称一"
        },
      ],
      creator: [
        {
          "value": 10,
          "label": "创建人一"
        },
        {
          "value": 1,
          "label": "创建人一"
        },
        {
          "value": 2,
          "label": "创建人一"
        },
      ],
      creatorDepart: [
        {
          "value": 10,
          "label": "创建人所属部门一",
          "children": [
            { value: '111', label: 111 }
          ]
        },
        {
          "value": 1,
          "label": "创建人所属部门二"
        },
        {
          "value": 2,
          "label": "创建人所属部门三"
        },
      ],
      labelType: [
        {
          "value": 10,
          "label": "标签类型一"
        },
        {
          "value": 1,
          "label": "标签类型二"
        },
        {
          "value": 2,
          "label": "标签类型三"
        },
      ]
    }
  });
})

router.post('/v1/label-manage/list', (req, res) => {
  // res.send({data: data2})
  res.send({
    totalRecords: 100,
    usedTime: 10,
    data: labelManageJson
    // "data": [
    //   {
    //     labelSetName: '标签集1',
    //     labelSetIds: [10, 1, 2],
    //     labelId: '11',
    //     labelName: "这是一个表前名称",
    //     remarks: "重点人员分类：刑侦",
    //     labelType: "人员",
    //     labelCount: 123,
    //     canDeploy: "no",
    //     creator: "管理员",
    //     creatorDepart: "YISA研创中心",
    //     updateTime: "2024-02-21 00:00:00",
    //     captureCounts: 0,
    //     captureDays: 0,
    //     labelTypeId: "personnel",
    //     managePermissions: 'part',
    //     managePersons: ['yiyisasasa', 'angular', 'javascript'],
    //     ruleType: "manual",
    //     timeRange: {
    //       period: 0,
    //       times: []
    //     },
    //     timeType: "nonFixed",
    //     visiblePermissions: "part",
    //     visiblePersons: ['yiyisasasa'],
    //     authority: 'visible'
    //   },
    //   {
    //     labelSetName: '标签集11',
    //     labelSetId: 'set1',
    //     labelId: '111',
    //     labelName: '标签名称',
    //     remarks: "重点人员分类：刑侦",
    //     labelType: "人员",
    //     labelCount: 123,
    //     canDeploy: "是",
    //     creator: "管理员",
    //     creatorDepart: "YISA研创中心",
    //     updateTime: "2024-02-21 00:00:00",
    //     captureCounts: 0,
    //     captureDays: 0,
    //     labelTypeId: "personnel",
    //     managePermissions: 'part',
    //     managePersons: ['yiyisasasa', 'angular', 'javascript'],
    //     timeRange: {
    //       period: 0,
    //       times: []
    //     },
    //     timeType: "nonFixed",
    //     visiblePermissions: "part",
    //     visiblePersons: ['yiyisasasa'],
    //     ruleType: "rule",
    //     rule: [
    //       ['sex', '=', '123'],
    //       ['and', 'caseType', '≠', '321'],

    //     ],
    //     authority: 'manage',
    //     authoritySet: 'manage',
    //   },
    //   {
    //     labelSetName: '标签集2',
    //     labelSetId: 'set2',
    //     labelId: '22',
    //     labelName: '标签名称',
    //     remarks: "重点人员分类：刑侦",
    //     labelType: "人员",
    //     labelCount: 123,
    //     canDeploy: "是",
    //     creator: "管理员",
    //     creatorDepart: "YISA研创中心",
    //     updateTime: "2024-02-21 00:00:00",
    //     authoritySet: 'manage',
    //     authority: "visible"
    //   }
    // ]
  });
})

router.post('/v1/label-manage/label-set', (req, res) => {
  // res.send({data: data2})
  // res.statusCode = 403
  res.send({
    "message": "添加失败",
    "data": []
  });
})

router.post('/v1/label-manage/label', (req, res) => {
  // res.send({data: data2})
  res.send({
    "data": []
  });
})

router.post('/v1/label-manage/add-target', (req, res) => {
  // res.send({data: data2})
  res.send({
    "data": []
  });
})

router.post('/v1/label-manage/label/del', (req, res) => {
  // res.send({data: data2})
  res.send({
    "data": []
  });
})

router.all('/v1/label-manage/person-query', (req, res) => {
  // res.send({data: data2})
  res.send({
    // data: alarms,
    data: {
      idNumber: "360722199805063658",
      personName: "yisa",
      featureList: Array(10).fill({
        feature:
          "fKONJjkjVqzmIbUqZa0OH70YbCoEKMklZ684JPkv+KRyrSMpUKjhJGssgyhMLWOoyx28KlaaS6qSoCyoqyVPLvCmPKv3pQYoeSatHk8s3CqvH7wiR6pepSEm6y7cm80nZ6VZHBUtf6benokmMhy8HGarFZ0Krv8mXyihFwAoMiOELbajqaW3JQuRyZq3pVQiFSsAo/YsvJ/nKFIWOyTiKYSRIiwar7wtyq4uJsCUjChMLAeuKiljJSGrAIclHEwoup8xKNumziDxqcertir/Kmio7KzNLDOrSQtzIycnSKe2rI0f5KokLjEiqByuJ0SpjqS9oiaquiXNJ9ghLC3CKfOnOyVpquqnsqhLJ66RmCUzqW0rjqVwpk6u/aZ9JZElSK3MH2qs7SV+k+KhAJQkJEkdCiXjqC6kdKj6qGspUJ4gnKGghCxLKyyocilQHrmmxip7q/alth6qq4ujVCXUp1GlaiuJqfEsAiyZrZwnYarZILshNq2yJbagOa9rpRcdsS+6KwanYaR+I1kslKjGK7Gp0qxlmV8nPyBTLIws/6kNJ7AkfhwkKtEp6iGtJEKgDCXEl8As/5XUKHqppKjaKsqqoivRqt0nZifIInsbRR0rG8+SOBUlKn2ltC36GTasHS8So5CnkqkqqdokH5LHIwmtp6YgFc8lh6FlqRyurROqo7EnayoZoHWqcaqdGDStKiYjKA0tfaBzHbOqHCi5KsIjIqzXqw+keKnoHuMqeqompw+piqLRpKkqOCv8lQuuDig7onmkvy0XLPIvi6sSq3+gnZ8Ip2MiM6P2IXOlXB9ILMArtyfJKEcqZ6z9KjqomiUBK+emLpZRpH2gQKkJJxWt4ql3pxcpiyXwoD+r0ZQzHXSpF6Z+H4+qUCgEp/ooZyJ0pWMnJKx/qEqlAqYdKWgpHaZKJCGkLiOhqA2kMZ4mKAYB+KiUqEAsrSfxD3yZSiR2JMirGyhhGxMpOSgRKlojEZp6qa8qDqo0FByoGKJsmI4p9iPZp3slAiZ9KNCvPajIogmgoiiJpBEsuhxSkcMooChrrVUo1yBdHJmhzqjRKg+q76weqdctvhnsKw0o4B7qqFCu36pip7qdkKxtKuEvGSc+HoGsWa17LKgiu6UtJBeqKKa0oY+sAhihrJ2hBKKTIFIaHCrypxWkMClHql2lUyAXrGYpAqq6pighxyn2G6mnM6QgKb4pp6PXLLWqAivBmsMnk6oXqskpq510KgyqJizmKjkoBCO3IJYmAKaxI0winyb5GCQg6qrFrg8q5CG8rPAo5SsZpR4nR4jpKbkmAacZoMUpu60zMG6bxKGfmhEhpyG6K/MnqilmqLcrsqk0oyIocCBSISIoHSkbpQ==",
        targetImage:
          "http://192.168.5.47:3003/target_pic.jpg",
      }),
    },
    message: "人员",
  });
})
router.all('/v1/label-manage/excel', (req, res) => {
  // res.send({data: data2})
  res.send({
    // data: alarms,
    data: {
      labelTypeId: 'vehicle',
      taskId: 12213
    },
    message: "人员",
  });
})

router.all('/v1/label-manage/process', (req, res) => {
  // res.send({data: data2})
  res.send({
    // data: alarms,
    process: 100,
    data: {
      success: 123,
      failedReason: "失败原因",
      failed: 21,
      failedUrl: '/11122'
    },
    message: "人员",
  });
})

router.all('/v1/label-manage/list-manage-label-set', (req, res) => {
  // res.send({data: data2})
  res.send({
    // data: alarms,
    process: 100,
    data: [
      {
        "labelSetId": 10,
        "labelSetName": "标签集一",
        "labelCount": 111,
        managePermissionsSet: 'part',
        managePersonsSet: ['yiyisasasa', 'angular', 'javascript'],
      },
      {
        "labelSetId": 11,
        "labelSetName": "标签集2",
        "labelCount": 0
      },
    ],
    message: "人员",
  });
})
router.all('/v1/label-manage/label-set/del', (req, res) => {
  // res.send({data: data2})
  res.send({
    // data: alarms,
    message: "人员",
  });
})

router.all('/v1/label-manage/check-label-set-name', (req, res) => {
  // res.send({data: data2})
  res.send({
    // data: alarms,
    message: "success",
  });
})

module.exports = router;
