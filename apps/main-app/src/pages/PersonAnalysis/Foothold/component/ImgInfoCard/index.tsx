import React, { useState, useEffect, useRef } from 'react'
import { Space, Image } from '@yisa/webui'
import cn from 'classnames'
import { CardDataType, GoalDataType, ImgInfoCardType } from './interface'
import { CopyToClipboard } from '@/components'
import './index.scss'
import { isArray } from '@/utils/is'
import { jumpRecordVehicle } from '@/utils'
import { validatePlate } from '@/utils'

export default function ImgInfoCard(props: ImgInfoCardType) {
  const {
    cardData,
    type = "foothold"
  } = props
  const prefixCls = "bigimg-info-card"

  useEffect(() => {
    document.querySelector(".track-info-content.active")?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  })
  function isCardDataType(obj: CardDataType | GoalDataType): obj is CardDataType {
    return "captureTimeA" in obj;
  }
  return (<div className={cn(`${prefixCls}`)}>
    <div className="target-info-content">
      <Space size={5} direction="vertical">
        {
          type === "foothold" && isArray(cardData) ?
            <Space size={5} direction="horizontal" className="gap-flex">
              {
                <div className="target-info-item">
                  <div className="label">落脚点位</div>:
                  <div className="con foothold">
                    {
                      cardData.length === 2 ?
                        <span title={cardData[0].locationName}>{`A ${cardData[0].locationName || "未知"}`}</span>
                        : <span title={cardData[0].locationName}>{cardData[0].locationName || "未知"}</span>
                    }
                    {
                      cardData.length === 2 ?
                        <span title={cardData[1].locationName}>{`B ${cardData[1].locationName || "未知"}`}</span>
                        : ''
                    }
                  </div>
                </div>
              }
            </Space>
            : ''
        }
        {
          type === "doublecar-message" && !isArray(cardData) && isCardDataType(cardData) ?
            <>
              <Space size={5} direction="horizontal" className="gap-flex">
                <div className='title-box'><div>距离<span>{cardData.distance}</span>km</div><div>时间差<span>{cardData.timedifference}</span>s</div><div>时速<span>{cardData.speed}</span>km/h</div></div>
              </Space>
              <Space size={5} direction="horizontal" className="gap-flex">
                <div className="target-info-item">
                  <div className="label long">车辆A抓拍时间</div>:
                  <div className="con" title={cardData.captureTimeA}>{cardData.captureTimeA}</div>
                </div>
              </Space>
              <Space size={5} direction="horizontal" className="gap-flex">
                <div className="target-info-item">
                  <div className="label long">车辆A抓拍地点</div>:
                  <div className="con" title={cardData.locationNameA}>{cardData.locationNameA}</div>
                </div>
              </Space>
              <Space size={5} direction="horizontal" className="gap-flex">
                <div className="target-info-item">
                  <div className="label long">车辆B抓拍时间</div>:
                  <div className="con" title={cardData.captureTimeB}>{cardData.captureTimeB}</div>
                </div>
              </Space>
              <Space size={5} direction="horizontal" className="gap-flex">
                <div className="target-info-item">
                  <div className="label long">车辆B抓拍地点</div>:
                  <div className="con" title={cardData.locationNameB}>{cardData.locationNameB}</div>
                </div>
              </Space>
            </>
            : ''
        }
        {
          type === "doublecar-goal" && !isArray(cardData) && !isCardDataType(cardData) ?
            <>
              <Space size={5} direction="horizontal" className="gap-flex">
                <div className="target-info-item">
                  <div className="label">前端识别</div>:
                  <div className="con">
                    <a target="_blank"
                      href={jumpRecordVehicle(cardData.licensePlate1, cardData['plateColorTypeId1'])}
                      className={!validatePlate(cardData.licensePlate1) ? 'plate-text plate-error ' : 'plate-text'}>
                      {cardData.licensePlate1}
                    </a>
                  </div>
                </div>
                <div className="target-info-item">
                  <div className="label">二次识别</div>:
                  <a href={jumpRecordVehicle(cardData.licensePlate2, cardData?.plateColorTypeId2)} className={`plate-bg plate-color-${cardData.licensePlate2 === '未识别' ? 8 : cardData.plateColorTypeId2}`}>{cardData.licensePlate2}</a>
                  <CopyToClipboard text={cardData.licensePlate2} />
                </div>
              </Space>
              <Space size={5} direction="horizontal" className="gap-flex">
                <div className="target-info-item">
                  <div className="label">车型</div>:
                  <div className="con" title={cardData.carInfo}>{cardData.carInfo}</div>
                </div>
              </Space>
            </>
            : ''
        }
      </Space>
    </div>

  </div >)

}


