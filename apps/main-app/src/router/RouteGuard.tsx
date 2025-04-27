import React, { Suspense, useEffect, useState, useRef } from 'react'
import {
  HashRouter,
  Navigate,
  RouteObject,
  useLocation,
} from 'react-router-dom'
import { useSelector, RootState, useDispatch } from "@/store";
import { getToken } from '@/utils/cookie'
import { RoutesType } from './router.config'
import { setRouterData, setSkin } from '@/store/slices/comment';

/**
 * 路由守卫
 */
const RouteGuard = (props: { children: React.ReactNode, routeItem: RoutesType }): JSX.Element => {
  const { children, routeItem } = props
  const location = useLocation()
  const dispatch = useDispatch()  
  const routes = useSelector((state: RootState) => {
    return state.user.route
  })
  const skin = useSelector((state: RootState) => {
    return state.comment.skin
  });

  const pageData = useRef({
    oldSkin: '',
  })

  // 组件渲染之前
  const beforeEach = () => {

    // 滚动条回到顶部
    try {
      document.getElementsByClassName('ysd-layout-horizontal-top-content-body')[0].scrollTop = 0
    } catch (error) {
    }
    try {
      document.getElementsByClassName('ysd-layout-vertical-top-right-content-body')[0].scrollTop = 0
    } catch (error) {
    }

    // 需要修改面包屑的
    let datas = JSON.parse(JSON.stringify(routeItem))
    dispatch(setRouterData(datas))


    // 固定主题
    if (routeItem.fixedTheme) {
      pageData.current.oldSkin = skin
      dispatch(setSkin(routeItem.fixedTheme))
      try {
        (document.getElementById('pifu-setting') as HTMLDivElement).style.display = 'none'
      } catch (error) {
      }
    }

  }


  // 组件销毁之前
  const afterEach = () => {


    // 还原主题
    if (routeItem.fixedTheme) {
      try {
        (document.getElementById('pifu-setting') as HTMLDivElement).style.display = 'block'
      } catch (error) { }
      dispatch(setSkin(pageData.current.oldSkin))
    }
  }

  useEffect(() => {
    const isLoggedIn = getToken()
    if (!isLoggedIn) {
      window.location.href = window.YISACONF.login_url + '&target_url=' + window.location.href
    }

    beforeEach()
    return (() => {
      afterEach()
    })
  }, [location])

  let hasAuth = true
  if (routeItem.name) {
    hasAuth = routes.includes(routeItem.name)
  }
  // debugger
  return (
    hasAuth ?
      <>{children}</>
      :
      <Navigate to="/403" />
  )
}

export default RouteGuard