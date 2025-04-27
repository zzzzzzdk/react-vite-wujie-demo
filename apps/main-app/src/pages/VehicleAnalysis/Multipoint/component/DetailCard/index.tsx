import React, { useState } from "react";
import DetailCardProps from "./interface";
import { AspectRatioBox, ImgZoom } from '@/components'
import { Image, Tooltip, Checkbox, Message } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon, DownOutlined, UpOutlined } from '@yisa/webui/es/Icon'
// import { ImgZoom } from '@yisa/webui_business'
import classNames from 'classnames'
import { isFunction } from "@/utils";
import './index.scss'
import { ResultRowType } from "@/pages/Search/Target/interface";

function DetailCard(props: DetailCardProps) {
  const colorArr = ["#3377ff", "#ff8d1a", "#00cc66", "#00a9cc", "#b6bc04", "#ff5b4d"];

  const {
    className,
    index = 0,
    cardData,
    onImgClick = (data: [], index: number) => { }
  } = props

  const [showMore, setShowMore] = useState(false)

  return (
    <div
      className={classNames("card-vehicle-detail-item", className)}
    >
      <span className="index">{index ? index + 1 : 1}</span>
      <div className="flag-title">
        <div className="icon-border">
          <div
            className="icon-color"
            style={{ backgroundColor: colorArr[cardData.flag - 1] }}
          >{cardData.flag}</div>
        </div>
        <div className="title-content">条件{cardData.flag}: </div>
        <div className="num-track"> {cardData.data.length || 0} 条碰撞轨迹</div>
        {cardData.data.length > 4 && <div
          className="more-btn"
          onClick={() => { setShowMore(!showMore) }}
        >
          {!showMore ? '查看更多' : '收起全部'}
          {!showMore ? <DownOutlined /> : <UpOutlined />}
        </div>}
      </div>
      <div className="track-centent">
        {cardData?.data && cardData?.data.length > 0 &&
          cardData.data.map((item: ResultRowType, index: number) => {
            if (!showMore && index > 3) {
              return
            }
            return (<div
              className="track-item"
              key={index}
            >
              <div
                className="capture-img"
                onClick={() => {
                  onImgClick(cardData?.data, index)
                }}
              >
                <Image src={item.targetImage} />
              </div>
              <div className="capture-info">
                <div className="capture-time info-item">
                  <Icon type="shijian" />
                  <div className="content" title={item.captureTime}>{item.captureTime || '-'}</div>
                </div>
                <div className="capture-location info-item">
                  <Icon type="didian" />
                  <div className="item-location-content" title={item.locationName}>{item.locationName || '-'}</div>
                </div>
              </div>
            </div>)
          })
        }
      </div>
    </div >
  )
}

export default DetailCard