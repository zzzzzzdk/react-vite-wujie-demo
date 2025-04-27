import React, { useState } from "react";
import './index.scss'
import { AspectRatioBox } from '@/components'
import { Image, Tooltip, Checkbox, Modal, Message, Popover } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon } from '@yisa/webui/es/Icon'
import { ImgZoom } from '@yisa/webui_business'
import classNames from 'classnames'
import { isFunction } from "@/utils";
import NormalProps from '../Normal/interface'
import { ResultRowType } from '@/pages/Search/Target/interface'
// import FooterLinks from "../../FooterLinks";
import FooterLinks from "../FooterLinks";
import './index.scss'
import GaitNumTip from "../Normal/GaitNumTip";

function CardPersonInfo(props: NormalProps<ResultRowType | any>) {
  const {
    className,
    cardData,
    onImgClick,
    onLocationClick,
    onCardClick,
    showChecked = true,
    showCaptureNum = false,
    checked = false,
    onChange,
    showImgZoom = false,
    onFilterChange = () => { },
    onImgDragStart,
    onImgDragEnd,
    linkEleClick,
    hasfooter = false,
    cardtype,
    onsimilarityNumberClick,
    showSimilarity = true,
    similarType = '',
    tagNum = 4,
    isRelate = false,
    onRelateClick = () => { }
  } = props
  // const prefixCls = hasfooter?"card-person-item small-box":"card-person-item"
  const prefixCls = "card-person-item"
  const { personBasicInfo = {}, similarity } = cardData
  const calcsimilarity = isNaN(Number(similarity)) ? ["00", "00"] : String(similarity).split(".").length === 2 ? String(similarity).split(".") : [String(similarity), "00"]
  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked

  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    // event.stopPropagation()
    // console.log(event.target.checked)
    if (!('checked' in props)) {
      setStateChecked(event.target.checked)
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        cardData: cardData,
        checked: event.target.checked,
        type: "person"
      })
    }
  }

  const handleCardClick = (event: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(event)
    }
  }

  const handleImgClick = (event: React.MouseEvent) => {
    if (onImgClick) {
      event.stopPropagation()
      onImgClick()
    }
  }

  // 拖拽事件
  const handleImgDragStart = (event: React.DragEvent) => {
    event.dataTransfer.dropEffect = "copy";
    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.setData("Text", JSON.stringify(cardData || "{}"));
    if (onImgDragStart && isFunction(onImgDragStart)) {
      onImgDragStart(event)
    }
  }

  const handleImgDragEnd = (event: React.DragEvent) => {
    if (onImgDragEnd && isFunction(onImgDragEnd)) {
      onImgDragEnd(event)
    }
  }
  //比中几项
  const handlesimilarityNumberClick = () => {
    if (!cardData?.matches?.length) {
      Message.warning("未比中目标")
      return
    }
    if (onsimilarityNumberClick && isFunction(onsimilarityNumberClick)) {
      onsimilarityNumberClick(cardData)
    }
  }

  return (
    <div
      className={classNames(prefixCls, className, {
        'checked': isChecked,
        'small-box': hasfooter
      })}
      onClick={handleCardClick}
    >
      {
        cardtype === 'clubbox' ?
          <div className={`${prefixCls}-${similarity ? 'similarity' : 'normal'}`}>
            {
              similarity ?
                <>
                  <span>{calcsimilarity[0]}</span><span>.{calcsimilarity[1]}%</span>
                </>
                : ''
            }
            <span>({cardData.sysModel || '未知'})</span>
          </div>
          :
          (similarity && showSimilarity) ? <div className={`${prefixCls}-similarity`}>
            <span>{calcsimilarity[0] || '-'}</span><span>.{calcsimilarity[1] || '-'}%</span>
            {
              similarType ? <span>({similarType})</span> : ''
            }
            {
              cardData?.matches?.length > 0 ?
                <span onClick={handlesimilarityNumberClick} className="matches">比中<em>{cardData?.matches?.length || 0}</em>项</span>
                : ""
            }
            {
              cardData.sysModel ?
                <span>({cardData.sysModel})</span>
                : ''
            }
            {
              isRelate && !cardData.isRelate ? <div className="relate-btn" onClick={onRelateClick}>关联人员</div>
                : null
            }
          </div>
            : ''
      }
      <div className={`${prefixCls}-wrapper`}>
        {
          showChecked ?
            <Checkbox
              className="card-checked"
              checked={isChecked}
              onChange={handleCheckedChange}
            />
            : ''
        }
        <div
          className={`card-img ${hasfooter ? 'small-img' : ''}`}
        >
          {
            cardData.isGait ?
              <GaitNumTip cardData={cardData} />
              : ''
          }
          <div
            className="card-img-inner"
            onClick={handleImgClick}
            onDragStart={handleImgDragStart}
            onDragEnd={handleImgDragEnd}
          >
            {/* {
              showImgZoom ?
                (cardtype === 'clubbox' ?
                  <ImgZoom imgSrc={cardData.resultSmallPic} /> : <ImgZoom imgSrc={cardData.targetImage} />)
                :
                (cardtype === 'clubbox' ?
                  <Image src={cardData.resultSmallPic} />:<Image src={cardData.targetImage} />)
            } */}
            {
              (showCaptureNum && cardData.captureNum) ?
                <div className="card-num">
                  <span>{cardData.captureNum}张</span>
                </div>
                : ''
            }
            {
              showImgZoom ?
                <ImgZoom imgSrc={cardData.targetImage} />
                :
                <Image src={cardData.targetImage} />
            }
          </div>
        </div>
        <div className={`${prefixCls}-wrapper-right`}>

          {
            cardtype === 'clubbox' ?
              <div className="person-item">
                <div className='person-info'>
                  <Icon type="shijian" />
                  {cardData.captureTime}</div>
                <div className='person-info' title={cardData.locationName}>
                  <Icon type="didian" />
                  {cardData.locationName}</div>
                <div className='add-title'>加入时间：</div>
                <div className='person-info'>
                  <Icon type="shijian" />{cardData.createTime}
                </div>
                <div className='person-info' title={`${cardData.userName}(${cardData.organizationName})`}><Icon type="gerenzhongxin" />{cardData.userName}({cardData.organizationName})</div>
              </div>
              :
              <>
                {
                  personBasicInfo.idcard ? <>
                    <div className="name">{personBasicInfo?.name || "未知"}</div>
                    <div className="info">
                      {/* <Icon type="xingming" /> */}
                      <span>{personBasicInfo?.sex || "未知"}</span><span>{personBasicInfo?.age ? personBasicInfo?.age : "未知"}</span><span>{personBasicInfo?.nation || "未知"}</span></div>
                    <div className="idcard">{/^[\dXx]+$/.test(personBasicInfo?.idcard) ?
                      <>
                        {/* <Icon type="shenfenzheng" /> */}
                        <a href={`#/record-detail-person?${encodeURIComponent(
                          JSON.stringify({
                            idNumber: personBasicInfo?.idcard === '未知' ? "" : personBasicInfo?.idcard,
                            groupId: personBasicInfo?.groupId ? personBasicInfo?.groupId : [],
                            groupPlateId: personBasicInfo?.groupPlateId ? personBasicInfo?.groupPlateId : [],
                            idType: personBasicInfo?.idType || '111'
                          })
                        )}`} target="_blank" className="link">{personBasicInfo?.idcard}</a>
                      </>
                      :
                      <>
                        {/* <Icon type="shenfenzheng" /> */}
                        <span>{personBasicInfo?.idcard || "未知"}</span></>
                    }</div>
                  </>
                    :
                    <div className="no-name">暂未实名</div>
                }
                {
                  cardData?.personTags && cardData?.personTags?.length ?
                    <div className="tag-container">
                      {/* <Icon type="renyuanku1" /> */}
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
                <div className="time">
                {
                  cardData?.dataSource && 
                  <div className="p-info">数据来源：{cardData.dataSource === 'cluster' ? '聚类': '档案'}</div>
                }
                  <span className="time-label">最近出现：</span>
                  <div className="time-content">
                    <Icon type="shijian" />
                    <div className="time-capture">{cardData.captureTime || '未知'}</div>
                  </div>
                  <div className="time-content">
                    <Icon type="didian" />
                    <div
                      className={classNames("time-capture")}
                      title={(cardData.locationName || cardData.locationId) || '--'}
                      onClick={() => { }}
                    >{(cardData.locationName || cardData.locationId) || '--'}</div>
                  </div>
                </div>

              </>
          }
        </div>
      </div>
      {
        hasfooter ?
          <FooterLinks eleClick={linkEleClick} cardData={cardData}></FooterLinks>
          : ''
      }
    </div>
  )
}

export default CardPersonInfo


