import React from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ErrorPage } from '@/components'
import findHomePath from "@/utils/findHomePath";

function _403(props) {

  const routes = useSelector((state) => {
    return state.user.route
  })
  const menuData = useSelector((state) => {
    return state.user.menu
  })

  const navigate = useNavigate();

  const goHome = () => {
    const homePath = findHomePath(menuData)
    navigate(homePath)
  }

  const textStyle = {
    textAlign: 'center',
    color: 'var(--errorpage-tip-color)',
    fontSize: '18px',
    letterSpacing: '2px',
    marginTop: '-60px'
  }

  return (
    <>
      <ErrorPage showJump={routes.length} jumpPage={goHome} type='403' />
      {
        !routes.length ?
          <div className="no-menu" style={textStyle}>无导航数据</div>
          : ''
      }
    </>
  )
}

export default _403
