import React, { useState, useEffect, useRef } from 'react'
import { Icon } from '@yisa/webui/es/Icon'
import { Image } from '@yisa/webui'
import { ImgZoom } from '@/components'
import classnames from 'classnames'
import { DetailCardType } from './interface'
import './index.scss'
import { ResultRowType } from '@/pages/Search/Target/interface'

export default function (props: DetailCardType) {
  const {
    index,
    cardData,
    // type='过夜',
    active = false,
    onCardClick
  } = props
  const { locationName,locationId,parkingCount,parkingFrequency,parkingtimes,parkingActions} = cardData
  const tag = (type: string) => {
    let stylename = ''
    let message = ''
    // let tag=document.createElement('span')
    switch (type) {
      case 'night':
        stylename = 'guoye';
        message = '过夜'
        break
      case 'days':
        stylename = 'duori'
        message = '多日'
        break
      case 'short':
        stylename = 'duanzan'
        message = '短暂'
        break
    }
    // return `<span className={'tag '+${stylename}>${message}</span>`
    return <span className={'tag ' + stylename}>{message}</span>
  }
  return (
    <div className={classnames("foothold-card-detail-item", {
      active: active
    })}
      onClick={onCardClick}>
      {
        index && <span className="index">{index}</span>
        // <span className="index">{index}</span>
      }
      <div className='tag-box'>
        {
          parkingActions.indexOf('days') > -1 ?
            tag("days") : ''
        }
        {
          parkingActions.indexOf('short') > -1 ?
            tag("short") : ''
        }
        {
          parkingActions.indexOf('night') > -1 ?
            tag("night") : ''
        }
      </div>
      <div className='sss'>
        <div className="item-location">
          <Icon type="didian" />
          <div className="item-location-content" title={locationName}>{locationName || '-'}</div>
        </div>
        <div className="item-location">
          <Icon type="fill-jiachetonghang" />
          <div className="item-location-content">落脚次数 {parkingCount || '-'} 次</div>
        </div>
        <div className="item-location">
          <Icon type="fill-jiachetonghang" />
          <div className="item-location-content">落脚频率 {(Math.round(parkingFrequency*100)/100).toFixed(2) || '-'} 次/周</div>
        </div>
      </div>
    </div>)
}

