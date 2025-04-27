import React, { useState, useEffect, useRef } from 'react'
import { Icon } from '@yisa/webui/es/Icon'
import { Image } from '@yisa/webui'
import { ImgZoom } from '@/components'
import classnames from 'classnames'
import { DetailCardType } from './interface'
import './index.scss'
import { ResultRowType } from '@/pages/Search/Target/interface'

export default function (props: DetailCardType<{ target: ResultRowType, peer: ResultRowType, index?: number }>) {
  const {
    cardData,
    showImgZooms = [false, false],
    positions = ["left", "right"],
    active = false,
    onImgClick = () => { },
    onCardClick = () => { }
  } = props
  const { target, peer } = cardData

  useEffect(() => {
    if (active) {
      document.querySelector(".card-detail-item.active")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }
  }, [active])

  return (
    <div
      className={classnames("card-detail-item", {
        active: active
      })}
      onClick={() => { onCardClick(cardData) }}
    >
      <span className="index">{cardData.index || 0}</span>
      <div className="item-location">
        <Icon type="didian" />
        <div className="item-location-content" title={target.locationName}>{target.locationName || '-'}</div>
      </div>
      <div className="item-img">
        <div className="car-common">
          <span className="car-common-title">查询车辆</span>
          <div className="car-common-img" onClick={() => { onImgClick({ cardData, type: "target" }) }}>
            {
              showImgZooms[0] ?
                <ImgZoom imgSrc={target.targetImage} position={positions[0]} />
                :
                <Image src={target.targetImage} />
            }
          </div>
          <div className="car-common-time">
            <Icon type="shijian" />
            <div className="content" title={target.captureTime}>{target.captureTime || '-'}</div>
          </div>
        </div>
        <div className="car-common">
          <span className="car-common-title">同行车辆</span>
          <div className="car-common-img" onClick={() => { onImgClick({ cardData, type: "peer" }) }}>
            {
              showImgZooms[1] ?
                <ImgZoom imgSrc={peer.targetImage} position={positions[1]} />
                :
                <Image src={peer.targetImage} />
            }
          </div>
          <div className="car-common-time">
            <Icon type="shijian" />
            <div className="content" title={peer.captureTime}>{peer.captureTime || '-'}</div>
          </div>
        </div>
      </div>
    </div >)
}

