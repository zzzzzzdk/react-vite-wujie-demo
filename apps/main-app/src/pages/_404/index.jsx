import React from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ErrorPage } from '@/components'
import findHomePath from "@/utils/findHomePath";

function _404(props) {

  const routes = useSelector((state) => {
    return state.user.route
  })
  const menuData = useSelector((state) => {
    return state.user.menu
  })


  const navigate = useNavigate()

  const goHome = () => {
    const homePath = findHomePath(menuData)
    navigate(homePath)
  }

  return <ErrorPage showJump={routes.length} jumpPage={goHome} type='404' />
}

export default _404
