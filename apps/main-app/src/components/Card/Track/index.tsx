import React, { useState, useEffect } from "react";
import { CardTrackProps } from "./interface";
import classNames from 'classnames'
import { isArray, isFunction } from "@/utils";
import { Image, Tooltip, Button, Space, Divider } from '@yisa/webui'
import { DownOutlined, Icon, UpOutlined } from '@yisa/webui/es/Icon'
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import './index.scss'

const Track = (props: CardTrackProps) => {
  const {
    className,
    cardData = {},
    onImgClick,
    locationCanClick = true,
    onLocationClick,
    onCardClick,
    checked = false,
    draggable = false,
    onImgDragStart,
    onImgDragEnd,
    indexColor = 'rgba(51, 119, 255, 0.5)'
  } = props

  const [showMore, setShowMore] = useState(false)

  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (onCardClick) {
      onCardClick(event, cardData)
    }
  }

  const handleLocClick = (event: React.MouseEvent) => {
    if (onLocationClick) {
      onLocationClick(event, cardData)
    }
  }

  // 拖拽事件
  const handleImgDragStart = (event: React.DragEvent, item: TargetResultItemType) => {
    event.dataTransfer.dropEffect = "copy";
    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.setData("Text", JSON.stringify(item));
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

  const handleImgClick = (event: React.MouseEvent, item: TargetResultItemType, index: number) => {
    event.stopPropagation()
    if (onImgClick) {
      onImgClick(event, item, index)
    }
  }

  const handleShowMore = (event: React.MouseEvent) => {
    event.stopPropagation()
    setShowMore(!showMore)
  }

  // useEffect(() => {
  //   document.querySelector(".card-track-item.checked")?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "center"
  //   })
  // })


  return (
    <div
      className={classNames("card-track-item", className, {
        'checked': checked
      })}
      onClick={handleCardClick}
    >
      <div className="card-track-item-content">
        <span className="serial-number" style={{ backgroundColor: indexColor }}>{cardData.index || 0}</span>
        <div className="card-track-item-image">
          <span className="capture-counts">{cardData.infos && isArray(cardData.infos) ? cardData.infos.length : 0}</span>
          {
            cardData.infos && isArray(cardData.infos) && cardData.infos.length ?
              <div
                className="img-wrap"
                onDragStart={(e) => handleImgDragStart(e, cardData.infos[0])}
                onDragEnd={handleImgDragEnd}
                draggable={draggable}
                onClick={(e) => handleImgClick(e, cardData.infos[0], 0)}
              >

                <Image
                  src={cardData.infos[0].targetImage}
                />
              </div>
              :
              ""
          }
        </div>
        <div className="card-track-item-info">
          <Space direction="vertical" size={6}>
            <div className="card-info">
              <Icon type="shijian" />
              <div>
                {
                  cardData.minCaptureTime === cardData.maxCaptureTime ?
                    cardData.minCaptureTime :
                    <>
                      <p>{cardData.minCaptureTime} - </p>
                      <p>{cardData.maxCaptureTime}</p>
                    </>
                }
              </div>
            </div>
            <div className="card-info">
              <Icon type="didian" />
              <span
                className={classNames("card-info-content location", {
                  'can-click': locationCanClick
                })}
                title={cardData.locationName || '-'}
                onClick={locationCanClick ? handleLocClick : () => { }}
              >
                {cardData.locationName}
              </span>
            </div>
            <div className="card-info">
              <Icon type="zhuapaicishu" />
              <div>
                抓拍 <span className="counts">{(cardData.infos ?? []).length || 0}</span> 次
              </div>
            </div>
          </Space>
          {
            cardData.infos && isArray(cardData.infos) && cardData.infos.length > 1 ?
              <div className="show-more" onClick={handleShowMore}>
                {
                  showMore ?
                    <>收起图片 <UpOutlined /></>
                    :
                    <>展开图片 <DownOutlined /></>
                }
              </div>
              :
              ""
          }


        </div>
      </div>
      {
        showMore ?
          <div className="infos-con">
            {
              cardData.infos && isArray(cardData.infos) && cardData.infos.length ?
                cardData.infos.map((item: TargetResultItemType, index: number) => {
                  return (
                    <div
                      className="track-img-item"
                      key={index}
                      style={{ cursor: onImgClick ? 'pointer' : "default" }}
                    >
                      <div
                        className="img-wrap"
                        onDragStart={(e) => handleImgDragStart(e, item)}
                        onDragEnd={handleImgDragEnd}
                        draggable={draggable}
                        onClick={(e) => handleImgClick(e, item, index)}
                      >

                        <Image
                          src={item.targetImage}
                        />
                      </div>
                    </div>
                  )
                })
                :
                <div className="no-infos">
                  暂无识别目标
                </div>
            }
          </div>
          :
          ""
      }
    </div>
  )
}

export default Track