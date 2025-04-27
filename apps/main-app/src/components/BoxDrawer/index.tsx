import React, { useRef, useState } from "react";
import { Drawer, Button } from '@yisa/webui'
import { LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import { DrawerProps } from '@yisa/webui/es/Drawer'
import classnames from 'classnames'
import { Portal } from '@/components'
import omit from '@/utils/omit'
import './index.scss'

export interface BoxDrawerProps extends DrawerProps {
  onOpen?: (e: any) => void;
  placement: 'left' | 'right'
}
export default function BoxDrawer(props: BoxDrawerProps) {
  const {
    className = "",
    visible = false,
    children,
    placement = 'left',
  } = props


  const handleSwitchVisible = (e: any) => {
    if (visible) {
      props.onClose?.(e)
    } else {
      props.onOpen?.(e)
    }
  }

  return (
    <Drawer
      className={`box-drawer ${className}`}
      mask={false}
      closable={false}
      {...omit(props, ['onOpen'])}
      handler={
        <div
          className={`box-drawer-switch-btn ${placement} visible-${visible}`}
          onClick={handleSwitchVisible}
        >
          {
            (placement === 'left' && visible) || (placement === 'right' && !visible) ?
              <LeftOutlined /> :
              <RightOutlined />
          }
        </div>
      }
    >
      {children}
    </Drawer>
  )
}
