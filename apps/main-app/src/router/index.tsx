import React, { Suspense } from 'react';
import RouteGuard from './RouteGuard';
import { createHashRouter, RouterProvider, RouteObject } from 'react-router-dom';
import { Loading } from '@yisa/webui';
import { getToken } from '@/utils/cookie';
import { mainAppRoutes, RoutesType } from '@/config/routes.config';
import { ErrorBoundary, MicroApp } from '@/components';
import { useSelector, RootState } from '@/store';
import { ItemMenu } from '@/store/slices/user';

const RouteElement = (menuData: ItemMenu[]) => {
  const flatMenuData = menuData.reduce((acc: ItemMenu[], item: ItemMenu) => {
    acc.push(item);
    if (item.children && item.children.length > 0) {
      acc.push(...item.children);
    }
    return acc;
  }, []);

  // 处理微应用路由
  const processMicroApps = (routes: RoutesType[]): RoutesType[] => {
    const newRoutes = [...routes];

    // 处理需要替换主应用路由的微应用
    flatMenuData.forEach((menuItem) => {
      // 如果导航有微应用配置，则添加微应用路由
      if (menuItem.micro) {
        const microApp = menuItem.micro;

        if (menuItem.micro.embedType === 'inlayout' || menuItem.micro.embedType === 'partial') {
          // 查找并替换主应用路由
          const replaceRoute = (routes: RoutesType[]): boolean => {
            for (let i = 0; i < routes.length; i++) {
              const route = routes[i];
              if (route.path === menuItem.path) {
                if (menuItem.micro?.embedType === 'inlayout') {
                  route.element = () => (
                    <MicroApp
                      microAppConfig={{
                        ...microApp as any,
                        baseRouter: microApp.path? '' : microApp.baseroute,
                      }}
                    />
                  );
                }
                route.isMicroApp = true;
                route.microAppConfig = microApp;
                return true;
              }
              if (route.children && replaceRoute(route.children)) {
                return true;
              }
            }
            return false;
          };

          replaceRoute(newRoutes);
        }
        if (menuItem.micro.embedType === 'outlayout') {
          // 添加独立大屏微应用路由
          newRoutes.push({
            path: menuItem.path || microApp.baseroute + '/*',
            element: () => (
              <MicroApp
                microAppConfig={{
                  ...microApp as any,
                  baseRouter: microApp.path? '' : microApp.baseroute,
                }}
              />
            ),
            isMicroApp: true,
            microAppConfig: microApp,
            noNeedAuth: true,
          });
        }
      }
    });

    return newRoutes;
  };

  // 转换路由配置为React Router格式
  const syncRouter = (arr: RoutesType[]): RouteObject[] => {
    return arr.map((route) => ({
      ...route,
      element: (
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            {route.noNeedAuth ? (
              <route.element currentMenu={route} />
            ) : (
              <RouteGuard routeItem={route}>
                <route.element  currentMenu={route}/>
              </RouteGuard>
            )}
          </Suspense>
        </ErrorBoundary>
      ),
      children: route.children && syncRouter(route.children),
    }));
  };

  const processedRoutes = processMicroApps(mainAppRoutes);
  const router = createHashRouter(syncRouter(processedRoutes));

  return router;
};

export default function APPRouter() {
  const menuData = useSelector((state: any) => {
    return state.user.menu;
  });

  return <RouterProvider router={RouteElement(menuData)} />;
}
