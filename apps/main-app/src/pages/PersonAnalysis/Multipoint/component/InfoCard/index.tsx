import React, { useState } from "react";
import InfoCardProps from "./interface";
import { AspectRatioBox, ImgZoom } from '@/components'
import { Image, Tooltip, Checkbox, Message, Popover } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon } from '@yisa/webui/es/Icon'
// import { ImgZoom } from '@yisa/webui_business'
import classNames from 'classnames'
import { isFunction } from "@/utils";
import './index.scss'
import { ResultRowType } from "@/pages/Search/Target/interface";

function InfoCard(props: InfoCardProps) {
  const colorArr = ["#3377ff", "#ff8d1a", "#00cc66", "#00a9cc", "#b6bc04"];
  const {
    className,
    active,
    index = 0,
    cardData,
    conditionNum = 0,
    tagNum = 3,
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
      <div className="person-img-info">
        <div className="person-img">
          <Image src={cardData.imageUrl} />
        </div>
        <div className="person-info">
          <div className="card-info vehicle-plate">
            <span className="card-info-label">
              <Icon type="xingming" />
            </span>
            <span className="name">{cardData.name || '未知'}</span>
            <span className="age">{cardData.age ||"未知"}</span>
          </div>
          <div className="card-info car-info">
            <span className="card-info-label">
              <Icon type="shenfenzheng" />
            </span>
            {/* <div className="card-info-content" title={cardData.idNumber}>{cardData.idNumber || '未知'}</div> */}
            {/^[\dXxEAGDSP]+$/.test(cardData.idNumber) ?
              <a
                href={`#/record-detail-person?${encodeURIComponent(
                  JSON.stringify({ 
                    idNumber: cardData.idNumber === '未知' ? '' : cardData.idNumber, 
                    groupId: Array.isArray(cardData?.groupId) ? cardData?.groupId : [cardData?.groupId], 
                    idType: cardData?.idType || '111' 
                  }))}`}
                className="link idcard"
                target="_blank"
                title={cardData.idNumber}>{cardData.idNumber}</a>
              :
              <span className="idcard" title={cardData.idNumber}>{cardData.idNumber}</span>
            }
          </div>
          {
            cardData?.personTags && cardData?.personTags?.length ?
              <div className="tag-container">
                {
                  cardData?.personTags && cardData?.personTags?.length ?
                    <ul className="tags">
                      {
                        cardData.personTags.slice(0, cardData.personTags.length > tagNum ? tagNum - 1 : tagNum).map((item: any, index: number) => <li key={index} title={item.name} className={`label-item label-item-${item.color}`}>{item.name}</li>)
                      }
                      {
                        cardData.personTags.length > tagNum ?
                          <Popover
                            placement="top"
                            content={cardData.personTags.map((elem: any, index: number) => <li key={index} className={`label-item label-item-${elem.color}`} title={elem.name}>{elem.name}</li>)}
                            overlayClassName="popover-person-tag"
                          >
                            <li key='...' className="label-item more">+{cardData.personTags.length - (tagNum - 1)}</li>
                          </Popover>
                          : null
                      }
                    </ul>
                    : <span className="ysd-icon">--</span>
                }
              </div>
              : ""
          }
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
