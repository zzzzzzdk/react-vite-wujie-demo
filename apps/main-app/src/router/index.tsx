import React, { Suspense, useState } from 'react'
import RouteGuard from './RouteGuard';
import {
  createHashRouter,
  RouterProvider,
  HashRouter,
  RouteObject,
  useRoutes,
} from 'react-router-dom'
import { Loading } from '@yisa/webui';
import { getToken, setToken } from '@/utils/cookie'
import routeData, { RoutesType } from './router.config'
import { ErrorBoundary } from '@/components';

type microItem = {
  path?: string;
  baseroute?: string;
  url: string;
  name: string;
  inLayout: boolean
}

const RouteElement = () => {
  let newRouteData = [...routeData]
  // 微前端嵌入路由
  let ninLayoutRoutes: microItem[] = [], noutLayoutRoutes: microItem[] = []
  if (window.YISACONF.micro_data && window.YISACONF.micro_data.length) {
    ninLayoutRoutes = window.YISACONF.micro_data.filter((item) => item.inLayout)
    noutLayoutRoutes = window.YISACONF.micro_data.filter((item) => !item.inLayout)
  }

  if (ninLayoutRoutes.length) {
    newRouteData.forEach(item => {
      if (item.layout) {
        const extraArr = ninLayoutRoutes.map(route => {
          return (
            {
              name: route.name,
              text: "首页",
              path: route.path || route.baseroute + '/*',
              element: () => (<micro-app name={route.name} url={route.url} baseroute={route.path ? '' : route.baseroute}></micro-app>),
              breadcrumb: [
                {
                  text: "首页",
                },
              ],
            }
          )
        })
        item.children = [...(item.children ?? []), ...extraArr]
      }
    })
  }

  if (noutLayoutRoutes.length) {
    const extraArr = noutLayoutRoutes.map(route => {
      return (
        {
          name: route.name,
          text: "首页",
          path: route.path || route.baseroute + '/*',
          element: () => (<micro-app name={route.name} url={route.url} baseroute={route.path ? '' : route.baseroute}> </micro-app>),
          breadcrumb: [
            {
              text: "首页",
            },
          ],
        }
      )
    })
    newRouteData = [...newRouteData, ...extraArr]
  }
  const syncRouter = (arr: RoutesType[]): RouteObject[] => {
    let routes: RouteObject[] = []
    arr.forEach(route => {
      const newRoute = {
        ...route,
        element: (
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              {
                route.noNeedAuth ?
                  <route.element />
                  :
                  <RouteGuard routeItem={route}>
                    <route.element />
                  </RouteGuard>
              }
            </Suspense>
          </ErrorBoundary>
        ),
        children: route.children && syncRouter(route.children)
      }
      routes.push(newRoute)
    })

    return routes
  }

  // const element = useRoutes(syncRouter(routeData))
  // console.log(newRouteData)
  const element = createHashRouter(syncRouter(newRouteData))
  return (
    element
  )
}



export default function APPRouter() {
  // 本地环境模拟登录时token
  if (process.env.NODE_ENV === "development") {
    // setToken('2vb1hj5ft8evs241r4h2siqp78----fronted---token', 88640000)
  }

  return (
    // <HashRouter>
    //   <RouteElement />
    // </HashRouter>
    <RouterProvider router={RouteElement()} />
  )
}