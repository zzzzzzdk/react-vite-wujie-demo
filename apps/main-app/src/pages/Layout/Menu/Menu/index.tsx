import React, { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { MenuProps } from './interface'
import MenuContext from './Context'
import { getPrefixCls } from '@/config'
import Vertical from './vertical'
import Horizontal from './horizontal'
import './index.scss'
import { useDispatch } from '@/store'
import { setVerticalFixed } from '@/store/slices/vertical';

const Menu = (props: MenuProps) => {

  const {
    type = 'vertical',
    activeKey,
    data = [],
    onChange,
    onOpen,
    onCollapsed,
    className,
    link,
    openKeys = [],
    inlineCollapsed = false,
    hover = false,
    width = '60px',
    fixed = false,
    hovering = false,
    onHoverChange,
    onFixed,
    mouseLeaveTime = 300,
    ...otherProps
  } = props

  const dispatch = useDispatch()

  const wapref = useRef<any>()

  const timer = useRef<any>()

  const prefixCls = getPrefixCls('menu')

  const [innerInlineCollapsed, setInnerInlineCollapsed] = useState(hover ? !fixed ? true : false : inlineCollapsed)

  const [innerOpenKeys, setInnerOpenKeys] = useState(openKeys)

  const [innerActiveKey, setInnerActiveKey] = useState(activeKey)

  const [innerFixed, setInnerFixed] = useState(fixed)

  const [activePath, setActivePath] = useState(['', '', '', ''])

  const [horizontalData, setHorizontalData] = useState({
    data1: [],
    data2: [],
    enable: false,
    index: 0
  })

  const innerOnChange = (key: string) => {
    if (!('activeKey' in props)) {
      setInnerActiveKey(key)
    }
    onChange?.(key)
  }

  const innerOpen = (key: string) => {
    const keys = [...innerOpenKeys]
    const index = keys.indexOf(key)
    if (index >= 0) {
      keys.splice(index, 1)
    } else {
      keys.push(key)
    }
    setInnerOpenKeys(keys)
    onOpen?.(keys)
  }

  const onCollapsedChange = () => {
    const tag = !innerInlineCollapsed
    setInnerInlineCollapsed(tag)
    onCollapsed?.(tag)
  }

  useEffect(() => {
    if (JSON.stringify(openKeys) !== JSON.stringify(innerOpenKeys)) {
      setInnerOpenKeys(openKeys)
    }
  }, [JSON.stringify(openKeys)])

  useEffect(() => {
    if (activeKey !== innerActiveKey) {
      setInnerActiveKey(activeKey)
    }
  }, [activeKey])

  useEffect(() => {
    const arr = ['', '', '', '']
    data.forEach((item: any, index: any) => {
      if (item.path == innerActiveKey) {
        arr[0] = item.path
        if (horizontalData.enable && index >= horizontalData.index) {
          arr[3] = '__els'
        }
      }
      if (item.children && item.children.length) {
        item.children.forEach((item2: any) => {
          if (item2.path == innerActiveKey) {
            arr[0] = item.path
            arr[1] = item2.path
            if (horizontalData.enable && index >= horizontalData.index) {
              arr[3] = '__els'
            }
          }

          if (item2.children && item2.children.length) {
            item2.children.forEach((item3: any) => {
              if (item3.path == innerActiveKey) {
                arr[0] = item.path
                arr[1] = item2.path
                arr[2] = item3.path
                if (horizontalData.enable && index >= horizontalData.index) {
                  arr[3] = '__els'
                }
              }
            })
          }
        })
      }
    })
    setActivePath(arr)
  }, [innerActiveKey])

  useEffect(() => {
    if (inlineCollapsed !== innerInlineCollapsed && !hover) {
      setInnerInlineCollapsed(inlineCollapsed)
    }
  }, [inlineCollapsed])

  useEffect(() => {
    if (!innerFixed) {
      if (hovering) {
        setInnerInlineCollapsed(false)
      } else {
        setInnerInlineCollapsed(true)
      }
    }
  }, [hovering])

  const onMouseEnter = (event: React.MouseEvent) => {
    clearTimeout(timer.current)
    if (hover && type == 'vertical' && !innerFixed) {
      setInnerInlineCollapsed(false)
      onHoverChange?.(true)
    }
  }

  const onMouseLeave = (event: React.MouseEvent) => {
    // console.log(event)
    // 与外界logo关联，判断移动的下一个元素为logo时，取消mouseleave事件
    const relatedTarget = event.relatedTarget
    const logoElement = document.querySelector('.ysd-layout-vertical-top-left-logo')
    if (relatedTarget !== window && (logoElement?.contains(relatedTarget as HTMLElement) || logoElement === relatedTarget)) {
      return
    }

    clearTimeout(timer.current)
    if (hover && type == 'vertical' && !innerFixed) {
      timer.current = setTimeout(() => {
        setInnerInlineCollapsed(true)
        onHoverChange?.(false)
      }, mouseLeaveTime)
    }
  }

  const onFixedChange = () => {
    const tag = !innerFixed
    setInnerFixed(tag)
    dispatch(setVerticalFixed(tag))
    onFixed?.(tag)
  }

  useEffect(() => {
    if (hover && fixed !== innerFixed) {
      dispatch(setVerticalFixed(fixed))
      setInnerFixed(fixed)
    }
  }, [fixed])

  const cn = classNames(
    prefixCls,
    className,
    {
      [`${prefixCls}-collapsed`]: type == 'vertical' && innerInlineCollapsed,
      [`${prefixCls}-${type}`]: type
    }
  )


  return (
    <MenuContext.Provider value={{
      activeKey: innerActiveKey as any,
      inlineCollapsed: innerInlineCollapsed,
      link: link as any,
      activePath: activePath,
      innerOpenKeys: innerOpenKeys as any,
      data: data as any,
      prefixCls: prefixCls
    }}>
      <div
        ref={wapref}
        className={cn}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ width: type === 'vertical' ? (hovering || innerFixed) ? width : '60px' : "100%" }}
        {...otherProps}
      >
        {
          type == 'vertical' ?
            <Vertical
              fixed={innerFixed}
              onFixedChange={onFixedChange}
              hover={hover}
              onChange={innerOnChange}
              onOpen={innerOpen}
              onCollapsedChange={onCollapsedChange} /> :
            <Horizontal
              wapref={wapref}
              onChange={innerOnChange}
              horizontalData={horizontalData}
              onChangeHorizontalData={(data: any) => { setHorizontalData(data) }} />
        }
      </div>
    </MenuContext.Provider>
  )
}


export default Menu
