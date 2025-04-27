import { ResultRowType } from '@/pages/Search/Target/interface'
import { Image, Space, Tooltip, Message } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import React, { useState, useEffect, useRef } from 'react'
import { JoinClue } from '@/components'
import character from '@/config/character.config'
import './index.scss'
import { fsyncSync } from 'fs'
import { logReport } from '@/utils/log'
type ImgInfoCardType = {
  data: ResultRowType & { source: "associateTarget" | "sameScene" },
  onConnectItemClick?: (data: ResultRowType) => void
}

export default function ImgInfoCard(props: ImgInfoCardType) {
  const {
    data,
    onConnectItemClick,
  } = props
  const prefixCls = "normal-img-info-card"
  const featureData = {
    feature: data.feature,
    targetType: data.targetType,
    targetImage: data.targetImage,
    detection: data.detection,
    gaitFeature: data.gaitFeature || "",
    infoId: data.infoId,
    windowFeature: data.windowFeature || "",
    bigImage: data.bigImage,
    licensePlate2: data.licensePlate2,
    plateColorTypeId2: data.plateColorTypeId2
  }
  const [showClue, setShowClue] = useState(false)
  const [clueList, setClueList] = useState<ResultRowType[]>([])
  const linkMap = {
    "image": "以图检索",
    "real-time-tracking": "实时跨镜追踪"
  }

  const handleJump = (e: React.MouseEvent, link: string) => {
    e.preventDefault()
    const desc = data['source'] === 'sameScene' ?
      `图片1 - 大图弹窗 - 同画面分析 - 图片2 -【快捷操作：${linkMap[link]}】`
      :
      data['source'] === "associateTarget" ?
        `图片1 - 大图弹窗 - 关联目标 - 图片2 -【快捷操作：${linkMap[link]}】`
        :
        `图片【1】-【快捷操作：${linkMap[link]}】`

    logReport({
      type: 'none',
      data: {
        desc,
        data
      }
    })
    if (link === "real-time-tracking" && data.targetType !== "face" && data.targetType !== "vehicle") {
      Message.warning("非人脸或汽车目标")
    } else {
      window.open(`#/${link}?featureList=${encodeURIComponent(JSON.stringify([featureData]))}`)
    }
  }
  return (<div
    className={`${prefixCls}`}
    onClick={() => onConnectItemClick?.(data)}
  >
    {data.targetType && <span className="feature-type-tip">{character.featureTypeToText[data.targetType]}</span>}
    <Image src={data.targetImage} />
    <div className="f-links">
      <Space split={<>|</>}>
        <Tooltip title="以图检索" placement="top">
          <a href="void;" target="_blank" onClick={(e) => { handleJump(e, "image") }}><Icon type="yitujiansuo" /></a>
        </Tooltip>
        <Tooltip title="实时跨镜追踪" placement="top">
          <a href="void;" target="_blank" onClick={(e) => { handleJump(e, "real-time-tracking") }} className={`${(data.targetType !== "face" && data.targetType !== "vehicle") ? "link-disabled" : ""}`}><Icon type="kuajingzhuizong" /></a>
        </Tooltip>
        <Tooltip title="加入线索库" placement="top">
          <a onClick={() => {
            setShowClue(true)
            setClueList([data])
          }}><Icon type="zancunjia" /></a>
        </Tooltip>
      </Space>
    </div>
    <JoinClue
      visible={showClue}
      clueDetails={clueList}
      cardData={data}
      onOk={() => { setShowClue(false) }}
      onCancel={() => { setShowClue(false) }}
    />
  </div>)
}

