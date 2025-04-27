import React, { useState, useEffect } from "react";
import { CardTargetProps } from "./interface";
import classNames from 'classnames'
import { isArray, isFunction } from "@/utils";
import { Image, Tooltip, Button, Space, Divider, Message } from '@yisa/webui'
import { DownOutlined, Icon, UpOutlined } from '@yisa/webui/es/Icon'
import { ResultRowType, ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import character from "@/config/character.config";
import './index.scss'
import { JoinClue } from "@/components";
import { logReport } from "@/utils/log";

const Target = (props: CardTargetProps) => {
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
  } = props
  const [showClue, setShowClue] = useState(false)
  const [clueList, setClueList] = useState<ResultRowType[]>([])


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

  const handleImgClick = (event: React.MouseEvent, item: TargetResultItemType) => {
    event.stopPropagation()
    if (onImgClick) {
      onImgClick(event, item)
    }
  }
  const linkMap = {
    "image": "以图检索",
    "real-time-tracking": "实时跨镜追踪"
  }
  const handleJump = (e: React.MouseEvent, link: string) => {
    e.preventDefault()
    const desc = cardData['source'] === 'sameScene' ?
      `图片1 - 大图弹窗 - 同画面分析 - 图片2 -【快捷操作：${linkMap[link]}】`
      :
      cardData['source'] === "associateTarget" ?
        `图片1 - 大图弹窗 - 关联目标 - 图片2 -【快捷操作：${linkMap[link]}】`
        :
        `图片【1】-【快捷操作：${linkMap[link]}】`

    logReport({
      type: 'none',
      data: {
        desc,
        data: cardData
      }
    })
    const featureData = {
      feature: cardData.feature,
      targetType: cardData.targetType,
      targetImage: cardData.targetImage,
      detection: cardData.detection,
      gaitFeature: cardData.gaitFeature || "",
      infoId: cardData.infoId,
      windowFeature: cardData.windowFeature || "",
      bigImage: cardData.bigImage,
      licensePlate2: cardData.licensePlate2,
      plateColorTypeId2: cardData.plateColorTypeId2,
    }
    if (link === "real-time-tracking" && cardData.targetType !== "face" && cardData.targetType !== "vehicle") {
      Message.warning("非人脸或汽车目标")
    } else {
      window.open(`#/${link}?featureList=${encodeURIComponent(JSON.stringify([featureData]))}`)
    }
  }
  
  return (
    <div
      className={classNames("card-target-item", className, {
        'checked': checked
      })}
      onClick={handleCardClick}
    >
      <div className="card-target-item-content">
        <div className="card-target-item-image">
          <div
            className="img-wrap"
            onDragStart={(e) => handleImgDragStart(e, cardData)}
            onDragEnd={handleImgDragEnd}
            draggable={draggable}
            onClick={(e) => handleImgClick(e, cardData)}
          >
            <Image
              src={cardData.targetImage}
            />
            <div className="f-links">
              <Space split={<>|</>}>
                <Tooltip title="以图检索" placement="top">
                  <a href="void;" target="_blank" onClick={(e) => { handleJump(e, "image") }}><Icon type="yitujiansuo" /></a>
                </Tooltip>
                <Tooltip title="实时跨镜追踪" placement="top">
                  <a
                    href="void;"
                    target="_blank"
                    onClick={(e) => { handleJump(e, "real-time-tracking") }}
                    className={`${(cardData.targetType !== "face" && cardData.targetType !== "vehicle") ? "link-disabled" : ""}`}><Icon type="kuajingzhuizong" /></a>
                </Tooltip>
                <Tooltip title="加入线索库" placement="top">
                  <a onClick={() => {
                    setShowClue(true)
                    setClueList([cardData])
                  }}><Icon type="zancunjia" /></a>
                </Tooltip>
              </Space>
            </div>
          </div>
        </div>
        <div className="card-target-item-info">
          <Space direction="vertical" size={16}>
            <div className="card-info">
              抓拍时间
              <div>
                {cardData.captureTime}
              </div>
            </div>
            <div className="card-info">
              目标类型
              <div>
                {character.featureTypeToText[cardData.targetType]}
              </div>
            </div>
          </Space>
        </div>
      </div>

      <JoinClue
        visible={showClue}
        clueDetails={clueList}
        onOk={() => { setShowClue(false) }}
        onCancel={() => { setShowClue(false) }}
      />
    </div>
  )
}

export default Target
