import { SortField, SortOrder } from '@/config/CommonType'
import light from '../pages/Layout/images/light.png'
import dark from '../pages/Layout/images/dark.png'
import { DrawType } from '@/components/LocationMapList/interface'
import { isArray } from '@/utils'

/**
 *@description  数据字典
 * */

const targetTypes = [
  { label: "人脸", value: 'face' },
  { label: "人体", value: 'pedestrian' },
  { label: "二轮车", value: 'bicycle' },
  { label: "三轮车", value: 'tricycle' },
  { label: "汽车", value: 'vehicle' },
]

const character = {
  pageSizeOptions: [40, 80, 200],
  tableGroupPageSizeOptions: [30, 60, 90],
  loadingTip: "正在加载中...",
  // 换肤配置
  skinData: [
    {
      skin: 'light',
      img: light,
      text: '浅色',
    },
    {
      skin: 'dark',
      img: dark,
      text: '深色'
    },
    // {
    //   skin: 'technological',
    //   img: dark,
    //   text: '科技色'
    // },
  ],
  // 目标类型
  targetTypes: window.YISACONF.systemControl?.targetTypeConfig && isArray(window.YISACONF.systemControl.targetTypeConfig) ?
    targetTypes.filter(item => window.YISACONF.systemControl?.targetTypeConfig?.includes(item.value))
    : targetTypes,
  // 是否有步态
  hasGait: window.YISACONF.systemControl?.targetTypeConfig && isArray(window.YISACONF.systemControl.targetTypeConfig) ?
    window.YISACONF.systemControl.targetTypeConfig.includes('gait') ? true : false
    : true,
  // 离线/历史目标类型分析控制
  analysisTypes: window.YISACONF.systemControl?.analysisTypeConfig && isArray(window.YISACONF.systemControl.analysisTypeConfig) ?
    targetTypes.filter(item => window.YISACONF.systemControl?.analysisTypeConfig?.includes(item.value))
    : targetTypes,
  // 图文列表
  resultShowType: [
    { label: "图文", value: 'image' },
    { label: "列表", value: 'list' },
  ],
  featureTypeToText: {
    face: "人脸",
    pedestrian: "人体",
    bicycle: "二轮车",
    tricycle: "三轮车",
    vehicle: "汽车",
    gait: "步态",
  },
  // 车辆分组方式g
  groupType: [
    {
      text: '按前端识别车牌分组',
      tableName: '前端车牌',
      value: 'licensePlate1',
      targetType: 'vehicle'
    },
    {
      text: '按二次识别车牌分组',
      tableName: '二次车牌',
      value: 'licensePlate2',
      targetType: 'vehicle'
    },
    {
      text: '按车牌省份分组',
      tableName: '车牌省份',
      value: 'licensePlate2Province',
      targetType: 'vehicle'
    },
    {
      text: '按点位分组',
      tableName: '点位',
      value: 'locationId',
      targetType: 'vehicle,face,pedestrian,bicycle,tricycle'
    },
    {
      text: '按车辆品牌分组',
      tableName: '车辆品牌',
      value: 'brandId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆型号分组',
      tableName: '车辆型号',
      value: 'modelId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆年款分组',
      tableName: '车辆年款',
      value: 'yearId',
      targetType: 'vehicle'
    },
    {
      text: '按车牌颜色分组',
      tableName: '车牌颜色',
      value: 'plateColorTypeId2',
      targetType: 'vehicle'
    },
    {
      text: '按行驶方向分组',
      tableName: '行驶方向',
      value: 'directionId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆使用性质分组',
      tableName: '车辆使用性质',
      value: 'vehicleFuncId',
      targetType: 'vehicle'
    },
    {
      text: '按车辆类别分组',
      tableName: '车辆类别',
      value: "vehicleTypeId",
      targetType: 'vehicle'
    },
    {
      text: '按车辆颜色分组',
      tableName: '车辆颜色',
      value: 'colorTypeId',
      targetType: 'vehicle'
    },
    {
      text: '按日期分组',
      tableName: '日期',
      value: 'date',
      targetType: 'face,pedestrian,bicycle,tricycle'
    },
    // {
    //   text: '按点位分组',
    //   tableName: '点位',
    //   value: 'color_id'
    // },
  ],
  // 筛选方式
  filterType: [
    {
      text: '可识别驾乘人脸',
      value: 'isFace',
      targetType: 'vehicle'
    },
    {
      text: '遮挡面部',
      value: 'sunVisor',
      targetType: 'vehicle'
    },
    {
      text: '双识同牌',
      value: 'samePlate',
      title: '筛选前端设备识别和二次识别相同的结果',
      targetType: 'vehicle'
    },
    {
      text: '初次入城（30天）',
      value: 'firstCity',
      targetType: 'vehicle'
    },
    {
      text: '可识别人脸',
      value: 'isFace',
      targetType: 'pedestrian,bicycle,tricycle'
    },

    // {
    //   text: '主驾未系安全带',
    //   value: 'mainWithout_belt',
    // },
    // {
    //   text: '副驾未系安全带',
    //   value: 'sub_without_belt',
    // },
    // {
    //   text: '主驾拨打电话',
    //   value: 'main_phone',
    // },
  ],
  //分组
  tagTypes: [
    { key: "region", name: '按点位选择' },
    { key: "locationGroup", name: '按点位组选择' },
    { key: "offline", name: '离线文件' },
  ],
  //以图上传类型
  imageTypes: [
    {
      label: "图片",
      value: "image"
    },
    {
      label: "步态",
      value: "gait"
    }
  ],
  //排序方式
  yituSort: [
    {
      label: "相似度",
      value: "similarity",
      order: "desc"
    },
    {
      label: "时间",
      value: "captureTime",
      order: "desc"
    },
  ] as {
    label: string;
    value: SortField;
    order: SortOrder;
  }[],
  //步态参数
  gaitParams: {
    maxDisplayNumber: 200,
    maxSelectedNumber: 5
  },
  //以图上传人脸，步态参数选择
  yituFilter: {
    face: [
      {
        value: "2",
        label: "过滤低质量人脸",
        default: true
      },
      {
        value: "1",
        label: "人脸搜车"
      }
    ],
    gait: [
      {
        value: "1",
        label: "人脸过滤",
        default: true
      },
    ]
  },
  //聚类弹窗tab
  clusterTabs: [
    {
      value: "idcard",
      label: "证件照"
    },
    {
      value: "captureFace",
      label: "抓拍人脸聚类"
    },
    {
      value: "driverFace",
      label: "驾乘人脸聚类"
    },
    {
      value: "pedestrian",
      label: "人体聚类"
    },
  ],
  //以图离线文件选择tab
  imageOfflineTabs: [
    {
      label: "上传视频",
      value: "upload"
    },
    {
      label: "已解析文件",
      value: "file"
    }
  ],
  // 关系人
  relationPerson: [
    { value: 0, label: '全部', name: '全部' },
    { value: 1, label: '同户籍', name: '同户籍' },
    { value: 2, label: '同手机使用人', name: '同手机' },
    { value: 3, label: '同车违章', name: '同违章' },
    { value: 4, label: '同车使用', name: '同车' },
    { value: 5, label: '同案', name: '同案' },
    { value: 6, label: '同出行', name: '同出行' },
    { value: 7, label: '同住', name: '同住' },
    { value: 8, label: '同上网', name: '同上网' },
  ],
  // 排序1
  sortList: [
    {
      value: "peerCount-desc",
      label: "按同行次数降序",
    },
    {
      value: "peerCount-asc",
      label: "按同行次数升序",
    },
    {
      value: "locationCount-desc",
      label: "按点位数降序",
    },
    {
      value: "locationCount-asc",
      label: " 按点位数升序",
    },
    // {
    //   value: "captureTime-desc",
    //   label: "按抓拍时间降序",
    // },
    // {
    //   value: "captureTime-asc",
    //   label: "按抓拍时间升序"
    // }
  ],
  // 排序2
  captureSortList: [
    {
      value: "captureTime-desc",
      label: "按抓拍时间降序",
    },
    {
      value: "captureTime-asc",
      label: "按抓拍时间升序"
    }
  ],
  //排序3
  foothodsortList: [
    {
      value: "staycount-down",
      label: "按落脚次数降序",
    },
    {
      value: "staycount-up",
      label: "按落脚次数升序",
    }
  ],
  //排序4
  staysortList: [
    {
      value: "staytime-down",
      label: "按落脚时长降序",
    },
    {
      value: "staytime-up",
      label: "按落脚时长升序",
    },
  ],
  // 抓拍次数排序
  captureCountsSortList: [
    {
      value: 'captureCounts-desc',
      label: "按抓拍次数降序",
    },
    {
      value: "captureCounts-asc",
      label: "按抓拍次数升序"
    }
  ],
  speedType: [
    {
      text: '1x',
      value: 1
    }, {
      text: '2x',
      value: 2
    }, {
      text: '4x',
      value: 4
    }, {
      text: '8x',
      value: 8
    }
  ],
  // 轨迹播放速度
  multiSpeedType: [
    {
      text: '1x',
      value: 20
    }, {
      text: '2x',
      value: 22
    }, {
      text: '4x',
      value: 24
    }, {
      text: '8x',
      value: 26
    }
  ],
  // 轨迹路网/直线切换类型
  trackType: [
    {
      value: '1',
      label: '路网导航'
    },
    {
      value: '2',
      label: '直线导航'
    }
  ],
  trackColor: ['#3377FF', '#FF8D1A'],
  recordSort: [
    {
      value: "captureTime",
      label: "拍摄时间",
    },
    {
      value: "captureNum",
      label: "抓拍次数",
    },
  ],
  // 设置权限下拉
  permissionType: [
    {
      value: 1,
      label: '共享'
    },
    {
      value: 0,
      label: '私密（仅自己可看）'
    }
  ],
  //身份信息类型
  cardInfoType: [
    {
      label: "人员照片",
      value: "image"
    },
    {
      label: "身份证号",
      value: "idcard"
    },
  ],
  // 特征信息
  targetInfo: [
    {
      text: '人脸',
      icon: 'renlian',
      field: 'face',
      color: '#AA89BD'
    },
    {
      text: '人体',
      icon: 'xingren',
      field: 'pedestrian',
      color: '#2B83E8'
    },
    {
      text: '二轮车',
      icon: 'erlunche',
      field: 'bicycle',
      color: '#E6A23C'
    },
    {
      text: '三轮车',
      icon: 'sanlunche',
      field: 'tricycle',
      color: '#49A838'
    },
    {
      text: '汽车',
      icon: 'qiche',
      field: 'vehicle',
      color: '#F56C6C'
    },
    {
      text: '步态',
      icon: 'butai1',
      field: 'gait',
      color: '#22619C'
    }
  ],
  // 婚姻
  "marital": [
    {
      "id": "10",
      "text": "未婚"
    },
    {
      "id": "20",
      "text": "已婚"
    },
    {
      "id": "21",
      "text": "初婚"
    },
    {
      "id": "22",
      "text": "再婚"
    },
    {
      "id": "23",
      "text": "复婚"
    },
    {
      "id": "30",
      "text": "丧偶"
    },
    {
      "id": "40",
      "text": "离婚"
    },
    {
      "id": "90",
      "text": "未知"
    }
  ],
  // 民族
  "nation": [
    {
      "id": "01",
      "text": "汉族"
    },
    {
      "id": "02",
      "text": "蒙古族"
    },
    {
      "id": "03",
      "text": "回族"
    },
    {
      "id": "04",
      "text": "藏族"
    },
    {
      "id": "05",
      "text": "维吾尔族"
    },
    {
      "id": "06",
      "text": "苗族"
    },
    {
      "id": "07",
      "text": "彝族"
    },
    {
      "id": "08",
      "text": "壮族"
    },
    {
      "id": "09",
      "text": "布依族"
    },
    {
      "id": "10",
      "text": "朝鲜族"
    },
    {
      "id": "11",
      "text": "满族"
    },
    {
      "id": "12",
      "text": "侗族"
    },
    {
      "id": "13",
      "text": "瑶族"
    },
    {
      "id": "14",
      "text": "白族"
    },
    {
      "id": "15",
      "text": "土家族"
    },
    {
      "id": "16",
      "text": "哈尼族"
    },
    {
      "id": "17",
      "text": "哈萨克族"
    },
    {
      "id": "18",
      "text": "傣族"
    },
    {
      "id": "19",
      "text": "黎族"
    },
    {
      "id": "20",
      "text": "傈僳族"
    },
    {
      "id": "21",
      "text": "佤族"
    },
    {
      "id": "22",
      "text": "畲族"
    },
    {
      "id": "23",
      "text": "高山族"
    },
    {
      "id": "24",
      "text": "拉祜族"
    },
    {
      "id": "25",
      "text": "水族"
    },
    {
      "id": "26",
      "text": "东乡族"
    },
    {
      "id": "27",
      "text": "纳西族"
    },
    {
      "id": "28",
      "text": "景颇族"
    },
    {
      "id": "29",
      "text": "柯尔克孜族"
    },
    {
      "id": "30",
      "text": "土族"
    },
    {
      "id": "31",
      "text": "达斡尔族"
    },
    {
      "id": "32",
      "text": "仫佬族"
    },
    {
      "id": "33",
      "text": "羌族"
    },
    {
      "id": "34",
      "text": "布朗族"
    },
    {
      "id": "35",
      "text": "撒拉族"
    },
    {
      "id": "36",
      "text": "毛南族"
    },
    {
      "id": "37",
      "text": "仡佬族"
    },
    {
      "id": "38",
      "text": "锡伯族"
    },
    {
      "id": "39",
      "text": "阿昌族"
    },
    {
      "id": "40",
      "text": "普米族"
    },
    {
      "id": "41",
      "text": "塔吉克族"
    },
    {
      "id": "42",
      "text": "怒族"
    },
    {
      "id": "43",
      "text": "乌孜别克族"
    },
    {
      "id": "44",
      "text": "俄罗斯族"
    },
    {
      "id": "45",
      "text": "鄂温克族"
    },
    {
      "id": "46",
      "text": "德昂族"
    },
    {
      "id": "47",
      "text": "保安族"
    },
    {
      "id": "48",
      "text": "裕固族"
    },
    {
      "id": "49",
      "text": "京族"
    },
    {
      "id": "50",
      "text": "塔塔尔族"
    },
    {
      "id": "51",
      "text": "独龙族"
    },
    {
      "id": "52",
      "text": "鄂伦春族"
    },
    {
      "id": "53",
      "text": "赫哲族"
    },
    {
      "id": "54",
      "text": "门巴族"
    },
    {
      "id": "55",
      "text": "珞巴族"
    },
    {
      "id": "56",
      "text": "基诺族"
    },
    {
      "id": "97",
      "text": "其他"
    },
    {
      "id": "98",
      "text": "外国血统中国籍人士"
    }
  ],
  // 文化程度
  "education": [
    {
      "id": "10",
      "text": "研究生教育"
    },
    {
      "id": "11",
      "text": "博士研究生毕业"
    },
    {
      "id": "12",
      "text": "博士研究生结业"
    },
    {
      "id": "13",
      "text": "博士研究生肄业"
    },
    {
      "id": "14",
      "text": "硕士研究生毕业"
    },
    {
      "id": "15",
      "text": "硕士研究生结业"
    },
    {
      "id": "16",
      "text": "硕士研究生肄业"
    },
    {
      "id": "17",
      "text": "研究生班毕业"
    },
    {
      "id": "18",
      "text": "研究生班结业"
    },
    {
      "id": "19",
      "text": "研究生班肄业"
    },
    {
      "id": "20",
      "text": "大学本科教育"
    },
    {
      "id": "21",
      "text": "大学本科毕业"
    },
    {
      "id": "22",
      "text": "大学本科结业"
    },
    {
      "id": "23",
      "text": "大学本科肄业"
    },
    {
      "id": "28",
      "text": "大学普通班毕业"
    },
    {
      "id": "30",
      "text": "大学专科教育"
    },
    {
      "id": "31",
      "text": "大学专科毕业"
    },
    {
      "id": "32",
      "text": "大学专科结业"
    },
    {
      "id": "33",
      "text": "大学专科肄业"
    },
    {
      "id": "40",
      "text": "中等职业教育"
    },
    {
      "id": "41",
      "text": "中等专科毕业"
    },
    {
      "id": "42",
      "text": "中等专科结业"
    },
    {
      "id": "43",
      "text": "中等专科肄业"
    },
    {
      "id": "44",
      "text": "职业高中毕业"
    },
    {
      "id": "45",
      "text": "职业高中结业"
    },
    {
      "id": "46",
      "text": "职业高中肄业"
    },
    {
      "id": "47",
      "text": "技工学校毕业"
    },
    {
      "id": "48",
      "text": "技工学校结业"
    },
    {
      "id": "49",
      "text": "技工学校肄业"
    },
    {
      "id": "50",
      "text": "高中以下"
    },
    {
      "id": "60",
      "text": "普通高级中学教育"
    },
    {
      "id": "61",
      "text": "普通高中毕业"
    },
    {
      "id": "62",
      "text": "普通高中结业"
    },
    {
      "id": "63",
      "text": "普通高中肄业"
    },
    {
      "id": "90",
      "text": "其他"
    },
    {
      "id": "91",
      "text": "中等师范学校（幼儿师范学校）毕业"
    },
    {
      "id": "92",
      "text": "中等师范学校（幼儿师范学校）结业"
    },
    {
      "id": "93",
      "text": "中等师范学校（幼儿师范学校）肄业"
    }
  ],
  // 宗教信仰
  "faith": [
    {
      "id": "00",
      "text": "无宗教信仰"
    },
    {
      "id": "10",
      "text": "佛教"
    },
    {
      "id": "20",
      "text": "喇嘛教"
    },
    {
      "id": "30",
      "text": "道教"
    },
    {
      "id": "40",
      "text": "天主教"
    },
    {
      "id": "50",
      "text": "基督教"
    },
    {
      "id": "60",
      "text": "东正教"
    },
    {
      "id": "70",
      "text": "伊斯兰教"
    },
    {
      "id": "99",
      "text": "其他"
    }
  ],
  colorOptions: [
    {
      "value": -1,
      "label": "不限"
    },
    {
      "value": 1,
      "label": "黑"
    },
    {
      "value": 2,
      "label": "白"
    },
    {
      "value": 3,
      "label": "灰"
    },
    {
      "value": 4,
      "label": "红"
    },
    {
      "value": 5,
      "label": "蓝"
    },
    {
      "value": 6,
      "label": "黄"
    },
    {
      "value": 7,
      "label": "橙"
    },
    {
      "value": 8,
      "label": "棕"
    },
    {
      "value": 9,
      "label": "绿"
    },
    {
      "value": 10,
      "label": "紫"
    },
    // {
    //   "value": 11,
    //   "label": "青"
    // },
    {
      "value": 12,
      "label": "粉"
    },
    {
      "value": 14,
      "label": "花"
    }
  ],
  //档案类型
  recordType: [
    {
      label: "常驻人口",
      value: "permanentPopulation",
      //TODO:CHANGE :
      // describtion: "多关键词检索姓名/证件号/标签/户籍地址/现住址，空格分隔",
      // showTab: false,
      describtion: "多关键词检索姓名/证件号/性别/车牌号码/户籍地址/现住址",
      showTab: true
    },
    {
      label: "抓拍聚类",
      value: "captureGroup",
      describtion: "多关键词检索姓名/证件号/标签/户籍地址/现住址，空格分隔",
      showTab: true
    },
    {
      label: "驾乘聚类",
      value: "driverGroup",
      describtion: "多关键词检索姓名/证件号/标签/户籍地址/现住址，空格分隔",
      showTab: true
    },
    {
      label: "车辆档案",
      value: "vehicleRecord",
      describtion: "多关键词检索车牌号码/车主姓名/车主证件号/标签，空格分隔",
      showTab: false
    }
  ],
  //档案检索基本信息nav栏
  recordNav: {
    baseInfo: {
      title: "基本信息",
      key: "baseInfo",
      children: [
        {
          "name": "personInfo",
          "text": "基本信息",
          required: true
        },
        {
          "name": "contactInfo",
          "text": "联系方式",
          required: true
        },
        {
          "name": "addressInfo",
          "text": "地址信息",
          required: true
        },
        {
          "name": "photoInfo",
          "text": "证件照",
          required: true
        },
        {
          "name": "carInfo",
          "text": "名下车辆",
          required: true
        },
        {
          "name": "illegalInfo",
          "text": "违法车辆"
        },
        {
          "name": "caseInfo",
          "text": "案件/警情"
        },
        {
          "name": "travelInfo",
          "text": "出行信息"
        },
        {
          "name": "hotelInfo",
          "text": "宾馆住宿"
        },
        {
          "name": "interInfo",
          "text": "网吧记录"
        }
      ]
    },
    analysis: {
      title: "关系分析",
      key: "analysis",
      children: [
        {
          name: "analysis",
          text: "关系分析"
        }
      ]
    },
    behavior: {
      title: "行为画像",
      key: "behavior",
      children: [
        {
          "name": "behavior",
          "text": "行为画像",
        }
      ]
    },
    relateInfo: {
      title: "关联人员",
      key: "relateInfo",
      children: [
        {
          name: "relateInfo",
          text: "关联人员"
        }
      ]
    },
    portrait: {
      title: "抓拍图像",
      key: "portrait",
      children: targetTypes.map(item => ({ name: item.value, text: item.label })).concat({ name: "gait", text: "步态" })
    },
    trace: {
      title: "行为轨迹",
      key: "trace",
      children: [
        {
          name: "mapTrace",
          text: "地图轨迹"
        }
      ]
    },
    optionLog: {
      title: "操作日志",
      key: "optionLog",
      children: [
        {
          name: "optionLog",
          text: "操作日志"
        }
      ]
    }


  },
  gaitFeature: [
    {
      "value": -1,
      "label": "不限"
    },
    {
      "value": 0,
      "label": "否"
    },
    {
      "value": 1,
      "label": "是"
    }
  ],
  ageRange: [
    {
      label: "未成年",
      range: ['0', '17']
    },
    {
      label: "中青年",
      range: ['18', '60']
    },
    {
      label: "老年",
      range: ['61',""]
    }
  ]
}
//画图工具
const drawTools: {
  icon: string;
  type: DrawType;
}[] = [
    {
      icon: 'zhuashou',
      type: 'default'
    },
    {
      icon: 'quanxuan',
      type: 'circle'
    },
    {
      icon: 'kuangxuan',
      type: 'rectangle'
    },
    {
      icon: 'zidingyi',
      type: 'polygon'
    },
    {
      icon: 'shanchu',
      type: 'clear'
    },
  ]

export default {
  ...character,
  drawTools
}
