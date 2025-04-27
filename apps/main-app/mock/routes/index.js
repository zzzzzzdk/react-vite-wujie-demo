var express = require("express");
var router = express.Router();
const location = require("./json/location.json");
const ziboLocation = require("./json/zibo-location.json")
const testLocation = require("./json/test-location.json")
// const location = require("../../location.json");
const locationGroup = require("./json/location-group.json");
const offlineJson = require("./json/offline.json");
const bmy = require('./json/bmy.json')
const hotBrands = require('./json/hot-brands.json')
const gaitData = require("./json/gait-data.json")

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "fusion_demo mock 数据" });
});

// 上错错误信息
router.post("/post_error", function (req, res, next) {
  res.json(req.json);
});

/**
 * @api {get} ---- 系统公共事项
 * @apiName common1
 * @apiGroup common
 *
 * @apiDescription
 * 1、iam中的配置target_url如下：http://192.168.5.37/#/，具体跳转到那个页面，前端会根据用户菜单权限中的第一个来控制跳转。
 * 2、部署页面时需要修改 index.html和front.html中的 baseApi、baseApi2。
 *
 * @apiHeader {String} Authorization  登陆认证token
 *
 * @apiError  {String} message  错误信息
 * @apiError  {Number} status  状态码 <code>401未登录、5xx服务器错误、4xx客户端错误</code>
 *
 */

/**
 * @api {get} /common/v1/config 获取系统配置信息-白名单
 * @apiName common2
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object} data  返回信息
 * @apiSuccess {String} data.title  系统title
 * @apiSuccess {String} data.login_url iam登录地址
 * @apiSuccess {String} data.logout_url iam退出地址
 * @apiSuccess {String} data.color 系统默认主题 <code>light 白色主题 、 dark 黑色主题</code>
 * @apiSuccess {String} data.layout 系统默认布局方式 <code>vertical 纵向布局 、 horizontal 横向布局</code>
 * @apiSuccess {String} data.help_url 帮助文档地址
 * @apiSuccess {String} data.manage_url iam后台地址
 * @apiSuccess {String} data.chrome_url=/uploads/chrome.zip 谷歌浏览器下载地址
 * @apiSuccess {String[]} data.show_database 建表支持的数据库类型  <code>1 mysql 、 5 hive、 99 clickhouse/ltdb 、8 GaussDB</code>
 */
router.get("/api/fusion/v1/common/config", function (req, res, next) {
  // req.json.data = '1651c1y+LEUOHurir0zxsERiUMvT9m07aHhZtxyRDhMk' +
  // 'G6FQdX6Kyda7NQr/vkHuowPGe1QDLMYK+32Be/TUpyM/WUNYwwvUwow' +
  // 'C6kLioMDZGFwaCkXam7JoftOkDK1UqzzvkFzdwvE1JH/EvmC6vNIK0hzo' +
  // 'uDiCebSRUtRgt160D67yi0S3aRLJB+a5/8NJwGiO8ss5G/w1ywVNZOWdXd+' +
  // 'LiZYQIV/IZ0ILnXAN84hsppW8NCmnwXsPJyR1pOjk8rbBxCLwRB0VTWRmxyAX' +
  // 'tR10cV5xl/lz8G8/L1iReitusJIRh5G5fAngE3u0DSo7Kx4gi9z/8/1OY+SUb' +
  // 'cCPrl6h8NOtE4gtUPnkyHb6kt7Fz8SgzLoC3t2qCeTY7zVSHtZO11l9A3dG8mC' +
  // 'emg15hUUFYl1CS8FLlYA+pDMTdIPyE1oYeV4M+E7z0WQ5v0+6fSTkJjaOkaVYPH' +
  // 'DaX1bBq7rJonyqU909d98t11FTjz7GSVkBoEnoDGG85UIPy7uE2BIUr6JXe/LmSviafO8agg=='

  req.json.data = {
    "login_url": "#/login?",
    // "logout_url": "./login.html?fa",
    "logout_url": "#/login?",
    "color": "light",
    "layout": "vertical",
    "sysType": "fas",
    // "help_url": "/syshelp",
    // "manage_url": "----",

    "win7ChromeUrl": '1111',
    "post_error": '/post_error',
    plateExcelUrl: '',
    iam_host: 'http://localhost:8081',
    sys_text: '以萨视图融合系统软件',
    pdm_host: 'http://localhost:8081',
    api_host: 'http://localhost:8081',
    websocketUrl: 'ws://localhost:3004/ws',
    homepageWsUrl: 'ws://localhost:3004/homepage',
    staticUrl: 'http://localhost:8081',
    map: {
      mapCRS: 3857,
      center: [120.205252, 35.965781],
      zoom: 12,
      scaleZoom: 13,
      mapTileTemplate: "{mapTileHost}/v3/tile?z={z}&x={x}&y={y}",
      wxMapTileTemplate: "'{mapTileHost}/{z}/{y}/{x}.png'",
      mapTileOptions: {
        minZoom: 1,
        maxZoom: 18,
        mapTileHost: "http://114.215.146.210:25003",
        // mapTileHost: "http://56.37.200.2:25003",
        wxMapTileHost: "http://56.35.165.69:6590/googleMapSatellite",
      },
    },
    // 系统权限控制
    systemControl: {
      type: 'fusion3', // face vehicle fusion3
      // 目标类型配置
      targetTypeConfig: [
        'face',
        'pedestrian',
        'bicycle',
        'tricycle',
        'vehicle',
        // 'gait'
      ],
      // 布控类型控制
      deployTypeConfig: [
        'vehicle',
        'face',
        'picture'
      ], // type为vehicle时，只有vehicle; type为face时只有face/picture
      // 离线历史控制
      analysisTypeConfig: [
        "face",
        'bicycle',
        'tricycle',
        'vehicle',
        'gait'
      ], //人脸只有人脸，车辆有二轮三轮汽车
    },
    province: '鲁',
    province_plate: ["鲁B", "鲁U"],
    "micro_data": [
      {
        url: 'http://localhost:8084/',
        baseroute: '/offline',
        name: 'child',
        inLayout: true,
      },
      {
        url: 'http://localhost:8084/',
        path: '/demo2',
        name: 'demo2',
        inLayout: false,
      },
      {
        url: 'http://localhost:8084/',
        name: 'demo1',
        path: '/demo1',
        inLayout: true,
      },
    ]
  };

  // res.status = 400
  res.json(req.json);
});

/**
 * @api {post} /get_user_info 获取用户信息
 * @apiName common3
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object} data  返回信息
 * @apiSuccess {Boolean} data.is_back 是否有后台权限
 * @apiSuccess {Boolean} data.is_front 是否有前台权限
 * @apiSuccess {String} data.color 系统主题  <code>light 白色主题 、 dark 黑色主题</code>
 * @apiSuccess {String} data.layout  系统布局方式  <code>vertical 纵向布局 、 horizontal 横向布局</code>
 * @apiSuccess {Object} data.user_info 用户信息
 * @apiSuccess {String} data.user_info.id 用户id
 * @apiSuccess {String} data.user_info.name 用户名称
 * @apiSuccess {String} data.user_info.unit 用户组织
 * @apiSuccess {String[]} data.user_info.role 用户角色
 * @apiSuccess {String[]} data.user_info.auth 用户按钮权限  <code>dbAdd 按钮1、synTable 按钮2</code>
 * @apiSuccess {Object[]} data.menus 后台菜单
 * @apiSuccess {String} data.menus.text 菜单名称
 * @apiSuccess {String} data.menus.icon 字体图标
 * @apiSuccess {String} data.menus.path 菜单路径
 * @apiSuccess {Object[]} data.menus.children 子菜单
 * @apiSuccess {Object[]} data.f_menus 前台菜单
 * @apiSuccess {String} data.f_menus.text 菜单名称
 * @apiSuccess {String} data.f_menus.icon 字体图标
 * @apiSuccess {String} data.f_menus.path 菜单路径
 * @apiSuccess {Object[]} data.f_menus.children 子菜单
 * @apiSuccess {String[]} data.route 后台页面权限
 * @apiSuccess {String[]} data.f_route 前台页面权限 <code>/home 首页、 /property  资产门户、 /property-info 资产详情、 /applyList 我的申请</code>
 */
router.get("/api/pdm/v1/common/route-menu", async function (req, res, next) {
  await req.sleep(0);

  req.json.data = {
    // color: "light", // light    dark    technological
    // layout: "vertical", // vertical     horizontal
    userInfo: {
      id: "e2db5b68-15c7-9c59-40b1-926f2a291e8f",
      name: "张康",
      unit: "张店区公安局",
      role: ["管理员"],
    },
    menu: [
 
      {
        "icon": "shouye1",
        "name": "home",
        "path": "/home",
        "text": "首页"
      },
      {
        "icon": "changyongyingyong",
        "name": "micro-test",
        "text": "测试",
        children: [
          {
            "icon": "shuxingjiansuo1",
            "text": "demo",
            "path": "/demo",
            "name": "demo",
          },
          {
            "icon": "shuxingjiansuo1",
            "text": "demo1内嵌",
            "path": "/demo1",
            "name": "demo1",
          },
          {
            "icon": "shuxingjiansuo1",
            "text": "demo2大屏",
            "path": "/demo2",
            "name": "demo2",
          }
        ]
      },
      {
        "children": [
          {
            "icon": "shuxingjiansuo1",
            "text": "属性检索",
            "remarks": "",
            "path": "/target",
            "name": "target",
            "type": "",
            "id": "7536c609-a05d-3327-6d23-7e2f2d9ce6db",
            "pid": "2e98e2f7-c68f-8cf4-155f-096fd20a52c7",
            "target": "",
            "children": null
          },
          {
            "icon": "yitujiansuo2",
            "text": "以图检索",
            "remarks": "",
            "path": "/image",
            "name": "image",
            "type": "",
            "id": "57f9fffc-fd8a-40fe-6698-87494f4192fa",
            "pid": "2e98e2f7-c68f-8cf4-155f-096fd20a52c7",
            "target": "",
            "children": null
          },
          {
            "icon": "kuajingzhuizong1",
            "text": "跨镜追踪",
            "remarks": "",
            "path": "/cross",
            "name": "cross",
            "type": "",
            "id": "b5629e49-bca2-1871-6296-f8d7f0a06885",
            "pid": "2e98e2f7-c68f-8cf4-155f-096fd20a52c7",
            "target": "",
            "children": null
          },
          {
            "icon": "kuajingzhuizong1",
            "text": "实时跨镜追踪",
            "remarks": "",
            "path": "/real-time-tracking",
            "name": "real-time-tracking",
            "type": "",
            "id": "b5629e49-bca2-1871-6296-f8d7f0a068851",
            "pid": "2e98e2f7-c68f-8cf4-155f-096fd20a52c71",
            "target": "",
            "children": null
          },
          {
            "icon": "danganjiansuo1",
            "text": "档案检索",
            "remarks": "",
            "path": "/record-search",
            "name": "record-search",
            "type": "",
            "id": "9be6fb29-ae8b-4c33-d2a9-38b39bd7d641",
            "pid": "2e98e2f7-c68f-8cf4-155f-096fd20a52c7",
            "target": "",
            "children": null
          },
          {
            "icon": "biaoqian",
            "text": "标签管理",
            "remarks": "",
            "path": "/label-manage",
            "name": "label-manage",
            "type": "",
            "id": "9be6fb29-ae8b-4c33-d2a9-38b39bd7d641",
            "pid": "2e98e2f7-c68f-8cf4-155f-096fd20a52c7",
            "target": "",
            "children": null
          }
        ],
        "icon": "mubiaojiansuo",
        "id": "2e98e2f7-c68f-8cf4-155f-096fd20a52c7",
        "name": "search",
        "path": "/search",
        "pid": "0",
        "remarks": "",
        "target": "",
        "text": "目标检索",
        "type": ""
      },
      {
        "children": [
          {
            "icon": "chucirucheng2",
            "text": "初次入城",
            "remarks": "",
            "path": "/initial",
            "name": "initial",
            "type": "",
            "id": "initial",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "cheliangtonghangfenxi",
            "text": "同行分析",
            "remarks": "",
            "path": "/vehicle-peer",
            "name": "vehicle-peer",
            "type": "",
            "id": "ea83ca46-0045-47f0-edcb-7a56ca4aa45c",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "chelianglajiaodianfenxi",
            "text": "落脚点分析",
            "remarks": "",
            "path": "/foothold-vehicle",
            "name": "foothold-vehicle",
            "type": "",
            "id": "f6ba14a5-4f0a-1f35-a00b-1ff63254133d",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "duodianpengzhuang-cheliang",
            "text": "多点碰撞",
            "remarks": "",
            "path": "/vehicle-multipoint",
            "name": "vehicle-multipoint",
            "type": "",
            "id": "a3fae2cc-f74e-9611-185a-d02a87efa1d8",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "shuangbaotaijiance",
            "text": "双胞胎车检索",
            "remarks": "",
            "path": "/doublecar",
            "name": "doublecar",
            "type": "",
            "id": "31e5fe1b-969b-3397-0564-80f32fa1a76f",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "guijichaxun-cheliang",
            "text": "轨迹重现",
            "remarks": "",
            "path": "/vehicle-track",
            "name": "vehicle-track",
            "type": "",
            "id": "376324ef-b4ad-b91d-47f9-2335c861f0a9",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "zhoufuyechu-cheliang",
            "text": "昼伏夜出",
            "remarks": "",
            "path": "/active-night",
            "name": "active-night",
            "type": "",
            "id": "a4811a69-2b33-9c65-3d37-5a5fcc52ab39",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "taopaiche1",
            "text": "套牌车",
            "remarks": "",
            "path": "/vehicle-clone",
            "name": "vehicle-clone",
            "type": "",
            "id": "bf4791b5-a567-673e-13a3-be51c3e783a2",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "jiapaiche1",
            "text": "假牌车",
            "remarks": "",
            "path": "/vehicle-fake",
            "name": "vehicle-fake",
            "type": "",
            "id": "cd03d0a4-7655-7a2e-760c-ecad41a82c21",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          },
          {
            "icon": "pinfanguoche1",
            "text": "频繁过车",
            "remarks": "",
            "path": "/frepass",
            "name": "frepass",
            "type": "",
            "id": "6c52f003-9a07-efb5-1670-8adf9e580ac7",
            "pid": "e164b77c-fd41-c793-b11f-efd21686d35e",
            "target": "",
            "children": null
          }
        ],
        "icon": "cheliangyanpan2",
        "id": "e164b77c-fd41-c793-b11f-efd21686d35e",
        "name": "vehicle-judgment",
        "path": "vehicle-judgment",
        "pid": "0",
        "remarks": "",
        "target": "",
        "text": "车辆研判",
        "type": ""
      },
      {
        "children": [
          {
            "icon": "duodianpengzhuang-renyuan",
            "text": "多点碰撞",
            "remarks": "",
            "path": "/person-multipoint",
            "name": "person-multipoint",
            "type": "",
            "id": "142e2242-cae2-3bff-9765-48b739b3bff7",
            "pid": "681b274c-a185-7a28-7e90-8bb796f123c2",
            "target": "",
            "children": null
          },
          {
            "icon": "guijichaxun-renyuan",
            "text": "轨迹重现",
            "remarks": "",
            "path": "/person-track",
            "name": "person-track",
            "type": "",
            "id": "f3e0f33b-2698-492f-e0bf-7a371b648954",
            "pid": "681b274c-a185-7a28-7e90-8bb796f123c2",
            "target": "",
            "children": null
          },
          {
            "icon": "tonghangfenxi2",
            "text": "同行分析",
            "remarks": "{\"path\":\"/face-peer\",\"route\":\"face-peer\"}",
            "path": "/face-peer",
            "name": "face-peer",
            "type": "",
            "id": "47696df8-ecef-9298-f464-960ed458a93b",
            "pid": "681b274c-a185-7a28-7e90-8bb796f123c2",
            "target": "",
            "children": null
          },
          {
            "icon": "renyuanlajiaodianfenxi",
            "text": "落脚点分析",
            "remarks": "",
            "path": "/foothold-person",
            "name": "foothold-person",
            "type": "",
            "id": "7cc992c1-3967-fb06-eafb-2711032d9130",
            "pid": "681b274c-a185-7a28-7e90-8bb796f123c2",
            "target": "",
            "children": null
          },
          {
            "icon": "quyumopai",
            "text": "区域摸排",
            "remarks": "",
            "path": "/regional-mapping",
            "name": "regional-mapping",
            "type": "",
            "id": "33f70005-4f94-f766-4c17-71713239bc5b",
            "pid": "681b274c-a185-7a28-7e90-8bb796f123c2",
            "target": "",
            "children": null
          }
        ],
        "icon": "renyuanyanpan2",
        "id": "681b274c-a185-7a28-7e90-8bb796f123c2",
        "name": "person-judgment",
        "path": "person-judgment",
        "pid": "0",
        "remarks": "",
        "target": "",
        "text": "人员研判",
        "type": ""
      },
      {
        "children": [
          {
            "icon": "mubiaobukong",
            "text": "目标布控",
            "remarks": "",
            "path": "/deploy",
            "name": "deploy",
            "type": "",
            "id": "cdc375a3-dcc9-7180-a1af-d274a4389512",
            "pid": "da8a6313-f18b-0abc-0df3-aa844767da67",
            "target": "",
            "children": null
          },
          {
            "icon": "bukongmingxi1",
            "text": "布控明细",
            "remarks": "",
            "path": "/deploy-detail",
            "name": "deploy-detail",
            "type": "",
            "id": "c744121e-1e1f-0a9b-1eb8-895f47f655e7",
            "pid": "da8a6313-f18b-0abc-0df3-aa844767da67",
            "target": "",
            "children": null
          },
          {
            "icon": "gaojinglishi1",
            "text": "告警历史",
            "remarks": "",
            "path": "/deploy-warning",
            "name": "deploy-warning",
            "type": "",
            "id": "03b902cc-404c-8e80-55b0-6f0163cccdc9",
            "pid": "da8a6313-f18b-0abc-0df3-aa844767da67",
            "target": "",
            "children": null
          }
        ],
        "icon": "bukonggaojing",
        "id": "da8a6313-f18b-0abc-0df3-aa844767da67",
        "name": "warning",
        "path": "/warning",
        "pid": "0",
        "remarks": "",
        "target": "",
        "text": "布控告警",
        "type": ""
      },
      {
        "children": [
          {
            "icon": "lixianshujufenxi1",
            "text": "离线数据分析",
            "remarks": "",
            "path": "/offline",
            "name": "offline",
            "type": "",
            "id": "fe3e694f-0412-587b-20c6-0a385948fa6b",
            "pid": "37c2e1a1-6608-f658-6543-20ff76388cdc",
            "target": "",
            "children": null
          },
          {
            "icon": "lishishipinfenxi",
            "text": "历史视频分析",
            "remarks": "",
            "path": "/history",
            "name": "history",
            "type": "",
            "id": "2833b431-87ca-99e4-39b1-d38e8e7f2668",
            "pid": "37c2e1a1-6608-f658-6543-20ff76388cdc",
            "target": "",
            "children": null
          },
          {
            "icon": "mubiao11bidui",
            "text": "目标1:1比对",
            "remarks": "",
            "path": "/one2one",
            "name": "one2one",
            "type": "",
            "id": "e38aa547-44a0-734a-ba63-0aa015a3138e",
            "pid": "37c2e1a1-6608-f658-6543-20ff76388cdc",
            "target": "",
            "children": null
          },
          {
            "icon": "renlianNNbidui",
            "text": "人脸N:N比对",
            "remarks": "",
            "path": "/n2n",
            "name": "N2N",
            "type": "",
            "id": "18a6fcc7-7107-3cf8-cd79-5a587bee4dbc",
            "pid": "37c2e1a1-6608-f658-6543-20ff76388cdc",
            "target": "",
            "children": null
          }
        ],
        "icon": "jiexiguanli",
        "id": "37c2e1a1-6608-f658-6543-20ff76388cdc",
        "name": "analysis",
        "path": "/analysis",
        "pid": "0",
        "remarks": "",
        "target": "",
        "text": "解析管理",
        "type": ""
      },
      {
        "icon": "jingwudamoxing",
        "name": "llm",
        "path": "http://192.168.7.8:8082/?apisix_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMyIsImlzcyI6ImxsbSIsImV4cCI6MTcxMzgzNjU5MCwiaWF0IjoxNzEzNzUwMTkwLCJqdGkiOiJlZjMxZTBkNi1lNzMxLTQ5NWMtYjVjZi1mNDFmOGY2NDFkYmEifQ.d8KcLO7TfGOfRj_s2lB5H5q46rIDgA2NVZtTG3UXDI8#/home",
        "text": "智慧警务大模型"
      },
    ],
    route: [
      "child",
      "demo",
      "demo1",
      "demo2",
      "home",
      "target",
      "cluebank",
      "create-track",
      "image",
      "cross",
      "offline",
      "history",
      "one2one",
      "n2n",
      "n2n-result",
      "home",
      "initial",
      "deploy",
      "vehicle-peer",
      "foothold-vehicle",
      "deploy-detail",
      "deployment",
      "deploy-warning",
      "warning-detail",
      "vehicle-multipoint",
      "doublecar",
      "vehicle-track",
      "person-multipoint",
      "person-track",
      "face-peer",
      "active-night",
      "foothold-person",
      "vehicle-clone",
      "vehicle-fake",
      "vehicle-clone",
      "real-time-tracking",
      "frepass",
      "regional-mapping",
      "record-detail-person",
      "record-detail-vehicle",
      "record-list",
      "record-search",
      "auth-approve",
      "label-manage"
    ],
    userAuth: {
      //以图权限
      image: {
        uploadConfig: ["image", "gait"]
      }
    }
  };

  res.json(req.json);
  // res.status(401).send({
  //   message: "登录权限失效",
  // })
});

router.get("/api/pdm/v1/search-condition/setting", async function (req, res, next) {
  await req.sleep(0);

  req.json = {
    "data": [{ "id": 1, "type": 1, "unitType": 5, "pageName": "target", "pageText": "目标检索-属性检索", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 2, "type": 1, "unitType": 5, "pageName": "image", "pageText": "目标检索-以图检索", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 3, "type": 2, "unitType": 1, "pageName": "image", "pageText": "目标检索-以图检索", "categoryName": "threshold", "categoryText": "相似度阈值", "min": "20", "default": "80", "max": "100" }, { "id": 4, "type": 1, "unitType": 5, "pageName": "cross", "pageText": "目标检索-跨镜追踪", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 5, "type": 2, "unitType": 1, "pageName": "cross", "pageText": "目标检索-跨镜追踪", "categoryName": "threshold", "categoryText": "相似度阈值", "min": "60", "default": "80", "max": "100" }, { "id": 6, "type": 1, "unitType": 5, "pageName": "record-search", "pageText": "目标检索-档案查询-更多检索条件", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 7, "type": 1, "unitType": 5, "pageName": "auth-approve", "pageText": "目标检索-档案查询-权限审批", "categoryName": "inquiryTime", "categoryText": "申请查询时间", "min": "0", "default": "30", "max": "90" }, { "id": 8, "type": 1, "unitType": 5, "pageName": "record-detail-person", "pageText": "目标检索-档案查询-人员档案详情-抓拍图像、行为轨迹", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 9, "type": 1, "unitType": 5, "pageName": "record-detail-person", "pageText": "目标检索-档案查询-操作日志", "categoryName": "logTimeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 10, "type": 1, "unitType": 5, "pageName": "record-detail-person", "pageText": "目标检索-档案查询-同行人员", "categoryName": "peerTimeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 11, "type": 1, "unitType": 3, "pageName": "record-detail-person", "pageText": "目标检索-档案查询-同行人员", "categoryName": "interval", "categoryText": "跟随间隔", "min": "0", "default": "5", "max": "100" }, { "id": 12, "type": 1, "unitType": 2, "pageName": "record-detail-person", "pageText": "目标检索-档案查询-同行人员", "categoryName": "peerSpot", "categoryText": "同行次数", "min": "0", "default": "1", "max": "100" }, { "id": 13, "type": 2, "unitType": 1, "pageName": "record-detail-person", "pageText": "目标检索-档案查询-关联人员", "categoryName": "threshold", "categoryText": "相似度阈值", "min": "60", "default": "80", "max": "100" }, { "id": 14, "type": 1, "unitType": 5, "pageName": "initial", "pageText": "车辆研判-初次入城", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "30" }, { "id": 15, "type": 2, "unitType": 5, "pageName": "initial", "pageText": "车辆研判-初次入城", "categoryName": "backtrackTime", "categoryText": "回溯时长", "min": "0", "default": "7", "max": "365" }, { "id": 16, "type": 1, "unitType": 5, "pageName": "frepass", "pageText": "车辆研判-频繁过车", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "30" }, { "id": 17, "type": 2, "unitType": 2, "pageName": "frepass", "pageText": "车辆研判-频繁过车", "categoryName": "passingNum", "categoryText": "过车次数", "min": "0", "default": "5", "max": "9999" }, { "id": 18, "type": 1, "unitType": 5, "pageName": "active-night", "pageText": "车辆研判-昼伏夜出", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "30" }, { "id": 19, "type": 1, "unitType": 6, "pageName": "active-night", "pageText": "车辆研判-昼伏夜出", "categoryName": "nighttime", "categoryText": "隐匿时间", "min": "0", "default": ["09:00:00", "21:00:00"], "max": "100" }, { "id": 20, "type": 2, "unitType": 1, "pageName": "active-night", "pageText": "车辆研判-昼伏夜出", "categoryName": "percentage", "categoryText": "隐匿抓拍占比", "min": "0", "default": "30", "max": "100" }, { "id": 21, "type": 1, "unitType": 3, "pageName": "vehicle-peer", "pageText": "车辆研判-同行分析", "categoryName": "timeRange", "categoryText": "跟车时间", "min": "0", "default": "60", "max": "600" }, { "id": 22, "type": 1, "unitType": 2, "pageName": "vehicle-peer", "pageText": "车辆研判-同行分析", "categoryName": "peerSpot", "categoryText": "同行次数", "min": "0", "default": "5", "max": "9999" }, { "id": 23, "type": 1, "unitType": 7, "pageName": "vehicle-peer", "pageText": "车辆研判-同行分析", "categoryName": "peerLocation", "categoryText": "同行点位", "min": "0", "default": "5", "max": "9999" }, { "id": 24, "type": 1, "unitType": 5, "pageName": "doublecar", "pageText": "车辆研判-双胞胎车检索", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "30" }, { "id": 25, "type": 1, "unitType": 5, "pageName": "foothold-vehicle", "pageText": "车辆研判-落脚点分析", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "30" }, { "id": 26, "type": 1, "unitType": 4, "pageName": "foothold-vehicle", "pageText": "车辆研判-落脚点分析", "categoryName": "footholdTime", "categoryText": "落脚时长", "min": "0", "default": "1", "max": "72" }, { "id": 27, "type": 1, "unitType": 5, "pageName": "vehicle-multipoint", "pageText": "车辆研判-多点碰撞", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "30" }, { "id": 28, "type": 1, "unitType": 5, "pageName": "vehicle-track", "pageText": "车辆研判-轨迹重现", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "30" }, { "id": 29, "type": 1, "unitType": 5, "pageName": "vehicle-clone", "pageText": "车辆研判-套牌车", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "1", "max": "90" }, { "id": 30, "type": 1, "unitType": 5, "pageName": "vehicle-fake", "pageText": "车辆研判-假牌车", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "9", "max": "23" }, { "id": 31, "type": 1, "unitType": 5, "pageName": "person-track", "pageText": "人员研判-轨迹重现", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "90" }, { "id": 32, "type": 1, "unitType": 5, "pageName": "face-peer", "pageText": "人员研判-同行分析", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "90" }, { "id": 33, "type": 1, "unitType": 3, "pageName": "face-peer", "pageText": "人员研判-同行分析", "categoryName": "interval", "categoryText": "跟随间隔", "min": "0", "default": "5", "max": "100" }, { "id": 34, "type": 1, "unitType": 2, "pageName": "face-peer", "pageText": "人员研判-同行分析", "categoryName": "peerSpot", "categoryText": "同行次数", "min": "0", "default": "1", "max": "100" }, { "id": 35, "type": 1, "unitType": 5, "pageName": "person-multipoint", "pageText": "人员研判-多点碰撞", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "90" }, { "id": 36, "type": 1, "unitType": 5, "pageName": "foothold-person", "pageText": "人员研判-落脚点分析", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "90" }, { "id": 37, "type": 1, "unitType": 4, "pageName": "foothold-person", "pageText": "人员研判-落脚点分析", "categoryName": "footholdTime", "categoryText": "落脚时长", "min": "0", "default": "1", "max": "100" }, { "id": 38, "type": 1, "unitType": 2, "pageName": "foothold-person", "pageText": "人员研判-落脚点分析", "categoryName": "footholdSpot", "categoryText": "落脚次数", "min": "0", "default": "1", "max": "100" }, { "id": 39, "type": 1, "unitType": 5, "pageName": "regional-mapping", "pageText": "人员研判-区域摸排", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "7", "max": "90" }, { "id": 40, "type": 1, "unitType": 5, "pageName": "deploy", "pageText": "布控告警-目标布控", "categoryName": "timeRange", "categoryText": "时间范围", "min": "0", "default": "30", "max": "90" }, { "id": 41, "type": 2, "unitType": 1, "pageName": "deploy", "pageText": "布控告警-目标布控", "categoryName": "faceThreshold", "categoryText": "人脸动态抓拍阈值", "min": "60", "default": "80", "max": "100" }, { "id": 42, "type": 2, "unitType": 1, "pageName": "deploy", "pageText": "布控告警-目标布控", "categoryName": "driverThreshold", "categoryText": "人脸驾乘抓拍阈值", "min": "60", "default": "80", "max": "100" }, { "id": 43, "type": 2, "unitType": 1, "pageName": "deploy", "pageText": "布控告警-目标布控", "categoryName": "pedestrianThreshold", "categoryText": "人体阈值", "min": "60", "default": "80", "max": "100" }, { "id": 44, "type": 2, "unitType": 1, "pageName": "deploy", "pageText": "布控告警-目标布控", "categoryName": "bicycleThreshold", "categoryText": "二轮车阈值", "min": "60", "default": "80", "max": "100" }, { "id": 45, "type": 2, "unitType": 1, "pageName": "deploy", "pageText": "布控告警-目标布控", "categoryName": "tricycleThreshold", "categoryText": "三轮车阈值", "min": "60", "default": "80", "max": "100" }, { "id": 46, "type": 2, "unitType": 1, "pageName": "deploy", "pageText": "布控告警-目标布控", "categoryName": "vehicleThreshold", "categoryText": "汽车阈值\t", "min": "60", "default": "90", "max": "100" }, { "id": 47, "type": 2, "unitType": 1, "pageName": "n2n", "pageText": "解析管理-人脸N：N比对", "categoryName": "thresholdRange", "categoryText": "阈值范围", "min": "60", "default": "80", "max": "100" }, {
      "id": 49,
      "type": 2,
      "unitType": 8,
      "pageName": "target",
      "pageText": "大图弹窗-属性检索",
      "categoryName": "expandTime",
      "categoryText": "拓展时长",
      "min": "0",
      "default": "30",
      "max": "1440"
    }], "message": "Success"
  }

  res.json(req.json);
});
router.get("/api/pdm/v1/label-manage/label-tree", async function (req, res, next) {
  await req.sleep(0);

  req.json.data = [
    {
      "id": "1",
      "labels": [
        {
          "color": 6,
          "id": "3",
          "name": "在逃人员"
        }
      ],
      "name": "人员系统标签"
    },
    {
      "id": "101",
      "labels": [
        {
          "color": 1,
          "id": "204",
          "name": "请22"
        }
      ],
      "name": "测试标签集"
    },
    {
      "id": "213",
      "labels": [
        {
          "color": 1,
          "id": "214",
          "name": "人员一"
        },
        {
          "color": 2,
          "id": "215",
          "name": "人员二"
        },
        {
          "color": 5,
          "id": "218",
          "name": "人员五"
        },
        {
          "color": 3,
          "id": "233",
          "name": "2.20人员标签"
        }
      ],
      "name": "新增人员标签"
    },
    {
      "id": "219",
      "labels": [
        {
          "color": 3,
          "id": "226",
          "name": "测测"
        }
      ],
      "name": "zdry"
    },
    {
      "id": "220",
      "labels": [
        {
          "color": 2,
          "id": "221",
          "name": "人员新建测试"
        }
      ],
      "name": "新标签"
    }
  ]

  res.json(req.json);
});

/**
 * @api {get} /refresh_token 刷新token-白名单
 * @apiName common4
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiDescription  登录iam之后跳转回来带上apisix_token和refresh_token两个参数。
 *  refresh_token的有效时长比apisix_token长一点。
 *  如果apisix_token过期了，前端拿refresh_token请求 ‘/refresh_token’接口获取新的refresh_token和apisix_token。
 *  如果refresh_token也过期了就直接退出，如果有效就替换为新的apisix_token和refresh_token。
 *  前段代码做了兼容支持session方式、只有apisix_token方式和apisix_token，refresh_token的方式。
 *  有ajax轮旋的页面算自动续期。下载预览不能实现续期功能。
 *  token可以加入ip校验等安全机制来确保会不被盗取。
 *
 * @apiQuery {String} token 上次获取的refresh_token
 *
 * @apiSuccess {String} refresh_token 下次刷新的token
 * @apiSuccess {String} apisix_token  请求头中用到的token
 *
 */
router.get("/refresh_token", function (req, res, next) {
  req.json.refresh_token = "rrrrccccc";
  req.json.apisix_token = "aaaaccccc";
  res.json(req.json);
});

/**
 * @api {get} /save-theme 修改布局和主题
 * @apiName common5
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiQuery {String} skin   系统主题 <code>light 白色主题 、 dark 黑色主题</code>
 * @apiQuery {String} layout 系统布局方式 <code>vertical 纵向布局 、 horizontal 横向布局</code>
 *
 */
router.post("/v1/common/save-theme", function (req, res, next) {
  res.json(req.json);
});

/**
 * @api {post} /common/logout 退出登录
 * @apiName common6
 * @apiUse APICommon
 * @apiGroup common
 *
 */
router.post("/common/logout", function (req, res, next) {
  res.json(req.json);
});

/**
 * @api {post} /common/get_location 获取点位信息
 * @apiName common7
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object[]} data
 */
router.all("/api/pdm/v1/common/location", async function (req, res) {
  // await req.sleep(12)
  // res.json(location);
  if (req.query.needType === "1") {
    // res.json(ziboLocation)
    // res.json(testLocation)
    //{
    const arr = new Array(100000).fill(0).map((item, index) => ({
      "abnormal": 1,
      "disabled": false,
      "id": "3702020625728343" + index,
      "lat": 35.942297 + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.5,
      "lng": 120.185623 + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.5,
      "locationType": 2,
      "status": 1,
      "text": `点位${index}`
    }))
    res.json({
      ...location,
      data: [
        {
          "children": [
            {
              // "children": arr,
              "id": "370211-1",
              "scale": 4,
              "text": "车辆卡口"
            },
            {
              "children": [
                {
                  "abnormal": 1,
                  "id": "3702020625728343777test-01",
                  "lat": "35.942297",
                  "lng": "120.185623",
                  "locationType": 2,
                  "status": 1,
                  "text": "澳柯玛-测试-离线视频-01"
                },
                {
                  "abnormal": 0,
                  "id": "3702020596089079666",
                  "lat": "36",
                  "lng": "120",
                  "locationType": 2,
                  "status": 0,
                  "text": "批量导入删除测试"
                },
                {
                  "abnormal": 1,
                  "id": "370211400056555",
                  "lat": "35.977631",
                  "lng": "120.205025",
                  "locationType": 2,
                  "status": 1,
                  "text": "手动添加设备"
                },
                {
                  "abnormal": 1,
                  "id": "370211400050444",
                  "lat": "35.950222",
                  "lng": "120.163333",
                  "locationType": 2,
                  "status": 1,
                  "text": "7楼澳柯玛摄像头04"
                },
                {
                  "abnormal": 1,
                  "id": "370211400049333",
                  "lat": "35.950222",
                  "lng": "120.163333",
                  "locationType": 2,
                  "status": 1,
                  "text": "7楼澳柯玛摄像头03"
                },
                {
                  "abnormal": 1,
                  "id": "370211400048222",
                  "lat": "36.062977",
                  "lng": "120.237122",
                  "locationType": 2,
                  "status": 1,
                  "text": "7楼澳柯玛摄像头02"
                },
                {
                  "abnormal": 1,
                  "id": "370211400047111",
                  "lat": "35.950222",
                  "lng": "120.163333",
                  "locationType": 2,
                  "status": 1,
                  "text": "7楼澳柯玛摄像头01"
                }
              ],
              "id": "370211-2",
              "scale": 4,
              "text": "视频监控"
            }
          ],
          "id": "370211",
          "scale": 3,
          "text": "黄岛区"
        }
      ]
    });

  } else {
    res.json(locationGroup);
  }
});

/**
 * @api {post} /common//api/pdm/v1/common/get_range_location 获取周边范围点位
 * @apiName common
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object[]} data
 */
router.all("/api/pdm/v1/common/nearby-location", function (req, res) {
  req.json = {
    data: [
      {
        "id": "3702014251621062",
        "text": "紫金山小区(36栋)B南门出口人脸抓拍",
        "lng": "120.188891",
        "lat": "35.964013",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702014185733170",
        "text": "紫金山路紫金山支路路口",
        "lng": "120.182602",
        "lat": "35.966339",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702014154843101",
        "text": "北江路老小区C入口车辆抓拍",
        "lng": "120.183323",
        "lat": "35.965707",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702014082243151",
        "text": "香江路第一小学南门停车场简易卡口",
        "lng": "120.191137",
        "lat": "35.965445",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013986846004",
        "text": "武夷山路与阿里山路路口",
        "lng": "120.191149",
        "lat": "35.967478",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013938328709",
        "text": "紫金山小区(9栋)D南门出口人脸车辆抓拍",
        "lng": "120.188891",
        "lat": "35.964013",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013904432557",
        "text": "井岗新村北区F北门入口车辆抓拍",
        "lng": "120.192395",
        "lat": "35.970157",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013780090657",
        "text": "樱花大厦C北门出口车辆抓拍",
        "lng": "120.187676",
        "lat": "35.970151",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013760819029",
        "text": "北江路106号D南门入口车辆抓拍",
        "lng": "120.184653",
        "lat": "35.965486",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013616216065",
        "text": "玫瑰园小区玫瑰园B北门入口人脸车辆抓拍枪机",
        "lng": "120.19249",
        "lat": "35.96615",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013543655640",
        "text": "伟业花园C东门出口车辆抓拍",
        "lng": "120.185911",
        "lat": "35.966887",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013486360241",
        "text": "太行山二支路嵩山路口",
        "lng": "120.185286",
        "lat": "35.969306",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013464202944",
        "text": "嘉陵江西路与武夷山路南侧",
        "lng": "120.191141",
        "lat": "35.969046",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013281595924",
        "text": "长白山路怡翠山庄门外高架匝道处",
        "lng": "120.193159",
        "lat": "35.968507",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013264396598",
        "text": "紫金山支路紫金广场南入口",
        "lng": "120.184331",
        "lat": "35.96572",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013242322777",
        "text": "濠北头社区D西南门出口车辆抓拍",
        "lng": "120.191111",
        "lat": "35.971442",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013171408707",
        "text": "香江旺角C地库出口车辆抓拍",
        "lng": "120.190429",
        "lat": "35.970148",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013170010970",
        "text": "澳龙花园D北门混合抓拍机",
        "lng": "120.189083",
        "lat": "35.971881",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702013092632178",
        "text": "紫金山小区(9栋)D西门入口人脸车辆抓拍",
        "lng": "120.188891",
        "lat": "35.964013",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012968111169",
        "text": "紫锦广场B座出口车辆抓拍",
        "lng": "120.190045",
        "lat": "35.965862",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012850444592",
        "text": "北江路106号D南门出口车辆抓拍",
        "lng": "120.184653",
        "lat": "35.965486",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012806651458",
        "text": "太行山路井冈新村北区门口",
        "lng": "120.18715",
        "lat": "35.969071",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012741113110",
        "text": "樱花大厦C北门入口车辆抓拍",
        "lng": "120.187676",
        "lat": "35.970151",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012669416467",
        "text": "九华山路玫瑰园小区爱尊客酒店东南绿化带",
        "lng": "120.187654",
        "lat": "35.965842",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012612838558",
        "text": "九华山路花园新村富御堂足疗保健",
        "lng": "120.188504",
        "lat": "35.964684",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012580689174",
        "text": "紫锦广场B座入口车辆抓拍",
        "lng": "120.190045",
        "lat": "35.965862",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012484684946",
        "text": "嘉陵江西路与井冈山路南侧",
        "lng": "120.186111",
        "lat": "35.970722",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012483655571",
        "text": "香江旺角C北门入口车辆抓拍",
        "lng": "120.191076",
        "lat": "35.970056",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012387277320",
        "text": "玫瑰园小区玫瑰园B北门出口人脸车辆抓拍枪机",
        "lng": "120.19249",
        "lat": "35.96615",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012259947855",
        "text": "御苑公寓D西门进口朝西车辆抓拍",
        "lng": "120.183855",
        "lat": "35.966353",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012238996182",
        "text": "井冈山路紫金山支路南30米",
        "lng": "120.186557",
        "lat": "35.964695",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012164620761",
        "text": "香江花园小区北门出口车辆抓拍",
        "lng": "120.184079",
        "lat": "35.968878",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012117073333",
        "text": "阿里山路职业中专大门口",
        "lng": "120.191618",
        "lat": "35.967231",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012104698152",
        "text": "樱花大厦C西门入口车辆抓拍",
        "lng": "120.187676",
        "lat": "35.970151",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012029675201",
        "text": "乾宝佳园乾宝佳园C入口车辆抓拍",
        "lng": "120.184675",
        "lat": "35.97176",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702012023809150",
        "text": "嘉陵江路北濠北头简易卡口",
        "lng": "120.190019",
        "lat": "35.971436",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011993251529",
        "text": "武夷山路丹江路路口简卡",
        "lng": "120.190829",
        "lat": "35.969821",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011814674231",
        "text": "澳龙花园D东门入口混合抓拍机",
        "lng": "120.19027",
        "lat": "35.970637",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011683355660",
        "text": "嘉陵江路武夷山路路口",
        "lng": "120.19129",
        "lat": "35.970679",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011675238926",
        "text": "香江路大地商场西南角玫瑰园小区西门东200米路口",
        "lng": "120.187898",
        "lat": "35.964913",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011566654901",
        "text": "香江花园小区北门入口车辆抓拍",
        "lng": "120.184079",
        "lat": "35.968878",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011460384500",
        "text": "金田小区C东门入口车辆抓拍",
        "lng": "120.183855",
        "lat": "35.967354",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011351868636",
        "text": "濠北头社区D西南门进口车辆抓拍",
        "lng": "120.191111",
        "lat": "35.971442",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011276143125",
        "text": "金柏小区西区C北门入口车辆抓拍",
        "lng": "120.189142",
        "lat": "35.970278",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011227843292",
        "text": "澳龙花园D东门出口混合抓拍机",
        "lng": "120.19027",
        "lat": "35.970637",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011190610006",
        "text": "紫金山小区2号楼东北角简易卡口",
        "lng": "120.185852",
        "lat": "35.964966",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011168020778",
        "text": "香江旺角C地库入口车辆抓拍",
        "lng": "120.190429",
        "lat": "35.970148",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011159855724",
        "text": "井冈山路社区、濠洼D南门出口车辆抓拍",
        "lng": "120.189238",
        "lat": "35.967801",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011142018580",
        "text": "香江旺角C北门出口车辆抓拍",
        "lng": "120.190568",
        "lat": "35.97017",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011139661572",
        "text": "井岗新村北区F北门出口车辆抓拍",
        "lng": "120.192395",
        "lat": "35.970157",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011124284972",
        "text": "香江路与紫金山路东侧",
        "lng": "120.18463",
        "lat": "35.967678",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011101893117",
        "text": "香江路与武夷山路路口",
        "lng": "120.189545",
        "lat": "35.96605",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011094435281",
        "text": "伟业花园C东门进口车辆抓拍",
        "lng": "120.185911",
        "lat": "35.966887",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702011081527626",
        "text": "长白山路嘉陵江路立交桥南侧",
        "lng": "120.193074",
        "lat": "35.967512",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010968095457",
        "text": "东小区C南门出口朝北车辆抓拍",
        "lng": "120.189756",
        "lat": "35.964499",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010947534934",
        "text": "井冈山路社区、濠洼D南门进口车辆抓拍",
        "lng": "120.189238",
        "lat": "35.967801",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010802535194",
        "text": "御苑公寓D西门出口朝东车辆抓拍",
        "lng": "120.183855",
        "lat": "35.966353",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010772969313",
        "text": "樱花大厦C北中门出口车辆抓拍",
        "lng": "120.187676",
        "lat": "35.970151",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010709247287",
        "text": "香江路与九华山路南侧",
        "lng": "120.187162",
        "lat": "35.965725",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010568714555",
        "text": "金柏小区西区C北门出口车辆抓拍",
        "lng": "120.189142",
        "lat": "35.970278",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010504609280",
        "text": "澳龙花园D西门混合抓拍机",
        "lng": "120.187927",
        "lat": "35.971388",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010467075615",
        "text": "香江路紫金山路东南角地下通道入口东20米",
        "lng": "120.183978",
        "lat": "35.967805",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010456113265",
        "text": "黄浦江路如意酒店门口",
        "lng": "120.190325",
        "lat": "35.964334",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010330962963",
        "text": "紫金山小区4号楼南侧路口简易卡口",
        "lng": "120.186023",
        "lat": "35.963977",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010204889260",
        "text": "金田小区C东门出口车辆抓拍",
        "lng": "120.183855",
        "lat": "35.967354",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010204361797",
        "text": "嘉陵江路北濠北头",
        "lng": "120.190019",
        "lat": "35.971436",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010154633680",
        "text": "武夷山路丹江路路口",
        "lng": "120.190829",
        "lat": "35.969821",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010149584789",
        "text": "北江路老小区C出口车辆抓拍",
        "lng": "120.183323",
        "lat": "35.965707",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "3702010006280285",
        "text": "香江路与太行山路东侧",
        "lng": "120.187162",
        "lat": "35.965725",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "370211536126",
        "text": "东小区C南门进口朝南车辆抓拍",
        "lng": "120.189917",
        "lat": "35.964462",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "370211400047",
        "text": "7楼澳柯玛摄像头01",
        "lng": "120.187683",
        "lat": "35.968004",
        "locationType": 2,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "370211010010",
        "text": "乾宝佳园乾宝佳园C出口车辆抓拍",
        "lng": "120.184675",
        "lat": "35.97176",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "370211009612",
        "text": "紫金山小区B西门入口人脸车辆抓拍",
        "lng": "120.188891",
        "lat": "35.964013",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      },
      {
        "id": "370211001396",
        "text": "武夷山路与嘉陵江路路口",
        "lng": "120.191154",
        "lat": "35.970908",
        "locationType": 1,
        "abnormal": 0,
        "status": 1,
        "disabled": false
      }
    ]
  }
  res.json(req.json);
});


/**
 * @api {post} /v1/common/analysisImage 上传图片识别
 * @apiName common9
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object[]} data
 */
router.all("/v1/common/analysisImage", function (req, res) {
  req.json = {
    "bigImage": "http://192.168.5.47:3003/704.jpg",
    "data": [
      {
        "targetType": "face",
        "id": "1829787057",
        "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290",
        "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290&xywh=314%2C967%2C104%2C140",
        "detection": {
          "x": 314,
          "y": 967,
          "w": 104,
          "h": 140
        },
        "feature": "A5vBJLilBiwuqj0scSyEqYKoviewJr2hoapWpZ2hI7AzHUGqCiR1KeKmXqRUI58lZixaqLaoNSJpoQaspyc2oKEhLy1iolOofyQvLZ8mTKhNMfggCKaeqkMrTKlbLBikjKgcpT2tGairpLckYSDAreGqex/KLKej1iSsIrupTJPBIgwtbaYGp+Esk6UuozEixx0GowYhyRwCqooolKr9HwWheCNFLaaeaaycrJKqG6WvJS0dYiyPrVgsUSAxra2iDazrGgKmQaIXKhcmQiq3Kq6jvKrGnoWww6jgqJeelizyqrmeXifZrdUmbikNqOCtapJGHN8m+CixKSag4ySVKuyn3yxFotoqHSIBmoybNyoNquMp3SUykDgnpBgtriWoaaormGAofSgVKtCo9qQ3qg2kSyowKMWTqCgwLcQoriM9qJ0pBib0HImkXpi7LOKkGKj5pq6rPq3DlmOu1yb2ilqlICm2ERKcIquRqKwpjSS/KJ4muC1qoJ6tEiVnHIElH6jpqwAg1q0bLBWqLKhCKImg3yiEIbAeVS05pbIehyRYKTQlcCrgqDGaKytplm4jHxxMrUgnzKz1qp0pkClFpj0tfKhbLgGmT6PgGwaiRKitoq8l/yqYHsEoU6I2oIemsJycGEul4ymxq8unP6SdK1ejlp3YJgqro6dWKFOsw6YrIA+mPyUWpNkpdinOomKscCWaqWkh+CirKjChWjCsppMs6q07KouepiyEqaYsvKU5m6QreaZVFbweAirELGIoHSQUG76gf6kdp0ukMSjFp8IbkyyYrRIGbqO7pQymvyU5JIWpx6zcr2mm9qRsJicnTCrfp0KjkKjJKQqjx6vhpoyRKRQZInwb55ksK5wr5CjBrngrjyRprIKh0Km2JRQnfagtKtok6adrp6gk6J8DpgeooyqCK3woWy1qqHEi8aHHow0q4hyAIaQrYixTIhYroitsoLYhhalJKF8mCajrpWAUVim0qKqoTirhrFWtKJ9QKUUc46tnLJmjLan6DP4hsiFhpAudtCzmk3YkfSnpH34p06n3KcKRVisPqgoj8RhbqGyoZKQqKDQiPKvCpzAt+y5jqvEoVyedKyuvIi0LJE+fsByVJsMpZy08JbOPJph1Lc2ZECijrGQpgSKFrT4rRqREIIQfwRgiJHikqqccKH4vva24JVcp5aB7ovIdeSkJnt+aXqcEKemoUaZuJZknraGeqCQkHi23qJ4qESGWq8ApCJksrLKpRil7Kj+hB6AHL4cqwSe1Jm4XySK1JvutTiYvJ8wvlBnBqmcgoqVaJ2ssKKnMI2wd/SCKmH8k1qVfJjEqj6hkpYmjj5jyLaGm0hN7KNYlcSpCntakrSCsJg==",
        "objectTypeId": 7
      },
      {
        "targetType": "pedestrian",
        "id": "3081189968",
        "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290",
        "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290&xywh=223%2C961%2C253%2C496",
        "detection": {
          "x": 223,
          "y": 961,
          "w": 253,
          "h": 496
        },
        "feature": "3SYKsHms9qMzqsMtjapHrOctTShur0sw0aU3JkUtcyyQr66p+ijSpq6vHi1EHmuxa64UINuvui2ZonSmSzWKJQetHqXEG7StnCgxKQcYATDbqTYqVCYJLcorOKFpGvEr2ytLsMwrHJ9tMd0S0aZLLGAr7q36MnMpqixBqOirz6AJri0vo6coMVmwcqcSKs+b8y1Dsl0pIq1QLlop2SdDJBKnJiYPs3wpeSUbsCoppSuPrOcuNZqYMAwnqSwypYQtKTFrsAwkbSHfJeUkupOmL9KgFy9xqXMtJ6AaqqSl0rAssVkrQ6uYKywpMjF5pi6wUq2sLUonHy9CJJgsJzE2pw==",
        "objectTypeId": 10,
        "gaitMaskUrl": null,
        "gaitObjectUrl": null
      },
      {
        "targetType": "vehicle",
        "id": "3959361391",
        "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290",
        "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F14%2C6dc2009f20fd&xywh=525%2C210%2C117%2C98",
        "detection": { x: 525, y: 210, w: 117, h: 98 },
        "feature": "ZoxQphixaqoCpXTAoJ0sugDICKUUZVi6XGKWwXScZrASs4DCrrU",
        "objectTypeId": 10,
        "licensePlate2": '鲁A33333',
        "plateColorTypeId2": 1
      }
    ],
    "dataGroup": [
      [
        {
          "targetType": "face",
          "id": "1829787057",
          "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290",
          "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290&xywh=314%2C967%2C104%2C140",
          "detection": {
            "x": 314,
            "y": 967,
            "w": 104,
            "h": 140
          },
          "feature": "A5vBJLilBiwuqj0scSyEqYKoviewJr2hoapWpZ2hI7AzHUGqCiR1KeKmXqRUI58lZixaqLaoNSJpoQaspyc2oKEhLy1iolOofyQvLZ8mTKhNMfggCKaeqkMrTKlbLBikjKgcpT2tGairpLckYSDAreGqex/KLKej1iSsIrupTJPBIgwtbaYGp+Esk6UuozEixx0GowYhyRwCqooolKr9HwWheCNFLaaeaaycrJKqG6WvJS0dYiyPrVgsUSAxra2iDazrGgKmQaIXKhcmQiq3Kq6jvKrGnoWww6jgqJeelizyqrmeXifZrdUmbikNqOCtapJGHN8m+CixKSag4ySVKuyn3yxFotoqHSIBmoybNyoNquMp3SUykDgnpBgtriWoaaormGAofSgVKtCo9qQ3qg2kSyowKMWTqCgwLcQoriM9qJ0pBib0HImkXpi7LOKkGKj5pq6rPq3DlmOu1yb2ilqlICm2ERKcIquRqKwpjSS/KJ4muC1qoJ6tEiVnHIElH6jpqwAg1q0bLBWqLKhCKImg3yiEIbAeVS05pbIehyRYKTQlcCrgqDGaKytplm4jHxxMrUgnzKz1qp0pkClFpj0tfKhbLgGmT6PgGwaiRKitoq8l/yqYHsEoU6I2oIemsJycGEul4ymxq8unP6SdK1ejlp3YJgqro6dWKFOsw6YrIA+mPyUWpNkpdinOomKscCWaqWkh+CirKjChWjCsppMs6q07KouepiyEqaYsvKU5m6QreaZVFbweAirELGIoHSQUG76gf6kdp0ukMSjFp8IbkyyYrRIGbqO7pQymvyU5JIWpx6zcr2mm9qRsJicnTCrfp0KjkKjJKQqjx6vhpoyRKRQZInwb55ksK5wr5CjBrngrjyRprIKh0Km2JRQnfagtKtok6adrp6gk6J8DpgeooyqCK3woWy1qqHEi8aHHow0q4hyAIaQrYixTIhYroitsoLYhhalJKF8mCajrpWAUVim0qKqoTirhrFWtKJ9QKUUc46tnLJmjLan6DP4hsiFhpAudtCzmk3YkfSnpH34p06n3KcKRVisPqgoj8RhbqGyoZKQqKDQiPKvCpzAt+y5jqvEoVyedKyuvIi0LJE+fsByVJsMpZy08JbOPJph1Lc2ZECijrGQpgSKFrT4rRqREIIQfwRgiJHikqqccKH4vva24JVcp5aB7ovIdeSkJnt+aXqcEKemoUaZuJZknraGeqCQkHi23qJ4qESGWq8ApCJksrLKpRil7Kj+hB6AHL4cqwSe1Jm4XySK1JvutTiYvJ8wvlBnBqmcgoqVaJ2ssKKnMI2wd/SCKmH8k1qVfJjEqj6hkpYmjj5jyLaGm0hN7KNYlcSpCntakrSCsJg==",
          "objectTypeId": 7
        },
        {
          "targetType": "pedestrian",
          "id": "3081189968",
          "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290",
          "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290&xywh=223%2C961%2C253%2C496",
          "detection": {
            "x": 223,
            "y": 961,
            "w": 253,
            "h": 496
          },
          "feature": "3SYKsHms9qMzqsMtjapHrOctTShur0sw0aU3JkUtcyyQr66p+ijSpq6vHi1EHmuxa64UINuvui2ZonSmSzWKJQetHqXEG7StnCgxKQcYATDbqTYqVCYJLcorOKFpGvEr2ytLsMwrHJ9tMd0S0aZLLGAr7q36MnMpqixBqOirz6AJri0vo6coMVmwcqcSKs+b8y1Dsl0pIq1QLlop2SdDJBKnJiYPs3wpeSUbsCoppSuPrOcuNZqYMAwnqSwypYQtKTFrsAwkbSHfJeUkupOmL9KgFy9xqXMtJ6AaqqSl0rAssVkrQ6uYKywpMjF5pi6wUq2sLUonHy9CJJgsJzE2pw==",
          "objectTypeId": 10,
          "gaitMaskUrl": null,
          "gaitObjectUrl": null
        }
      ],
      [
        {
          "targetType": "face",
          "id": "1829787dfsd057",
          "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290",
          "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290&xywh=314%2C967%2C104%2C140",
          "detection": {
            "x": 414,
            "y": 467,
            "w": 704,
            "h": 140
          },
          "feature": "A5vBJLilBiwuqj0scSyEqYKoviewJr2hoapWpZ2hI7AzHUGqCiR1KeKmXqRUI58lZixaqLaoNSJpoQaspyc2oKEhLy1iolOofyQvLZ8mTKhNMfggCKaeqkMrTKlbLBikjKgcpT2tGairpLckYSDAreGqex/KLKej1iSsIrupTJPBIgwtbaYGp+Esk6UuozEixx0GowYhyRwCqooolKr9HwWheCNFLaaeaaycrJKqG6WvJS0dYiyPrVgsUSAxra2iDazrGgKmQaIXKhcmQiq3Kq6jvKrGnoWww6jgqJeelizyqrmeXifZrdUmbikNqOCtapJGHN8m+CixKSag4ySVKuyn3yxFotoqHSIBmoybNyoNquMp3SUykDgnpBgtriWoaaormGAofSgVKtCo9qQ3qg2kSyowKMWTqCgwLcQoriM9qJ0pBib0HImkXpi7LOKkGKj5pq6rPq3DlmOu1yb2ilqlICm2ERKcIquRqKwpjSS/KJ4muC1qoJ6tEiVnHIElH6jpqwAg1q0bLBWqLKhCKImg3yiEIbAeVS05pbIehyRYKTQlcCrgqDGaKytplm4jHxxMrUgnzKz1qp0pkClFpj0tfKhbLgGmT6PgGwaiRKitoq8l/yqYHsEoU6I2oIemsJycGEul4ymxq8unP6SdK1ejlp3YJgqro6dWKFOsw6YrIA+mPyUWpNkpdinOomKscCWaqWkh+CirKjChWjCsppMs6q07KouepiyEqaYsvKU5m6QreaZVFbweAirELGIoHSQUG76gf6kdp0ukMSjFp8IbkyyYrRIGbqO7pQymvyU5JIWpx6zcr2mm9qRsJicnTCrfp0KjkKjJKQqjx6vhpoyRKRQZInwb55ksK5wr5CjBrngrjyRprIKh0Km2JRQnfagtKtok6adrp6gk6J8DpgeooyqCK3woWy1qqHEi8aHHow0q4hyAIaQrYixTIhYroitsoLYhhalJKF8mCajrpWAUVim0qKqoTirhrFWtKJ9QKUUc46tnLJmjLan6DP4hsiFhpAudtCzmk3YkfSnpH34p06n3KcKRVisPqgoj8RhbqGyoZKQqKDQiPKvCpzAt+y5jqvEoVyedKyuvIi0LJE+fsByVJsMpZy08JbOPJph1Lc2ZECijrGQpgSKFrT4rRqREIIQfwRgiJHikqqccKH4vva24JVcp5aB7ovIdeSkJnt+aXqcEKemoUaZuJZknraGeqCQkHi23qJ4qESGWq8ApCJksrLKpRil7Kj+hB6AHL4cqwSe1Jm4XySK1JvutTiYvJ8wvlBnBqmcgoqVaJ2ssKKnMI2wd/SCKmH8k1qVfJjEqj6hkpYmjj5jyLaGm0hN7KNYlcSpCntakrSCsJg==",
          "objectTypeId": 7
        },
        {
          "targetType": "pedestrian",
          "id": "3081189dsffsdf968",
          "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290",
          "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C6dae55d18290&xywh=223%2C961%2C253%2C496",
          "detection": {
            "x": 23,
            "y": 161,
            "w": 353,
            "h": 696
          },
          "feature": "3SYKsHms9qMzqsMtjapHrOctTShur0sw0aU3JkUtcyyQr66p+ijSpq6vHi1EHmuxa64UINuvui2ZonSmSzWKJQetHqXEG7StnCgxKQcYATDbqTYqVCYJLcorOKFpGvEr2ytLsMwrHJ9tMd0S0aZLLGAr7q36MnMpqixBqOirz6AJri0vo6coMVmwcqcSKs+b8y1Dsl0pIq1QLlop2SdDJBKnJiYPs3wpeSUbsCoppSuPrOcuNZqYMAwnqSwypYQtKTFrsAwkbSHfJeUkupOmL9KgFy9xqXMtJ6AaqqSl0rAssVkrQ6uYKywpMjF5pi6wUq2sLUonHy9CJJgsJzE2pw==",
          "objectTypeId": 10,
          "gaitMaskUrl": null,
          "gaitObjectUrl": null
        }
      ]
    ]
  };
  res.json(req.json);
});

/**
 * @api {post} /common/upload 保存上传识别历史
 * @apiName common10
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object[]} data
 */

router.all("/api/pdm/v1/common/upload-image", function (req, res) {
  res.json();
});

/**
 * @api {post} /common/upload 查询上传识别历史
 * @apiName common11
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object[]} data
 */

router.all("/api/pdm/v1/common/show-history", function (req, res) {
  req.json = {
    data: [
      {
        param: {
          bigImage:
            "http://192.168.5.76:8021/rlimg?url=http://192.168.5.80:9081/1818,b5b8af3970ac6b.jpg",
          feature:
            "nKOAJjgjZaw3I38qOa3rHywdUyoQKH8lQ68yJBQwTKVqrTIpSqgYJWMsqyg+LbSocxzyKjmUHqoyoCyoOSVDLuamPqvvpSYoNCc2IGMs8Sr9H+UiOqpmpbUl/y7GmdYnKKViH/YssqbZnCImKiBUH0Crup0Crv8mGihyGdAnXSKZLeajj6WIJdUN7JiZpT8jIisrovMs8p/9KNgSNiSuKV0PGCwlr6Attq5DJoAWgyhLLCCuUSkHJTSrhBniGhMoTKFaKOWmJSAdqsWrsioIK06o4qy3LCerWhaWIwUnWaexrPcew6oKLuIiORzLJ2ypDKRpoxeqwyXAJzsjNy0uKnKoLyVuqhqofKidJ1OayyU/qYcr6aXGpUSuf6e+JRglTq3bHXmsviVODXGi6JVRIwQfMCUxqZ+jd6gMqTop4J6um4KggyxFK2CoYSmrHq+mqiqRq02mXB6Iq9WipSUGqC6liSttqf0sCSx7rX8nUKrIINAhJ61dJaqgSa+spQ0epy+cK7imvaQWI2Ms1ajIK92p3awhmcEnHR06LIEs9qkqJx8lYhsKKuEpdyJdJHyfLyVPm9AsOY0JKYqpyKjqKrOq5Su/qiMoNyf3I04NJB1mHAwZsxMLKtWlni3AGSqsMi91ojenealCqTYk2JA5JMqs1abLls8lJqKYqSSuYBTgohUokCrMoHqqQ6rDGDGtVCZOKA0tiZ/2HaqqSSikKjMkMqy0q/qig6liHicrK6q7prmo96LXpKoqGStLlyKunSdHohSksS00LPQvjKvNqvegVqAip9gie6JXIUylsCA/LMkrxyfAKEcqX6wAK4CoXyUtK9mmh5mQpKagKKnuJgytQ6qDpwcpLSXioYOrLo3yHJGphKZ3HbyqZigapy8p3SFzpYcnNqyWqJWlGKZkKT4pAqZ/JJGjNyKbqD2k1Z8wKKoTL6mWqDksFiihFISbuSTtJPSrPijiGSIpTCjRKYkj7ZlQqcwqHKoFDGuoraG7lWkp5yMKqLclpCVpKNCvPaimoiKhnShqpA0sCR2HkOwoqihprVAowiHvHcigeajgKoCqxazuqOAt2xSPK/Qn7R7bqFSuD6uZp32cSKyNKs0vDye7Hl+sbK1WLMgirKWzIxqqwKXuoqasRxaIrJygpaJQIcsbTSptp8uiIikqqlOlCx40rGwpx6nuprsg1yl5HLqnBaQsKaApB6TZLOSqByt3mD8nWqr/qbUpoZxXKjmqJyziKmUoVSKzIfklHaYrJFQiSSZCHYcfFqvIrh4q9iLErBEpxyv9pCYnvZAhKlQn+6Zvn9Mp1a0iMGWa26EwnPIhxiCSK8cntikwqMwr1am1ovQnlCBxIjoobCnnpA==",
          targetImage:
            "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Frlimg%3Furl%3Dhttp%3A%2F%2F192.168.5.80%3A9081%2F1818%2Cb5b8af3970ac6b.jpg&xywh=39,27,88,120&cut_img=1",
          targetType: "bicycle",
          detection: {
            h: 120,
            w: 88,
            x: 39,
            y: 27,
          }
        },
      },
      {
        param: {
          bigImage:
            "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.80%3A9081%2F1819%2C012519069c40a3b0.jpg",
          feature:
            "eCwUpPStuKl8ps0tk6uEqVehSazALVIrNCHLHWCoRqnPKBUqKizsJGgUUJ+oqZwmFKIQLjQo4yWioNmrqiT6KAeiDSmQImMpe6aiqT0Ptqzen5cghyplKI+rDqw/JN2cwRwSJg0VOKS7Kugh7ysxKmOfuqF9sJylMyyHqg6f1ii1pw2t4618CV4lIKrjJG+p6p8VpX4oWKzGKp8sTpuAqoYWhKGGpUmn55Dup0mpOqaiKgUmQSGfp9MroSVbJ2yg4yuUpG6oyCx9qhqlIJ7fKY8cIyS2Iq6gSyu+qSooLiQjKgAmeqhZI3svu6pEFVwj0KB9piIp7KMNKTmntqtVKkSpAaz9pxMg9yuVpiMjoyeZKuOktqSwLegmnijEJ1chRqHXrMwmGaQjpaSkhJ/TJYWrVib4rEwnzizXL+ar3ibLJ7siPSiXLMKod6HDKkQm4qgEpPiosavfqweV66huIDSbxCpnIE6j5KnVp5WmXqYnpKKlWx4XrQStfCotoWMUKxPRmb6jTCEhHYsibyHLqmaW1KQmq86f3yByoGCfoieTrrWs4SrqLWmmEh/qpX2nlygvJI4gOJeaJneoGikjIDokv6Ttp+yt36V7Kx6oCqCBJUsq7qHbqrEb/Z/vqB4ifCOtrlIoGJ0SrfekZyFzrG0bUStgJDatVRg+ozUpbCT6pQktPi9tJsstwyoYLaUkb6kepPglF6YSrkmjJ6jLqROmWaR/qEwpM6hpLIwrtq1JrtemrSyQJEwrj6ceK1IjAawLob8brK3WLaMowKmzK4kdr5e+rUsfJ6xxKs2lfSLfnhwskCy6LIWcaaTeqGUYW6x/GIQrciauqJIt9ShgHEOr0J4AKDofq5mEq/SoPS3yLEwlcSjkCmSlAiVHpl4iY6QbLDQeJayjIYufdKWxp9ylFaU4LMitXig4IeUtPh/IKd4owCZIqnsktKUiLDokHqnfLkwo1KjCK+4iHSmGrFEltSXuqKKsX6rALPsjb6eJIMKl5iLtJ6qtJKyYKRAq7STGqWCkOKFXqLsgkCt8mm6miqdOrBAciamxpxugCCzDp4opWqjfqu8qfamGKgutIyMnqNmc4S0vnHeoESyqqrEppqZ+JCgpbSOLK2QoEynCrFSlRiwxLBSp4Kw9Kv2mKyhGpNOrlBsEIM4djp7/q6gskirvqNeoVyaxIdYpKJg7rY+X356QJtooxCmmLwWvUqZcKywt5KRgEloqBa4zLT0ie6X7JpscrSa1HVMjKKlhIEkk8iq6GZqctCXgKRSeWSRVJP8lViDJoaobWyBgqMEoOCeZovMlBqUvp+8qLas4pCMqJ6ralg4d4KyvKaycOpZyKmqqb6ioKmEfc6Simg==",
          targetImage:
            "http://192.168.11.12:81/image-proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F13%2C3e6a51291ce7&xywh=1506%2C415%2C471%2C458",
          targetType: "vehicle",
          detection: {
            h: 79,
            w: 63,
            x: 1489,
            y: 424,
          }
        },
      },
      {
        param: {
          bigImage:
            "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.80%3A9081%2F1821%2C01251ab9c4c17734.jpg",
          feature:
            "7SRaIscg5CaMH8sqt6rQGl8qYqPZKl0oIiRUKGew66zMIdqiUyM6ozCt/x0FJrIoy6k1JBEq1Cl6KDYmSxvTJJkpyaZGFlQo561rIkWltCS1rGKiMC7wLt6h6asrpKck3KxPpjAqiaE2I2ytEyDBJH0pEKD1oAGssqKeKhOo+ik1oy4pgqzBpDOqbiR4pdwoN6DJJ9IsdaQ/qR+iQiQmpjMnDiXMqSSjLqx2LVQjDyW8JLIgqSjBpXglPCMsIZIgVC6ZJAegeyt3okynaaamKacrtSPBo4AnkyJZJainmSsUJY4o2SiyIsAsJKxRIBwrACsfHEcmBqgunvspB6AKIOWk2KZfHGQcfKh1qDko5xBzK1Or7CQ+oJMiSaihJOelgKxFpTeoaKl6oPypHSsfLCKdSa4nrJMs8x/ULT+l3x68IYUlYhhhKgSrmCjdJ2IqVaZGJimp7aOVrUWh3Ca1rUSq+KfrJBUjLafRrfelkyiULSIt5CVUra2n3ypkqzCiCyTTnRcs9qfdpGydHChKqrqpySLUnBIkc6iHmt4hgaWBrPWpVaNyLlMoK67YqUel0ygnqdGj96nTqdoleibSLKmbBSqrpBGhsKByqDOtYSVsFxUqMRY9KIcosKieJ9YrHqsKLIssoaRBrrCjaS51qAsuuixoH+EowSKRnx4IpiqkJOIslSy7KrakOCBmLH0kiScHqdUtq6UurPKmgR9dn0Up6ayPoQIpXJ4mo26Ybquhrdgju6VYpPssBqu9JBmpZ6jUq8qYoajspyMmwa+fLEEhDCmKp/wpWqxuKjWrKSWsJA4o3ydTJoGtdib2I2ejJq3EKNsoraQeqZgsd6FLJYepziZeqZMhOCzAqomZDCxKJukoFZ4UDr0jR61/KLMmfSi1L6elNa2xpSclVKxyHoKsN6aTLWcpzKqLKfEnqSaXKV2j5yZYoHksgqpPJq6n6akeLLoc9ygdphks9STRqIaY4SVQqRGo0KO6ozqlvqhMqwAfaZwdp2GrwarhrHsnPKWxqcmoZiucrJ6Vpyvfn/OamqpLJD0nRZYpqp0kZCVyLdMsVSmPHIwsSKxcHp+pAp5UHYasminRq16iZCTRoiMPrKlEqQwkRS0kLkuZoaADmbQsqiQcLiergKFhoKKkLyw/J7KnRCvzqfglxSvYpzyoUSpLIR8e6yQzJvqnzKsnprop2BCZKfEt3atEKLWuaY7AJlkpiSgErfMlbCbPICQsc6wrptUluxNUrTiqrCm6qR8qzybYq2iqnRtppump3R31KUikLSnuowGqMqqHqCYpxKi/Khmr7KRCnRQmSqmVqcmdDil9rLAVsqMNqOokWaf6Kmmsd6muKSegYix7pQ==",
          feature_id: "c6e775f92a732264a45c1df4834d4264",
          targetImage:
            "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Fimg.php%3Fimg_uuid%3Dhttp%253A%252F%252F192.168.5.80%253A9081%252F1821%252C01251ab9c4c17734.jpg&xywh=966,429,67,84&cut_img",
          targetType: "face",
          h: 84,
          w: 67,
          x: 966,
          y: 429,
        },
      },
      {
        param: {
          bigImage:
            "http://192.168.5.76:8021/rlimg?url=http://192.168.5.80:9081/1842,011010cfb4720a47.jpg",
          feature:
            "3iNVKVCoOi2YHLGZVqerquym1Kx9pYsvOCpSryCmnifvqTcmKKNWp9wq2a4AJh0rGiViJuwimaA/qg4tgig3qf+qBiq6pk2oaSlRqResN6qtpVIo3Q84oj6pBS1koXQnsaYxotap7yjEq9Uaz6wnlj8rWSaNJwKrNiUIq6+oeSB6m6uop6WUqggp7BkTrRaYaKoQrGgqoaIMo5mpequvKvapuaiXKTckdikeISiXYiRGnV8oACwOowGoxKI4rn6gFpiVpEIprCudKuOnESwgolklFKiYqJWgyjC0rLmgaqaFqgOkYauYpAMr2KI4L7Oo+KVELXgnu5dxqJ0oJK1HLQWqByTqIvgpXaqbpD2mgZyrp1cVaik5LhkrUaY/qeIt8ytCL0gmEalOry2YNap1JxQkySakKE2gu6tjLLijM6bSFTsrOyV1LNqekKh3HMkhcqdzKJelOSlVnD4kQ5U+qJMh5hynH66ozqvnIwGplisCoj2m3acRnV4nMR6Oqe+mQCnUmJKa5qwHJMKmDCvapCaqZChVJfqNTanvLTwmYKObKGKl0CVZpSQnGaxlIbGrPJ7Fo4uTmZgMrHEr75uwrIwhbxjfqKYmXJg0IlChTCp2qYapmRpmrQ4ora3lmFsaIacKnN6jc6EzrZkpjyQ3rtmc/CCDptqsAJekpV0dkqQnJgin6p9dqpIkbSHEnj4cK6xqKv0ulabzIY6lUyBPp1ydriUBKVasyaW4pKYeXizYKCMoaKWon+ynNCp4qusk4KYILg+ibKZFoteo2xeJq28ghic+qNOlYKnsIICsDqYmnQcnKCpCJJQg9ajeldOrfSlQo+conSgVLOCa6apjrremmSRGpouh8YCTJzsciKZDqPGqyiPBpTsnRy1VIB8oaRNspOit76IiKh8mAC2pIf2p1SMIp1ombCYvKiGswCpeKJulo6EInBCdaqFVKV0qlKQtJCQjGKtUIg0hRyEbIe4oKyhYJc+gSaixEncoGDASLIWkZ6uVopIqlqcyrF4YQyQyJCEssSprqDIoHSwOqX+iV6gIrKaiAx2gJTmjNihULQamzy5lJAoj/ChtqyWsOyp2qOGoIyjXJeoqfhvQqPUtrSWwqHCl66g/G94mKKfCIf6uDCACIREmECtRKn4bwaNKqgStXKU9rCSZpy64nY8kBS2qpOYcbK3NJ4kqnCR3JAIt6yjwrFMs1SurrNcoICkNKFwlZZ3dpEGofRyRLsut5p9WoFcjeZxspq4g9qPHoNsk0x7FK98jlCYuKhOuryswKcYprCmILOwrdyjIopgjrCwALUus1KlvK8ktn6n7qkao3p/zGDapt6PHLd0qkiobLNSsBq0xHDUslys4ow==",
          feature_id: "227ac354e7a75b3526e20dd0076bd1eb",
          targetImage:
            "http://192.168.5.76:8021/img.php?img_uuid=http%3A%2F%2F192.168.5.76%3A8021%2Frlimg%3Furl%3Dhttp%3A%2F%2F192.168.5.80%3A9081%2F1842%2C011010cfb4720a47.jpg&xywh=24,22,49,61&cut_img=1",
          targetType: "face",
          h: 61,
          w: 49,
          x: 24,
          y: 22,
        },
      },
      {
        param: {
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
      }
    ],
  };
  res.json(req.json);
});

/**
 * @api {post} /v1/common/upload_analysis_image_clipping 截图上传识别
 * @apiName common11
 * @apiUse APICommon
 * @apiGroup common
 *
 * @apiSuccess {Object[]} data
 */
router.all("/v1/common/upload_analysis_image_clipping", function (req, res) {
  req.json = {
    "bigImage": "http://192.168.11.12:82/image-proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F11%2C76bddd4753ca",
    "data": [
      {
        "targetType": "face",
        "id": "dee80b4e-9d45-4efc-9b5c-32d0093e0b79",
        "parentId": "",
        "bigImage": "http://192.168.11.12:82/image-proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F11%2C76bddd4753ca",
        "targetImage": "http://192.168.11.12:82/image-proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F11%2C76bddd4753ca\u0026xywh=20%2C5%2C72%2C86",
        "detection": {
          "x": 20,
          "y": 5,
          "w": 72,
          "h": 86
        },
        "feature": "2yY9qNimKSQ0qBYtlZ2EqdKqAyZLrBwpzSkGpUieYxZVJXyjhCZBqM8oEhWZJk6oXKeeGruhtZ1QKLor06GcHaYcNCRjKzCa3qbyofujaCVpKIcr76gEl2opkCQ+FxGgcahZoE+pTpwoJkGo0i3FJ1ehUqisJCepLqgSKjcvPCq1nfyoKSzMqNIYOKijKn2muyl5oFGs65wQIhWaQaX0quSvr63SLNYsF6FNEWyoWaeWJVegRaxNqzggth60LJeX3KMKLCyqPqp3LQGi/Ch9qoCgb6xhKZ+tdK5/mFkk1qwarIQoqKvcGSya0CnDqTSrg5YdJ2grVyH8Iq8lIazyK+4jdqwbqCUt9BvwnIei1SzPK7Sr1Z05pCes3p1KLagpQqtDoqypOKQEpLgn3ClkobMpBx6wJFUn8qrvqwao36KnnEulXyTCosKoVyiSobArYiyiIVeSXprhrAwr46nDJXshvyV5LlqtviSsoHYoQKySqpulFCw9Kgagcqr2KlUsxSHlp3IhsCsKpi+swyVeqEAoYimVrZ8oGKYGpestiCthnB+dYyzoG50t66mmookjy6k2pr6slqTVo/urySSLJvSqyKfYHZokxypqqfOqXaIIpJmq6KprIv0chKVTLusKcaxUrJ6r7CxjqPOrQSkWIi0rbyU0K22i06M2JFCWLCYyLa2Zf6cFKFSbNy02LVCVuCUbpbIm0KuHIrCqCSmTog2tn6w7IAgoRhlqm4gKCKJGJdosNyocqzsiFi9npWotpCv8qbCqPJ2ILCQhHClEqYGoVaweJA0rHKc+qzwiiyqXKl8Z+6KzKcysmC3Ir2mfKpsGnl8tj6TjH0YfryNWpG4sVCAMKFwhoyFaK1GsqqO0psOKICDRIjiuRifDpvmv9awKKSgqSKzuIaeocJoNI84s3a4AKgGk3CJ0rIyp66aMJiutBqW6KKYUwSThmhGnnqM3qI4jtCsZJM8gqifZKPasEaNVpZIbYRZ1kUioa61eK4KklyMBmkYi16HxKkoj4SVyrCiotKjeplYsmaxJnski26kgKEam2itCKdGqFilaKQYbvCkpqVcqFiq3niaZE5+zq8Yqx6w0IdigOB8opD4q0K3sqA4ms6l0qHgscSSVqCYb3ixOLCQhVSEFpLygEag7JLgdVyfuqaghahssLDuthKlWqCgicaMonJ8kV6puKwOmRqV0p7osbaKcoSIr9SS5Js4MWpkdqcOnFCucqHkrpSDSLD6sZizGHdegc6YRnMqskCoSDxwq5q5rJhCotq0eFs6QQidpokSrbaloImokFaiXq7ApRq3MKMSspSOMKcitd6I7JNipBaiIiUgijyltqN8ofSBDKlUs3R1MKQ==",
        "objectTypeId": 5,
        "isFeature": false
      }
    ],
    "dataGroup": [
      [
        {
          "targetType": "face",
          "id": "dee80b4e-9d45-4efc-9b5c-32d0093e0b79",
          "parentId": "",
          "bigImage": "http://192.168.11.12:82/image-proxy?img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F11%2C76bddd4753ca",
          "targetImage": "http://192.168.11.12:82/image-proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.11.12%3A9080%2F11%2C76bddd4753ca\u0026xywh=20%2C5%2C72%2C86",
          "detection": {
            "x": 20,
            "y": 5,
            "w": 72,
            "h": 86
          },
          "feature": "2yY9qNimKSQ0qBYtlZ2EqdKqAyZLrBwpzSkGpUieYxZVJXyjhCZBqM8oEhWZJk6oXKeeGruhtZ1QKLor06GcHaYcNCRjKzCa3qbyofujaCVpKIcr76gEl2opkCQ+FxGgcahZoE+pTpwoJkGo0i3FJ1ehUqisJCepLqgSKjcvPCq1nfyoKSzMqNIYOKijKn2muyl5oFGs65wQIhWaQaX0quSvr63SLNYsF6FNEWyoWaeWJVegRaxNqzggth60LJeX3KMKLCyqPqp3LQGi/Ch9qoCgb6xhKZ+tdK5/mFkk1qwarIQoqKvcGSya0CnDqTSrg5YdJ2grVyH8Iq8lIazyK+4jdqwbqCUt9BvwnIei1SzPK7Sr1Z05pCes3p1KLagpQqtDoqypOKQEpLgn3ClkobMpBx6wJFUn8qrvqwao36KnnEulXyTCosKoVyiSobArYiyiIVeSXprhrAwr46nDJXshvyV5LlqtviSsoHYoQKySqpulFCw9Kgagcqr2KlUsxSHlp3IhsCsKpi+swyVeqEAoYimVrZ8oGKYGpestiCthnB+dYyzoG50t66mmookjy6k2pr6slqTVo/urySSLJvSqyKfYHZokxypqqfOqXaIIpJmq6KprIv0chKVTLusKcaxUrJ6r7CxjqPOrQSkWIi0rbyU0K22i06M2JFCWLCYyLa2Zf6cFKFSbNy02LVCVuCUbpbIm0KuHIrCqCSmTog2tn6w7IAgoRhlqm4gKCKJGJdosNyocqzsiFi9npWotpCv8qbCqPJ2ILCQhHClEqYGoVaweJA0rHKc+qzwiiyqXKl8Z+6KzKcysmC3Ir2mfKpsGnl8tj6TjH0YfryNWpG4sVCAMKFwhoyFaK1GsqqO0psOKICDRIjiuRifDpvmv9awKKSgqSKzuIaeocJoNI84s3a4AKgGk3CJ0rIyp66aMJiutBqW6KKYUwSThmhGnnqM3qI4jtCsZJM8gqifZKPasEaNVpZIbYRZ1kUioa61eK4KklyMBmkYi16HxKkoj4SVyrCiotKjeplYsmaxJnski26kgKEam2itCKdGqFilaKQYbvCkpqVcqFiq3niaZE5+zq8Yqx6w0IdigOB8opD4q0K3sqA4ms6l0qHgscSSVqCYb3ixOLCQhVSEFpLygEag7JLgdVyfuqaghahssLDuthKlWqCgicaMonJ8kV6puKwOmRqV0p7osbaKcoSIr9SS5Js4MWpkdqcOnFCucqHkrpSDSLD6sZizGHdegc6YRnMqskCoSDxwq5q5rJhCotq0eFs6QQidpokSrbaloImokFaiXq7ApRq3MKMSspSOMKcitd6I7JNipBaiIiUgijyltqN8ofSBDKlUs3R1MKQ==",
          "objectTypeId": 5,
          "isFeature": false
        }
      ]
    ],
    "errorMessage": "",
    "message": "请求成功"
  }
  res.json(req.json);
});

/**
  * @api {post} /v1/targetretrieval/license-excel 批量车牌导入
  * @apiName common12
  * @apiUse APICommon
  * @apiGroup common
  *
  * @apiSuccess {Object[]} data
  */
router.all('/v1/targetretrieval/license-excel', async function (req, res) {
  req.json = {
    successNum: 100,
    successUrl: '/123',
    failNum: 21,
    failUrl: '/123',
    message: "最多导入20000条"
  }
  await req.sleep(2)
  // res.statusCode = 400
  res.json(req.json)
})

/**
  * @api {post} /get_bmy 车型数据
  * @apiName common13
  * @apiUse APICommon
  * @apiGroup common
  *
  * @apiSuccess {Object[]} data
  */
router.all('/api/pdm/v1/common/bmy', function (req, res) {
  res.json(bmy)
})

/**
  * @api {post} /get_ 车型数据
  * @apiName common13
  * @apiUse APICommon
  * @apiGroup common
  *
  * @apiSuccess {Object[]} data
  */
router.all('/api/pdm/v1/common/hot-brands', function (req, res) {
  res.json(hotBrands)
})

/**
  * @api {post} /get_步态数据
  * @apiName common14

  * @apiUse APICommon
  * @apiGroup common
  *
  * @apiSuccess {Object[]} data
  */
// router.all('/gait_data', function (req, res) {
//   res.json(gaitData)
// })j

/**
* @api {post} /get_associate_target 获取关联目标
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/targetretrieval/associatetarget', function (req, res) {
  req.json = {
    "data": [
      {
        "bigImage": "http://192.168.5.82:9898/image_proxy?img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F17b44e10-55b5-11ec-88b0-0cc47a9c4b97.jpg",
        "captureTime": "2024-04-16 10:29:52",
        "detection": {
          "x": 146,
          "y": 986,
          "w": 238,
          "h": 721
        },
        "licensePlate": "未识别",
        "downloadUrl": "http://192.168.5.82:9898/image_proxy?browser_download_pic=%E7%A6%8F%E8%8E%B1%E7%A4%BE%E5%8C%BAE%E5%8C%BAE%E5%8C%BA24%E5%8F%B7%E6%A5%BC%E8%A5%BF%E4%BE%A7%E4%BA%BA%E8%84%B8%E8%BD%A6%E8%BE%86%E6%B7%B7%E5%90%88%E6%8A%93%E6%8B%8D-20240416102952-12\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F17b44e10-55b5-11ec-88b0-0cc47a9c4b97.jpg",
        "feature": "ySINqKcswixPKGG27STqJzcxvTD+q7+U5a3zrDUqq6qmLYClM6h5MC8wHqFkqKMsQjCjrh4txCvPKrQoDzAPqC+rurFILe8tIi31pbItNiQtKjsqDK5zH2wgiSbxF02v+ikRKZ4soqR4oVSqUygOJbWgFSS0rT6wpSwoJGkvDazYpd6lQa+JsPOofalNL6yiza/MrGknWS0TKUGsxrP7HvSc3K6yrKYsPzNtqtKpLaZTMNUp7ystrBUoAKkuq6UlAjC8Ltaqei+BHRaxwygEMj0pVCrUpOWruykXKvUrZ6o2LgkhkSW9LLqq/qneqgatVi/tJmKlQTPAKRctu5keKg==",
        "targetImage": "http://192.168.5.82:9898/image_proxy?exactly=1\u0026img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F17b44e10-55b5-11ec-88b0-0cc47a9c4b97.jpg\u0026xywh=146%2C986%2C238%2C721",
        "infoId": "661de2a0-77df-3442-9cbf-7636e5a294ad",
        "lngLat": {
          "lng": 120.123726,
          "lat": 36.067626
        },
        "locationName": "福莱社区E区E区24号楼西侧人脸车辆混合抓拍",
        "locationId": "3702013384139221",
        "deviceId": "3702013598866077",
        "targetType": "bicycle",
        "trackingSegment": [
          [
            0,
            0
          ],
          [
            0,
            0
          ]
        ]
      }
    ],
    "errorMessage": "",
    "message": "请求成功",
    "targetPoint": [
      {
        "infoId": "661de2a0-77df-3442-9cbf-7636d317a58e",
        "targetType": "face",
        "point": {
          "x": 264,
          "y": 1063
        }
      },
      {
        "infoId": "661de2a0-77df-3442-9cbf-7636e5a294ad",
        "targetType": "bicycle",
        "point": {
          "x": 265,
          "y": 1346
        }
      }
    ],
    "track": []
  }
  res.json(req.json)
})

/**
* @api {post} /v1/common/location-count 获取可视区域点位
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/api/pdm/v1/common/location-count', function (req, res) {
  const data = {
    "message": "sucess",
    "data": [
      { "count": 8992, "id": "370211", "lat": "35.964713", "lng": "120.204048", "text": "黄岛区" }
    ]
  }
  res.send(data)
})

/**
* @api {post} /v1/common/upload/verify 上传之前的验证
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/upload/verify', async function (req, res, next) {
  req.json = {
    exist: false,
    chunks: [],
    url: ''
  }
  res.json(req.json);
});

/**
* @api {post} /v1/common/upload/chunk 分片chunk上传
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/upload/chunk', async function (req, res, next) {
  req.json = {

  }
  await req.sleep(1)
  res.json(req.json);
});

/**
* @api {post} /v1/common/upload/merge 文件分片合并
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/upload/merge', async function (req, res, next) {
  req.json = {

  }
  res.json(req.json);
});

/**
* @api {post} /v1/common/disk/free 获取磁盘剩余空间
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/disk/free', async function (req, res, next) {
  req.json = {
    freeSpace: '1.1GB'
  }
  res.json(req.json);
});

/**
* @api {post} /v1/common/track 获取拼接的轨迹数据
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/track', async function (req, res, next) {
  req.json = {
    data: [
      {
        minCaptureTime: '2023-10-01 14:10:00',
        maxCaptureTime: '2023-11-01 14:10:00',
        locationId: '370211400047',
        locationName: '7楼澳柯玛摄像头04',
        lngLat: {
          lng: '120.173145',
          lat: '35.935726'
        },
        path: [],
        // lngLat: { lng: 0, lat: 0 },
        // path: ["0.000000,0.000000"],
        infos: [
          {
            targetImage: 'http://192.168.5.47:3003/701.jpg',
            bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
            captureTime: '',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '2222222222222222',
            captureTime: '',
            locationName: '育英实验小学北泊子安置房简易卡口',
            locationId: '3702011611547297',
            targetType: 'pedestrian',
            videoFrom: 'realtime',
            lngLat: {
              lng: "120.157974",
              lat: "36.029556",
            },
            downloadUrl: '',
            infoId: 'this is a infoId',
            similarity: '98.9',
            // 汽车
            // licensePlate1: '车牌1',
            // licensePlate2: '车牌2',
            // plateColorTypeId2: '1',
            licensePlate: '车联车',
            licensePlateUrl: './'
          },
          {
            targetImage: 'http://192.168.5.47:3003/702.jpg',
            bigImage: '',
            captureTime: '',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '33333333333333333',
            captureTime: '',
            locationName: '铁山街道办事处朱家园朱家园村入口人车混合抓拍',
            locationId: "3702014293522715",
            targetType: 'bicycle',
            videoFrom: 'realtime',
            lngLat: {
              lng: "119.95947",
              lat: "35.97949",
            },
            downloadUrl: '',
            // 人体
            gaitFeature: '111',
            gaitMaskUrl: ['11'],
            gaitObjectUrl: ['11'],
            gaitVideoUrl: '',
            gaitVideoDuration: 0,
            // 汽车
            licensePlate1: '车牌1',
            licensePlate2: '车牌2',
            plateColorTypeId2: '1',
            carInfo: '品牌-型号-年款',
            movingDirection: '移动方向',
            similarity: '99.9',
            infoId: '312312312312321',
          },
          {
            targetImage: 'http://192.168.5.47:3003/703.jpg',
            bigImage: '',
            captureTime: '',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '44444444444444444',
            captureTime: '',
            locationName: '点位名称',
            locationId: '123123',
            targetType: 'face',
            videoFrom: 'realtime',
            lngLat: {
              lng: "119.95947",
              lat: "35.97949",
            },
            downloadUrl: '',
            // 人体
            gaitFeature: '',
            gaitMaskUrl: [],
            gaitObjectUrl: [],
            gaitVideoUrl: '',
            gaitVideoDuration: 0,
            // 汽车
            licensePlate1: '车牌1',
            licensePlate2: '车牌2',
            plateColorTypeId2: '1',
            carInfo: '品牌-型号-年款',
            movingDirection: '移动方向',
            infoId: '3123123123213123312321',
          },
          {
            targetImage: 'http://192.168.5.47:3003/image_proxy.jpg',
            bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
            captureTime: '2023-06-01 14:10:00',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '555555555555555555',
            captureTime: '',
            locationName: '点位名称',
            locationId: '123123',
            targetType: 'vehicle',
            videoFrom: 'realtime',
            lngLat: {
              lng: "119.95947",
              lat: "35.97949",
            },
            downloadUrl: '',
            // 人体
            gaitFeature: '',
            gaitMaskUrl: [],
            gaitObjectUrl: [],
            gaitVideoUrl: '',
            gaitVideoDuration: 0,
            // 汽车
            licensePlate1: '车牌一',
            licensePlate2: '车牌二',
            plateColorTypeId2: '5',
            carInfo: '品牌-型号-年款',
            movingDirection: '移动方向',
            licensePlate1Url: '/321',
            licensePlate2Url: '/123',
            infoId: '3213124214124123123415',
          },
        ]
      },
      {
        minCaptureTime: '2023-09-01 14:10:00',
        maxCaptureTime: '2023-10-01 14:10:00',
        locationId: '370211400047',
        locationName: '7楼澳柯玛摄像头03',
        lngLat: {
          lng: '120.167748',
          lat: '35.943059'
        },
        path: ['120.167748,35.943059;120.167861,35.942603;120.16799,35.942271;120.168076,35.942099;120.168263,35.941772;120.168392,35.94159;120.168456,35.941514;120.16865,35.941289;120.168826,35.941112;120.169486,35.9405;120.170082,35.939894;120.17065,35.939224;120.170903,35.938891;120.171273,35.938376;120.171337,35.938285;120.172759,35.936279;120.172914,35.936064;120.172952,35.936016;120.173145,35.935726'],
        // lngLat: { lng: 0, lat: 0 },
        // path: ["0.000000,0.000000"],

        infos: [
          {
            targetImage: 'http://192.168.5.47:3003/704.jpg',
            bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
            captureTime: '2023-06-01 14:10:00',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '555555555555555555',
            captureTime: '',
            locationName: '点位名称',
            locationId: '123123',
            targetType: 'vehicle',
            videoFrom: 'realtime',
            lngLat: {
              lng: "119.95947",
              lat: "35.97949",
            },
            downloadUrl: '',
            // 人体
            gaitFeature: '',
            gaitMaskUrl: [],
            gaitObjectUrl: [],
            gaitVideoUrl: '',
            gaitVideoDuration: 0,
            // 汽车
            licensePlate1: '车牌一',
            licensePlate2: '车牌二',
            plateColorTypeId2: '5',
            carInfo: '品牌-型号-年款',
            movingDirection: '移动方向',
            licensePlate1Url: '/321',
            licensePlate2Url: '/123',
            infoId: '3213124354657457',
          },
        ]
      },
      {
        minCaptureTime: '2023-08-01 14:10:00',
        maxCaptureTime: '2023-09-01 14:10:00',
        locationId: '370211400047',
        locationName: '7楼澳柯玛摄像头02',
        lngLat: {
          lng: '120.167244',
          lat: '35.943317'
        },
        path: ['120.167244,35.943317;120.167443,35.943263;120.16762,35.943156;120.167748,35.943059'],
        infos: [
          {
            targetImage: 'http://192.168.5.47:3003/705.jpg',
            bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
            captureTime: '2023-06-01 14:10:00',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '555555111555555555555',
            captureTime: '',
            locationName: '点位名称',
            locationId: '123123',
            targetType: 'face',
            videoFrom: 'realtime',
            lngLat: {
              lng: "119.95947",
              lat: "35.97949",
            },
            downloadUrl: '',
            // 人体
            gaitFeature: '',
            gaitMaskUrl: [],
            gaitObjectUrl: [],
            gaitVideoUrl: '',
            gaitVideoDuration: 0,
            // 汽车
            licensePlate1: '车牌一',
            licensePlate2: '车牌二',
            plateColorTypeId2: '5',
            carInfo: '品牌-型号-年款',
            movingDirection: '移动方向',
            licensePlate1Url: '/321',
            licensePlate2Url: '/123',
            infoId: '12312466457123123',
          },
          {
            targetImage: 'http://192.168.5.47:3003/706.jpg',
            bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
            captureTime: '2023-06-01 14:10:00',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '1112321312',
            captureTime: '',
            locationName: '点位名称',
            locationId: '123123',
            targetType: 'face',
            videoFrom: 'realtime',
            lngLat: {
              lng: "119.95947",
              lat: "35.97949",
            },
            downloadUrl: '',
            // 人体
            gaitFeature: '',
            gaitMaskUrl: [],
            gaitObjectUrl: [],
            gaitVideoUrl: '',
            gaitVideoDuration: 0,
            // 汽车
            licensePlate1: '车牌一',
            licensePlate2: '车牌二',
            plateColorTypeId2: '5',
            carInfo: '品牌-型号-年款',
            movingDirection: '移动方向',
            licensePlate1Url: '/321',
            licensePlate2Url: '/123',
            infoId: 'jasdkaspi1238123',
          },
        ]
      },
      {
        minCaptureTime: '2023-06-01 14:10:00',
        maxCaptureTime: '2023-07-01 14:10:00',
        locationId: '370211400047',
        locationName: '7楼澳柯玛摄像头01',
        lngLat: {
          lng: '120.162212',
          lat: '35.942367'
        },
        path: ['120.162212,35.942367;120.162631,35.942437;120.162733,35.942453;120.163484,35.942582;120.16439,35.942753;120.165656,35.942984;120.166053,35.943059;120.166359,35.943118;120.166804,35.94321;120.167244,35.943317'],
        infos: [
          {
            targetImage: 'http://192.168.5.47:3003/705.jpg',
            bigImage: 'http://192.168.5.47:3003/image_proxy.jpg',
            captureTime: '2023-06-01 14:10:00',
            detection: {
              x: 100,
              y: 100,
              w: 200,
              h: 200,
            },
            feature: '555555111555555555555',
            captureTime: '',
            locationName: '点位名称',
            locationId: '123123',
            targetType: 'face',
            videoFrom: 'offline',
            lngLat: {
              lng: "119.95947",
              lat: "35.97949",
            },
            downloadUrl: '',
            // 人体
            gaitFeature: '',
            gaitMaskUrl: [],
            gaitObjectUrl: [],
            gaitVideoUrl: '',
            gaitVideoDuration: 0,
            // 汽车
            licensePlate1: '车牌一',
            licensePlate2: '车牌二',
            plateColorTypeId2: '5',
            carInfo: '品牌-型号-年款',
            movingDirection: '移动方向',
            licensePlate1Url: '/321',
            licensePlate2Url: '/123',
            infoId: '12312466457121231233123',
          },

        ]
      }
    ],
  }
  await req.sleep(1)
  res.json(req.json);
});

// router.all('/api/pdm/v1/label-manage/label-tree', (req, res) => {
//   res.send({
//     data: Array.from({ length: 3 }).map((_, i) => {
//       return {
//         id: Math.random(),
//         name: `标签集-${i}`,
//         labels: Array.from({ length: 5 }).map((_, j) => {
//           return {
//             id: Math.random(),
//             name: `标签-${j}`,
//           }
//         })
//       }
//     }),
//     message: '获取标签'
//   })
// })

/**
* @api {post} /v1/common/playback 获取录像回放播放地址
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/playback', async function (req, res, next) {
  req.json = {
    // data: 'http://192.168.5.47:3003/video/bgfx.mp4',
    data: 'http://192.168.5.47:3003/video/h265.mp4',
    // data: 'http://192.168.5.47:3003/video/playback3.flv',
    // data: 'http://192.168.5.47:3003/video/flv-demo.flv',
  }
  // await req.sleep(1)
  res.status = 400
  res.json(req.json);
});

/**
* @api {post} /v1/common/cube/import 数智万象导入
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/cube/import', async function (req, res, next) {
  req.json = {
    message: '这是失败原因',
    data: {
      size: 321,
      url: '/前往数智万象'
    }
  }
  await req.sleep(1)
  // res.statusCode = 400
  res.json(req.json);
});
/**
* @api {post} /v1/common/token/get 上传检索参数
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {id} data
*/
global.peerData = null
global.targetData = {
  targetType: 'vehicle',
  beginDate: "2024-01-01 00:00:00",
  endDate: "2024-01-02 14:40:41",
  locationIds: ["3702023739704259", "3702014294916629"],

  // 汽车
  licensePlate: '鲁A12345',
  plateColorTypeId: '1',
  brandId: "5",
  modelId: ["57"],
  yearId: ["16123"],
  colorTypeId: 4,
  vehicleTypeId: [1, 2],
  // 人脸
  sexId: 1,
  glassesId: [1],

  // 人体
  sexId: 1,
  coatColorTypeId: [1, 2],
  pantsColorTypeId: [2, 3],
  // 二轮车
  bicycleTypeId: [2, 3],
  coatColorTypeId: [3, 4],
  // colorTypeId: [4],
  // 三轮车
  coatColorTypeId: [3, 4],
  // colorTypeId: [4],
  // 其他
  objectTypeId: 2,
  directionId: 5,
  vehicleFuncId: [6, 7],
  reflectiveOr: 1,
  graffiti: 1,
  tissue: 1,
  roofRack: 1
}


/**
* @api {post} /v1/common/cube/import 数智万象导入
* @apiName common15
* @apiUse APICommon
* @apiGroup common
*
* @apiSuccess {Object[]} data
*/
router.all('/v1/common/export/id', async function (req, res, next) {
  req.json = {
    message: '这是失败原因',
    id: 'exportid---111'
  }
  await req.sleep(1)
  // res.statusCode = 400
  res.json(req.json);
});
module.exports = router;
