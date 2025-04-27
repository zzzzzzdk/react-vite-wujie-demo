import React, { lazy } from "react";
import { LoaderFunction } from "react-router-dom";
import Home from "./Home";

export type BreadcrumbType = {
  text?: string;
  path?: string;
  target?: string;
};

export interface RoutesType {
  path?: string;
  element: React.LazyExoticComponent<(props: any) => JSX.Element> | (() => JSX.Element);
  children?: RoutesType[];
  loader?: LoaderFunction;
  index?: any;
  noNeedAuth?: Boolean;
  name?: string;
  text?: string;
  fixedTheme?: string;
  breadcrumb?: BreadcrumbType[];
  layout?: boolean;
}

/**
 *  @description  路由配置，菜单导航最多支持三级。
 *
 *  一、 path  路径； name 选中菜单的路径；fixedTheme 固定为某个主题
 *
 *  二、 单独布局的页面放到上面，不然会被其他路由拦截
 *
 * */

let routeData: RoutesType[] = [
  {
    path: "*",
    element: lazy(() => import("@/pages/_404")),
    noNeedAuth: true,
    breadcrumb: [
      {
        text: "404",
      },
    ],
  },
  {
    name: "login",
    text: "登录",
    path: "/login",
    noNeedAuth: true,
    element: lazy(() => import("@/pages/Login")),
    breadcrumb: [
      {
        text: "登录页",
      },
    ],
  },
  {
    name: "home",
    text: "首页",
    path: "/home",
    element: lazy(() => import("@/pages/Home")),
    breadcrumb: [
      {
        text: "首页",
      },
    ],
  },
  {
    path: "/",
    layout: true,
    element: lazy(() => import("@/pages/Layout")),
    noNeedAuth: true,
    children: [
      {
        index: true,
        name: "target",
        element: lazy(() => import("./Home")),
        breadcrumb: [
          {
            text: "首页",
          },
        ],
      },
      /** 检索 */
      {
        name: "target",
        text: "属性检索",
        path: "/target",
        element: lazy(() => import("@/pages/Search/Target")),
        breadcrumb: [
          {
            text: "目标检索",
          },
          {
            text: "属性检索",
          },
        ],
      },

      {
        name: "image",
        text: "以图检索",
        path: "/image",
        element: lazy(() => import("@/pages/Search/Image")),
        breadcrumb: [
          {
            text: "目标检索",
          },
          {
            text: "以图检索",
          },
        ],
      },
      {
        name: "cross",
        text: "跨镜追踪",
        path: "/cross",
        element: lazy(() => import("@/pages/Search/Cross")),
        breadcrumb: [
          {
            text: "目标检索",
          },
          {
            text: "跨镜追踪",
          },
        ],
      },
      {
        name: "real-time-tracking",
        text: "实时跨镜追踪",
        path: "/real-time-tracking",
        element: lazy(() => import("@/pages/Search/RealTimeTracking")),
        breadcrumb: [
          {
            text: "目标检索",
          },
          {
            text: "实时跨镜追踪",
          },
        ],
      },
      /** 解析管理 */
      {
        name: "offline",
        text: "1:1",
        path: "/offline",
        element: lazy(() => import("@/pages/Analysis/Offline")),
        breadcrumb: [
          {
            text: "解析管理",
          },
          {
            text: "离线数据分析",
          },
        ],
      },
      {
        name: "history",
        text: "1:1",
        path: "/history",
        element: lazy(() => import("@/pages/Analysis/History")),
        breadcrumb: [
          {
            text: "解析管理",
          },
          {
            text: "历史数据分析",
          },
        ],
      },
      {
        name: "one2one",
        text: "1:1",
        path: "/one2one",
        element: lazy(() => import("@/pages/Analysis/One2One")),
        breadcrumb: [
          {
            text: "解析管理",
          },
          {
            text: "目标1:1比对",
          },
        ],
      },
      {
        name: "n2n",
        text: "1:1",
        path: "/n2n",
        element: lazy(() => import("@/pages/Analysis/N2N")),
        breadcrumb: [
          {
            text: "解析管理",
          },
          {
            text: "人脸N:N比对",
          },
        ],
      },
      {
        /* n2n任务结果 */
        name: "n2n-result",
        text: "n2n-result",
        path: "/n2n-result",
        element: lazy(() => import("@/pages/Analysis/N2N/TaskResult")),
        breadcrumb: [
          {
            text: "解析管理",
          },
          {
            text: "人脸N:N比对",
          },
          {
            text: "任务结果",
          },
        ],
      },
      /* 布控告警 */
      {
        name: "deploy",
        text: "目标布控",
        path: "/deploy/:jobId?",
        element: lazy(() => import("@/pages/Deploy/Deploy")),
        breadcrumb: [
          {
            text: "布控告警",
          },
          {
            text: "目标布控",
          },
        ],
      },
      {
        name: "deploy-detail",
        text: "布控明细",
        path: "/deploy-detail",
        element: lazy(() => import("@/pages/Deploy/DeployDetail")),
        breadcrumb: [
          {
            text: "布控告警",
          },
          {
            text: "布控明细",
          },
        ],
      },
      {
        name: "deployment",
        text: "布控单明细",
        path: "/deployment/:jobId",
        element: lazy(() => import("@/pages/Deploy/Deployment")),
        breadcrumb: [
          {
            text: "布控告警",
          },
          {
            text: "布控单明细",
          },
        ],
      },
      {
        name: "deploy-warning",
        text: "告警历史",
        path: "/deploy-warning/:jobId?",
        element: lazy(() => import("@/pages/Deploy/DeployWarning")),
        breadcrumb: [
          {
            text: "布控告警",
          },
          {
            text: "告警历史",
          },
        ],
      },
      {
        name: "warning-detail",
        text: "告警详情",
        path: "/warning-detail/:infoId",
        element: lazy(() => import("@/pages/Deploy/WarningDetail")),
        breadcrumb: [
          {
            text: "布控告警",
          },
          {
            text: "告警详情",
          },
        ],
      },
      {
        name: "cluebank",
        text: "线索库",
        path: "/cluebank",
        element: lazy(() => import("@/pages/ClueBank")),
        breadcrumb: [
          {
            text: "线索库",
          },
        ],
      },
      {
        name: "upload",
        text: "大文件分片上传",
        path: "upload",
        element: lazy(() => import("@/pages/Upload")),
        breadcrumb: [
          {
            text: "大文件分片上传",
          },
        ],
      },
      {
        name: "errorTest",
        text: "错误页面跳转",
        path: "errorTest",
        element: lazy(() => import("@/pages/ErrorTest")),
        breadcrumb: [
          {
            text: "错误页面跳转",
          },
        ],
      },
      // 研判
      {
        path: "/foothold-vehicle",
        text: "落脚点分析",
        name: "foothold-vehicle",
        element: lazy(() => import("@/pages/VehicleAnalysis/Foothold")),
        breadcrumb: [
          {
            text: "车辆研判",
          },
          {
            text: "落脚点分析",
          },
        ],
      },
      {
        path: "/foothold-person",
        text: "落脚点分析",
        name: "foothold-person",
        element: lazy(() => import("@/pages/PersonAnalysis/Foothold")),
        breadcrumb: [
          {
            text: "人员研判",
          },
          {
            text: "落脚点分析",
          },
        ],
      },
      {
        path: "/doublecar",
        text: "双胞胎车",
        name: 'doublecar',
        element: lazy(() => import('@/pages/VehicleAnalysis/Doublecar')),
        breadcrumb: [
          {
            text: "车辆研判"
          }, {
            text: '双胞胎车'
          }
        ]
      },
      {
        path: "/active-night",
        text: "昼伏夜出",
        name: 'active-night',
        element: lazy(() => import('@/pages/VehicleAnalysis/ActiveNight')),
        breadcrumb: [
          {
            text: "车辆研判"
          }, {
            text: '昼伏夜出'
          }
        ]
      },
      {
        path: "/frepass",
        text: "频繁过车",
        name: 'frepass',
        element: lazy(() => import('@/pages/VehicleAnalysis/FrePass')),
        breadcrumb: [
          {
            text: "车辆研判"
          }, {
            text: '频繁过车'
          }
        ]
      },
      {
        path: "/vehicle-peer",
        text: "同行分析",
        name: "vehicle-peer",
        element: lazy(() => import("@/pages/VehicleAnalysis/Peer")),
        breadcrumb: [
          {
            text: "车辆研判",
          },
          {
            text: "同行分析",
          },
        ],
      },
      {
        path: "/face-peer",
        text: "同行分析",
        name: "face-peer",
        element: lazy(() => import("@/pages/VehicleAnalysis/Peer")),
        breadcrumb: [
          {
            text: "人员研判",
          },
          {
            text: "同行分析",
          },
        ],
      },
      {
        path: "/initial",
        text: "初次入城",
        name: "initial",
        element: lazy(() => import("@/pages/VehicleAnalysis/Initial")),
        breadcrumb: [
          {
            text: "车辆研判",
          },
          {
            text: "初次入城",
          },
        ],
      },
      {
        path: "/vehicle-multipoint",
        text: "多点碰撞",
        name: 'vehicle-multipoint',
        element: lazy(() => import('@/pages/VehicleAnalysis/Multipoint')),
        breadcrumb: [
          {
            text: "车辆研判"
          },
          {
            text: "多点碰撞"
          }
        ]
      },
      {
        path: "/vehicle-fake",
        text: "假牌车",
        name: 'vehicle-fake',
        element: lazy(() => import('@/pages/VehicleAnalysis/FakeCloneVehicle')),
        breadcrumb: [
          {
            text: "车辆研判"
          },
          {
            text: "假牌车"
          }
        ]
      },
      {
        path: "/vehicle-clone",
        text: "套牌车",
        name: 'vehicle-clone',
        element: lazy(() => import('@/pages/VehicleAnalysis/FakeCloneVehicle')),
        breadcrumb: [
          {
            text: "车辆研判"
          },
          {
            text: "套牌车"
          }
        ]
      },
      {
        path: "/person-multipoint",
        text: "多点碰撞",
        name: 'person-multipoint',
        element: lazy(() => import('@/pages/PersonAnalysis/Multipoint')),
        breadcrumb: [
          {
            text: "人员研判"
          },
          {
            text: "多点碰撞"
          }
        ]
      },
      {
        path: "/vehicle-track",
        text: "轨迹重现",
        name: 'vehicle-track',
        element: lazy(() => import('@/pages/VehicleAnalysis/Track')),
        breadcrumb: [
          {
            text: "车辆研判"
          },
          {
            text: "轨迹重现"
          }
        ]
      },
      {
        path: "/person-track",
        text: "轨迹重现",
        name: 'person-track',
        element: lazy(() => import('@/pages/PersonAnalysis/Track')),
        breadcrumb: [
          {
            text: "人员研判"
          },
          {
            text: "轨迹重现"
          }
        ]
      },
      {
        path: "/record-detail-person",
        text: "档案详情",
        name: 'record-search',
        // element: lazy(() => import('@/pages/record/list')),
        element: lazy(() => import('@/pages/Search/record/detail')),
        breadcrumb: [
          {
            text: "目标检索"
          },
          {
            text: "档案检索",
            path: '/record-search'
          },
          {
            text: "档案检索结果"
          },
          {
            text: "人员档案详情"
          },
        ]
      },
      {
        path: "/record-detail-vehicle",
        text: "档案详情",
        name: 'record-search',
        // element: lazy(() => import('@/pages/record/list')),
        element: lazy(() => import('@/pages/Search/record/VehicleDetails')),
        breadcrumb: [
          {
            text: "目标检索"
          },
          {
            text: "档案检索",
            path: '/record-search'
          },
          {
            text: "档案检索结果"
          },
          {
            text: "车辆档案详情"
          },
        ]
      },
      {
        path: "/record-list",
        text: "人员档案",
        name: 'record-search',
        // element: lazy(() => import('@/pages/record/list')),
        element: lazy(() => import('@/pages/Search/record/list')),
        breadcrumb: [
          {
            text: "目标检索"
          },
          {
            text: "档案检索",
            path: '/record-search'
          },
          {
            text: "检索结果"
          },
        ]
      },
      // {
      //   path: "/record-num",
      //   text: "人员档案",
      //   name: 'record-search',
      //   // element: lazy(() => import('@/pages/record/list')),
      //   element: lazy(() => import('@/pages/Search/record/RecordNum')),
      //   breadcrumb: [
      //     {
      //       text: "目标检索"
      //     },
      //     {
      //       text: "档案检索"
      //     },
      //     {
      //       text: "档案统计"
      //     }
      //   ]
      // },
      {
        path: "/record-search",
        text: "人员档案",
        name: 'record-search',
        // element: lazy(() => import('@/pages/record/list')),
        element: lazy(() => import('@/pages/Search/record/search')),
        breadcrumb: [
          {
            text: "目标检索"
          },
          {
            text: "档案检索"
          }
        ]
      },
      {
        path: "/label-manage",
        text: "标签管理",
        name: "label-manage",
        // element: lazy(() => import('@/pages/record/list')),
        element: lazy(() => import('@/pages/Search/record/LabelManage')),
        breadcrumb: [
          {
            text: "目标检索"
          },
          {
            text: "标签管理"
          }
        ]
      },
      {
        path: '/auth-approve',
        text: "权限审批",
        name: 'record-search',
        element: lazy(() => import('@/pages/Search/record/AuthApprove')),
        breadcrumb: [
          {
            text: "目标检索"
          },
          {
            text: "档案检索",
            path: '/record-search'
          },
          {
            text: "权限审批"
          }
        ]
      },
      {
        name: 'create-track',
        text: "生成轨迹",
        path: "/create-track",
        element: lazy(() => import("@/pages/CreateTrack")),
        breadcrumb: [
          {
            text: "生成轨迹",
          },
        ],
      },
      {
        name: 'regional-mapping',
        text: "区域摸排",
        path: "/regional-mapping",
        element: lazy(() => import("@/pages/PersonAnalysis/RegionalMapping")),
        breadcrumb: [
          {
            text: "人员研判",
          },
          {
            text: "区域摸排",
          },
        ],
      },

      /** ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑页面路由上边写↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */
      {
        path: "403",
        text: "403",
        name: "403",
        element: lazy(() => import("@/pages/_403")),
        noNeedAuth: true,
        breadcrumb: [
          {
            text: "403",
          },
        ],
      },
      {
        path: "demo",
        text: "demo",
        name: "demo",
        element: lazy(() => import("@/pages/Demo")),
        noNeedAuth: true,
        breadcrumb: [
          {
            text: "demo",
          },
        ],
      },
    ],
  },
];



export default routeData;
