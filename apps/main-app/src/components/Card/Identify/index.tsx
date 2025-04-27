import React, { useState } from "react";
import { IdentifyProps } from "./interface";
import classNames from 'classnames'
import { isArray, isFunction } from "@/utils";
import { Image, Tooltip, Button, Space, Divider } from '@yisa/webui'
import { DownOutlined, Icon, UpOutlined } from '@yisa/webui/es/Icon'
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import GaitNumTip from "../Normal/GaitNumTip";
import ImgZoom from "@/components/ImgZoom";
import './index.scss'

const Identify = (props: IdentifyProps) => {
  const {
    className,
    style,
    cardData = {},
    onImgClick,
    locationCanClick = true,
    onLocationClick,
    onCardClick,
    checked = false,
    draggable = false,
    onImgDragStart,
    onImgDragEnd,
    onAddFilterate,
    showSimilarity = true,
    showImageZoom = false,
    showAddFilterate = true,
    indexColor
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


  // 过滤名单添加按钮
  const ImgTooltipTitle = (item: TargetResultItemType) => {
    return (
      <Button className="add-not-me" onClick={(e) => { handleAddFilterate(e, item) }} type="primary"> 加入过滤名单 </Button>
    )
  }

  const handleAddFilterate = (e: React.MouseEvent, item: TargetResultItemType) => {
    e.stopPropagation()
    if (onAddFilterate && isFunction(onAddFilterate)) {
      onAddFilterate(item)
    }
  }

  return (
    <div
      className={classNames("card-identify-item", className, {
        'checked': checked
      })}
      onClick={handleCardClick}
      style={style}
    >
      <div className="card-identify-item-head">
        <div className="head-left">
          <span 
            className="serial-number"
            style={{backgroundColor: indexColor || '#37f'}}
          >{cardData.index || 0}</span>
          <span className="">共有 <span className="number">{cardData.infos && isArray(cardData.infos) ? cardData.infos.length : 0}</span> 条识别目标</span>
        </div>
        {
          cardData.infos && isArray(cardData.infos) && cardData.infos.length > 3 ?
            <div className="head-right" onClick={handleShowMore}>
              {
                showMore ?
                  <>收起全部 <UpOutlined /></>
                  :
                  <>查看更多 <DownOutlined /></>
              }
            </div>
            :
            ""
        }
      </div>
      <div className="card-identify-item-con">
        <div className="infos-con">
          {
            cardData.infos && isArray(cardData.infos) && cardData.infos.length ?
              (showMore ? cardData.infos : cardData.infos.slice(0, 3)).map((item: TargetResultItemType, index: number) => {
                return (
                  <div
                    className="identify-img-item"
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
                      {
                        showAddFilterate ?
                          <Tooltip
                            placement="top"
                            title={ImgTooltipTitle(item)}
                            mouseEnterDelay={0.3}
                            light
                            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
                          >
                            {/* {
                          showImageZoom && item.targetType === 'vehicle' ?
                            <ImgZoom imgSrc={item.targetImage} />
                            : */}
                            <Image
                              src={item.targetImage}
                            />
                            {/* } */}
                            {cardData.infos.length > 3 && index == 2 && !showMore ?
                              <div className="infos-residue" onClick={handleShowMore}>
                                <span> + {cardData.infos.length - 3} </span>
                              </div>
                              : null
                            }
                          </Tooltip>
                          :
                          <>
                            <Image
                              src={item.targetImage}
                            />
                            {cardData.infos.length > 3 && index == 2 && !showMore ?
                              <div className="infos-residue" onClick={handleShowMore}>
                                <span> + {cardData.infos.length - 3} </span>
                              </div>
                              : null
                            }
                          </>
                      }
                      {
                        item.retrieval ?
                          <Tooltip
                            placement="right"
                            title={"已进行关联检索"}
                            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
                          >
                            <div className="retrieval"><Icon type="guanlianjiansuo" /></div>
                          </Tooltip>
                          : ""
                      }
                      {
                        item.gaitFeature ?
                          <GaitNumTip cardData={item} />
                          : ''
                      }
                    </div>
                    {
                      item.hasOwnProperty("similarity") && showSimilarity && item.targetType !== 'vehicle' ?
                        <Divider className="similarity" orientation="center">
                          {
                            item.similarity ?
                              <span className="first">{String(item.similarity).split('.')[0] || '0'}</span>
                              : '0'
                          }
                          {
                            (item.similarity && String(item.similarity).split('.')[1]) ?
                              <span className="last">.{String(item.similarity).split('.')[1] + '%'}</span>
                              : ''
                          }
                        </Divider>
                        : ''
                    }
                  </div>
                )
              })
              :
              <div className="no-infos">
                暂无识别目标
              </div>
          }
        </div>
        <Space direction="vertical" size={6}>
          <div className="card-info"><Icon type="shijian" />
            {cardData.minCaptureTime === cardData.maxCaptureTime ? cardData.minCaptureTime : `${cardData.minCaptureTime} - ${cardData.maxCaptureTime}`}
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
        </Space>
      </div>
    </div>
  )
}

export default Identify