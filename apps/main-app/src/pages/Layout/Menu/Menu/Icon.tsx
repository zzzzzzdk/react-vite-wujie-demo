import React from 'react'
import {Icon} from '@yisa/webui/es/Icon'

const Iconn = (props: any) => {

  const {
    icon
  } = props

  if (typeof icon === 'string') {
    return <Icon type={icon} />
  }

  return icon
}

export default Iconn
