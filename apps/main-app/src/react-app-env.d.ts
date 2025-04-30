/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace JSX {
  interface IntrinsicElements {
    'micro-app': AppInterface;
  }
}
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare interface Window {
  ccTheme: unknown;
  systemSkinKey: string;
  YISACONF: {
    sys: string;
    sys_text: string;
    api_host: string;
    login_url: string;
    manageUrl: string;
    iam_url: string;
    das_url: string;
    sysType?: string;
    circle_text?: string;
    map: {
      center: Array;
      zoom: number;
      scaleZoom: number;
      zooms: Array;
      mapTileType: string;
      mapCRS: string;
      mapTileHost: string;
      slName: string;
      wxName: string;
      mapTileTemplate: string;
      mapTileOptions: {
        minZoom: number;
        maxZoom: number;
        mapTileHost: string
        wxMapTileHost: string;
      }
    };
    xpChromeUrl: string;
    win7ChromeUrl: string;
    accountExcelUrl: string;
    appDownloadUrl: string;
    realTimeSocketUrl: string;
    yisalab: string;
    editPwdUrlApi?: string;
    messageConst: {
      wssUrl: string;
      getNewsList: string;
      getNewsHistoryList: string;
      getContactList: string;
      createGroupUrl: string;
      checkFileUrl: string;
      uploadChunkUrl: string;
      getGroupList: string;
      getDepartmentInfo: string;
      editGroupUrl: string;
      exitGroupUrl: string;
    };
    color?: string;
    layout?: string;
    plateExcelUrl?: string;
    licenseExcelUrl?: string;
    pdm_host?: string;
    iam_host?: string;
    shelvesUrl?: string;
    logout_url: string;
    staticUrl?: string;
    websocketUrl?: string;
    homepageWsUrl?: string;
    systemControl?: {
      type?: 'face' | 'vehicle' | 'fusion3';
      targetTypeConfig?: string[];
      deployTypeConfig?: string[];
      analysisTypeConfig?: string[];
    };
    gaitListMouseMoveCount?: number;
    province: string;
    province_plate: string[];
    //人员共性分析最大数量
    commonalityAnalysisCount: number;
    // 证书登录地址
    certificate_url: string;
    // 微前端路由数据
    micro_data: {
      url: string;
      baseroute: string;
      name: string;
      inLayout: boolean
    }[];
  }
  Hls: unknown;
  cancelTokens: CancelTokenSource[];
}


declare let createIS: any;
declare let pubKeyUrl: string
declare let yscUrl: string
declare let globalErrorUrl: string
declare let globalLoginUrl: string

declare module '@yisa/yisa-map'
declare module '@yisa/LightCanvasMarkersLayer'
declare module 'js-cookie'
declare module 'flex-gap-polyfill'
