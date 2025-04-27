import React, { useRef, useState } from "react";
import { Drawer, Button } from '@yisa/webui'
import { LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import { DrawerProps } from '@yisa/webui/es/Drawer'
import classnames from 'classnames'
import { Portal } from '@/components'
import omit from '@/utils/omit'
import './index.scss'

export interface BoxDrawerProps extends Omit<DrawerProps, "width" | "title" | "visible" | "onClose" | "className"> {
  onChange: () => void; //点击展开收起按钮回调 ,需要自定义抽屉显隐
  placement: 'left' | 'right'
  gap?: number //抽屉间空隙
  visibles: [boolean, boolean] //每个抽屉的可见情况
  widths?: [number, number] //每个抽屉的宽度
  titles?: [React.ReactNode, React.ReactNode] //每个抽屉的标题
  contents?: [React.ReactNode, React.ReactNode] //每个抽屉的内容
}
// 交互逻辑 ： 一次性全展开，收起的时候一半一半收起
// 暂不支持传递类名，会导致样式丢失
export default function DoubleDrawer(props: BoxDrawerProps) {
  const {
    // className = "",
    visibles = [false, false],
    placement = 'left',
    contents = ["内容1", "内容2"],
    titles = ["标题1", "标题2"],
    widths = [376, 376],
    gap = 12,
    onChange,
  } = props
  const compPrefixCls = "double-drawer", prefixCls = "inner-drawer-container"
  //是否都可见
  const visible = visibles.every(Boolean), hidden = visibles.every(item => item === false), leftVisible = visibles[0] && !visible[1]
  //宽度 , 需要加上padding值 ，同时出现需要加上 gap 值
  const width = ((visible || hidden) ? widths[0] + widths[1] + gap : leftVisible ? widths[0] : widths[1]) + 12 * 2


  const handleSwitchVisible = (e: any) => {
    // if (!hidden) {
    //   props.onClose?.(e)
    // } else {
    //   props.onOpen?.(e)
    // }
    // debugger
    onChange()
  }

  return (
    <Drawer
      width={width}
      className={`${compPrefixCls} `}
      mask={false}
      closable={false}
      visible={!hidden}
      {...omit(props, ["titles", "contents", "widths", "visibles", "onChange"])}
      handler={
        <div
          className={`box-drawer-switch-btn ${placement} visible-${visible}`}
          onClick={handleSwitchVisible}
        >
          {
            (placement === 'left' && visibles.filter(Boolean).length) || (placement === 'right' && !visibles.filter(Boolean).length) ?
              <LeftOutlined /> :
              <RightOutlined />
          }
        </div>
      }
    >
      <div className={`${prefixCls}`} style={{  }}>
        {/* {
          visibles[0] && <div className={`${prefixCls}-left`} style={{ width: widths[0] }}>
            {titles[0] && <div className={`${prefixCls}-left-title`}>{titles[0]}</div>}
            <div className={`${prefixCls}-left-content`}>{contents[0]}</div>
          </div>
        } */}
        {
          <div className={`${prefixCls}-left`} style={{ width: visibles[0] ? widths[0] : 0 }}>
            {titles[0] && <div className={`${prefixCls}-left-title`}>{titles[0]}</div>}
            <div className={`${prefixCls}-left-content`}>{contents[0]}</div>
          </div>
        }
        {
          <div className={`${prefixCls}-right`} style={{ width: visibles[1] ? widths[1] : 0 }}>
            {titles[1] && <div className={`${prefixCls}-right-title`}>{titles[1]}</div>}
            <div className={`${prefixCls}-right-content`}>{contents[1]}</div>
          </div>
        }
      </div>
    </Drawer>
  )
}
