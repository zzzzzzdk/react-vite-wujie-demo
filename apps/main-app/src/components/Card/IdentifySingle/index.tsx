import React, { useState } from "react";
import { IdentifyProps } from "./interface";
import classNames from 'classnames'
import { AspectRatioBox, ImgZoom } from '@/components'
import { isArray, isFunction } from "@/utils";
import { Image, Tooltip, Button, Space, Divider, Checkbox, PopConfirm } from '@yisa/webui'
import { DownOutlined, Icon, UpOutlined } from '@yisa/webui/es/Icon'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import FooterLinks from "../FooterLinks";
import GaitNumTip from "../Normal/GaitNumTip";
import './index.scss'

const Single = (props: IdentifyProps) => {
  const {
    className,
    cardData = {},
    onImgClick,
    locationCanClick = true,
    onLocationClick,
    onCardClick,
    showChecked = false,
    checked = false,
    onCheck,
    draggable = false,
    onImgDragStart,
    onImgDragEnd,
    showFooterLinks = true,
    linkEleClick,
    showAddFilterate = true,
    showDelBtn = false,
    onDelClick,
    onAddFilterate,
    showSimilarity = true,
    showGaitFeature = true
  } = props

  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked

  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    // console.log(event.target.checked)
    if (!('checked' in props)) {
      setStateChecked(event.target.checked)
    }

    if (onCheck && isFunction(onCheck)) {
      onCheck({
        cardData: cardData,
        checked: event.target.checked
      })
    }
  }

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

  const handleDelClick = (event?: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation()
    if (onDelClick && isFunction(onDelClick)) {
      onDelClick(cardData)
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

  const handleImgClick = (event: React.MouseEvent, item: TargetResultItemType) => {
    event.stopPropagation()
    if (onImgClick) {
      onImgClick(event, item)
    }
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
      className={classNames("card-identify-single-item", className, {
        'checked': checked,
        'no-footer': !showFooterLinks
      })}
      onClick={handleCardClick}
    >
      <div className="card-identify-single-item-con">
        <div
          className="identify-img-item"
          style={{ cursor: onImgClick ? 'pointer' : "default" }}
        >
          <AspectRatioBox
            className="card-img"
            ratio={188 / 188}
          >
            {
              showChecked ?
                <Checkbox
                  className="card-checked"
                  checked={checked}
                  onChange={handleCheckedChange}
                />
                : ''
            }
            {
              showDelBtn ?
                <PopConfirm
                  overlayClassName="del-popconfirm"
                  title={<span>确认要删除这条内容吗？</span>}
                  onConfirm={handleDelClick}
                  getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
                >
                  <span className='del-btn'>
                    <Icon type='lajitong' />
                  </span>
                </PopConfirm>
                : ''
            }
            <div
              className="img-wrap"
              onDragStart={(e) => handleImgDragStart(e, cardData)}
              onDragEnd={handleImgDragEnd}
              draggable={draggable}
              onClick={(e) => handleImgClick(e, cardData)}
            >
              {
                showAddFilterate ?
                  <Tooltip
                    placement="top"
                    title={ImgTooltipTitle(cardData)}
                    mouseEnterDelay={0.3}
                    light
                    getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
                  >
                    <Image
                      src={cardData.targetImage}
                    />
                  </Tooltip>
                  :
                  <Image src={cardData.targetImage} />
              }
              {
                cardData.retrieval ?
                  <Tooltip
                    placement="right"
                    title={"已进行关联检索"}
                    getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
                  >
                    <div className="retrieval"><Icon type="guanlianjiansuo" /></div>
                  </Tooltip>
                  : ""
              }
            </div>
          </AspectRatioBox>
          {
            cardData.similarity && showSimilarity ?
              <Divider className="similarity" orientation="center">
                {
                  cardData.similarity ?
                    <span className="first">{String(cardData.similarity).split('.')[0] || '0'}</span>
                    : '0'
                }
                {
                  (cardData.similarity && String(cardData.similarity).split('.')[1]) ?
                    <span className="last">.{String(cardData.similarity).split('.')[1] + '%'}</span>
                    : ''
                }
              </Divider>
              : ''
          }
          {
            cardData.gaitFeature && showGaitFeature ?
              <GaitNumTip cardData={cardData} />
              : ''
          }

        </div>
        {
          cardData.minCaptureTime || cardData.maxCaptureTime ?
            <div className="card-info"><Icon type="shijian" />{cardData.minCaptureTime === cardData.maxCaptureTime ? cardData.minCaptureTime : `${cardData.minCaptureTime} - ${cardData.maxCaptureTime}`}</div>
            : ''
        }
        {
          cardData.captureTime ?
            <div className="card-info"><Icon type="shijian" />{cardData.captureTime || '-'}</div>
            : ''
        }
        <div className="card-info">
          <Icon type="didian" />
          <span
            className={classNames("card-info-content location", {
              'can-click': locationCanClick
            })}
            title={cardData.locationName || '-'}
            onClick={locationCanClick ? handleLocClick : () => { }}
          >
            {cardData.locationName || '-'}
          </span>
        </div>
      </div>
      {
        showFooterLinks ?
          <FooterLinks eleClick={linkEleClick} cardData={cardData} />
          : ''
      }
    </div>
  )
}

export default Single