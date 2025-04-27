import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, Ref } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@yisa/webui/es/Icon'
import cn from 'classnames'
import { CSSTransition } from 'react-transition-group';
import useMeasure from 'react-use-measure'
import { useSpring, animated, config } from "react-spring"
import CollapseProps, { CollapseRef } from './interface'
import './index.scss'

export default forwardRef<CollapseRef, CollapseProps>(function Collapse(props, ref) {
  const {
    headerSlot,
    title = "档案信息",
    showTitleIcon = true,
    showButton = true,
    collapse = false,
    children
  } = props
  const prefixCls = 'yisa-collapse'

  const [isCollapsed, setIsCollapsed] = useState(collapse);
  const [containerRef, boundsElem] = useMeasure();

  const togglePanel = () => {
    setIsCollapsed((prevState) => !prevState);
  };
  //内容区高度
  const panelContentAnimatedStyle = useSpring({
    height: isCollapsed ? 0 : boundsElem.height,
    // config:config.default { mass: 1, tension: 170, friction: 26 }
  });
  useImperativeHandle(ref, () => ({
    collapse() {
      if (isCollapsed) return
      togglePanel()
    },
    expand() {
      if (!isCollapsed) return
      togglePanel()
    }
  }))

  return (
    <div className={prefixCls}>
      {
        headerSlot || (
          <header className={`${prefixCls}-header`}>
            <span className={cn(`${prefixCls}-header-title`, { "title-icon": showTitleIcon })}>{title}</span>
            {
              showButton && <span className={`${prefixCls}-header-button`} onClick={togglePanel}>
                <span>{isCollapsed ? "展开" : "收起"}</span>
                <span className={cn({ "expand": isCollapsed })}><CaretUpOutlined /></span>
              </span>
            }
          </header>
        )
      }
      <animated.div
        style={panelContentAnimatedStyle}
        className={`${prefixCls}-wrapper`}
      >
        <div ref={containerRef}>
          {children}
        </div>
      </animated.div>
    </div>
  )
})
