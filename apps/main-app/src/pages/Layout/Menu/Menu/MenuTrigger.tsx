import React from 'react'
import Trigger from 'rc-trigger'
import { getPrefixCls } from '@/config'

const MenuTrigger = (props: any) => {

  const {
    action = 'hover',
    children,
    ...others
  } = props

  const prefixCls = getPrefixCls('menu')

  return <Trigger
    prefixCls={prefixCls + '-tooltip'}
    action={action}
    mouseEnterDelay={0.2}
    mouseLeaveDelay={0.2}
    {...others}>
    {
      children
    }
  </Trigger>
}


export default MenuTrigger
