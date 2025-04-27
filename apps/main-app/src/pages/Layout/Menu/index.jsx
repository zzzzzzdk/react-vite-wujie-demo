import React, { useEffect, useRef, useState, createRef } from 'react'
import { Link } from "react-router-dom";
import Menu from './Menu';
import { useSelector } from "react-redux";


export default (pros) => {

  const {
    type,
    onCollapsed,
    collapsed,
    hovering,
    onHoverChange,
    width = "268px",
  } = pros

  const isFirst = useRef(true)

  const [openKeys, setOpenKeys] = useState([])

  const menus = useSelector((state) => {
    return state.user.menu
  });

  const activeKey = useSelector((state) => {
    return state.comment.routerData.name
  });

  const rec = (data) => {
    data.forEach(item => {
      item.title = item.text
      item.nodeRef = createRef(null)

      if (item.children && item.children.length) {
        item.children = rec(item.children)
      }
    })
    return data
  }

  const stateMenu = rec(JSON.parse(JSON.stringify(menus)))

  useEffect(() => {
    if (isFirst.current && activeKey && menus.length) {
      isFirst.current = false
      try {
        menus.forEach((item, index) => {
          if (item.children && item.children.length) {
            item.children.forEach((item2) => {
              if (item2.path == activeKey) {
                setOpenKeys([`/${item.path}`])
              }
              if (item2.children && item2.children.length) {
                item2.children.forEach((item3) => {
                  if (item3.path == activeKey) {
                    setOpenKeys([`/${item.path}`])
                  }
                })
              }
            })
          }
        })
      } catch (error) {
      }
    }
  }, [activeKey])

  return (
    <Menu
      hover
      width={width}
      openKeys={openKeys}
      data={stateMenu}
      type={type}
      link={Link}
      // onCollapsed={onCollapsed}
      inlineCollapsed={collapsed}
      activeKey={"/" + activeKey}
      onFixed={onCollapsed}
      hovering={hovering}
      onHoverChange={onHoverChange}
      mouseLeaveTime={0}
    />
  )
}
