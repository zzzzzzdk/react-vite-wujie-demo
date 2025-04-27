const WebSocket = require("ws");

function wsLaunch(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    /* <=====================================系统提示=============================================> */
    if (req.url.includes("ws")) {
      const data = {
        content:
          "[车辆标签布控] 于 2024-02-23 13:53:04 在 [烟台岭南侧十字路口全局711519] 检测到目标 [浙CDF5265] 告警。",
        to_id: "3",
        type: "monitorResult",
        type_data: 2,
        feedback_message: null,
        link_url: "/fusion3/#/deploy-warning/119/",
        image_url:
          "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F84_e66b71b0-9570-11ed-98ea-3473790e9619.jpg\u0026xywh=870%2C302%2C339%2C271",
        bigImage:
          "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F84_e66b71b0-9570-11ed-98ea-3473790e9619.jpg",
        detection: {
          x: 870,
          y: 302,
          w: 339,
          h: 271,
        },
        create_time: "2024-02-23 13:53:16",
      };

      // setInterval(() => {
        // ws.send(JSON.stringify({ unread_count: 999 }));
        ws.send(JSON.stringify(data));
      // }, 3000);
    }
    /* <=====================================首页布控告警=============================================> */
    if (req.url.includes("homepage")) {
      // setInterval(() => {
        const data = {
          alarmCount: {
            personnelCount: 100000,
            vehicleCount: 5000,
            imageCount: 22,
          },
          alarmInfo: [
            {
              bigImage:
                "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F008038ee-55c4-11ec-88b0-0cc47a9c4b97.jpg",
              bkType: 1,
              captureTime: "2024-02-23 14:23:53",
              carInfo: "雷克萨斯-ES-2021,2018",
              detection: {
                h: 495,
                w: 549,
                x: 970,
                y: 505,
              },
              deviceId: "0",
              direction: "方向未知",
              downloadUrl:
                "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E7%8E%AF5%E5%8F%B7%E7%BA%BF%E4%B8%8E%E7%94%9F%E6%80%81%E5%9B%AD11%E5%8F%B7%E7%BA%BF%E4%BA%A4%E5%8F%89%E5%8F%A3%E4%B8%9C%E5%8C%97%E4%BE%A7-20240223142353-13&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F008038ee-55c4-11ec-88b0-0cc47a9c4b97.jpg",
              feature:
                "3iUapVKbiJxJrQStbC/kJCKoS7MTpFmsZSwRrdCtXqM9LBGv8adJMHusnSs0ryyrpzAmtM6vfqvcIH8t2ivmpACtfjLCLlCti66xJR+rNicBrFcb+6YRrwmsSh1LsR+n/I5pLTazxSr8niUlpizYKP4sNqRSLMIZk66XqMcq2q6SnK0VjRa8KI4q/q5VpLmzFBygKKQspTG4KdyobJtenMyoBCwYL9ouUiIMr5ssmSqAKVel/i4OL8SpcK0mqn4DjQ54JGmtmyrwpjUxiCi/KTWtUDPjLDmoOC/Qr3wuzKk0Kysw960drk2pOy+5INOrh7DXrHorz6pJqlisOrI7Jw==",
              infoId: "65d839f9-0301-d92f-fc9b-e0c73ff1b551",
              jobId: 218,
              licensePlate1: "鲁B17W0Y",
              licensePlate2: "鲁B17W0Y",
              lngLat: {
                lat: 36.066332,
                lng: 120.118982,
              },
              locationId: "3702013333637169",
              locationName: "环5号线与生态园11号线交叉口东北侧",
              measure: 1,
              monitorTarget: {
                brandId: [],
                carInfo: "",
                itemId: 239,
                labelInfos: [
                  {
                    color: 7,
                    id: 4,
                    name: "昼伏夜出",
                  },
                  {
                    color: 7,
                    id: 5,
                    name: "初次入城",
                  },
                  {
                    color: 7,
                    id: 6,
                    name: "双胞胎车",
                  },
                  {
                    color: 7,
                    id: 7,
                    name: "假牌车",
                  },
                  {
                    color: 7,
                    id: 8,
                    name: "套牌车",
                  },
                ],
                license: "",
                licensePlate: "鲁B17W0Y",
                modelId: [],
                monitorTargetId: 0,
                monitorTargetUrl: "",
                personName: "",
                plateColorTypeId: 5,
                yearId: [],
              },
              monitorType: "monitorVehicleTagType",
              plateColorTypeId1: 0,
              plateColorTypeId2: 5,
              plateColorTypeString2: "蓝",
              plateImage: "",
              similarity: 0,
              targetImage:
                "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F008038ee-55c4-11ec-88b0-0cc47a9c4b97.jpg&xywh=970%2C505%2C549%2C495",
              targetType: "vehicle",
              title: "测试布控002",
              windowFeature: "",
            },
            {
              bigImage:
                "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F84_e66b71b0-9570-11ed-98ea-3473790e9619.jpg",
              bkType: 1,
              captureTime: "2024-02-23 13:53:04",
              carInfo: "特斯拉TESLA-Model Y-2021",
              detection: {
                h: 271,
                w: 339,
                x: 870,
                y: 302,
              },
              deviceId: "0",
              direction: "方向未知",
              downloadUrl:
                "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E7%83%9F%E5%8F%B0%E5%B2%AD%E5%8D%97%E4%BE%A7%E5%8D%81%E5%AD%97%E8%B7%AF%E5%8F%A3%E5%85%A8%E5%B1%80711519-20240223135304-47&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F84_e66b71b0-9570-11ed-98ea-3473790e9619.jpg",
              feature:
                "WyhbrQeuybDtL3qkECMDLogxArJRsJOr/Kp7rdslV67GrIwryaFzrW2rkCacKg2pkTDbqQgrex1kMGYymidJLpQsp6kjKPAtB7CBsB6wxSmgroys2KMorXEwXynxsaYiBy8wnEMx5ipTH7wpGyRbrcgqY6jFqN0vGy4GJgQwVywGrRywDaxfKD0uKJ56oI6ksKgkrwKlBzTjKA4vRy2SrFWr4CcPrLsUni5BrlurKy9TMGOmrhjOK3shHi1VsYyuHC3lorqrTq34rZ6slDJqrfSsliLRKiSf/DGcqjGmCCMLJekvFC5YqkYniCq0KpMrLCMIFmumcK+jL0YsfS2UpQ==",
              infoId: "65d832c0-598e-b868-f283-72ccce299ca8",
              jobId: 119,
              licensePlate1: "浙CDF5265",
              licensePlate2: "浙CDF5265",
              lngLat: {
                lat: 36.09397,
                lng: 120.042711,
              },
              locationId: "3702011654069753",
              locationName: "烟台岭南侧十字路口全局711519",
              measure: 1,
              monitorTarget: {
                brandId: [],
                carInfo: "",
                itemId: 84,
                labelInfos: [
                  {
                    color: 5,
                    id: 182,
                    name: "车辆标签",
                  },
                ],
                license: "",
                licensePlate: "浙CDF5265",
                modelId: [],
                monitorTargetId: 0,
                monitorTargetUrl: "",
                personName: "",
                plateColorTypeId: 15,
                yearId: [],
              },
              monitorType: "monitorVehicleTagType",
              plateColorTypeId1: 0,
              plateColorTypeId2: 15,
              plateColorTypeString2: "新能源绿",
              plateImage: "",
              similarity: 0,
              targetImage:
                "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F84_e66b71b0-9570-11ed-98ea-3473790e9619.jpg&xywh=870%2C302%2C339%2C271",
              targetType: "vehicle",
              title: "车辆标签布控",
              windowFeature: "",
            },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d8587cee-9570-11ed-98ea-3473790e9619.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 13:21:35",
            //   carInfo: "哈弗-H3-2012",
            //   detection: {
            //     h: 584,
            //     w: 576,
            //     x: 404,
            //     y: 487,
            //   },
            //   deviceId: "0",
            //   direction: "方向未知",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%8C%97%E6%B3%A5%E5%85%AC%E7%A7%9F%E6%88%BFC%E5%8D%97%E9%97%A8%E5%85%A5%E5%8F%A3%E8%BD%A6%E8%BE%86%E6%8A%93%E6%8B%8D-20240223132135-71&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d8587cee-9570-11ed-98ea-3473790e9619.jpg",
            //   feature:
            //     "uLCjLxKwkSi3LK4wpy0ULncwbSu1qwSie66Op8Ssa7ESLSuviq+rK5mova/jraEssyi+J3awISgOMAIk46D6K2YtBKx0nrqpIbI3HzmjVjB3pcCmO7AvLvCtdZpTKmwuAancLckib6vsLxksWaRsJT0xXSW6rE4svS3rMOEbjCshM/WrQqdDqMAvoKFIoqusJB7fIIyonK/4rPorNK5pJNck2pebtAKygCqqrKQu3bBNpS6wga2/Ib4gUiiVKBAwCyburKMtSzOeMdGs/aplnbcsvy1PLT2iFSFJrychkaZzHRUgbasjMPmqrSWELTIiKyyPJnKqpxy9oS6r7yc0qA==",
            //   infoId: "65d82b5f-526a-582c-c72a-f87c5894e52f",
            //   jobId: 218,
            //   licensePlate1: "无牌",
            //   licensePlate2: "浙CE017C",
            //   lngLat: {
            //     lat: 36.017565,
            //     lng: 120.128699,
            //   },
            //   locationId: "3702013200725159",
            //   locationName: "北泥公租房C南门入口车辆抓拍",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 239,
            //     labelInfos: [
            //       {
            //         color: 7,
            //         id: 4,
            //         name: "昼伏夜出",
            //       },
            //       {
            //         color: 7,
            //         id: 5,
            //         name: "初次入城",
            //       },
            //       {
            //         color: 7,
            //         id: 6,
            //         name: "双胞胎车",
            //       },
            //       {
            //         color: 7,
            //         id: 7,
            //         name: "假牌车",
            //       },
            //       {
            //         color: 7,
            //         id: 8,
            //         name: "套牌车",
            //       },
            //     ],
            //     license: "",
            //     licensePlate: "浙CE017C",
            //     modelId: [],
            //     monitorTargetId: 0,
            //     monitorTargetUrl: "",
            //     personName: "",
            //     plateColorTypeId: 5,
            //     yearId: [],
            //   },
            //   monitorType: "monitorVehicleTagType",
            //   plateColorTypeId1: 0,
            //   plateColorTypeId2: 5,
            //   plateColorTypeString2: "蓝",
            //   plateImage: "",
            //   similarity: 0,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d8587cee-9570-11ed-98ea-3473790e9619.jpg&xywh=404%2C487%2C576%2C584",
            //   targetType: "vehicle",
            //   title: "测试布控002",
            //   windowFeature: "",
            // },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d8587cee-9570-11ed-98ea-3473790e9619.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 13:21:33",
            //   carInfo: "哈弗-H3-2012",
            //   detection: {
            //     h: 584,
            //     w: 576,
            //     x: 404,
            //     y: 487,
            //   },
            //   deviceId: "0",
            //   direction: "方向未知",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=370211008837-20240223132133-21&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d8587cee-9570-11ed-98ea-3473790e9619.jpg",
            //   feature:
            //     "uLCjLxKwkSi3LK4wpy0ULncwbSu1qwSie66Op8Ssa7ESLSuviq+rK5mova/jraEssyi+J3awISgOMAIk46D6K2YtBKx0nrqpIbI3HzmjVjB3pcCmO7AvLvCtdZpTKmwuAancLckib6vsLxksWaRsJT0xXSW6rE4svS3rMOEbjCshM/WrQqdDqMAvoKFIoqusJB7fIIyonK/4rPorNK5pJNck2pebtAKygCqqrKQu3bBNpS6wga2/Ib4gUiiVKBAwCyburKMtSzOeMdGs/aplnbcsvy1PLT2iFSFJrychkaZzHRUgbasjMPmqrSWELTIiKyyPJnKqpxy9oS6r7yc0qA==",
            //   infoId: "65d82b5d-526a-582c-c72a-f87c525f9851",
            //   jobId: 218,
            //   licensePlate1: "浙CE017C",
            //   licensePlate2: "浙CE017C",
            //   lngLat: {
            //     lat: 0,
            //     lng: 0,
            //   },
            //   locationId: "370211008837",
            //   locationName: "370211008837",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 239,
            //     labelInfos: [
            //       {
            //         color: 7,
            //         id: 4,
            //         name: "昼伏夜出",
            //       },
            //       {
            //         color: 7,
            //         id: 5,
            //         name: "初次入城",
            //       },
            //       {
            //         color: 7,
            //         id: 6,
            //         name: "双胞胎车",
            //       },
            //       {
            //         color: 7,
            //         id: 7,
            //         name: "假牌车",
            //       },
            //       {
            //         color: 7,
            //         id: 8,
            //         name: "套牌车",
            //       },
            //     ],
            //     license: "",
            //     licensePlate: "浙CE017C",
            //     modelId: [],
            //     monitorTargetId: 0,
            //     monitorTargetUrl: "",
            //     personName: "",
            //     plateColorTypeId: 5,
            //     yearId: [],
            //   },
            //   monitorType: "monitorVehicleTagType",
            //   plateColorTypeId1: 0,
            //   plateColorTypeId2: 5,
            //   plateColorTypeString2: "蓝",
            //   plateImage: "",
            //   similarity: 0,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d8587cee-9570-11ed-98ea-3473790e9619.jpg&xywh=404%2C487%2C576%2C584",
            //   targetType: "vehicle",
            //   title: "测试布控002",
            //   windowFeature: "",
            // },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d850a0e6-9570-11ed-98ea-3473790e9619.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 13:21:22",
            //   carInfo: "哈弗-H3-2012",
            //   detection: {
            //     h: 591,
            //     w: 588,
            //     x: 400,
            //     y: 487,
            //   },
            //   deviceId: "0",
            //   direction: "方向未知",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E5%A2%A8%E9%A6%99%E8%B7%AF%E5%A2%A8%E9%A6%99%E4%B8%9C%E9%83%A1%E5%B0%8F%E5%8C%BA%E9%97%A8%E5%8F%A3%E7%AE%80%E6%98%93%E5%8D%A1%E5%8F%A3-20240223132122-23&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d850a0e6-9570-11ed-98ea-3473790e9619.jpg",
            //   feature:
            //     "NbGUMSCt46z3LOotTCfOIpoyVhmaqzkie6bOLFiqgrL0pXSucrCvommgG603rDIY2aelLdSwEh4sKImsWa0OpXQuAaGanAyo9a9NohytUi0fLtyj+rDNIN+sNigjKXsx2auWMWEoUiFWJVIkwaTbKzEwbaUjrc0sFCxBpXyu4SqtMQ4gDarDKqUwASciJGiub66mqCyw8anPrRspbbDFLGekyCwntWGwIqhnqX4r+K44IYij36NXsbQmMCULKHKlWKryJYcwbjJJNKKozapzKeMsxSxoJpumVqQjKqIoGSVSKVSibq13qEypNCDFMBGdG6UwKAisOylfrH6sZi0jLQ==",
            //   infoId: "65d82b52-c177-b78e-5451-7e3b72174d95",
            //   jobId: 218,
            //   licensePlate1: "无牌",
            //   licensePlate2: "浙CE017C",
            //   lngLat: {
            //     lat: 35.903043,
            //     lng: 120.049343,
            //   },
            //   locationId: "3702011977708669",
            //   locationName: "墨香路墨香东郡小区门口简易卡口",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 239,
            //     labelInfos: [
            //       {
            //         color: 7,
            //         id: 4,
            //         name: "昼伏夜出",
            //       },
            //       {
            //         color: 7,
            //         id: 5,
            //         name: "初次入城",
            //       },
            //       {
            //         color: 7,
            //         id: 6,
            //         name: "双胞胎车",
            //       },
            //       {
            //         color: 7,
            //         id: 7,
            //         name: "假牌车",
            //       },
            //       {
            //         color: 7,
            //         id: 8,
            //         name: "套牌车",
            //       },
            //     ],
            //     license: "",
            //     licensePlate: "浙CE017C",
            //     modelId: [],
            //     monitorTargetId: 0,
            //     monitorTargetUrl: "",
            //     personName: "",
            //     plateColorTypeId: 5,
            //     yearId: [],
            //   },
            //   monitorType: "monitorVehicleTagType",
            //   plateColorTypeId1: 0,
            //   plateColorTypeId2: 5,
            //   plateColorTypeString2: "蓝",
            //   plateImage: "",
            //   similarity: 0,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F41_d850a0e6-9570-11ed-98ea-3473790e9619.jpg&xywh=400%2C487%2C588%2C591",
            //   targetType: "vehicle",
            //   title: "测试布控002",
            //   windowFeature: "",
            // },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c88c85c-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 11:21:48",
            //   carInfo: "日产-天籁-2012",
            //   detection: {
            //     h: 311,
            //     w: 351,
            //     x: 505,
            //     y: 627,
            //   },
            //   deviceId: "0",
            //   direction: "方向未知",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E7%83%9F%E5%8F%B0%E4%B8%9C%E5%9B%9B%E8%B7%AF%E4%B8%8E%E5%8F%B0%E5%85%B4%E4%B8%80%E8%B7%AF%E5%85%A8%E5%B1%80711647-20240223112148-77&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c88c85c-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   feature:
            //     "l6rtqIceUS5wrBkzMSj8KIkwuqfDHNskN7HOLpYnFqjSKxKguiGAsaQnOiIrLD6z0CwhLr+kt66NLM4ogq3vsI6YBaWoqZKrYRzyLqUrtSvANAKtzqSKsp+gTi+ULbogDS0mrgoysCWcrSYoyZ8RLlSb8q0Skm0ruSu/MAmm/6jFr7Gih6l+JBsh86/bLYcqnxJKLKguZqLqpYSrDq0IKKQkHiw+Hx8pGSrJql+tCS0VMUywXC8Yr4EqjikHpUmvA64JI3weCaaXqu0wga9TrjUsqB9zqzazoK/CLTGpxC5oLSMuX6nUJPIvNa1HpjGsxy5Lp3wqkpjnJusel6ogMQ==",
            //   infoId: "65d80f4c-88d7-aef9-fd93-8ab8fd38da2f",
            //   jobId: 119,
            //   licensePlate1: "无牌",
            //   licensePlate2: "闽G67866",
            //   lngLat: {
            //     lat: 35.866271,
            //     lng: 120.004397,
            //   },
            //   locationId: "3702013785397145",
            //   locationName: "烟台东四路与台兴一路全局711647",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 84,
            //     labelInfos: [
            //       {
            //         color: 5,
            //         id: 182,
            //         name: "车辆标签",
            //       },
            //     ],
            //     license: "",
            //     licensePlate: "闽G67866",
            //     modelId: [],
            //     monitorTargetId: 0,
            //     monitorTargetUrl: "",
            //     personName: "",
            //     plateColorTypeId: 5,
            //     yearId: [],
            //   },
            //   monitorType: "monitorVehicleTagType",
            //   plateColorTypeId1: 0,
            //   plateColorTypeId2: 5,
            //   plateColorTypeString2: "蓝",
            //   plateImage: "",
            //   similarity: 0,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c88c85c-9620-11ed-97be-ac1f6bfc9d56.jpg&xywh=505%2C627%2C351%2C311",
            //   targetType: "vehicle",
            //   title: "车辆标签布控",
            //   windowFeature: "",
            // },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c88c85c-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 11:21:42",
            //   carInfo: "日产-天籁-2012",
            //   detection: {
            //     h: 311,
            //     w: 351,
            //     x: 505,
            //     y: 627,
            //   },
            //   deviceId: "0",
            //   direction: "方向未知",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E7%8F%A0%E6%B5%B7%E8%A1%97%E9%81%93%E5%8A%9E%E4%BA%8B%E5%A4%84%E9%80%AF%E5%AE%B6%E5%BA%84%E5%8C%97%E8%B7%AF%E5%8F%A3%E4%B8%9C%E5%8D%97%E8%A7%92%E6%9C%9D%E5%8D%97%E6%B7%B7%E5%90%88%E6%8A%93%E6%8B%8D%E6%9C%BA-20240223112142-10&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c88c85c-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   feature:
            //     "l6rtqIceUS5wrBkzMSj8KIkwuqfDHNskN7HOLpYnFqjSKxKguiGAsaQnOiIrLD6z0CwhLr+kt66NLM4ogq3vsI6YBaWoqZKrYRzyLqUrtSvANAKtzqSKsp+gTi+ULbogDS0mrgoysCWcrSYoyZ8RLlSb8q0Skm0ruSu/MAmm/6jFr7Gih6l+JBsh86/bLYcqnxJKLKguZqLqpYSrDq0IKKQkHiw+Hx8pGSrJql+tCS0VMUywXC8Yr4EqjikHpUmvA64JI3weCaaXqu0wga9TrjUsqB9zqzazoK/CLTGpxC5oLSMuX6nUJPIvNa1HpjGsxy5Lp3wqkpjnJusel6ogMQ==",
            //   infoId: "65d80f46-88d7-aef9-fd93-8ab87547a583",
            //   jobId: 119,
            //   licensePlate1: "闽G67866",
            //   licensePlate2: "闽G67866",
            //   lngLat: {
            //     lat: 35.848898,
            //     lng: 119.948318,
            //   },
            //   locationId: "3702011091436822",
            //   locationName: "珠海街道办事处逯家庄北路口东南角朝南混合抓拍机",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 84,
            //     labelInfos: [
            //       {
            //         color: 5,
            //         id: 182,
            //         name: "车辆标签",
            //       },
            //     ],
            //     license: "",
            //     licensePlate: "闽G67866",
            //     modelId: [],
            //     monitorTargetId: 0,
            //     monitorTargetUrl: "",
            //     personName: "",
            //     plateColorTypeId: 5,
            //     yearId: [],
            //   },
            //   monitorType: "monitorVehicleTagType",
            //   plateColorTypeId1: 0,
            //   plateColorTypeId2: 5,
            //   plateColorTypeString2: "蓝",
            //   plateImage: "",
            //   similarity: 0,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c88c85c-9620-11ed-97be-ac1f6bfc9d56.jpg&xywh=505%2C627%2C351%2C311",
            //   targetType: "vehicle",
            //   title: "车辆标签布控",
            //   windowFeature: "",
            // },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c76cbb6-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 11:21:25",
            //   carInfo: "本田-思域-2014",
            //   detection: {
            //     h: 316,
            //     w: 327,
            //     x: 537,
            //     y: 570,
            //   },
            //   deviceId: "0",
            //   direction: "方向未知",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=370211000438-20240223112125-98&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c76cbb6-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   feature:
            //     "ZzEoq0McjSylJsKrRaeasv2pLTEcsEohIKk9JIQuFhgmKpup9yogrHiimqc9LvksOajmHfWuPSo+rFSuG6gCrgAwlai1rI4sxp7hqY+kgKxDL9oiG6lgLPgreSxOq8ajP66EIe4ymB7hsmWp4y/HJrUpEyazLCavBilaMtGpECsLr+yysyeeq0ojZK/Jne8s5iMfMAKp+Sz/Khstbq6KrjGmDJ94JMStVa3dKi0sTiWAKSknS65gp3CpADShrU6k4aUWK1CgNCk1LbKudKgopYYtaDJxsgcc/hRbMNsi7KyILJAsyaf+qf2sprBfLAE0UCxSrteujCwlL7sVy6k0KQ==",
            //   infoId: "65d80f35-e100-c56f-1624-34715f1b2f3a",
            //   jobId: 218,
            //   licensePlate1: "闽GBP356",
            //   licensePlate2: "闽GBP356",
            //   lngLat: {
            //     lat: 0,
            //     lng: 0,
            //   },
            //   locationId: "370211000438",
            //   locationName: "370211000438",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 239,
            //     labelInfos: [
            //       {
            //         color: 7,
            //         id: 4,
            //         name: "昼伏夜出",
            //       },
            //       {
            //         color: 7,
            //         id: 5,
            //         name: "初次入城",
            //       },
            //       {
            //         color: 7,
            //         id: 6,
            //         name: "双胞胎车",
            //       },
            //       {
            //         color: 7,
            //         id: 7,
            //         name: "假牌车",
            //       },
            //       {
            //         color: 7,
            //         id: 8,
            //         name: "套牌车",
            //       },
            //     ],
            //     license: "",
            //     licensePlate: "闽GBP356",
            //     modelId: [],
            //     monitorTargetId: 0,
            //     monitorTargetUrl: "",
            //     personName: "",
            //     plateColorTypeId: 5,
            //     yearId: [],
            //   },
            //   monitorType: "monitorVehicleTagType",
            //   plateColorTypeId1: 0,
            //   plateColorTypeId2: 5,
            //   plateColorTypeString2: "蓝",
            //   plateImage: "",
            //   similarity: 0,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c76cbb6-9620-11ed-97be-ac1f6bfc9d56.jpg&xywh=537%2C570%2C327%2C316",
            //   targetType: "vehicle",
            //   title: "测试布控002",
            //   windowFeature: "",
            // },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c76cbb6-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 11:21:18",
            //   carInfo: "本田-思域-2014",
            //   detection: {
            //     h: 316,
            //     w: 327,
            //     x: 537,
            //     y: 570,
            //   },
            //   deviceId: "0",
            //   direction: "方向未知",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E8%83%B6%E5%B7%9E%E6%B9%BE%E4%B8%9C%E8%B7%AF%E4%B8%8E%E5%A4%A7%E6%B9%BE%E6%B8%AF%E8%B7%AF%E8%B7%AF%E5%8F%A3-20240223112118-24&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c76cbb6-9620-11ed-97be-ac1f6bfc9d56.jpg",
            //   feature:
            //     "ZzEoq0McjSylJsKrRaeasv2pLTEcsEohIKk9JIQuFhgmKpup9yogrHiimqc9LvksOajmHfWuPSo+rFSuG6gCrgAwlai1rI4sxp7hqY+kgKxDL9oiG6lgLPgreSxOq8ajP66EIe4ymB7hsmWp4y/HJrUpEyazLCavBilaMtGpECsLr+yysyeeq0ojZK/Jne8s5iMfMAKp+Sz/Khstbq6KrjGmDJ94JMStVa3dKi0sTiWAKSknS65gp3CpADShrU6k4aUWK1CgNCk1LbKudKgopYYtaDJxsgcc/hRbMNsi7KyILJAsyaf+qf2sprBfLAE0UCxSrteujCwlL7sVy6k0KQ==",
            //   infoId: "65d80f2e-e100-c56f-1624-3471b6cd5e68",
            //   jobId: 218,
            //   licensePlate1: "无牌",
            //   licensePlate2: "闽GBP356",
            //   lngLat: {
            //     lat: 35.938808,
            //     lng: 120.141694,
            //   },
            //   locationId: "3702013470470502",
            //   locationName: "胶州湾东路与大湾港路路口",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 239,
            //     labelInfos: [
            //       {
            //         color: 7,
            //         id: 4,
            //         name: "昼伏夜出",
            //       },
            //       {
            //         color: 7,
            //         id: 5,
            //         name: "初次入城",
            //       },
            //       {
            //         color: 7,
            //         id: 6,
            //         name: "双胞胎车",
            //       },
            //       {
            //         color: 7,
            //         id: 7,
            //         name: "假牌车",
            //       },
            //       {
            //         color: 7,
            //         id: 8,
            //         name: "套牌车",
            //       },
            //     ],
            //     license: "",
            //     licensePlate: "闽GBP356",
            //     modelId: [],
            //     monitorTargetId: 0,
            //     monitorTargetUrl: "",
            //     personName: "",
            //     plateColorTypeId: 5,
            //     yearId: [],
            //   },
            //   monitorType: "monitorVehicleTagType",
            //   plateColorTypeId1: 0,
            //   plateColorTypeId2: 5,
            //   plateColorTypeString2: "蓝",
            //   plateImage: "",
            //   similarity: 0,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F3.504027013177082e%2B17_5c76cbb6-9620-11ed-97be-ac1f6bfc9d56.jpg&xywh=537%2C570%2C327%2C316",
            //   targetType: "vehicle",
            //   title: "测试布控002",
            //   windowFeature: "",
            // },
            // {
            //   bigImage:
            //     "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F440_1ed21d22-927b-11ed-8d2d-a0369f1f7f36.jpg",
            //   bkType: 1,
            //   captureTime: "2024-02-23 10:11:34",
            //   detection: {
            //     h: 118,
            //     w: 94,
            //     x: 1347,
            //     y: 579,
            //   },
            //   deviceId: "0",
            //   downloadUrl:
            //     "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E6%98%9F%E5%B1%95%E9%9B%85%E8%8B%91%E7%8F%A0%E6%B5%B7%E8%A1%97%E9%81%93%E6%98%9F%E5%B1%95%E9%9B%85%E8%8B%91%E5%87%BA%E5%8F%A3%E4%BA%BA%E8%BD%A6%E6%B7%B7%E5%90%88%E6%8A%93%E6%8B%8D-20240223101134-84&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F440_1ed21d22-927b-11ed-8d2d-a0369f1f7f36.jpg",
            //   feature:
            //     "hSPopvcnsyT1LCCkXiiSpKgndq4KqqQu96jIKkAoBym3ptgowSSHJLYk0qnjrcAm0SPVIvWYBykkq92sj55aqD0l9a9BKHksQix6pWWstRS2KaQeR61dG2YZraO3KVcXoZ4VJ54la5ttILGiYStQKIgp558eqnylFKzxpHWjTidBJ4ipOqILJsgmGyXbHEMhaJ5MKPypuaciKxsm2CkSrFuodZoBJdejxyywnjCkLCgaqOEsi6RYK/0pQqU+n/6rADAWmeEnJiPcqUKgwajWp70iISlmLY8kBifNn4EorKXZK64qoyyiKagijilJqiigaKoXKUsd0qwHoRqrRCaVKdqkFKKkJkAkCay0rUUdip7mJLKoUKeiLC6ieib3HAAhFSQZp9UuqKgkKOYtNyoZq00tFCy1FmcctKwpq+2oSaLXpzelTqh7JYOh+Krbo6souSXpqC0mGSiqKKgkZaCFqROpuSXiLEWdHaxypVYudB2xodOnbqRKGEasdCH7J0is1qt2rXqgj6sYrkwliCjKq86eky00Kw0oViYOKoKiZSfrKDYp3qwMrKygGqbQIfKRuCrRJrMYj6b2KVOkpaRlLAMrwagQK3ejR6rkKgeush1XoUmsIKh0qakoRKubJQwpdymzHMqqvagOpcAj4qh6IrSlwqhRLN6rzqjjrFunYiw6ookpfqmRHpMjDaltKVqj4C1/JiOZ+h/eJAas+x77KvcpU6mfH5ydQZy8rNYsIqjwqW+g5SdLK3ka1RmuqNAliCRxLTysCq2orF0dtKf4K3WpZSuurJEsnhnjKywgI6UiqP+kIKY/LLmo8CtuJXEpcZ/gGa6obymoqj+mZiXMnzupdCz3LOofGyhSKSKgtKkVKPuixS1gKh6ebZFxqTmj9Cl4qPUnN6pSKf0r8iu6qMkp850CLHudziYvLAuqcB7yJ/KmfS4BqFGW8qnxLDakzypqm3qm46UaJ9Ue9B/MJWQd5ajXlnupIZmWJwyhCSuKJeuvz6kJLqSmZSvNovCgf6oxJCKmgRA0pz8pwSoxo8OpdSwTJkKqUiEDIG+noinoJEOguSdnp40q+yckLDOhtzAALk8thS9fLhulFygXIsqse6yzHLQlhLCRJYWl8SqTJE8klisoqlormaaVHJolmySFJ38o0J8lIegMzqRsKGwpaqxfK/ufXKqsq5+jEaYzod8dfaaUInglhByqJ44kCSd3KWIoXI2BqMOcwqHgp70kO6WSJxeSZKNpmhiwsyj3qxAhEa1QsHcj4SeaqTGsryNcKo8mDSwHKSKsZZodJ5MotCgdm+qY1idOn0yiu6G1JKch3SGIqR6p9p6dlIan8qksLI6f/6oJIzIpZKDeKA==",
            //   infoId: "65d7fed6-4ff7-c718-21dd-425fc5a2ecbb",
            //   jobId: 218,
            //   lngLat: {
            //     lat: 35.880224,
            //     lng: 119.964545,
            //   },
            //   locationId: "3702011822188309",
            //   locationName: "星展雅苑珠海街道星展雅苑出口人车混合抓拍",
            //   measure: 1,
            //   monitorTarget: {
            //     brandId: [],
            //     carInfo: "",
            //     itemId: 242,
            //     labelInfos: [],
            //     license: "",
            //     licensePlate: "",
            //     modelId: [],
            //     monitorTargetId: 4163346353,
            //     monitorTargetUrl:
            //       "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F8%2C6a5281e2ef88&xywh=1347%2C579%2C94%2C118",
            //     personName: "",
            //     plateColorTypeId: -1,
            //     yearId: [],
            //   },
            //   monitorType: "monitorImageType",
            //   similarity: 99.53,
            //   targetImage:
            //     "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F440_1ed21d22-927b-11ed-8d2d-a0369f1f7f36.jpg&xywh=1347%2C579%2C94%2C118",
            //   targetType: "face",
            //   title: "测试布控002",
            // },
          ],
        };

        ws.send(JSON.stringify(data));
      // }, 3000);
    }
    ws.on("close", () => {
      console.log("User disconnected");
    });
  });
}
module.exports = wsLaunch;
