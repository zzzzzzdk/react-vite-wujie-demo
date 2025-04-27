import React, { useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setRouterData, setSkin } from '@/store/slices/comment';
import {
  HashRouter,
  Navigate,
  RouteObject,
  useLocation,
} from 'react-router-dom'
import store from "@/store";

const useBreadcrumb = () => {
 const location = useLocation()
  // const routerData = useSelector((state) => {
  //   return state.comment.routerData
  // });
  const routerData = store.getState().comment.routerData

  const dispatch = useDispatch()

  const pushHandel = (text) => {
    const routerData = store.getState().comment.routerData
    dispatch(setRouterData({
      ...routerData,
      breadcrumb: [...routerData.breadcrumb, { text: text }]
    }))
  }


  const backHandel = useCallback(() => {
    dispatch(setRouterData({
      ...routerData,
      breadcrumb: routerData.breadcrumb.slice(0, routerData.breadcrumb.length - 1)
    }))
  }, [routerData])


  return {
    pushHandel,
    backHandel
  }

}

export default useBreadcrumb