import React, { useState, useEffect, useRef } from 'react'
import { Image } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import './index.scss'
import { ResultRowType } from '@/pages/Search/Target/interface'

export default function TargetCard(props: { cardData?: ResultRowType }) {
  const {
    cardData
  } = props
  return (
    <div className="card-target-item">
      <div className="item-img">
        <Image src={cardData?.targetImage} />
      </div>
      <div className="item-info">
        {
          cardData?.licensePlate2 && <div className="card-info">
            <span className="card-info-label">
              <Icon type="chepai" />
              <span>车牌信息：</span>
            </span>
            {
              cardData?.licensePlate2 == '无牌' ?
                <div className={`plate2-text plate-color-8`}></div> :
                <div className={`plate2-text plate-bg plate-color-${cardData?.plateColorTypeId2}`}>{cardData.licensePlate2}</div>
            }
          </div>
        }
        {
          cardData?.carInfo &&
          <div className="card-info">
            <span className="card-info-label">
              <Icon type="cheliangxinghao" />
              <span>车辆型号：</span>
            </span>
            <div className="card-info-content" title={cardData.carInfo}>{cardData.carInfo || '-'}</div>
          </div>
        }
      </div>
    </div>
  )
}

