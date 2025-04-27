const express = require("express");
const router = express.Router();
const totalData = require("./json/vehicleAnalysis.json")
//车辆初次入城数据 ,被目标检索接口拦截
router.post("/v1/targetretrieval/city-first", (req, res) => {
  // res.send({
  //   ...totalData,
  //   data: totalData.initialData,
  //   detailsData: [],
  //   initialData: [],
  //   totalRecords:100
  // });
});

//车辆频繁过车数据 ,被目标检索接口拦截
router.post("/v1/targetretrieval/frequent_pass", (req, res) => {
  res.send({ "data": [{ "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4162d0-54b1-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 954, "y": 375, "w": 524, "h": 515 }, "feature": "ZbEipUMtTCgYrmyuTR/fp3Yptya/KIiwViXBJDGsCyv3oX0tzq3XqUQo3BtlsCqq3SaiqBCwCDA5MDYspaavq/KwKzCtLiwssy8lKtUhyKjnpUQaGy6RsXctiK8ErYQsYabxKui0Ci8xLqQqC69KsB0spiBFMF+uKa/NLMWnkKyTLhwwbCTYr4MnOqkOrtuwZSalroesXDE7qvOtb61OoNQoXa1QrH0tM7CNrc2syi9jpn6oIzBFqd6lNSjLqgGupiXDrGKu1a3Fszuj/yx9q86bsS1aFfctr63BJQcsKi0rINYtPydAKGCtX6dJKHowgixyrVuo7yddLucpkbAgrA==", "targetType": "vehicle", "captureTime": "2024-03-12 06:26:45", "carInfo": "丰田-威兰达-2022,2021,2020", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E6%B5%B7%E9%9D%92%E9%95%87%E5%90%8E%E6%B2%B3%E8%A5%BF%E6%9D%91%E5%90%8E%E6%B2%B3%E8%A5%BF%E5%85%A5%E5%8F%A3%E4%BA%BA%E8%BD%A6%E6%8A%93%E6%8B%8D-20240312062645-19\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4162d0-54b1-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef8525-564c-4a0a-9313-e81921f78773", "licensePlate1": "鲁U57F85", "licensePlate2": "鲁U57F85", "lngLat": { "lng": 119.54644, "lat": 35.708161 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4162d0-54b1-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=954%2C375%2C524%2C515", "LatestCaptureTime": "2024-03-12 06:26:45", "locationName": "海青镇后河西村后河西入口人车抓拍", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4162d0-54b1-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1198%2C793%2C115%2C37", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702012507762660", "locationId": "3702013655860249" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09601746-55b9-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 881, "y": 509, "w": 500, "h": 495 }, "feature": "vCcgLcQs1aFkqY4wPChpLAUwsSsMpIYptK66Lc2oyzFRsFYt/yt4rLgqJ7BRsc6gLytZqCMwximypL4uuyYypBEsE6iKMW+tLLKjLJKksTFer58v+SYqq9Ec0iSooUGi0qTVqlOgOaq6scgou6zBql4p9CNOKgS1XyrNLrMusqoDKowwZ7ILmikgBrBfLAio0CItpYAmkCvJqkYsLC6wMIQmYy62KAAwYqa8HhO0I6hmJqmrPitXqgakIirZKNOpYqpsJBaoW6USMUUtEiyxK/ItcKq8L8GseLF6rREtJK94LekhTCl/p/EokyxvLBSoQKiFrXaasS0nKMQpbDCBLw==", "targetType": "vehicle", "captureTime": "2024-03-12 05:35:03", "carInfo": "铃木-雨燕-2009,2008,2007,2005", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%89%8D%E6%B9%BE%E6%B8%AF%E8%B7%AF%E6%98%86%E4%BB%91%E5%B1%B1%E8%B7%AF%E4%B8%9C80%E7%B1%B3%E7%AE%80%E6%98%93%E5%8D%A1%E5%8F%A3-20240312053503-60\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09601746-55b9-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef7907-9486-99bc-fe90-0aa1ad3685ea", "licensePlate1": "鲁B616K5", "licensePlate2": "鲁B616K5", "lngLat": { "lng": 120.138802, "lat": 36.001868 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09601746-55b9-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=881%2C509%2C500%2C495", "LatestCaptureTime": "2024-03-12 05:35:03", "locationName": "前湾港路昆仑山路东80米简易卡口", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09601746-55b9-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1078%2C896%2C121%2C39", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702010129533384", "locationId": "3702011764217158" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4298e4-55d3-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 969, "y": 195, "w": 358, "h": 321 }, "feature": "iSS+rG6nGyiLpeUpJiwoKF8w2SmsrUomeyWhrEOuEieeLBspRipYs0YlU7MILgusLaxdsV+qPincKG2rmqy4r7GwjawJIKGzcK0VLSScQKrhKbYt6y8MrOMhyymTssksA64wJIemUy7Vqr+sXqxPrPolELA5LfIsnquPLYGhryoEp3GoIq1TMPcmQaheFGWvrKE+JYmk8Ch1KFap05HnrIirAbAHLKyscx7nrd6sirRHLAGpt6xWL2+adjD7rzsmAyjhLfol7a2RKtIuWSxvloQxl60rqpwr4CsUrKWxBLAFq64vi7HTsbokzS3upNskwKqBICkrRiDFrUMcBrBwJQ==", "targetType": "vehicle", "captureTime": "2024-03-12 06:26:58", "carInfo": "吉利-自由舰-2012,2011", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%89%8D%E6%B9%BE%E6%B8%AF%E8%B7%AF%E6%98%86%E4%BB%91%E5%B1%B1%E8%B7%AF%E4%B8%9C80%E7%B1%B3%E7%AE%80%E6%98%93%E5%8D%A1%E5%8F%A3-20240312062658-14\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4298e4-55d3-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef8532-60fd-de18-652e-844c227894cf", "licensePlate1": "鲁BG1U86", "licensePlate2": "鲁BG1U86", "lngLat": { "lng": 120.138802, "lat": 36.001868 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4298e4-55d3-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=969%2C195%2C358%2C321", "LatestCaptureTime": "2024-03-12 06:26:58", "locationName": "前湾港路昆仑山路东80米简易卡口", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0b4298e4-55d3-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1110%2C455%2C88%2C29", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702010590809396", "locationId": "3702013019606035" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1091cebc-55b7-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 940, "y": 1036, "w": 853, "h": 959 }, "feature": "96RBLWelVybIoJ+jqqkprOcu56L1npqo3qhVq+MqiCQWsAEWq6oZsC2rSjChKwaui69gKuOwLC3Zr9kujy8FrX8o86SMKaCyxabnKrytCxTRLxQwyC84r6wuViOJsAskIifuLJaupiIOrIyokioCJygqM7RPJo2requxMCOoWiyRLL0r56z2LdocvaWTsCGg2a7dMCwe+TG7K9wsAa4GJ4utJCgpsSKwKi6IqKutfDB2rL6tQq3LoV6oDqyGLh4gia0fqmkiMil5JQgvmSwELwEWPKy+MmkwczE+odytY7CSKGgxSKb2K2Gf6Z8UJnew8adXrBiocSv+K0QxbiqEqQ==", "targetType": "vehicle", "captureTime": "2024-03-12 08:48:11", "carInfo": "马自达-Mazda6-2015", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%85%AB%E9%87%8C%E5%BA%84%E7%A4%BE%E5%8C%BAC%E4%B8%9C%E9%97%A8%E5%87%BA%E5%8F%A3%E8%BD%A6%E8%BE%86%E6%8A%93%E6%8B%8D-20240312084811-22\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1091cebc-55b7-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65efa64b-b567-d1cc-52bd-9e79afc733fd", "licensePlate1": "鲁U0U663", "licensePlate2": "鲁U0U663", "lngLat": { "lng": 120.146052, "lat": 35.977335 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1091cebc-55b7-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=940%2C1036%2C853%2C959", "LatestCaptureTime": "2024-03-12 08:48:11", "locationName": "八里庄社区C东门出口车辆抓拍", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1091cebc-55b7-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1217%2C1922%2C197%2C60", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702011216575190", "locationId": "3702011483241759" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09990306-55b1-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 1259, "y": 404, "w": 514, "h": 464 }, "feature": "9CX8ojonWS3trSmsvKbSnD+r46yYHAYdlqOrLm2oXC4PoAUsi6SXMBSoJyvrrbMt0SwhIOQtOywuKUqmAKcmMCCtC7Y2p4YvUC3FKtEqe63ipTIRYKw9rWkpoqTEqFagwCMdKculaqRMsmcZ5KWYsMMwHyy5M0OkWiyZMGcl2qyEKHIsIy0dp1AwgqyCqXOvWjFzsQmw7imaqEufKaZho2orr6IqKJIuuC/+ruKs6CSuqvWqFCwLK/Oe1iRKpgitdy6YMy2miqY+MIIwWy82Lvksny9mL2yrcCn0rYQsfaRTrQevSyODqVysY6xrqRIpNbDJsRIoJiP9lKeoO6w5MA==", "targetType": "vehicle", "captureTime": "2024-03-12 05:42:31", "carInfo": "大众-朗逸-2015", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%89%8D%E6%B9%BE%E6%B8%AF%E8%B7%AF%E6%98%86%E4%BB%91%E5%B1%B1%E8%B7%AF%E4%B8%9C80%E7%B1%B3%E7%AE%80%E6%98%93%E5%8D%A1%E5%8F%A3-20240312054231-43\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09990306-55b1-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef7ac7-2181-0741-3343-043cd3e753ed", "licensePlate1": "鲁BT1325", "licensePlate2": "鲁BT1325", "lngLat": { "lng": 120.138802, "lat": 36.001868 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09990306-55b1-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1259%2C404%2C514%2C464", "LatestCaptureTime": "2024-03-12 05:42:31", "locationName": "前湾港路昆仑山路东80米简易卡口", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F09990306-55b1-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1532%2C784%2C112%2C37", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702011184102652", "locationId": "3702011764217158" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0add33e0-5589-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 447, "y": 377, "w": 506, "h": 617 }, "feature": "YLBVMZSpXqdGp7isyylAq9+hcbAbKp6ujiLIp/qsEa7zlfGehKHNrwEt3CnfrsQuXyyGpHosJDHzJ8ElSKq+sGSw7bB2Kf8sFK83nAetMjASq4Cteag5rXokjSz1DLStVq/9M4WoJaWiJPEpESN8qkseOS14rUSoDy6cLMCpeLAuLOkypLGQGy0wchIIqMmuXjFgqROmAyLUrDooxqDzo7GvKq2crG6iFy2/quWuoDPVKXyo8aYWr9Yc5yeLrIewgKZLsRekSaigLkQyZK3kK7Ov76xLLKMruSaUHdQwm6zvI34mkqZvruyqHqzZpg2pajF0oNkiyC33sGmpkSzhqQ==", "targetType": "vehicle", "captureTime": "2024-03-12 06:15:48", "carInfo": "长安商用-神骐T10-2019", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%89%8D%E6%B9%BE%E6%B8%AF%E8%B7%AF%E6%98%86%E4%BB%91%E5%B1%B1%E8%B7%AF%E4%B8%9C80%E7%B1%B3%E7%AE%80%E6%98%93%E5%8D%A1%E5%8F%A3-20240312061548-70\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0add33e0-5589-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef8294-0ff2-106b-8725-4389061d4cc8", "licensePlate1": "鲁ULN855", "licensePlate2": "鲁ULN855", "lngLat": { "lng": 120.138802, "lat": 36.001868 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0add33e0-5589-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=447%2C377%2C506%2C617", "LatestCaptureTime": "2024-03-12 06:15:48", "locationName": "前湾港路昆仑山路东80米简易卡口", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0add33e0-5589-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=627%2C890%2C119%2C37", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702013230086307", "locationId": "3702011764217158" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0c0c292a-5597-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 394, "y": 488, "w": 538, "h": 481 }, "feature": "syknpj8p7y+iJmQnw6zcL92ojCpxqWCYEi5yKX+wKSmgLmggR6KjMfujwR6QrmYvabCmLx2wVCl/rA6qH7A9MaGxqKaGoZOwnitOIM2ZIi6dsWcj9LRJKr2sgySsn2CgVasGnRspUKDCLdusT6EILGemqKzdo9ggoxnbJ08vVq+9KVqxTLSOJPIwiKNUGYIiiahvosWsUKS5ppQNDxBmrB8sgaZUmQswF6iSpMUh5qEppXIwlieJqDMhFqotrRMoD5xZMtmrSy5RKjYvm61gsDcxFC4ToTOkECy9Jaqp3CtJLrKrkaSRKjIvey6YsLuw7qXVrx4mqZhPr1Oynq5/qA==", "targetType": "vehicle", "captureTime": "2024-03-12 06:47:53", "carInfo": "比亚迪-E5-2018,2017,2016", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E9%A6%99%E6%A6%AD%E4%B8%BD%E6%99%AF%E5%85%A5%E5%8F%A3%E9%81%93%E9%97%B8-20240312064753-25\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0c0c292a-5597-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef8a19-cd38-83f2-3b9a-4cc67f2300d9", "licensePlate1": "鲁BD97109", "licensePlate2": "鲁BD97109", "lngLat": { "lng": 120.045276, "lat": 35.895471 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0c0c292a-5597-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=394%2C488%2C538%2C481", "LatestCaptureTime": "2024-03-12 06:47:53", "locationName": "香榭丽景入口道闸", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0c0c292a-5597-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=547%2C882%2C128%2C36", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 15, "plateColorTypeString2": "新能源绿", "deviceId": "3702011216575190", "locationId": "3702012792916528" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0a045a5c-557a-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 127, "y": 531, "w": 502, "h": 504 }, "feature": "6J+cqyYn1K4Srq4kOzNWJpIZu66vLN+nqqz/LT+s4SlspaquFbJcrgOmXKUMLEomaKtkr60xxCt2KiMj2C4TlHOkriKYsf4uYqv/L3kqr6eDsoCsHCxQsAwuh6SUrRgwMhTdpIaYsqZ/rm6rtytwI8qtF6g+pQAqQqEcNEUnpqrosJyuQ7TQLsut4S+Mo3ywSaAonDYRKK50KpowXifkot6pRKlNodUkMakVLSYqWy0urowocy7XMFImcis7FjOaGyFbsQ0exq56spksth45oD+tmiU5KAQgmqVvHLwrf6weKXSmySryrTYszS1DrqcnmrDNsZyfH6ucLZcwRqY4KQ==", "targetType": "vehicle", "captureTime": "2024-03-12 05:53:47", "carInfo": "北汽新能源-EC系列-2017", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E9%A6%99%E6%A6%AD%E4%B8%BD%E6%99%AF%E5%85%A5%E5%8F%A3%E9%81%93%E9%97%B8-20240312055347-48\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0a045a5c-557a-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef7d6b-51dc-d770-c97e-ce7af3085254", "licensePlate1": "鲁BD00256", "licensePlate2": "鲁BD00256", "lngLat": { "lng": 120.045276, "lat": 35.895471 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0a045a5c-557a-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=127%2C531%2C502%2C504", "LatestCaptureTime": "2024-03-12 05:53:47", "locationName": "香榭丽景入口道闸", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0a045a5c-557a-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=274%2C923%2C133%2C38", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 15, "plateColorTypeString2": "新能源绿", "deviceId": "3702012170797964", "locationId": "3702012792916528" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F01ccacd8-54f1-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 1641, "y": 429, "w": 407, "h": 678 }, "feature": "myTErf0lC6Gkp7ooticrIrMsOaR+qyovVDCbrHqrRKwrsVesAiQGK0ef4x3Zlx0rxikssB8ysCRsrOQvTqpOH7QpKapOrSccM7L2K2OkIiwIrK8bGy+WrEEmdSuDJgesPK53MKusi6UkLU0nRah0rlEwni6AK8Msa6zhLlYw+LFzKdM1WbD0LMeoEyzvK2ewVinyIACnrim1LiWxbSInqKImMrCBI6QniiITrZ2lCrEFsU6kwyM6pjUY6DFRIaEwb6Zmsvao9huBIxepSy/VqwMw+CyDKhYnUaUtLMCuyiwPLuaonLA7MXccWyswqOMsfSGwrGouXayumnisyy1+KQ==", "targetType": "vehicle", "captureTime": "2024-03-12 02:16:07", "carInfo": "陕汽通家-福家-2011", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E6%B5%B7%E9%9D%92%E9%95%87%E5%90%8E%E6%B2%B3%E8%A5%BF%E6%9D%91%E5%90%8E%E6%B2%B3%E8%A5%BF%E5%85%A5%E5%8F%A3%E4%BA%BA%E8%BD%A6%E6%8A%93%E6%8B%8D-20240312021607-03\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F01ccacd8-54f1-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef4a67-0475-ab65-4186-bc5aca973cea", "licensePlate1": "鲁U151E0", "licensePlate2": "鲁U151E0", "lngLat": { "lng": 119.54644, "lat": 35.708161 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F01ccacd8-54f1-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1641%2C429%2C407%2C678", "LatestCaptureTime": "2024-03-12 02:16:07", "locationName": "海青镇后河西村后河西入口人车抓拍", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F01ccacd8-54f1-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1841%2C967%2C128%2C44", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702010414706381", "locationId": "3702013655860249" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0642909c-55bf-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 480, "y": 512, "w": 516, "h": 491 }, "feature": "+alfK6Ur8CTVrJeiU6lPrMgxrqlrqtOpiaXhrN8koSl3seawEJw0MEKvIzBGsietUSpKrQkhVyUZrLClaSj3rCykUq6jnjawgbHiqzuuOy1JMb6keK1IEBGhyK44pDywlyXgLTwrmiCsKTYw/ZrcraSqybRMo+epoKTWLiyvtp1EKTYjga6yqK0sw6+sMXOqVivtJZWmTqQBLBmo4ocRIewrtyzor7khySKGrDqv07CdpsqkWitRrZ4k9SnyJ0atP6pULIUpe631KaIwYjIFp50u063iI+otiCxtsROtvi13JTyxMbEOrVqpWCJGKJGjqa73rHExCq/9quArd6Q7MA==", "targetType": "vehicle", "captureTime": "2024-03-12 04:16:00", "carInfo": "现代-悦动-2010,2008", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E9%A6%99%E6%A6%AD%E4%B8%BD%E6%99%AF%E5%85%A5%E5%8F%A3%E9%81%93%E9%97%B8-20240312041600-72\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0642909c-55bf-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65ef6680-07af-6ae9-c6c7-511de67734b2", "licensePlate1": "鲁B61NC7", "licensePlate2": "鲁B61NC7", "lngLat": { "lng": 120.045276, "lat": 35.895471 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0642909c-55bf-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=480%2C512%2C516%2C491", "LatestCaptureTime": "2024-03-12 04:16:00", "locationName": "香榭丽景入口道闸", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F0642909c-55bf-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=646%2C919%2C121%2C39", "groupCount": { "difference": 0, "originalCount": 30, "remainingCount": 30 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702012080456499", "locationId": "3702012792916528" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1205a2b2-54e2-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 1018, "y": 471, "w": 521, "h": 479 }, "feature": "fJgBMdoqvqL9Hy4xzKzXrL6l3KgOsLoWYyfMovGotKhPLZytNK6KFi+sbKKbKAmlN6kbIQou6izqIo4n3iuzrA8uEyg/rHKvUq75rWIvlCUfK0kkfi9tLX0ufCpTrh0ua60BKPyYG50wK40sFi7Wru0rerNyrHmvcLAjrswpUi+VK6stMq1vq2Exu68grPCsZSGpqN0jXTIYKsudGy9KrKWsr6uAtDKvHawWKyYwUDGqKmKoyaOwLQSgTJzrK0mtGqwiMIkpHjC5qCcq3yWipvYykS3Lpd2scKypn2gvjLCYKbesEaqTLi0ppLC6qBg0SqronDIqXa0iLR4mNyTIpg==", "targetType": "vehicle", "captureTime": "2024-03-11 17:20:54", "carInfo": "本田-雅阁-2016", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E9%A6%99%E6%A6%AD%E4%B8%BD%E6%99%AF%E5%85%A5%E5%8F%A3%E9%81%93%E9%97%B8-20240311172054-71\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1205a2b2-54e2-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eeccf6-7bfa-1c78-639c-49ff5fab47fb", "licensePlate1": "鲁B5S10U", "licensePlate2": "鲁B5S10U", "lngLat": { "lng": 120.045276, "lat": 35.895471 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1205a2b2-54e2-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1018%2C471%2C521%2C479", "LatestCaptureTime": "2024-03-11 17:20:54", "locationName": "香榭丽景入口道闸", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1205a2b2-54e2-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1231%2C873%2C119%2C38", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702012895895870", "locationId": "3702012792916528" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F120886b6-54e3-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 1134, "y": 1164, "w": 837, "h": 899 }, "feature": "ly3NJNqoQ6adrFus0yQRpuuojpyZsEAttKUvIdcsvCttqtmteymRLS+yEyxlqRgm7q4QKKsr+ajkpMysFioqLHisx7X3MGemmaiIKfckPZ2xn9UrlSpjrMcrASxvLy0tzq0gNBWwEqtwIDMlTKNqKVkyay+QKLAh4DB9sw+rGy0UosKqyqpDJJ+h5Cxar5UmCyxuoU2oeS1tnmsqFiG8KTOskCWlLIYog6aZKVojAS+nI3+si6yesD+jKKOHLdexgC+8JzUZgzBbLUOtATPVrLIwTizfKcsqPCWGrqgsEytaK64NnCpHLSmxCCvxramujjFNKgmpyazgog2YPCS+rg==", "targetType": "vehicle", "captureTime": "2024-03-11 17:21:04", "carInfo": "大众-捷达-2015国产", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%89%8D%E6%B9%BE%E6%B8%AF%E8%B7%AF%E6%98%86%E4%BB%91%E5%B1%B1%E8%B7%AF%E4%B8%9C80%E7%B1%B3%E7%AE%80%E6%98%93%E5%8D%A1%E5%8F%A3-20240311172104-90\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F120886b6-54e3-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eecd00-210f-ebe7-b083-adcdc5412c0a", "licensePlate1": "UT9818", "licensePlate2": "UT0010", "lngLat": { "lng": 120.138802, "lat": 36.001868 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F120886b6-54e3-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1134%2C1164%2C837%2C899", "LatestCaptureTime": "2024-03-11 17:21:04", "locationName": "前湾港路昆仑山路东80米简易卡口", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F120886b6-54e3-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1446%2C2029%2C215%2C33", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702010840825821", "locationId": "3702011764217158" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F14eb7b1c-54da-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 372, "y": 522, "w": 513, "h": 480 }, "feature": "aq7eIZCfASiZK32pyCynLv2rgSvPKDGY1S/xr8Sux54yrEup9iYEKlKvZRN6sScwYiW2sGsrTq0cLq8MUrAlJX6yEyvlrEQcFyl9LPCsSij0rW2iiLMOqRQrfyy3KagvQLGzJduv0SN3r2Qt0CeXpkIpDbAppeIneS8Is3ExJ6+wrZaoErQJJDMxQi/YpXIstKcCMBSoLqOSLBinZK6EIjoyiKuULo2k9x+8n7qtcqgMKgYtgDFPo4OkmyyKrnCIrzEyqymWHar/K5EtMaruodAsgi18oUawSSYlIVWrPSY5IY+wKC/UqViYNq7/Lcus+y+ArXqptCcaLTOkFSm3HA==", "targetType": "vehicle", "captureTime": "2024-03-11 18:38:09", "carInfo": "吉利-金刚三厢-2016", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E9%A6%99%E6%A6%AD%E4%B8%BD%E6%99%AF%E5%85%A5%E5%8F%A3%E9%81%93%E9%97%B8-20240311183809-77\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F14eb7b1c-54da-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eedf11-17e6-e71f-68cd-160f6e6835f7", "licensePlate1": "鲁AM9S79", "licensePlate2": "鲁AM9S79", "lngLat": { "lng": 120.045276, "lat": 35.895471 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F14eb7b1c-54da-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=372%2C522%2C513%2C480", "LatestCaptureTime": "2024-03-11 18:38:09", "locationName": "香榭丽景入口道闸", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F14eb7b1c-54da-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=522%2C910%2C125%2C40", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702012761828767", "locationId": "3702012792916528" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1208cdae-544f-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 1984, "y": 59, "w": 966, "h": 1026 }, "feature": "ZqxdKkipuaa5qroq1y3VKHedoCzzqN+wjy7bJbyqzyqjqK6tK6/qKhoqmyxyslSpnitHLn0oBK3Urs0vtizco1UpEaYRIEgpZSzpLlKsMaexrY+oA6Q8KpqqEa4tJZcwlCuGpumo8y/KpImsbCcZqB2rHyn5nxw2xDB/MO+sLS1OLQuqr6SppdMv7y4gsESteii/LmMpaSZDMBss6S8FrGEuuiS5nY+tuC1xLEMwfq88MJUq/akaKtynwKYmpIIpZai1IXQ1k7D0mN8suysdJ52okintq3exYq6yLa2xEqYpr4YuJanuJsAlG60trI+hHCI8KdGvsauwGiunq58AJA==", "targetType": "vehicle", "captureTime": "2024-03-11 17:21:06", "carInfo": "中通客车-风采-A款", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%85%AB%E9%87%8C%E5%BA%84%E7%A4%BE%E5%8C%BAC%E4%B8%9C%E9%97%A8%E5%87%BA%E5%8F%A3%E8%BD%A6%E8%BE%86%E6%8A%93%E6%8B%8D-20240311172106-25\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1208cdae-544f-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eecd02-4874-7d1d-197f-a7ce46af05b8", "licensePlate1": "鲁B00075F", "licensePlate2": "鲁B00075F", "lngLat": { "lng": 120.146052, "lat": 35.977335 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1208cdae-544f-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1984%2C59%2C966%2C1026", "LatestCaptureTime": "2024-03-11 17:21:06", "locationName": "八里庄社区C东门出口车辆抓拍", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1208cdae-544f-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=2405%2C1020%2C153%2C48", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 16, "plateColorTypeString2": "新能源黄绿", "deviceId": "3702012931479268", "locationId": "3702011483241759" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F18ec4802-5478-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 255, "y": 489, "w": 534, "h": 486 }, "feature": "dazsHSWkuzE8KsMwrzAorI+pPqRopM6oRi5+K+itnqwCJ0qyorCLJyMo+qR5H0yodSKorjGxhyiKrAEonK00pie0wClOm+yvCqwIopUpdCXmqvqlyDHNJDAkdSsOtJEcJKPNLWuyfqy8LE+pgSmtpJCnXCM+LZQpYx/iprwtJa3KMNArOyhhKqgiK7EcrVer8SmVqiIwVTLmrsew+6epJdMkq6z8qm4hXaxMsJ2nsy99LFSuiy9vLc6royxgq6OoMqXOJ9emXKFJrEsm0y11qhsp+THFIucqBTN8ngEvgp8DLNIwQ6rhLualYKjZLdYl1rJWqmOkvqE/KR4ajqw/Hg==", "targetType": "vehicle", "captureTime": "2024-03-11 20:22:14", "carInfo": "丰田-凯美瑞-2021", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E9%A6%99%E6%A6%AD%E4%B8%BD%E6%99%AF%E5%85%A5%E5%8F%A3%E9%81%93%E9%97%B8-20240311202214-11\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F18ec4802-5478-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eef776-3124-3bfc-feda-2a7fb8afef62", "licensePlate1": "鲁B13VQ0", "licensePlate2": "鲁B13VQ0", "lngLat": { "lng": 120.045276, "lat": 35.895471 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F18ec4802-5478-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=255%2C489%2C534%2C486", "LatestCaptureTime": "2024-03-11 20:22:14", "locationName": "香榭丽景入口道闸", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F18ec4802-5478-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=424%2C892%2C119%2C38", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702010217063445", "locationId": "3702012792916528" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F16ea90b6-557e-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 1737, "y": 430, "w": 596, "h": 552 }, "feature": "MaXJJfMug62XF6YqbA77sXgl+Kymrm+smS8+ohmlni6YKkGqT6g8J2OpzKXqIgcuyin0rpwtvy6OrUgoJSRDMU6yqxyPLdaiMa3XKEsqKq6LK1inz6yHpJ8qJKiLI4msYK34MGGwEZBCqbGnhDKZMI4pYy2WLXGuNrGgJcQvQqzUqgq1Ha59L5IsVK6JJoOiQ6xTFSykjjCtoKKseR4sFOSnIwUwpF6uFiBaruqi6Kz+sNGsJq6XIkwd+yltA+wsISqWsGaxbK5dJFamqq0mIRuurTOaJNAj6yOfqPqsBq2KsSUx/ikyJ7sqq6iKpVexXrFRq9MnqCkMrnqlMiscJQ==", "targetType": "vehicle", "captureTime": "2024-03-11 19:30:11", "carInfo": "阿尔法·罗密欧-Giulia-2019,2017", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E6%B5%B7%E9%9D%92%E9%95%87%E5%90%8E%E6%B2%B3%E8%A5%BF%E6%9D%91%E5%90%8E%E6%B2%B3%E8%A5%BF%E5%85%A5%E5%8F%A3%E4%BA%BA%E8%BD%A6%E6%8A%93%E6%8B%8D-20240311193011-63\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F16ea90b6-557e-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eeeb43-ead0-6995-8dad-84b38f13209f", "licensePlate1": "鲁UAL290", "licensePlate2": "鲁UAL290", "lngLat": { "lng": 119.54644, "lat": 35.708161 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F16ea90b6-557e-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1737%2C430%2C596%2C552", "LatestCaptureTime": "2024-03-11 19:30:11", "locationName": "海青镇后河西村后河西入口人车抓拍", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F16ea90b6-557e-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1886%2C876%2C130%2C46", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702010129533384", "locationId": "3702013655860249" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F169c0fce-555e-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 2129, "y": 1086, "w": 808, "h": 957 }, "feature": "aCL4q38uo62dq1ox3y6zqaGrP7H7LC+t66zhqZYuhCE+NCCuCK7PqYyoDyTosBQn4Cv9GhwsebA9LGCODy5YregjYC5Jo7ItPLE9Kxgl9K5AsZ2k/qVanD8wEys/pMAsHK2UIYsgJikhLWQvIi+IpnGhGqzFJ6UpUq5zsEaxiy2wr+WyZLMOMxUmsLLmJFCuPavYq/Muf6uRHGqpJ6inKN0sNKvApOgvIyN8pWUpmSYUL6GjBS+LLb0n4p2ELsMnMSbTKkGqS6l8rbwnpyV+rr0t1Ccjrd+kgK1CLyGsmCmfLWysaiy/KtKocCsdsK2rfSp/sKUpoCwJLt+tf6YwrA==", "targetType": "vehicle", "captureTime": "2024-03-11 19:21:45", "carInfo": "北汽新能源-EC系列-2019,2018", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E9%A6%99%E6%A6%AD%E4%B8%BD%E6%99%AF%E5%85%A5%E5%8F%A3%E9%81%93%E9%97%B8-20240311192145-01\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F169c0fce-555e-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eee949-2371-1d58-8e0a-d1d5e118d31a", "licensePlate1": "鲁BD37890", "licensePlate2": "鲁BD37890", "lngLat": { "lng": 120.045276, "lat": 35.895471 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F169c0fce-555e-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=2129%2C1086%2C808%2C957", "LatestCaptureTime": "2024-03-11 19:21:45", "locationName": "香榭丽景入口道闸", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F169c0fce-555e-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=2466%2C1917%2C222%2C64", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 15, "plateColorTypeString2": "新能源绿", "deviceId": "3702012585971763", "locationId": "3702012792916528" }, { "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1209a462-55db-11ec-88b0-0cc47a9c4b97.jpg", "detection": { "x": 1253, "y": 513, "w": 568, "h": 619 }, "feature": "FDF9L14kqS+bo5mgvqa4JhAoP6nXs8AvtytqoEWzTzByKqajSjCPncysEBgTr1UqmKpvKTIthy0xqbkq/C29MK2uzLSDoncwPi5IL+2rwq+ErBksdKtzqBSpdyzSqhqky6CSKtadlixkMBEsn6c7Luct1S1CLSEsoiztL0ij1C/dJhktrKWoK1kvEC2dnrKweS0yMYijNiw+q7UhnhlnLWQqtK0jHLCpFCQ8qp8mWzF/qFgqoSltrGMn3idDKicszyzKLigogSngMYEsWzEnqj6s2iojqTWhh6xjKNOhPyk4pZmteKQ9MBiyCqeFqtuxM61iKTiuIKzDGsCkVTDSKA==", "targetType": "vehicle", "captureTime": "2024-03-11 17:21:12", "carInfo": "大众-桑塔纳-2015,2014,2013", "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E6%B5%B7%E9%9D%92%E9%95%87%E5%90%8E%E6%B2%B3%E8%A5%BF%E6%9D%91%E5%90%8E%E6%B2%B3%E8%A5%BF%E5%85%A5%E5%8F%A3%E4%BA%BA%E8%BD%A6%E6%8A%93%E6%8B%8D-20240311172112-10\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1209a462-55db-11ec-88b0-0cc47a9c4b97.jpg", "infoId": "65eecd08-0cf6-e5fd-d73f-6ff79a9f68bd", "licensePlate1": "鲁UT2178", "licensePlate2": "鲁UT2178", "lngLat": { "lng": 119.54644, "lat": 35.708161 }, "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1209a462-55db-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1253%2C513%2C568%2C619", "LatestCaptureTime": "2024-03-11 17:21:12", "locationName": "海青镇后河西村后河西入口人车抓拍", "direction": "方向未知", "plateImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F1209a462-55db-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=1441%2C1040%2C142%2C46", "groupCount": { "difference": 0, "originalCount": 29, "remainingCount": 29 }, "plateColorTypeId2": 5, "plateColorTypeString2": "蓝", "deviceId": "3702010487470875", "locationId": "3702013655860249" }], "echo": { "timeRange": { "times": ["2024-02-12 00:00:00", "2024-03-12 09:20:07"], "periods": { "dates": null, "times": null } }, "locationIds": ["3702012792916528", "3702011764217158", "3702013019606035", "3702011483241759", "3702013655860249"], "locationGroupIds": [], "pageSize": 40, "pageNo": 1, "region_id": null, "timeType": "", "plateColorTypeId": -1, "licensePlate": "", "brandId": [], "modelId": [], "yearId": [], "vehicleTypeId": [], "vehicleFuncId": [], "objectTypeId": -1, "colorTypeId": -1, "noPlate": -1, "excludeLicensePlates": [{ "plateColorID": -1, "plateNumber": "" }, { "plateColorID": -1, "plateNumber": "" }], "passingCount": 1, "timeLimitation": 5, "continuousCapture": 10, "captureCount": -1, "groupFilters": [], "sort": { "field": "", "order": "" } }, "errorMessage": "", "message": "分组数据返回", "totalRecords": 18, "usedTime": 0.23 });
});

// 车辆同行分析
router.post("/v1/judgement/accomplices/vehicle/list", async (req, res) => {
  // await req.sleep(6)
  res.send({
    ...totalData,
    data: {
      ...totalData.data,
      cacheId: Math.random()
    },
    detailsData: [],
    initialData: []
  });
});
//车辆同行详情数据
router.post("/v1/judgement/accomplices/vehicle/detail", (req, res) => {
  const {
    timeSort
  } = req.body
  const { order } = timeSort
  res.send({
    ...totalData,
    data: order === "desc" ? totalData.detailsData2 : [...totalData.detailsData2].reverse(),
    // data: [],
    detailsData: [],
    initialData: [],
    totalRecords: 10
  })
})

// 多点碰撞车辆信息列表
router.post("/v1/judgement/collision/vehicle/list", async (req, res) => {
  await req.sleep(6)
  res.send({
    "cacheId": "b455137f-e3e5-414b-9bc1-d581d0007779",
    "data": [{
      "elementId": "686ee6c5-70e1-4a5b-8b4e-1fdfc8dd2f32",
      "licensePlate2": "鲁C812NF",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "广汽传祺-传祺M8-2019,2018",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C26f033b92051b0.jpg&xywh=1332%2C299%2C243%2C221",
      "conditionCounts": 3,
      "count": 18,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "4d20bdc2-d94e-40ef-8f8d-c80343ed11ad",
      "licensePlate2": "鲁CC031H",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "Jeep-大指挥官-2021,2018",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C26ef89e07ea848.jpg&xywh=1205%2C496%2C414%2C374",
      "conditionCounts": 3,
      "count": 18,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "53f30cac-bf49-46e5-9d87-e21019353609",
      "licensePlate2": "鲁CK528N",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "奥迪-Q5/Q5L-2022,2021,2020,2018,2017,2021新能源",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26efdb00f157ca.jpg&xywh=1309%2C347%2C265%2C235",
      "conditionCounts": 3,
      "count": 18,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "cff43126-4f22-4a81-a2ca-017c6d11b222",
      "licensePlate2": "鲁CAM366",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "大众-POLO-2013",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C26f0abd246d12b.jpg&xywh=1359%2C369%2C236%2C188",
      "conditionCounts": 3,
      "count": 18,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "164432ad-0414-4295-866a-010b2655bb69",
      "licensePlate2": "鲁CKC773",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "本田-CR-V-2010",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26ef54f4940571.jpg&xywh=1268%2C290%2C206%2C188",
      "conditionCounts": 3,
      "count": 18,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "ec14f3e2-2a42-4aa1-80db-c9acec9653dc",
      "licensePlate2": "鲁C5L87",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "日产-轩逸-2012,2009",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26f069329a5fa9.jpg&xywh=648%2C507%2C373%2C265",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "52d6b9c0-9c55-40dd-a6c9-497dfca973f3",
      "licensePlate2": "鲁CBF196",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "宝骏-560-2017,2016,2015",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C26f0e4f2b6b192.jpg&xywh=1104%2C654%2C504%2C492",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "8918ab77-27b7-47db-800c-300e3616b7e2",
      "licensePlate2": "鲁C679DD",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "大众-POLO劲取-2009,2008,2006",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C26f04332f836e4.jpg&xywh=351%2C714%2C538%2C467",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "3782af36-5f36-474d-8efb-f1a60af81369",
      "licensePlate2": "鲁EEF196",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "宝骏-560-2017,2016,2015",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C26ef99f9b8ee5c.jpg&xywh=1406%2C230%2C159%2C146",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "75bb7453-976e-45ba-aa22-79e72a899b3a",
      "licensePlate2": "鲁C5L287",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "日产-轩逸-2012,2009",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C26f0a8edf44a3a.jpg&xywh=465%2C699%2C465%2C451",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "3aafd7a1-b42a-404e-bb88-54fa231271e0",
      "licensePlate2": "鲁CQ992D",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "江铃-凯锐-2011,2010,2009,2008",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F83%2C26f0323186d52d.jpg&xywh=265%2C554%2C673%2C562",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "82b7621b-bf22-4c0a-919c-0e9200fc9e9c",
      "licensePlate2": "鲁C682D9",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "丰田-皇冠-2010",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C26f0740f24dad6.jpg&xywh=295%2C702%2C591%2C483",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "eaf57b1c-15c2-401e-b347-6ff170fe50f9",
      "licensePlate2": "鲁C398CH",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "宝马-2系旅行车-2016,2015",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C26eff806c19ccf.jpg&xywh=251%2C659%2C611%2C528",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "6a601b3b-c2d8-4a5b-aaac-e0499ac0b16f",
      "licensePlate2": "鲁CGR601",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "江淮-同悦-2012,2010,2008",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C26f0017464267c.jpg&xywh=993%2C802%2C570%2C388",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "fc725a0e-9668-4869-97d1-8e7c3bc45118",
      "licensePlate2": "鲁C278K6",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "标致-3008-2015,2014,2013",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C26efef3f21a0e8.jpg&xywh=312%2C665%2C583%2C509",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "3807f972-6b56-4120-bc43-95a8b1ddf027",
      "licensePlate2": "鲁CY9221",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "丰田-RAV4-2021,2020",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C26f070cc6dc3f9.jpg&xywh=1252%2C506%2C400%2C342",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    {
      "elementId": "8a082fd1-788d-4aa6-9656-3315a755399d",
      "licensePlate2": "鲁CQ192D",
      "plateColorTypeId2": 5,
      "plateColorTypeString2": "蓝",
      "carInfo": "MG/名爵-MG5-2021",
      "imageUrl": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F81%2C26f011348c9127.jpg&xywh=553%2C416%2C579%2C436",
      "conditionCounts": 3,
      "count": 15,
      "flags": [
        1,
        2,
        3
      ]
    },
    ],
    "errorMessage": "",
    "message": "",
    totalRecords: 10
  })
})

// 多点碰撞车辆轨迹
router.post("/v1/judgement/collision/vehicle/detail", async (req, res) => {
  await req.sleep(3)
  res.send({
    "data": [{
      "flag": 1,
      "data": [{
        "flags": [1, 2, 3],
        "bigImage": "http://192.168.11.211:9080/80,26f033b92051b0.jpg",
        "captureTime": "2023-11-21 14:56:14",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 1332,
          "y": 299,
          "w": 243,
          "h": 221
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145614-21&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C26f033b92051b0.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c548e-aa5f-bd96-138e-48180363dff0",
        "licensePlate1": "鲁C812NF",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C26f033b92051b0.jpg&xywh=1332%2C299%2C243%2C221",
        "targetType": "vehicle"
      },
      {
        "bigImage": "http://192.168.11.211:9081/78,26effd6f696746.jpg",
        "captureTime": "2023-11-21 14:56:09",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 764,
          "y": 644,
          "w": 799,
          "h": 546
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145609-79&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26effd6f696746.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c5489-50f3-c4a1-9a6e-509b34116f7a",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26effd6f696746.jpg&xywh=764%2C644%2C799%2C546",
        "targetType": "vehicle"
      },
      {
        "bigImage": "http://192.168.11.211:9081/84,26ee9626b5dcd9.jpg",
        "captureTime": "2023-11-21 14:53:52",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 1332,
          "y": 299,
          "w": 243,
          "h": 221
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145352-16&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C26ee9626b5dcd9.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c5400-aa5f-bd96-138e-4818b9b52be3",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C26ee9626b5dcd9.jpg&xywh=1332%2C299%2C243%2C221",
        "targetType": "vehicle"
      }
      ],
    }, {
      "flag": 3,
      "data": [{
        "flags": [1, 3],
        "bigImage": "http://192.168.11.211:9080/80,26f033b92051b0.jpg",
        "captureTime": "2023-11-21 14:56:14",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 1332,
          "y": 299,
          "w": 243,
          "h": 221
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145614-21&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C26f033b92051b0.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c548e-aa5f-bd96-138e-48180363dff0",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F80%2C26f033b92051b0.jpg&xywh=1332%2C299%2C243%2C221",
        "targetType": "vehicle"
      },
      {
        "bigImage": "http://192.168.11.211:9081/78,26effd6f696746.jpg",
        "captureTime": "2023-11-21 14:56:09",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 764,
          "y": 644,
          "w": 799,
          "h": 546
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145609-79&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26effd6f696746.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c5489-50f3-c4a1-9a6e-509b34116f7a",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26effd6f696746.jpg&xywh=764%2C644%2C799%2C546",
        "targetType": "vehicle"
      },
      {
        "bigImage": "http://192.168.11.211:9081/84,26ee9626b5dcd9.jpg",
        "captureTime": "2023-11-21 14:53:52",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 1332,
          "y": 299,
          "w": 243,
          "h": 221
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145352-16&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C26ee9626b5dcd9.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c5400-aa5f-bd96-138e-4818b9b52be3",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F84%2C26ee9626b5dcd9.jpg&xywh=1332%2C299%2C243%2C221",
        "targetType": "vehicle"
      },
      {
        "bigImage": "http://192.168.11.211:9081/78,26ee56095a486e.jpg",
        "captureTime": "2023-11-21 14:53:47",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 764,
          "y": 644,
          "w": 799,
          "h": 546
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145347-53&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26ee56095a486e.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c53fb-50f3-c4a1-9a6e-509b4d7503ad",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26ee56095a486e.jpg&xywh=764%2C644%2C799%2C546",
        "targetType": "vehicle"
      },
      {
        "bigImage": "http://192.168.11.211:9080/82,26ecd8003f5824.jpg",
        "captureTime": "2023-11-21 14:50:14",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 1332,
          "y": 299,
          "w": 243,
          "h": 221
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145014-26&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C26ecd8003f5824.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c5326-aa5f-bd96-138e-481884b332cb",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F82%2C26ecd8003f5824.jpg&xywh=1332%2C299%2C243%2C221",
        "targetType": "vehicle"
      },
      {
        "bigImage": "http://192.168.11.211:9080/79,26ec9749dcb74f.jpg",
        "captureTime": "2023-11-21 14:50:09",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 764,
          "y": 644,
          "w": 799,
          "h": 546
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145009-32&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C26ec9749dcb74f.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c5321-50f3-c4a1-9a6e-509b951ea439",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9080%2F79%2C26ec9749dcb74f.jpg&xywh=764%2C644%2C799%2C546",
        "targetType": "vehicle"
      }, {
        "bigImage": "http://192.168.11.211:9081/78,26ee56095a486e.jpg",
        "captureTime": "2023-11-21 14:53:47",
        "carInfo": "广汽传祺-传祺M8-2019,2018",
        "detection": {
          "x": 764,
          "y": 644,
          "w": 799,
          "h": 546
        },
        "downloadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=7%E6%A5%BC%E6%BE%B3%E6%9F%AF%E7%8E%9B%E6%91%84%E5%83%8F%E5%A4%B401-20231121145347-53&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26ee56095a486e.jpg",
        "feature": "",
        "windowFeature": "",
        "infoId": "655c53fb-50f3-c4a1-9a6e-509b4d7503ad",
        "licensePlate1": "",
        "licensePlate2": "鲁C812NF",
        "lngLat": {
          "lng": 120.163333,
          "lat": 35.950222
        },
        "locationId": "370211400047",
        "locationName": "7楼澳柯玛摄像头01",
        "direction": "未识别",
        "plateColorTypeId2": 5,
        "plateColorTypeString2": "蓝",
        "plateImage": "",
        "targetImage": "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.211%3A9081%2F78%2C26ee56095a486e.jpg&xywh=764%2C644%2C799%2C546",
        "targetType": "vehicle"
      }
      ],
    }],
    "elementId": "686ee6c5-70e1-4a5b-8b4e-1fdfc8dd2f32",
    "errorMessage": "",
    "message": "",
    "records": [{
      "accessory_prob": 0,
      "analysis_id": 0,
      "bolster_prob": 0,
      "brand_id": 45,
      "capture_time": 1700549774,
      "card_prob": 0,
      "coat_color_type_id_left": 0,
      "coat_color_type_id_left_prob": 0,
      "coat_color_type_id_right": 0,
      "coat_color_type_id_right_prob": 0,
      "color_id": 0,
      "color_id_left": 0,
      "color_id_left_prob": 0,
      "color_id_prob": 0,
      "color_id_right": 0,
      "color_id_right_prob": 0,
      "color_type_id": 0,
      "color_type_id_prob": 0,
      "date": "0001-01-01T00:00:00Z",
      "detection": [{
        "h": 221,
        "prob": 9527,
        "w": 243,
        "x": 1332,
        "y": 299
      }],
      "detection_center_point": null,
      "detection_prob": 0,
      "device_id": 0,
      "device_type": 0,
      "direction_id": 0,
      "feature": "",
      "file_id": 0,
      "frozen_id": 0,
      "frozen_id_prob": 0,
      "glasses_left_id": 0,
      "glasses_left_prob": 0,
      "glasses_right_id": 0,
      "glasses_right_prob": 0,
      "graffiti_prob": 0,
      "hat_left_id": 0,
      "hat_left_prob": 0,
      "hat_right_id": 0,
      "hat_right_prob": 0,
      "heavy_truck_cover_id": 0,
      "heavy_truck_cover_id_prob": 0,
      "heavy_truck_load_id": 0,
      "heavy_truck_load_prob": 0,
      "heavy_truck_prob": 0,
      "heavy_truck_refit_prob": 0,
      "image_url": "http://192.168.11.211:9080/80,26f033b92051b0.jpg",
      "info_id": "655c548e-aa5f-bd96-138e-48180363dff0",
      "insert_time": 0,
      "is_face": 0,
      "face_children_ids": null,
      "is_unlicensed": 0,
      "job_id": 0,
      "lane_id": 0,
      "last_captured": 0,
      "latitude": 0,
      "led_prob": 0,
      "license_plate1": "",
      "license_plate2": "鲁C812NF",
      "location_id": 370211400047,
      "longitude": 0,
      "mask_left_id": 0,
      "mask_left_prob": 0,
      "mask_right_id": 0,
      "mask_right_prob": 0,
      "model_id": 4663,
      "moving_direction": 0,
      "none_prob": 0,
      "num_certificates": 0,
      "num_certificates_prob": 0,
      "object_type": 0,
      "object_type_id": 0,
      "occupant_left_id": 0,
      "occupant_left_prob": 0,
      "occupant_right_id": 0,
      "occupant_right_prob": 0,
      "pendant_prob": 0,
      "perspective_id": 0,
      "perspective_id_prob": 0,
      "phone_left_id": 0,
      "phone_left_prob": 0,
      "phone_right_id": 0,
      "phone_right_prob": 0,
      "plate_color_id1": 0,
      "plate_color_id2": 0,
      "plate_color_type_id2": 5,
      "plate_detection2": null,
      "plate_type_id1": 0,
      "plate_type_id2": 0,
      "received_time": 0,
      "reflective_left_prob": 0,
      "reflective_prob": 0,
      "reflective_right_prob": 0,
      "region_id": 0,
      "roi_detections": null,
      "roof_rack_prob": 0,
      "seat_belt_left_id": 0,
      "seat_belt_left_prob": 0,
      "seat_belt_right_id": 0,
      "seat_belt_right_prob": 0,
      "sent_time": 0,
      "smoking_left_id": 0,
      "smoking_left_prob": 0,
      "smoking_right_id": 0,
      "smoking_right_prob": 0,
      "source_id": 0,
      "spare_tire_prob": 0,
      "speed": 0,
      "sticker_prob": 0,
      "sun_visor_left_id": 0,
      "sun_visor_left_prob": 0,
      "sun_visor_right_id": 0,
      "sun_visor_right_prob": 0,
      "sundries_prob": 0,
      "sunroof_prob": 0,
      "tanker_truck_prob": 0,
      "tissue_prob": 0,
      "toy_prob": 0,
      "uid": "655c548e-aa5f-bd96-138e-48180363dff0",
      "unlicensed_prob": 0,
      "user_id": 0,
      "vehicle_func_id": 0,
      "vehicle_func_id_prob": 0,
      "vehicle_type_id": 0,
      "vehicle_type_id_prob": 0,
      "window_feature": "",
      "year_id": 12262,
      "year_id_prob": 0,
      "province": "",
      "similarity": 0
    },
    {
      "accessory_prob": 0,
      "analysis_id": 0,
      "bolster_prob": 0,
      "brand_id": 45,
      "capture_time": 1700549769,
      "card_prob": 0,
      "coat_color_type_id_left": 0,
      "coat_color_type_id_left_prob": 0,
      "coat_color_type_id_right": 0,
      "coat_color_type_id_right_prob": 0,
      "color_id": 0,
      "color_id_left": 0,
      "color_id_left_prob": 0,
      "color_id_prob": 0,
      "color_id_right": 0,
      "color_id_right_prob": 0,
      "color_type_id": 0,
      "color_type_id_prob": 0,
      "date": "0001-01-01T00:00:00Z",
      "detection": [{
        "h": 546,
        "prob": 8878,
        "w": 799,
        "x": 764,
        "y": 644
      }],
      "detection_center_point": null,
      "detection_prob": 0,
      "device_id": 0,
      "device_type": 0,
      "direction_id": 0,
      "feature": "",
      "file_id": 0,
      "frozen_id": 0,
      "frozen_id_prob": 0,
      "glasses_left_id": 0,
      "glasses_left_prob": 0,
      "glasses_right_id": 0,
      "glasses_right_prob": 0,
      "graffiti_prob": 0,
      "hat_left_id": 0,
      "hat_left_prob": 0,
      "hat_right_id": 0,
      "hat_right_prob": 0,
      "heavy_truck_cover_id": 0,
      "heavy_truck_cover_id_prob": 0,
      "heavy_truck_load_id": 0,
      "heavy_truck_load_prob": 0,
      "heavy_truck_prob": 0,
      "heavy_truck_refit_prob": 0,
      "image_url": "http://192.168.11.211:9081/78,26effd6f696746.jpg",
      "info_id": "655c5489-50f3-c4a1-9a6e-509b34116f7a",
      "insert_time": 0,
      "is_face": 0,
      "face_children_ids": null,
      "is_unlicensed": 0,
      "job_id": 0,
      "lane_id": 0,
      "last_captured": 0,
      "latitude": 0,
      "led_prob": 0,
      "license_plate1": "",
      "license_plate2": "鲁C812NF",
      "location_id": 370211400047,
      "longitude": 0,
      "mask_left_id": 0,
      "mask_left_prob": 0,
      "mask_right_id": 0,
      "mask_right_prob": 0,
      "model_id": 4663,
      "moving_direction": 0,
      "none_prob": 0,
      "num_certificates": 0,
      "num_certificates_prob": 0,
      "object_type": 0,
      "object_type_id": 0,
      "occupant_left_id": 0,
      "occupant_left_prob": 0,
      "occupant_right_id": 0,
      "occupant_right_prob": 0,
      "pendant_prob": 0,
      "perspective_id": 0,
      "perspective_id_prob": 0,
      "phone_left_id": 0,
      "phone_left_prob": 0,
      "phone_right_id": 0,
      "phone_right_prob": 0,
      "plate_color_id1": 0,
      "plate_color_id2": 0,
      "plate_color_type_id2": 5,
      "plate_detection2": null,
      "plate_type_id1": 0,
      "plate_type_id2": 0,
      "received_time": 0,
      "reflective_left_prob": 0,
      "reflective_prob": 0,
      "reflective_right_prob": 0,
      "region_id": 0,
      "roi_detections": null,
      "roof_rack_prob": 0,
      "seat_belt_left_id": 0,
      "seat_belt_left_prob": 0,
      "seat_belt_right_id": 0,
      "seat_belt_right_prob": 0,
      "sent_time": 0,
      "smoking_left_id": 0,
      "smoking_left_prob": 0,
      "smoking_right_id": 0,
      "smoking_right_prob": 0,
      "source_id": 0,
      "spare_tire_prob": 0,
      "speed": 0,
      "sticker_prob": 0,
      "sun_visor_left_id": 0,
      "sun_visor_left_prob": 0,
      "sun_visor_right_id": 0,
      "sun_visor_right_prob": 0,
      "sundries_prob": 0,
      "sunroof_prob": 0,
      "tanker_truck_prob": 0,
      "tissue_prob": 0,
      "toy_prob": 0,
      "uid": "655c5489-50f3-c4a1-9a6e-509b34116f7a",
      "unlicensed_prob": 0,
      "user_id": 0,
      "vehicle_func_id": 0,
      "vehicle_func_id_prob": 0,
      "vehicle_type_id": 0,
      "vehicle_type_id_prob": 0,
      "window_feature": "",
      "year_id": 12262,
      "year_id_prob": 0,
      "province": "",
      "similarity": 0
    },
    {
      "accessory_prob": 0,
      "analysis_id": 0,
      "bolster_prob": 0,
      "brand_id": 45,
      "capture_time": 1700549632,
      "card_prob": 0,
      "coat_color_type_id_left": 0,
      "coat_color_type_id_left_prob": 0,
      "coat_color_type_id_right": 0,
      "coat_color_type_id_right_prob": 0,
      "color_id": 0,
      "color_id_left": 0,
      "color_id_left_prob": 0,
      "color_id_prob": 0,
      "color_id_right": 0,
      "color_id_right_prob": 0,
      "color_type_id": 0,
      "color_type_id_prob": 0,
      "date": "0001-01-01T00:00:00Z",
      "detection": [{
        "h": 221,
        "prob": 9527,
        "w": 243,
        "x": 1332,
        "y": 299
      }],
      "detection_center_point": null,
      "detection_prob": 0,
      "device_id": 0,
      "device_type": 0,
      "direction_id": 0,
      "feature": "",
      "file_id": 0,
      "frozen_id": 0,
      "frozen_id_prob": 0,
      "glasses_left_id": 0,
      "glasses_left_prob": 0,
      "glasses_right_id": 0,
      "glasses_right_prob": 0,
      "graffiti_prob": 0,
      "hat_left_id": 0,
      "hat_left_prob": 0,
      "hat_right_id": 0,
      "hat_right_prob": 0,
      "heavy_truck_cover_id": 0,
      "heavy_truck_cover_id_prob": 0,
      "heavy_truck_load_id": 0,
      "heavy_truck_load_prob": 0,
      "heavy_truck_prob": 0,
      "heavy_truck_refit_prob": 0,
      "image_url": "http://192.168.11.211:9081/84,26ee9626b5dcd9.jpg",
      "info_id": "655c5400-aa5f-bd96-138e-4818b9b52be3",
      "insert_time": 0,
      "is_face": 0,
      "face_children_ids": null,
      "is_unlicensed": 0,
      "job_id": 0,
      "lane_id": 0,
      "last_captured": 0,
      "latitude": 0,
      "led_prob": 0,
      "license_plate1": "",
      "license_plate2": "鲁C812NF",
      "location_id": 370211400047,
      "longitude": 0,
      "mask_left_id": 0,
      "mask_left_prob": 0,
      "mask_right_id": 0,
      "mask_right_prob": 0,
      "model_id": 4663,
      "moving_direction": 0,
      "none_prob": 0,
      "num_certificates": 0,
      "num_certificates_prob": 0,
      "object_type": 0,
      "object_type_id": 0,
      "occupant_left_id": 0,
      "occupant_left_prob": 0,
      "occupant_right_id": 0,
      "occupant_right_prob": 0,
      "pendant_prob": 0,
      "perspective_id": 0,
      "perspective_id_prob": 0,
      "phone_left_id": 0,
      "phone_left_prob": 0,
      "phone_right_id": 0,
      "phone_right_prob": 0,
      "plate_color_id1": 0,
      "plate_color_id2": 0,
      "plate_color_type_id2": 5,
      "plate_detection2": null,
      "plate_type_id1": 0,
      "plate_type_id2": 0,
      "received_time": 0,
      "reflective_left_prob": 0,
      "reflective_prob": 0,
      "reflective_right_prob": 0,
      "region_id": 0,
      "roi_detections": null,
      "roof_rack_prob": 0,
      "seat_belt_left_id": 0,
      "seat_belt_left_prob": 0,
      "seat_belt_right_id": 0,
      "seat_belt_right_prob": 0,
      "sent_time": 0,
      "smoking_left_id": 0,
      "smoking_left_prob": 0,
      "smoking_right_id": 0,
      "smoking_right_prob": 0,
      "source_id": 0,
      "spare_tire_prob": 0,
      "speed": 0,
      "sticker_prob": 0,
      "sun_visor_left_id": 0,
      "sun_visor_left_prob": 0,
      "sun_visor_right_id": 0,
      "sun_visor_right_prob": 0,
      "sundries_prob": 0,
      "sunroof_prob": 0,
      "tanker_truck_prob": 0,
      "tissue_prob": 0,
      "toy_prob": 0,
      "uid": "655c5400-aa5f-bd96-138e-4818b9b52be3",
      "unlicensed_prob": 0,
      "user_id": 0,
      "vehicle_func_id": 0,
      "vehicle_func_id_prob": 0,
      "vehicle_type_id": 0,
      "vehicle_type_id_prob": 0,
      "window_feature": "",
      "year_id": 12262,
      "year_id_prob": 0,
      "province": "",
      "similarity": 0
    },
    {
      "accessory_prob": 0,
      "analysis_id": 0,
      "bolster_prob": 0,
      "brand_id": 45,
      "capture_time": 1700549627,
      "card_prob": 0,
      "coat_color_type_id_left": 0,
      "coat_color_type_id_left_prob": 0,
      "coat_color_type_id_right": 0,
      "coat_color_type_id_right_prob": 0,
      "color_id": 0,
      "color_id_left": 0,
      "color_id_left_prob": 0,
      "color_id_prob": 0,
      "color_id_right": 0,
      "color_id_right_prob": 0,
      "color_type_id": 0,
      "color_type_id_prob": 0,
      "date": "0001-01-01T00:00:00Z",
      "detection": [{
        "h": 546,
        "prob": 8878,
        "w": 799,
        "x": 764,
        "y": 644
      }],
      "detection_center_point": null,
      "detection_prob": 0,
      "device_id": 0,
      "device_type": 0,
      "direction_id": 0,
      "feature": "",
      "file_id": 0,
      "frozen_id": 0,
      "frozen_id_prob": 0,
      "glasses_left_id": 0,
      "glasses_left_prob": 0,
      "glasses_right_id": 0,
      "glasses_right_prob": 0,
      "graffiti_prob": 0,
      "hat_left_id": 0,
      "hat_left_prob": 0,
      "hat_right_id": 0,
      "hat_right_prob": 0,
      "heavy_truck_cover_id": 0,
      "heavy_truck_cover_id_prob": 0,
      "heavy_truck_load_id": 0,
      "heavy_truck_load_prob": 0,
      "heavy_truck_prob": 0,
      "heavy_truck_refit_prob": 0,
      "image_url": "http://192.168.11.211:9081/78,26ee56095a486e.jpg",
      "info_id": "655c53fb-50f3-c4a1-9a6e-509b4d7503ad",
      "insert_time": 0,
      "is_face": 0,
      "face_children_ids": null,
      "is_unlicensed": 0,
      "job_id": 0,
      "lane_id": 0,
      "last_captured": 0,
      "latitude": 0,
      "led_prob": 0,
      "license_plate1": "",
      "license_plate2": "鲁C812NF",
      "location_id": 370211400047,
      "longitude": 0,
      "mask_left_id": 0,
      "mask_left_prob": 0,
      "mask_right_id": 0,
      "mask_right_prob": 0,
      "model_id": 4663,
      "moving_direction": 0,
      "none_prob": 0,
      "num_certificates": 0,
      "num_certificates_prob": 0,
      "object_type": 0,
      "object_type_id": 0,
      "occupant_left_id": 0,
      "occupant_left_prob": 0,
      "occupant_right_id": 0,
      "occupant_right_prob": 0,
      "pendant_prob": 0,
      "perspective_id": 0,
      "perspective_id_prob": 0,
      "phone_left_id": 0,
      "phone_left_prob": 0,
      "phone_right_id": 0,
      "phone_right_prob": 0,
      "plate_color_id1": 0,
      "plate_color_id2": 0,
      "plate_color_type_id2": 5,
      "plate_detection2": null,
      "plate_type_id1": 0,
      "plate_type_id2": 0,
      "received_time": 0,
      "reflective_left_prob": 0,
      "reflective_prob": 0,
      "reflective_right_prob": 0,
      "region_id": 0,
      "roi_detections": null,
      "roof_rack_prob": 0,
      "seat_belt_left_id": 0,
      "seat_belt_left_prob": 0,
      "seat_belt_right_id": 0,
      "seat_belt_right_prob": 0,
      "sent_time": 0,
      "smoking_left_id": 0,
      "smoking_left_prob": 0,
      "smoking_right_id": 0,
      "smoking_right_prob": 0,
      "source_id": 0,
      "spare_tire_prob": 0,
      "speed": 0,
      "sticker_prob": 0,
      "sun_visor_left_id": 0,
      "sun_visor_left_prob": 0,
      "sun_visor_right_id": 0,
      "sun_visor_right_prob": 0,
      "sundries_prob": 0,
      "sunroof_prob": 0,
      "tanker_truck_prob": 0,
      "tissue_prob": 0,
      "toy_prob": 0,
      "uid": "655c53fb-50f3-c4a1-9a6e-509b4d7503ad",
      "unlicensed_prob": 0,
      "user_id": 0,
      "vehicle_func_id": 0,
      "vehicle_func_id_prob": 0,
      "vehicle_type_id": 0,
      "vehicle_type_id_prob": 0,
      "window_feature": "",
      "year_id": 12262,
      "year_id_prob": 0,
      "province": "",
      "similarity": 0
    },
    {
      "accessory_prob": 0,
      "analysis_id": 0,
      "bolster_prob": 0,
      "brand_id": 45,
      "capture_time": 1700549414,
      "card_prob": 0,
      "coat_color_type_id_left": 0,
      "coat_color_type_id_left_prob": 0,
      "coat_color_type_id_right": 0,
      "coat_color_type_id_right_prob": 0,
      "color_id": 0,
      "color_id_left": 0,
      "color_id_left_prob": 0,
      "color_id_prob": 0,
      "color_id_right": 0,
      "color_id_right_prob": 0,
      "color_type_id": 0,
      "color_type_id_prob": 0,
      "date": "0001-01-01T00:00:00Z",
      "detection": [{
        "h": 221,
        "prob": 9527,
        "w": 243,
        "x": 1332,
        "y": 299
      }],
      "detection_center_point": null,
      "detection_prob": 0,
      "device_id": 0,
      "device_type": 0,
      "direction_id": 0,
      "feature": "",
      "file_id": 0,
      "frozen_id": 0,
      "frozen_id_prob": 0,
      "glasses_left_id": 0,
      "glasses_left_prob": 0,
      "glasses_right_id": 0,
      "glasses_right_prob": 0,
      "graffiti_prob": 0,
      "hat_left_id": 0,
      "hat_left_prob": 0,
      "hat_right_id": 0,
      "hat_right_prob": 0,
      "heavy_truck_cover_id": 0,
      "heavy_truck_cover_id_prob": 0,
      "heavy_truck_load_id": 0,
      "heavy_truck_load_prob": 0,
      "heavy_truck_prob": 0,
      "heavy_truck_refit_prob": 0,
      "image_url": "http://192.168.11.211:9080/82,26ecd8003f5824.jpg",
      "info_id": "655c5326-aa5f-bd96-138e-481884b332cb",
      "insert_time": 0,
      "is_face": 0,
      "face_children_ids": null,
      "is_unlicensed": 0,
      "job_id": 0,
      "lane_id": 0,
      "last_captured": 0,
      "latitude": 0,
      "led_prob": 0,
      "license_plate1": "",
      "license_plate2": "鲁C812NF",
      "location_id": 370211400047,
      "longitude": 0,
      "mask_left_id": 0,
      "mask_left_prob": 0,
      "mask_right_id": 0,
      "mask_right_prob": 0,
      "model_id": 4663,
      "moving_direction": 0,
      "none_prob": 0,
      "num_certificates": 0,
      "num_certificates_prob": 0,
      "object_type": 0,
      "object_type_id": 0,
      "occupant_left_id": 0,
      "occupant_left_prob": 0,
      "occupant_right_id": 0,
      "occupant_right_prob": 0,
      "pendant_prob": 0,
      "perspective_id": 0,
      "perspective_id_prob": 0,
      "phone_left_id": 0,
      "phone_left_prob": 0,
      "phone_right_id": 0,
      "phone_right_prob": 0,
      "plate_color_id1": 0,
      "plate_color_id2": 0,
      "plate_color_type_id2": 5,
      "plate_detection2": null,
      "plate_type_id1": 0,
      "plate_type_id2": 0,
      "received_time": 0,
      "reflective_left_prob": 0,
      "reflective_prob": 0,
      "reflective_right_prob": 0,
      "region_id": 0,
      "roi_detections": null,
      "roof_rack_prob": 0,
      "seat_belt_left_id": 0,
      "seat_belt_left_prob": 0,
      "seat_belt_right_id": 0,
      "seat_belt_right_prob": 0,
      "sent_time": 0,
      "smoking_left_id": 0,
      "smoking_left_prob": 0,
      "smoking_right_id": 0,
      "smoking_right_prob": 0,
      "source_id": 0,
      "spare_tire_prob": 0,
      "speed": 0,
      "sticker_prob": 0,
      "sun_visor_left_id": 0,
      "sun_visor_left_prob": 0,
      "sun_visor_right_id": 0,
      "sun_visor_right_prob": 0,
      "sundries_prob": 0,
      "sunroof_prob": 0,
      "tanker_truck_prob": 0,
      "tissue_prob": 0,
      "toy_prob": 0,
      "uid": "655c5326-aa5f-bd96-138e-481884b332cb",
      "unlicensed_prob": 0,
      "user_id": 0,
      "vehicle_func_id": 0,
      "vehicle_func_id_prob": 0,
      "vehicle_type_id": 0,
      "vehicle_type_id_prob": 0,
      "window_feature": "",
      "year_id": 12262,
      "year_id_prob": 0,
      "province": "",
      "similarity": 0
    },
    {
      "accessory_prob": 0,
      "analysis_id": 0,
      "bolster_prob": 0,
      "brand_id": 45,
      "capture_time": 1700549409,
      "card_prob": 0,
      "coat_color_type_id_left": 0,
      "coat_color_type_id_left_prob": 0,
      "coat_color_type_id_right": 0,
      "coat_color_type_id_right_prob": 0,
      "color_id": 0,
      "color_id_left": 0,
      "color_id_left_prob": 0,
      "color_id_prob": 0,
      "color_id_right": 0,
      "color_id_right_prob": 0,
      "color_type_id": 0,
      "color_type_id_prob": 0,
      "date": "0001-01-01T00:00:00Z",
      "detection": [{
        "h": 546,
        "prob": 8878,
        "w": 799,
        "x": 764,
        "y": 644
      }],
      "detection_center_point": null,
      "detection_prob": 0,
      "device_id": 0,
      "device_type": 0,
      "direction_id": 0,
      "feature": "",
      "file_id": 0,
      "frozen_id": 0,
      "frozen_id_prob": 0,
      "glasses_left_id": 0,
      "glasses_left_prob": 0,
      "glasses_right_id": 0,
      "glasses_right_prob": 0,
      "graffiti_prob": 0,
      "hat_left_id": 0,
      "hat_left_prob": 0,
      "hat_right_id": 0,
      "hat_right_prob": 0,
      "heavy_truck_cover_id": 0,
      "heavy_truck_cover_id_prob": 0,
      "heavy_truck_load_id": 0,
      "heavy_truck_load_prob": 0,
      "heavy_truck_prob": 0,
      "heavy_truck_refit_prob": 0,
      "image_url": "http://192.168.11.211:9080/79,26ec9749dcb74f.jpg",
      "info_id": "655c5321-50f3-c4a1-9a6e-509b951ea439",
      "insert_time": 0,
      "is_face": 0,
      "face_children_ids": null,
      "is_unlicensed": 0,
      "job_id": 0,
      "lane_id": 0,
      "last_captured": 0,
      "latitude": 0,
      "led_prob": 0,
      "license_plate1": "",
      "license_plate2": "鲁C812NF",
      "location_id": 370211400047,
      "longitude": 0,
      "mask_left_id": 0,
      "mask_left_prob": 0,
      "mask_right_id": 0,
      "mask_right_prob": 0,
      "model_id": 4663,
      "moving_direction": 0,
      "none_prob": 0,
      "num_certificates": 0,
      "num_certificates_prob": 0,
      "object_type": 0,
      "object_type_id": 0,
      "occupant_left_id": 0,
      "occupant_left_prob": 0,
      "occupant_right_id": 0,
      "occupant_right_prob": 0,
      "pendant_prob": 0,
      "perspective_id": 0,
      "perspective_id_prob": 0,
      "phone_left_id": 0,
      "phone_left_prob": 0,
      "phone_right_id": 0,
      "phone_right_prob": 0,
      "plate_color_id1": 0,
      "plate_color_id2": 0,
      "plate_color_type_id2": 5,
      "plate_detection2": null,
      "plate_type_id1": 0,
      "plate_type_id2": 0,
      "received_time": 0,
      "reflective_left_prob": 0,
      "reflective_prob": 0,
      "reflective_right_prob": 0,
      "region_id": 0,
      "roi_detections": null,
      "roof_rack_prob": 0,
      "seat_belt_left_id": 0,
      "seat_belt_left_prob": 0,
      "seat_belt_right_id": 0,
      "seat_belt_right_prob": 0,
      "sent_time": 0,
      "smoking_left_id": 0,
      "smoking_left_prob": 0,
      "smoking_right_id": 0,
      "smoking_right_prob": 0,
      "source_id": 0,
      "spare_tire_prob": 0,
      "speed": 0,
      "sticker_prob": 0,
      "sun_visor_left_id": 0,
      "sun_visor_left_prob": 0,
      "sun_visor_right_id": 0,
      "sun_visor_right_prob": 0,
      "sundries_prob": 0,
      "sunroof_prob": 0,
      "tanker_truck_prob": 0,
      "tissue_prob": 0,
      "toy_prob": 0,
      "uid": "655c5321-50f3-c4a1-9a6e-509b951ea439",
      "unlicensed_prob": 0,
      "user_id": 0,
      "vehicle_func_id": 0,
      "vehicle_func_id_prob": 0,
      "vehicle_type_id": 0,
      "vehicle_type_id_prob": 0,
      "window_feature": "",
      "year_id": 12262,
      "year_id_prob": 0,
      "province": "",
      "similarity": 0
    }
    ],
    totalRecords: 10
  })
})


// 多点碰撞人脸列表
router.post('/v1/judgement/collision/face/list', async (req, res) => {
  await req.sleep(6)
  res.send({
    "cacheId": "3b08f0a3-379f-4cc3-a8b3-ccf9ffb90240",
    "data": [
      {
        "elementId": "63796c5f-d36a-4b31-bcf2-159590381d09",
        "captureTime": "2023-11-24 23:08:49",
        "imageUrl": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "name": "儿童女性王肖肖",
        "age": 6,
        "ageIdType": "儿童",
        "idNumber": "410327198006137139",
        "gender": "女性",
        "labels": [
          "1-1",
        ],
        "count": 300,
        "flags": [
          1,
          2,
          3
        ],
        "personTags": [
          {
            "color": 1,
            "name": "徘徊人员"
          },
          {
            "color": 2,
            "name": "地道人员"
          },
          {
            "color": 3,
            "name": "徘徊人员"
          },
          {
            "color": 4,
            "name": "徘徊人员"
          }
        ]
      },
      {
        "elementId": "de4da485-045b-48a4-892a-337b5721d426",
        "captureTime": "2023-11-24 23:08:49",
        "imageUrl": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "name": "中青年男性王肖肖",
        "age": 0,
        "ageIdType": "中青年",
        "idNumber": "621022199002015237",
        "gender": "男性",
        "labels": [
          "1-2"
        ],
        "count": 300,
        "flags": [
          1,
          2,
          3
        ]
      },
      {
        "elementId": "de4da485-045b-48a4-892a-337b5721d42611",
        "captureTime": "2023-11-24 23:08:49",
        "imageUrl": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "name": "老年男性王肖肖",
        "age": 0,
        "ageIdType": "老年",
        "idNumber": "621022199002015237",
        "gender": "男性",
        "labels": [
          "1-3"
        ],
        "count": 300,
        "flags": [
          1,
          2,
          3
        ]
      }
    ],
    "errorMessage": "",
    "message": "",
    "totalRecords": 2
  })
})

// 多点碰撞人脸详情
router.post('/v1/judgement/collision/face/detail', async (req, res) => {
  await req.sleep(3)
  res.send({
    "data": [{
      "flag": 1,
      "data": [{
        "captureTime": "2023-11-24 23:08:49",
        "infoId": "6560bc81-6b03-c875-9733-bc6f7212e05b",
        "locationName": "3702011824548998",
        "locationId": "3702011824548998",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011824548998-20231124230849-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          1,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 23:08:43",
        "infoId": "6560bc7b-65a9-eba7-cfdd-6068a27e8f60",
        "locationName": "3702010208362881",
        "locationId": "3702010208362881",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702010208362881-20231124230843-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          1,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 21:42:42",
        "infoId": "6560a852-6b03-c875-9733-bc6f67d418bb",
        "locationName": "3702011824548998",
        "locationId": "3702011824548998",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011824548998-20231124214242-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          1,
          3
        ]
      }
      ]
    },
    {
      "flag": 2,
      "data": [{
        "captureTime": "2023-11-24 23:08:43",
        "infoId": "6560bc7b-65a9-eba7-cfdd-60689f2bc49d",
        "locationName": "3702011766652061",
        "locationId": "3702011766652061",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011766652061-20231124230843-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 23:08:37",
        "infoId": "6560bc75-8e3a-c131-2f68-2fda364b720a",
        "locationName": "3702011372445168",
        "locationId": "3702011372445168",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011372445168-20231124230837-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 23:08:37",
        "infoId": "6560bc75-8e3a-c131-2f68-2fda1fb03afd",
        "locationName": "3702011365942481",
        "locationId": "3702011365942481",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011365942481-20231124230837-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 21:42:37",
        "infoId": "6560a84d-65a9-eba7-cfdd-6068cbdf2f44",
        "locationName": "3702011766652061",
        "locationId": "3702011766652061",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011766652061-20231124214237-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 21:42:31",
        "infoId": "6560a847-8e3a-c131-2f68-2fda618de978",
        "locationName": "3702011372445168",
        "locationId": "3702011372445168",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011372445168-20231124214231-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 21:42:31",
        "infoId": "6560a847-8e3a-c131-2f68-2fda837dde45",
        "locationName": "3702011365942481",
        "locationId": "3702011365942481",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011365942481-20231124214231-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 20:16:27",
        "infoId": "6560941b-65a9-eba7-cfdd-6068c515146b",
        "locationName": "3702011766652061",
        "locationId": "3702011766652061",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011766652061-20231124201627-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 20:16:21",
        "infoId": "65609415-8e3a-c131-2f68-2fda0c577c0b",
        "locationName": "3702011365942481",
        "locationId": "3702011365942481",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011365942481-20231124201621-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 20:16:21",
        "infoId": "65609415-8e3a-c131-2f68-2fda1614a62d",
        "locationName": "3702011372445168",
        "locationId": "3702011372445168",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011372445168-20231124201621-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 18:50:21",
        "infoId": "65607fed-65a9-eba7-cfdd-6068e06f66ca",
        "locationName": "3702011766652061",
        "locationId": "3702011766652061",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011766652061-20231124185021-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 18:50:16",
        "infoId": "65607fe8-8e3a-c131-2f68-2fda13a48748",
        "locationName": "3702011372445168",
        "locationId": "3702011372445168",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011372445168-20231124185016-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 18:50:16",
        "infoId": "65607fe8-8e3a-c131-2f68-2fdac91adbcb",
        "locationName": "3702011365942481",
        "locationId": "3702011365942481",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011365942481-20231124185016-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 17:24:20",
        "infoId": "65606bc4-65a9-eba7-cfdd-60684a3531a5",
        "locationName": "3702011766652061",
        "locationId": "3702011766652061",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011766652061-20231124172420-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 17:24:14",
        "infoId": "65606bbe-8e3a-c131-2f68-2fda4cdc9edb",
        "locationName": "3702011372445168",
        "locationId": "3702011372445168",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011372445168-20231124172414-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      },
      {
        "captureTime": "2023-11-24 17:24:14",
        "infoId": "65606bbe-8e3a-c131-2f68-2fda096b9d34",
        "locationName": "3702011365942481",
        "locationId": "3702011365942481",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011365942481-20231124172414-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_5e25ebfe-962a-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          2,
          3
        ]
      }
      ]
    },
    {
      "flag": 3,
      "data": [{
        "captureTime": "2023-11-24 23:08:49",
        "infoId": "6560bc81-6b03-c875-9733-bc6f7212e05b",
        "locationName": "3702011824548998",
        "locationId": "3702011824548998",
        "lngLat": {
          "lng": 0,
          "lat": 0
        },
        "targetImage": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "bigImage": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "detection": {
          "x": 0,
          "y": 0,
          "w": 0,
          "h": 0
        },
        "downLoadUrl": "http://192.168.11.12:81/image-proxy?browser_download_pic=3702011824548998-20231124230849-00&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.50425701310018e%2B17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
        "objectType": "未知目标",
        "deviceType": "未知设备",
        "flags": [
          1,
          3
        ]
      }]
    }
    ],
    "elementId": "63796c5f-d36a-4b31-bcf2-159590381d09",
    "errorMessage": "",
    "message": "",
    "records": [{
      "capture_time": 1700699095,
      "detection": [{
        "h": 36,
        "prob": 7711,
        "w": 26,
        "x": 1431,
        "y": 598
      }],
      "flags": [
        "1",
        "3"
      ],
      "image_url": "http://192.168.7.206:8000/3.50425701310018e+17_e3e37692-961d-11ed-97be-ac1f6bfc9d56.jpg",
      "info_id": "655e9bd7-65a9-eba7-cfdd-606826734f9a",
      "location_id": 3702010208362881,
      "object_type": 0,
      "device_type": 0
    },
    {
      "capture_time": 1700616288,
      "detection": [],
      "flags": [
        "1",
        "3"
      ],
      "image_url": "http://192.168.7.206:8000/3.50425701310018e+17_edf930f4-961d-11ed-97be-ac1f6bfc9d56.jpg",
      "info_id": "655d5860-6b03-c875-9733-bc6f39df6652",
      "location_id": 3702011824548998,
      "object_type": 0,
      "device_type": 0
    }
    ],
    "totalRecords": 750
  })
})

// 获取标签
router.get('/api/pdm/v1/label-manage/label-list', (req, res) => {
  res.send({
    "data": [{
      "name": "标签1-1",
      "id": "1-1",
    }, {
      "name": "标签1-2",
      "id": "1-2",
    }, {
      "name": "标签1-3",
      "id": "1-3",
    }]
  })
})

module.exports = router;
