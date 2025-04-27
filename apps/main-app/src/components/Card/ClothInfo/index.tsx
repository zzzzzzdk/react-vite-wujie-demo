import './index.scss'
import { Image, Tooltip } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import GaitNumTip from '../Normal/GaitNumTip'
import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
const ClothInfo = (props: any) => {
  const {
    cardData = {},
    isSameDay = false,
    isShowGait = false,
    onCaptureClick,
    onCardClick
  } = props
  return <div className="clothing-card" onClick={onCardClick}>
    <div className="image">
      <Image src={cardData.targetImage} />
    </div>
    {
      isShowGait && cardData.isGait && cardData.gaitObjectNumber > 0 ?
        <GaitNumTip cardData={cardData} />
        : ''
    }
    <div className="cloth-info">
      <div className="info">
        <Icon type="shangyi" />
        <div className="info-content">上衣: {['未识别', '未知', '花色'].includes(cardData.coat) ? cardData.coat : `${cardData.coat}色`}</div>
      </div>
      <div className="info">
        <Icon type="xiayi" />
        <div className="info-content">下衣: {['未识别', '未知', '花色'].includes(cardData.pants) ? cardData.pants : `${cardData.pants}色`}</div>
      </div>
      {
        isSameDay ? null : <>
          <div className="info">
            <Icon type="zhuapaitianshu" />
            <div className="info-content" onClick={(e) => {
              e.stopPropagation()
              onCaptureClick()
            }}>抓拍天数(近90天): <span>{cardData.dateCount}</span>天</div>
          </div>
          {/* <Tooltip
            title={`衣着特征占比：18.00%`}>
            <div className="similarity"> */}
          {/* <span>{cardData.similarty.split('.')[0]}</span><span>.{cardData.similarty.split('.')[1]}%</span> */}
          {/* </div>
          </Tooltip> */}
        </>
      }

    </div>
  </div>
}
export default ClothInfo
