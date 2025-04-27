import React, { useState } from "react";
import InfoCardProps from "./interface";
import { AspectRatioBox, ImgZoom } from '@/components'
import { Image, Tooltip, Checkbox, Message } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon } from '@yisa/webui/es/Icon'
// import { ImgZoom } from '@yisa/webui_business'
import classNames from 'classnames'
import { isFunction } from "@/utils";
import './index.scss'
import { ResultRowType } from "@/pages/Search/Target/interface";
import { jumpRecordVehicle } from '@/utils'
import { validatePlate } from "@/utils";

function InfoCard(props: InfoCardProps) {
  const colorArr = ["#3377ff", "#ff8d1a", "#00cc66", "#00a9cc", "#b6bc04"];
  const {
    className,
    active,
    index = 0,
    cardData,
    conditionNum = 0,
    onCardClick = () => { },
  } = props

  return (
    <div
      className={classNames("card-vehicle-info-item", className, {
        "active": active
      })}
      onClick={(e) => onCardClick(e)}
    >
      <span className="index">{index}</span>
      <div className="vehicle-img-info">
        <div className="vehicle-img">
          <Image src={cardData.imageUrl} />
        </div>
        <div className="vehicle-info">
          <div className="card-info vehicle-plate">
            <span className="card-info-label">
              <Icon type="chepai" />
              <span>车牌信息：</span>
            </span>
            {
              cardData?.licensePlate2 === '未识别' ?
                <div className={`plate2-text plate-color-8`}></div> :
                <a href={jumpRecordVehicle(cardData.licensePlate2, cardData?.plateColorTypeId2)} className={`plate2-text plate-bg plate-color-${cardData?.plateColorTypeId2}`} target="_blank">{cardData.licensePlate2}</a>
            }
          </div>
          <div className="card-info car-info">
            <span className="card-info-label">
              <Icon type="cheliangxinghao" />
              <span>车辆型号：</span>
            </span>
            <div className="card-info-content" title={cardData.carInfo}>{cardData.carInfo || '-'}</div>
          </div>
          <div className="card-info show-conditional">
            {
              colorArr.map((item, index) => {
                if (conditionNum <= index) {
                  return
                }
                return (
                  <div className="conditional-item" key={index}>
                    <div className="conditional-index" style={{ backgroundColor: colorArr[index] }}>{index + 1}</div>
                    <div className="satisfy">{cardData?.flags && cardData?.flags.includes(index + 1) ? '满足' : '不满足'}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoCard