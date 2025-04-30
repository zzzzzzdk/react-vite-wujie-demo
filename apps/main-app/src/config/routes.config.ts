import React, { lazy, ComponentType } from "react";
import { LoaderFunction } from "react-router-dom";
import { MicroAppConfig } from "@/store/slices/user";

export type BreadcrumbType = {
  text?: string;
  path?: string;
  target?: string;
};



export interface RoutesType {
  path?: string;
  element: React.LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  children?: RoutesType[];
  loader?: LoaderFunction;
  index?: any;
  noNeedAuth?: Boolean;
  name?: string;
  text?: string;
  fixedTheme?: string;
  breadcrumb?: BreadcrumbType[];
  layout?: boolean;
  isMicroApp?: boolean; // 是否是微应用路由
  microAppConfig?: MicroAppConfig; // 微应用配置
}

// 主应用路由配置
export const mainAppRoutes: RoutesType[] = [
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
        element: lazy(() => import("@/router/Home")),
        breadcrumb: [
          {
            text: "首页",
          },
        ],
      },
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
        path: "/demo",
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
      {
        path: "/demo1",
        text: "demo1",
        name: "demo1",
        element: lazy(() => import("@/pages/Demo1")),
        noNeedAuth: true,
        breadcrumb: [
          {
            text: "demo1",
          },
        ],
      },
      {
        path: "/demo2",
        text: "demo2",
        name: "demo2",
        element: lazy(() => import("@/pages/Demo2")),
        noNeedAuth: true,
        breadcrumb: [
          {
            text: "demo2",
          },
        ],
      },
    ],
  },
];