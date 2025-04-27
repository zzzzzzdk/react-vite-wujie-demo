import React, { useState, useEffect, useRef } from 'react'
import { Space, Image } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import cn from 'classnames'
import { TrackInfoProps } from './interface'
import './index.scss'
import { ErrorImage } from '@yisa/webui_business'

export default function TrackInfo(props: TrackInfoProps) {
  const {
    data,
    onLocationClick = () => { },
    onTrackCardClick,
    trackIndex,
    sign,
    active
  } = props
  const prefixCls = "card-track-info"

  useEffect(() => {
    document.querySelector(".track-info-content.active")?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  })

  return (<div className={cn(`${prefixCls}`)}>
    {
      <div
        className={cn("track-info-content", { "number-gap": trackIndex, active: active })}
        onClick={() => {
          onTrackCardClick?.(data)
        }}
      >
        {trackIndex !== undefined && <div className="index">{trackIndex}</div>}
        {sign && <div className="sign">{sign}</div>}
        <div className="track-info-item">
          <Icon type="shijian" />
          <div className="card-info">{data.minCaptureTime === data.maxCaptureTime ? data.minCaptureTime : `${data.minCaptureTime} - ${data.maxCaptureTime}`}</div>
        </div>
        <div className="track-info-item">
          <Icon type="didian" />
          <div className="card-info">{data.locationName || '-'}</div>
        </div>
      </div>
    }
  </div>)

}


