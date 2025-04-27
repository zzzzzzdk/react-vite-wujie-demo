import React, { useState } from "react";
import PeerCardProps from "./interface";
import { AspectRatioBox, ImgZoom } from '@/components'
import { Image, Tooltip, Checkbox, Message } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon } from '@yisa/webui/es/Icon'
// import { ImgZoom } from '@yisa/webui_business'
import classNames from 'classnames'
import { isFunction } from "@/utils";
import './index.scss'
import { ResultRowType } from "@/pages/Search/Target/interface";

function PeerCard(props: PeerCardProps) {
  const {
    className,
    cardData,
    onImgClick = () => { },
    locationCanClick = true,
    onLocationClick,
    onCardClick,
    showChecked = true,
    checked = false,
    active = false,
    onChange,
    showImgZoom = false,
    onImgDragStart,
    onImgDragEnd,
    draggable = false,
  } = props
  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked
  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    // console.log(event)
    if (!('checked' in props)) {
      setStateChecked(event.target.checked)
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        cardData: cardData,
        checked: event.target.checked
      })
    }
  }

  const handleCardClick = (event: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(event)
    }
  }

  const handleLocClick = (event: React.MouseEvent) => {
    if (onLocationClick) {
      onLocationClick(event)
    }
  }

  // 拖拽事件
  const handleImgDragStart = (event: React.DragEvent) => {
    event.dataTransfer.dropEffect = "copy";
    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.setData("Text", JSON.stringify(cardData));
    if (onImgDragStart && isFunction(onImgDragStart)) {
      console.log(event)
      onImgDragStart(event)
    }
  }

  const handleImgDragEnd = (event: React.DragEvent) => {
    if (onImgDragEnd && isFunction(onImgDragEnd)) {
      onImgDragEnd(event)
    }
  }

  return (
    <div
      className={classNames("card-peer-item", className, {
        'checked': isChecked,
        "active": active
      })}
      onClick={handleCardClick}
    >
      <AspectRatioBox
        className="card-img"
        ratio={130 / 130}
      >
        {
          showChecked ?
            <span onClick={(e) => { e.stopPropagation() }}>
              <Checkbox
                className="card-checked"
                checked={isChecked}
                onChange={handleCheckedChange}
              />
            </span>
            : ''
        }
        <div
          className="card-img-inner"
          onClick={onImgClick}
          onDragStart={handleImgDragStart}
          onDragEnd={handleImgDragEnd}
          draggable={!showImgZoom}
        >
          {
            showImgZoom ?
              <ImgZoom imgSrc={cardData.targetImage} draggable={draggable} />
              :
              <Image src={cardData.targetImage} />
          }
        </div>
      </AspectRatioBox>
      <div className="card-info-wrapper">
        {
          cardData.licensePlate2 && <div className="card-info">
            {
              cardData.licensePlate2 == '无牌' ?
                <span className={`plate2-text plate-color-8`}></span> :
                (
                  cardData.licensePlate2Url && cardData.licensePlate2Url != "" ?
                    <a target="_blank" href={cardData.licensePlate2Url} className={`plate2-text plate-bg plate-color-${cardData.plateColorTypeId2}`}>
                      {cardData.licensePlate2}
                    </a>
                    :
                    <span className={`plate2-text plate-bg plate-color-${cardData.plateColorTypeId2}`}>{cardData.licensePlate2}</span>
                )
            }
          </div>
        }
        {
          cardData.carInfo ?
            <div className="card-info">
              <Icon type="cheliangxinghao" />
              <div className="card-info-content" title={cardData.carInfo}>{cardData.carInfo || '-'}</div>
            </div>
            : ''
        }
        {
          cardData.captureTime &&
          <div className="card-info">
            <Icon type="shijian" />
            <div className="card-info-content">{cardData.captureTime || '-'}</div>
          </div>
        }
        {
          cardData.locationName || (cardData.lngLat?.lng && cardData.lngLat?.lat) ?
            <div className="card-info">
              <Icon type="didian" />
              <div
                className={classNames("card-info-content location", {
                  'can-click': locationCanClick
                })}
                title={cardData.locationName || '-'}
                onClick={locationCanClick ? handleLocClick : () => { }}
              >{cardData.locationName || '-'}</div>
            </div>
            : ''
        }
        {
          cardData.direction &&
          <div className="card-info">
            <Icon type="fangxiang" />
            <div className="card-info-content">{cardData.direction || '-'}</div>
          </div>
        }
        {
          cardData.peerCount && cardData.peerLocationCount &&
          <div className="card-info">
            <Icon type="fill-jiachetonghang" />
            <div className="card-info-content"><span>同行次数</span><em className="count">{cardData.peerCount}</em><span>点位数</span><em className="count">{cardData.peerLocationCount}</em></div>
          </div>
        }
      </div>
    </div>
  )
}

export default PeerCard
