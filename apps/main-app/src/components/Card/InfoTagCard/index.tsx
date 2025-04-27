import React, { useState } from "react";
import './index.scss'
import { Image, Tooltip, Checkbox, Modal, Message } from '@yisa/webui'
import { Icon, DeleteOutlined } from '@yisa/webui/es/Icon'
import SearchPersonInfoType from './interface'
import classNames from 'classnames'
import './index.scss'
import InfoTagCardType from "./interface";
import { AspectRatioBox, ColorfulLabelList, ImgZoom } from "@/components";
// import {ColorfulLabelList} from "./ColorfulLabelList"
function InfoTagCard(props: InfoTagCardType) {
  const {
    type = 'person',
    // name,
    // personId
    cardData,
    size = "middle",
    showDelete = false,
    deleteInteraction = "hover",
    onDelete,
    onImgClick
  } = props
  // const [tagNum,setTagNum]=useState
  const { personBasicInfo } = cardData
  //删除事件
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    onDelete?.(cardData)

  }
  return (
    <div
      className="card-info-item"
    >
      <AspectRatioBox
        className={classNames("card-img", { small: size === "small" })}
        ratio={130 / 130}
      >
        {
          showDelete ?
            <span onClick={handleDelete} className={classNames("card-delete", {
              "hovering": deleteInteraction === "hover"
            })}>
              <DeleteOutlined />
            </span>
            : ''
        }
        <div
          className="card-img-inner"
          onClick={onImgClick}
        // onDragStart={handleImgDragStart}
        // onDragEnd={handleImgDragEnd}
        // draggable={!showImgZoom}
        >
          {
            // showImgZoom ?
            //   <ImgZoom imgSrc={cardData.targetImage} draggable={draggable} />
            //   :
            <Image src={cardData.targetImage} />
          }
        </div>
      </AspectRatioBox>
      {
        <div className={classNames("card-info-wrapper", { small: size === "small" })}>
          {
            personBasicInfo?.idcard ?
              <>
                {
                  personBasicInfo?.name &&
                  <div className="card-info">
                    <Icon type="xingming" />
                    <div className="card-info-content">
                      <span>{personBasicInfo?.name || '未知'}</span>
                      <span style={{ marginInlineStart: 20 }}>{(personBasicInfo?.age as unknown as string) === '未知' ? personBasicInfo.age : `${personBasicInfo?.age || '0'}`}</span>
                    </div>
                  </div>
                }
                {
                  personBasicInfo?.idcard &&
                  <div className="card-info">
                    <Icon type="shenfenzheng" />
                    <div className="card-info-content">
                      {/^[\dXx]+$/.test(personBasicInfo.idcard) ?
                        <a
                          href={`#/record-detail-person?${encodeURIComponent(
                            JSON.stringify({
                              idNumber: personBasicInfo?.idcard === '未知' ? '' : personBasicInfo?.idcard,
                              groupId: Array.isArray(personBasicInfo?.groupId) ? personBasicInfo?.groupId : [personBasicInfo?.groupId],
                              idType: personBasicInfo?.idType || '111'
                            }))}`}
                          className="link idcard"
                          title={personBasicInfo?.idcard}>{personBasicInfo?.idcard}</a>
                        :
                        <span className="idcard" title={personBasicInfo?.idcard}>{personBasicInfo?.idcard}</span>
                      }
                    </div>
                  </div>
                }
                {
                  <div className="card-info">
                    <Icon type="renyuanku1" />
                    <div className="card-info-content">
                      {
                        cardData?.personTags?.length > 0 ?
                          <ColorfulLabelList labels={cardData.personTags || []} />
                          : '-'
                      }
                    </div>
                  </div>
                }
              </>
              :
              <div className="no-name">暂未实名</div>
          }
        </div>
      }
    </div >
  )
}

export default InfoTagCard


