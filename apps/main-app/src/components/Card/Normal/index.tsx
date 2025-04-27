import React, { useState } from "react";
import NormalProps from "./interface";
import { AspectRatioBox, ImgZoom } from '@/components'
import { Image, Tooltip, Checkbox, Message, PopConfirm } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon, DeleteOutlined } from '@yisa/webui/es/Icon'
// import { ImgZoom } from '@yisa/webui_business'
import classNames from 'classnames'
import { isFunction, jumpRecordVehicle } from "@/utils";
import FooterLinks from "../FooterLinks";
import GaitNumTip from './GaitNumTip'
import { validatePlate } from "@/utils";
import './index.scss'

function formatSimilarity(similar: string | undefined) {
  return isNaN(Number(similar))
    ? ["00", "00"]
    : String(similar).split(".").length === 2
      ? String(similar).split(".")
      : [String(similar), "00"]
}

function CardNormal(props: NormalProps) {
  const {
    className,
    hasCaptureTitle = false,
    cardData = {},
    onImgClick = () => { },
    handleDelete = () => { },
    locationCanClick = true,
    onLocationClick,
    onPortraitClick,
    onPeerClick,
    onCardClick,
    showChecked = true,
    checked = false,
    onChange,
    showImgZoom = false,
    onFilterChange = () => { },
    onImgDragStart,
    onImgDragEnd,
    linkEleClick,
    onsimilarityNumberClick,
    draggable = false,
    showDelete = false,
    captureTimeTitle,
    hasfooter = true,
    cardTitle,
    peerFlag = false,
    showCaptureTime = false,
    showLocation = false,
    pageName = ""
  } = props

  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked
  const calcsimilarity = formatSimilarity(cardData.similarity)
  const { personBasicInfo } = cardData
  const calcPersonBasicSimilarity = formatSimilarity(personBasicInfo?.similarity)
  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    // console.log(event.target.checked)
    if (!('checked' in props)) {
      setStateChecked(event.target.checked)
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        cardData: cardData,
        checked: event.target.checked
      })
    }
  }

  const handleCardClick = (event: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(event)
    }
  }

  const handleLocClick = (event: React.MouseEvent) => {
    if (onLocationClick) {
      onLocationClick(event)
    }
  }

  // 拖拽事件
  const handleImgDragStart = (event: React.DragEvent) => {
    event.dataTransfer.dropEffect = "copy";
    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.setData("Text", JSON.stringify(cardData));
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
  // 聚合数据
  const handlePortraitClick = (event: React.MouseEvent) => {
    if (onPortraitClick && isFunction(onPortraitClick)) {
      onPortraitClick && onPortraitClick(event)
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

  const parseStr = (str: any) =>{
    const emptyArr = ["无车牌", "未识别", "未知"];
    if(!str || emptyArr.includes(str)){
      return  (str || "未识别")
    } else {
      return str
    }
  }

  return (
    <div
      className={classNames("card-normal-item", className, {
        'checked': isChecked
      })}
      onClick={handleCardClick}
    >
      {
        cardData.similarity && <div className={`card-normal-item-similarity`}>
          <span>{calcsimilarity[0]}</span><span>.{calcsimilarity[1]}%</span>
          {cardData?.matches?.length > 0 ?
            <span onClick={handlesimilarityNumberClick}>比中<em>{cardData?.matches?.length || 0}</em>项</span>
            : ""
          }
        </div>
      }
      <AspectRatioBox
        className="card-img"
        ratio={188 / 188}
      >
        {
          showChecked ?
            <Checkbox
              className="card-checked"
              checked={isChecked}
              onChange={handleCheckedChange}
            />
            : ''
        }
        {
          showDelete ?
            <PopConfirm
              title="确认要删除这条内容吗？"
              onConfirm={handleDelete}
            >
              <div className="card-delete"
              // onClick={handleDelete}
              >
                {/* <Icon type="icon-shanchu" /> */}
                <DeleteOutlined />
              </div>
            </PopConfirm>
            : ''
        }
        {
          cardTitle ?
            <span className="card-title">
              {cardTitle}
            </span>
            : ''
        }
        {
          cardData.targetType === 'pedestrian' && cardData.isGait && cardData.gaitObjectNumber > 0 ?
            <GaitNumTip cardData={cardData} />
            : ''
        }
        <div
          className="card-img-inner"
          onClick={onImgClick}
          onDragStart={handleImgDragStart}
          onDragEnd={handleImgDragEnd}
          draggable={!showImgZoom}
        >
          {
            showImgZoom ?
              <ImgZoom imgSrc={cardData.targetImage} draggable={draggable} />
              :
              <Image src={cardData.targetImage} />
          }
          {
            cardData.portraitNum ?
              <div className="portrait-num" onClick={handlePortraitClick}>聚合：{cardData.portraitNum}</div>
              : null
          }
        </div>
      </AspectRatioBox>
      {
        // 二三轮车车牌
        cardData.licensePlate &&
        <div className="card-info plate-wrap">
          {
            cardData.licensePlateUrl && cardData.licensePlateUrl != "" && cardData.licensePlate != '无牌' ?
              <a target="_blank" href={cardData.licensePlateUrl} className={cardData.plate == '无牌' ? 'plate-text plate-error' : 'plate-text'}>
                {cardData.licensePlate}
              </a>
              :
              <span className={cardData.licensePlate == '无牌' ? 'plate-text plate-error' : 'plate-text'}>{cardData.licensePlate == '无牌' ? '未知' : cardData.licensePlate}</span>
          }
        </div>
      }
      {
        cardData.licensePlate1 &&
        <div className="card-info plate-wrap">
          {
            validatePlate(cardData.licensePlate1) ?
              <a target="_blank"
                href={jumpRecordVehicle(cardData.licensePlate1, cardData.plateColorTypeId1)}
                className={'plate-text'}>
                {cardData.licensePlate1}
              </a>
              :
              <span className={'plate-text plate-error'}>{parseStr(cardData.licensePlate1)}</span>
          }
          {
            cardData.licensePlate2 &&
            <Tooltip placement="bottom" title="二次识别">
              {
                ["无牌", "无车牌", "未识别", "未知"].includes(cardData.licensePlate2) ?
                  // <span className={`plate2-text plate-bg plate-color-8`}></span>
                  <span className={`plate2-text`}>{cardData.licensePlate2 || "未识别"}</span>
                  :
                  <a
                    target="_blank"
                    href={jumpRecordVehicle(cardData.licensePlate2, cardData.plateColorTypeId2)}
                    className={`plate2-text plate-bg plate-color-${cardData.plateColorTypeId2}`}>{cardData.licensePlate2}
                  </a>
              }
            </Tooltip>
          }
        </div>
      }
      {
        pageName !== "image" && cardData.carInfo ?
          <div className="card-info">
            <Icon type="cheliangxinghao" />
            <div className="card-info-content" title={cardData.carInfo}>{cardData.carInfo || '-'}</div>
          </div>
          : ''
      }
      {/* {
        cardData.carType ?
          <div className="card-info">
            <Icon type="cheleixing" />
            <div className="card-info-content" title={cardData.carType}>{cardData.carType || '-'}</div>
          </div>
          : ''
      } */}
      {
        !!cardData.nocturnalTimes &&
        <>
          <div className="card-info">
            <Icon type="zhuapaicishu" />
            <span>昼伏夜出<span className='num' onClick={() => {
              onFilterChange({
                text: cardData.licensePlate2,
                type: 'id',
                value: cardData.licensePlate2,
                cardData: cardData
              })
            }}>{cardData.nocturnalTimes}</span>天</span>
          </div>
        </>
      }
      {
        cardData.count ?
          <>
            <div className="card-info">
              <Icon type="zhuapaicishu" />
              <span>抓拍<span className='num' onClick={() => {
                onFilterChange({
                  text: cardData.licensePlate2,
                  type: 'id',
                  value: cardData.licensePlate2,
                  cardData: cardData
                })
              }}>{cardData.count}</span>次</span>
            </div>
          </>
          : ''
      }
      {
        showCaptureTime ?
          <div className="card-info">
            <Icon type="shijian" />
            <div className="card-info-content">{cardData.captureTime || '-'}</div>
          </div>
          :
          !peerFlag && cardData.captureTime &&
          <>
            {
              cardData.count || hasCaptureTitle ?
                <div className="card-info">
                  {captureTimeTitle || "最近抓拍"}：
                </div>
                : ''
            }
            <div className="card-info">
              <Icon type="shijian" />
              <div className="card-info-content">{cardData.captureTime || '-'}</div>
            </div>
          </>
      }
      {
        cardData.userName ?
          <div className="card-info">
            <Icon type="xingming" />
            <div
              className={classNames("card-info-content", {
                // 'can-click': locationCanClick
              })}
              title={cardData.userName || '-'}
            // onClick={locationCanClick ? handleLocClick : () => { }}
            >{cardData.userName || '-'}</div>
          </div>
          : ''
      }
      {
        personBasicInfo?.similarity ?
          <div className="card-info">
            <div className="card-info-content person-similarity">
              <span>{calcPersonBasicSimilarity[0]}</span>
              <span>.{calcPersonBasicSimilarity[1]}%</span>
            </div>
          </div>
          : ''
      }
      {
        cardData.idCard ?
          <div className="card-info">
            <Icon type="zhengjianzhao" />
            <div
              className={classNames("card-info-content num", {
                // 'can-click': locationCanClick
              })}
              title={cardData.idCard || '-'}
            // onClick={idCardClick ? handleIdCardClick : () => { }}
            >{cardData.idCard || '-'}</div>
          </div>
          : ''
      }
      {
        personBasicInfo?.name ?
          <div className="card-info">
            <Icon type="xingming" />
            <div className="card-info-content">{personBasicInfo?.name || '-'}</div>
          </div>
          : ''
      }
      {
        personBasicInfo?.idcard ?
          <div className="card-info">
            <Icon type="shenfenzheng" />
            {
              /^[\dXx]+$/.test(personBasicInfo.idcard)
                ?
                <a href={`#/record-detail-person?${encodeURIComponent(
                  JSON.stringify({
                    idNumber: personBasicInfo?.idcard === '未知' ? '' : personBasicInfo?.idcard,
                    groupId: Array.isArray(personBasicInfo?.groupId) ? personBasicInfo?.groupId : [personBasicInfo?.groupId],
                    idType: personBasicInfo?.idType || '111'
                  }))}`}
                  className="card-info-content link" target="_blank" title={personBasicInfo?.idcard}>{personBasicInfo?.idcard || '-'}</a>
                :
                <div className="card-info-content" title={personBasicInfo?.idcard}>{personBasicInfo?.idcard}</div>
            }
          </div>
          : ''
      }
      {
        cardData.peerNum ?
          <div className="card-info ">
            <Icon type="xingming" />
            <div
              className={classNames("card-info-content", {
                // 'can-click': locationCanClick
              })}
              title={cardData.peerNum || '-'}
              onClick={onPeerClick}
            >同行<span className="num">{cardData.peerNum || '-'}</span>次</div>
          </div>
          : ''
      }
      {
        showLocation ?
          <div className="card-info">
            <Icon type="didian" />
            <div
              className={classNames("card-info-content location", {
                'can-click': locationCanClick
              })}
              title={cardData.locationName || '-'}
              onClick={locationCanClick ? handleLocClick : () => { }}
            >{cardData.locationName || '-'}</div>
          </div>
          :
          !cardData.userName && !peerFlag && (cardData.locationName || (cardData.lngLat?.lng && cardData.lngLat?.lat)) ?
            <div className="card-info">
              <Icon type="didian" />
              <div
                className={classNames("card-info-content location", {
                  'can-click': locationCanClick
                })}
                title={cardData.locationName || '-'}
                onClick={locationCanClick ? handleLocClick : () => { }}
              >{cardData.locationName || '-'}</div>
            </div>
            : ''
      }
      {
        pageName !== "image" && cardData.direction &&
        <div className="card-info">
          <Icon type="fangxiang" />
          <div className="card-info-content">{cardData.direction || '-'}</div>
        </div>
      }
      {/* 衣着特征 */}
      {
        pageName !== "image" && cardData.clothing ? <>
          <div className="card-info">
            <Icon type="shangyi" />
            <div className="card-info-content">上衣:{cardData.clothing.topCloth || '-'}</div>
          </div>
          <div className="card-info">
            <Icon type="xiayi" />
            <div className="card-info-content">下衣:{cardData.clothing.bottomCloth || '-'}</div>
          </div>
          <div className="card-info">
            <Icon type="zhuapaitianshu" />
            <div className="card-info-content">抓拍天数(近90天):{cardData.clothing.captureNum || '-'}</div>
          </div>
        </>
          : null
      }
      {/* {
        cardData.links && */}
      {hasfooter && <FooterLinks eleClick={linkEleClick} cardData={cardData} />}
      {/* } */}
    </div>
  )
}

export default CardNormal
