import React, { useEffect } from 'react';
import WujieReact from 'wujie-react';
import { useSelector, RootState } from "@/store";

export interface microAppConfigPorps {
  baseRouter?: string;
  height: string;
  width: string;
  name: string;
  loading: React.ReactNode;
  url: string;
  alive: boolean;
  fetch: () => void;
  props: object;
  attrs: object;
  replace: () => void;
  sync: boolean;
  prefix: object;
  fiber: boolean;
  degrade: boolean;
  plugins: string[];
  beforeLoad: () => void;
  beforeMount: () => void;
  afterMount: () => void;
  beforeUnmount: () => void;
  afterUnmount: () => void;
  activated: () => void;
  deactivated: () => void;
  loadError: () => void;
}

const { bus } = WujieReact;

// 定义微前端应用组件
interface MicroAppProps {
  // appName: string; // 微前端应用的名称
  microAppConfig: microAppConfigPorps; // 传递给微前端应用的参数
}

const MicroApp: React.FC<MicroAppProps> = ({ microAppConfig }) => {
  const userInfo = useSelector((state: any) => {
    return state.user.userInfo
  });

  useEffect(() => {
    // 主应用监听事件
    bus.$on('事件名字', function (arg1: any) {});
    // 主应用发送事件
    bus.$emit('userInfo', userInfo);
    // 主应用取消事件监听
    // bus.$off("事件名字", function (arg1, arg2, ...) {});
  }, []);

  return (
    <WujieReact
      // @ts-ignore
      name={microAppConfig.name}
      url={microAppConfig.url}
      sync={microAppConfig.sync || true}
      props={{
        baseRouter: microAppConfig.baseRouter || '',
        eventBus: {
          onAppMounted: () => console.log(`${microAppConfig.name} mounted`),
          onAppUnmounted: () => console.log(`${microAppConfig.name} unloaded`),
        },
      }}
    />
  );
};

export default MicroApp;
