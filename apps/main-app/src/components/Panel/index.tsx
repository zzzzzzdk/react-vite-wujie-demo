import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, Ref } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@yisa/webui/es/Icon'
import cn from 'classnames'
import { CSSTransition } from 'react-transition-group';
import useMeasure from 'react-use-measure'
import { useSpring, animated, config } from "react-spring"
import CollapseProps from './interface'
import './index.scss'

export default React.forwardRef (function Panel(props: CollapseProps,ref:React.ForwardedRef<HTMLElement>) {
  const {
    className = "",
    headerSlot,
    title = "标题",
    showTitleIcon = true,
    children
  } = props
  const prefixCls = 'yisa-panel'

  return (
    <div className={`${prefixCls} ${className}`}>
      {
        headerSlot || (
          <header className={`${prefixCls}-header`}>
            <span className={cn(`${prefixCls}-header-title`, { "title-icon": showTitleIcon })}>{title}</span>
          </header>
        )
      }
      <main className={`${prefixCls}-container`} ref={ref}>
        {children}
      </main>
    </div>
  )
})
