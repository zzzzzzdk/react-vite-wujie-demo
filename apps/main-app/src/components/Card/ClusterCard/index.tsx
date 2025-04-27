import React, { useState, useEffect, useRef } from 'react'
import { Popover, Button } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import { ErrorImage } from '@yisa/webui_business'
import { Link } from 'react-router-dom'
import { ClusterCardType } from './interface'
import './index.scss'

export default function ClusterCard(props: ClusterCardType) {
  const {
    data,
    footerBtnText = "手动关联身份",
    onFooterBtnClick = () => { },
    onImgClick = () => { },
    imgCursor = "pointer",
    showFooterBtn = true
  } = props

  const handleCardClick = (data: ClusterCardType["data"]) => {
    onFooterBtnClick?.(data)
  }

  const tagContent = () => {
    return <div className="cluster-tag-more">
      {
        data?.labels?.map((item, index) => <span
          title={item.name}
          className={`label-item label-item-${item.color}`}
          key={index}
        >
          {item.name}
        </span>)
      }
    </div>
  }

  const handleImgClick = (item: ClusterCardType["data"]) => {
    onImgClick?.(item)
  }

  return (
    <div className="clustering-card-container">
      <div className="clustering-left">
        <div className={`clustering-left-img ${imgCursor}`} onClick={() => handleImgClick(data)}>
          <ErrorImage src={data.targetImage} alt="" />
        </div>
        {
          data.groupCount && <div className="clustering-cover">{data.groupCount}张</div>
        }
        {
          data.similarity && <div className="clustering-similarity">{data.similarity}%</div>
        }
        {/* <div className="clustering-similarity">92<i>%</i></div> */}
      </div>
      <div className="clustering-right">
        {
          data.idcard ? <>
            <span className="name">{data.name || "未知"}</span>
            <div className="name-sex-age common-item">
              <Icon type="xingming" /> <span>{data.sex}</span>|<span>{data.age}</span>
            </div>
            <div className="common-item">
              <Icon type="shenfenzheng" />
              {
                data.idcard ?
                  <Link className="link" to={`/record-detail-person?${encodeURIComponent(JSON.stringify({ 
                    idNumber: data.idcard === '未知' ? '' : data.idcard, 
                    idType: data.idType, 
                    groupId: Array.isArray(data.groupPlateId) ? data.groupPlateId : [data.groupPlateId] 
                  }))}`} target="_blank" >{data.idcard}</Link>
                  :
                  <div className="id-card">未知</div>
              }
            </div>
          </>
            : <div className="no-name">暂未实名</div>
        }
        <div className="tag-container common-item">
          <Icon type="renyuanku1" />
          {
            data?.labels && data.labels?.length ?
              data.labels.map((item, index) => {
                if (index == 0) {
                  return <span className={`label-item label-item-${item.color}`} key={index} title={item.name}>{item.name}</span>
                } else if (index == 1) {
                  return <Popover
                    overlayClassName="cluster-tag-popover"
                    content={tagContent}
                    key={index}
                  >
                    <span className="label-item more">+{(data.labels?.length || 1) - 1}</span>
                  </Popover>
                }
              })
              : <span>--</span>
          }
        </div>
        {
          showFooterBtn && <div className="clustering-right-btn">
            <Button type="default" onClick={() => handleCardClick(data)}>{footerBtnText}</Button>
          </div>
        }
      </div>
    </div>
  )
}

