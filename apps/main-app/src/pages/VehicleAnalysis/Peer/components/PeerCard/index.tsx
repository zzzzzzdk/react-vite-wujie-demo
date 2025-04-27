import React, { useState } from "react";
import PeerCardProps from "./interface";
import { AspectRatioBox, ImgZoom } from '@/components'
import { Image, Checkbox, Popover } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon, DeleteOutlined } from '@yisa/webui/es/Icon'
import classNames from 'classnames'
import { isFunction, jumpRecordVehicle } from "@/utils";
import './index.scss'

function PeerCard(props: PeerCardProps) {
  const {
    type = "vehicle",
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
    showDelete = false,
    deleteInteraction = "hover",
    onDelete,
    tagNum = 1,
    size = "middle",
  } = props
  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked
  const personBasicInfo = cardData.personBasicInfo || {}
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
  //删除事件
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    onDelete?.(cardData)

  }

  // 拖拽事件
  const handleImgDragStart = (event: React.DragEvent) => {
    event.dataTransfer.dropEffect = "copy";
    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.setData("Text", JSON.stringify(cardData));
    if (onImgDragStart && isFunction(onImgDragStart)) {
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
        className={classNames("card-img", { small: size === "small" })}
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
        {
          showDelete ?
            <span onClick={handleDelete} className={classNames("card-delete", {
              "hovering": deleteInteraction === "hover"
            })}>
              <DeleteOutlined />
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
      {
        type === "vehicle" && <div className="card-info-wrapper">
          {
            cardData.licensePlate2 && <div className="card-info">
              {
                cardData.licensePlate2 == '未识别' ?
                  <span className={`plate2-text plate-bg plate-color-8`}></span> :
                  // (
                  <a target="_blank" href={jumpRecordVehicle(cardData.licensePlate2, cardData?.plateColorTypeId2)} className={`plate2-text plate-bg plate-color-${cardData.plateColorTypeId2}`}>
                    {cardData.licensePlate2}
                  </a>
                // :
                // <span className={`plate2-text plate-bg plate-color-${cardData.plateColorTypeId2}`}>{cardData.licensePlate2}</span>
                // )
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
            cardData.locationName || (cardData.lngLat?.lng && cardData.lngLat?.lat)
              ?
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
            cardData.minCount && cardData.peerSpot &&
            <div className="card-info">
              <Icon type="fill-jiachetonghang" />
              <div className="card-info-content">
                <span>同行次数</span><em className="count">{cardData.peerSpot}</em>
                <span>点位数</span><em className="count">{cardData.minCount}</em>
              </div>
            </div>
          }
        </div>
      }
      {
        type === "person" && <div className="card-info-wrapper">
          {
            // cardData.captureTime &&
            <div className="card-info">
              <Icon type="shijian" />
              <div className="card-info-content">{cardData.captureTime || '-'}</div>
            </div>
          }
          {
            // cardData.locationName || (cardData.lngLat?.lng && cardData.lngLat?.lat)
            //   ?
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
            // : ''
          }
          {
            cardData.peerSpot &&
            <div className="card-info">
              <Icon type="fill-jiachetonghang" />
              <div className="card-info-content">
                <span>同行次数</span><em className="count">{cardData.peerSpot}</em>次
              </div>
            </div>
          }
        </div>
      }
      {
        (type === "personTarget" || type === "personDetail") &&
        <div className="card-info-wrapper">
          {
            personBasicInfo?.idcard ?
              <>
                {
                  // personBasicInfo?.name &&
                  <div className="card-info">
                    <Icon type="xingming" />
                    <div className="card-info-content">
                      <span>{personBasicInfo?.name || '未知'}</span>
                      <span style={{ marginInlineStart: 20 }}>{personBasicInfo?.age !== "未知" ? `${personBasicInfo?.age || "0"}` : "未知"}</span>
                    </div>
                  </div>
                }
                {
                  // personBasicInfo?.idcard &&
                  <div className="card-info">
                    <Icon type="shenfenzheng" />
                    <div className="card-info-content">
                      {
                        /^[\dXx]+$/.test(personBasicInfo?.idcard) ?
                          <a
                            href={`#/record-detail-person?${encodeURIComponent(
                              JSON.stringify({
                                idNumber: personBasicInfo.idcard === '未知' ? '' : personBasicInfo.idcard,
                                groupId: Array.isArray(personBasicInfo?.groupId) ? personBasicInfo.groupId : [personBasicInfo.groupId],
                                idType: personBasicInfo?.idType || '111'
                              }))}`}
                            target="_blank"
                            className="link idcard" title={personBasicInfo?.idcard}>{personBasicInfo?.idcard}</a>
                          :
                          <span className="idcard" title={personBasicInfo?.idcard}>{personBasicInfo?.idcard || "-"}</span>
                      }
                    </div>
                  </div>
                }
                {
                  type === "personTarget" &&
                  <div className="card-info">
                    <Icon type="renyuanku1" />
                    <div className="card-info-content">
                      {
                        cardData?.personTags?.length ?
                          <div className="tags">
                            {
                              cardData.personTags.slice(0, tagNum).map((item, index: number) => <div
                                key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</div>)
                            }
                            {
                              cardData.personTags.length > tagNum ?
                                <Popover
                                  placement="topRight"
                                  // visible={true}
                                  content={<div className="cluster-tag-more">
                                    {
                                      cardData.personTags?.map((elem, index: number) => <span key={index} title={elem.name} className={`label-item label-item-${elem.color}`}>{elem.name}</span>)
                                    }
                                  </div>}
                                  overlayClassName="cluster-tag-popover"
                                >
                                  <div key='...' className={`label-item ${className}`}>+{cardData.personTags.length - tagNum}</div>
                                </Popover>
                                : null
                            }
                          </div>
                          : "-"
                      }
                    </div>
                  </div>
                }
              </>
              :
              <div className="no-name">暂未实名</div>
          }
        </div>
      }
    </div >
  )
}

export default PeerCard
